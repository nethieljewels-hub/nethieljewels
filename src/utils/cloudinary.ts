export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  quality?: string | number;
  crop?: string;
  format?: string;
}

/**
 * Automatically transforms Cloudinary URLs to include dynamic optimization parameters:
 * - `f_auto`: Automatic webp/avif format selection based on browser capability
 * - `q_auto`: Intelligent quality compression
 * - `w_X`: Width scaling for responsive image delivery
 *
 * Example:
 * `https://res.cloudinary.com/demo/image/upload/v12345/sample.jpg`
 * -> `https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800,c_limit/v12345/sample.jpg`
 */
export function getCloudinaryUrl(
  url?: string | null,
  options: CloudinaryTransformOptions = {}
): string {
  if (!url || typeof url !== "string") return "";

  // Return non-cloudinary URLs, SVGs, or already-transformed URLs untouched
  if (
    !url.includes("res.cloudinary.com") ||
    url.includes("/upload/f_auto") ||
    url.endsWith(".svg")
  ) {
    return url;
  }

  // Do not apply image parameters to video resources
  if (url.includes("/video/upload/")) {
    return url;
  }

  const { width, height, quality = "auto", crop = "limit", format = "auto" } = options;

  const transformations: string[] = [`f_${format}`, `q_${quality}`];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop && (width || height)) transformations.push(`c_${crop}`);

  const transformString = transformations.join(",");

  return url.replace("/upload/", `/upload/${transformString}/`);
}

/**
 * Helper to check if valid Cloudinary credentials are configured.
 */
export function isCloudinaryConfigured(): boolean {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  return Boolean(
    cloudName &&
      cloudName !== "your_cloud_name" &&
      cloudName.trim() !== ""
  );
}

/**
 * DIRECT CLIENT-TO-CLOUDINARY UPLOADER (Unsigned Preset):
 *
 * HOW IT WORKS:
 * - Browser uploads the file DIRECTLY to Cloudinary using an unsigned upload preset.
 * - Zero bytes pass through Vercel (no API call, no size limits).
 * - Zero bytes touch Supabase.
 * - No signature or API secret needed — the preset handles permissions.
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = "products",
  onProgress?: (percent: number) => void
): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary cloud name or upload preset is missing. Check NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local"
    );
  }

  const isVideo =
    file.type.startsWith("video/") ||
    Boolean(file.name.match(/\.(mp4|mov|webm|mkv|avi|m4v)$/i));
  const resourceType = isVideo ? "video" : "image";

  // Build the upload payload — no signature needed with unsigned preset
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", `nethiel_jewelry/${folder}`);

  // Stream file directly from browser to Cloudinary
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    xhr.open("POST", endpoint, true);

    // Track live upload progress percentage (0% to 100%)
    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    // Upload completed successfully
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.secure_url) {
            resolve(res.secure_url);
          } else {
            reject(new Error("Cloudinary response did not contain secure_url."));
          }
        } catch (err) {
          reject(new Error("Failed to parse Cloudinary response: " + String(err)));
        }
      } else {
        try {
          const errorRes = JSON.parse(xhr.responseText);
          reject(
            new Error(
              `Cloudinary upload error (${xhr.status}): ${
                errorRes.error?.message || xhr.statusText
              }`
            )
          );
        } catch {
          reject(new Error(`Cloudinary upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error occurred while uploading to Cloudinary."));
    };

    xhr.ontimeout = () => {
      reject(new Error("Cloudinary upload request timed out."));
    };

    // 2-minute timeout for large video files
    xhr.timeout = 120000;

    xhr.send(formData);
  });
}

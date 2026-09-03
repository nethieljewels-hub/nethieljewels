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
 * DIRECT CLIENT-TO-CLOUDINARY UPLOADER:
 *
 * HOW IT WORKS (IN SIMPLE TERMS):
 * 1. Step 1: The browser asks our server (/api/cloudinary-signature) for a "security permission slip" (signature).
 * 2. Step 2: The browser uploads the heavy video or image DIRECTLY to Cloudinary's servers.
 *
 * WHY THIS IS HUGE:
 * - Vercel will NEVER crash with "File too large" errors (bypasses Vercel's 4.5MB limit).
 * - Supabase Storage is NEVER touched (0 bytes of Supabase egress bandwidth used).
 * - Cloudinary compresses the video automatically for fast mobile streaming.
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = "products",
  onProgress?: (percent: number) => void
): Promise<string> {
  // Check if file is a video or image
  const isVideo =
    file.type.startsWith("video/") ||
    Boolean(file.name.match(/\.(mp4|mov|webm|mkv|avi|m4v)$/i));
  const resourceType = isVideo ? "video" : "image";

  // Step 1: Ask our Next.js API for the security signature (takes ~5 milliseconds)
  const sigRes = await fetch("/api/cloudinary-signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });

  if (!sigRes.ok) {
    const errorData = await sigRes.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Failed to obtain Cloudinary signature (${sigRes.status})`
    );
  }

  const { signature, timestamp, apiKey, cloudName, folder: targetFolder } =
    await sigRes.json();

  // Step 2: Build the upload payload to send directly to Cloudinary
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", targetFolder);

  // Step 3: Stream the file directly from user's browser to Cloudinary
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

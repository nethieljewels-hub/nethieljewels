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
 * Uploads a file (image or video) to Cloudinary via the secure backend API endpoint.
 * @param file File object to upload
 * @param folder Optional Cloudinary folder name (e.g. "products", "banners", "reels", "settings")
 * @returns The Cloudinary secure URL string
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = "products"
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.error || response.statusText || "Upload request failed";
      throw new Error(`Cloudinary upload failed: ${errorMessage}`);
    }

    const data = await response.json();
    if (!data.url) {
      throw new Error("Cloudinary did not return a valid secure URL.");
    }

    return data.url;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if ((err as Error)?.name === "AbortError") {
      throw new Error("Cloudinary upload request timed out after 25 seconds.");
    }
    throw err;
  }
}

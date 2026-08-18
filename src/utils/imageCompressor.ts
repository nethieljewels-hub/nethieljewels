import imageCompression from "browser-image-compression";

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  initialQuality?: number;
  useWebWorker?: boolean;
}

/**
 * Compresses an image file without perceptible quality loss.
 * If the file is a video or non-compressible format, returns the original file.
 */
export async function compressImage(
  file: File,
  customOptions?: CompressionOptions
): Promise<File> {
  // Only compress images
  if (!file.type.startsWith("image/")) {
    return file;
  }

  const defaultOptions: CompressionOptions = {
    maxSizeMB: 2,
    maxWidthOrHeight: 2560,
    initialQuality: 0.95,
    useWebWorker: true,
  };

  const options = { ...defaultOptions, ...customOptions };

  // If the file size is already smaller than or equal to maxSizeMB, return the untouched original file
  // to avoid canvas downscaling, re-encoding artifacts, or loss of clarity.
  const targetBytes = (options.maxSizeMB || 2) * 1024 * 1024;
  if (file.size <= targetBytes) {
    return file;
  }

  try {
    const compressedFile = await imageCompression(file, options);
    // Ensure the output file retains its name
    return new File([compressedFile], file.name, {
      type: compressedFile.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.warn("Image compression error, falling back to original file:", error);
    return file;
  }
}

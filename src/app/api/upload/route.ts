import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // Allow 60 seconds max duration for media uploads

const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "").trim();
const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || "").trim();

// Configure Cloudinary with environment variables from .env.local
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export async function POST(req: NextRequest) {
  try {
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          error:
            "Cloudinary credentials missing. Please make sure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in .env.local",
        },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided for upload." }, { status: 400 });
    }

    // Convert file buffer to base64 Data URI for fast upload without stream delays
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString("base64");

    const isVideo =
      file.type.startsWith("video/") ||
      Boolean(file.name.match(/\.(mp4|mov|webm|mkv|avi|m4v)$/i));
    const resourceType = isVideo ? "video" : "image";
    const mimeType = file.type || (isVideo ? "video/mp4" : "image/jpeg");
    const dataUri = `data:${mimeType};base64,${base64String}`;

    // Upload directly to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `nethiel_jewelry/${folder}`,
      resource_type: resourceType,
      timeout: 30000,
    });

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
    });
  } catch (error) {
    console.error("Cloudinary upload route error:", error);
    const message = error instanceof Error ? error.message : "Failed to upload to Cloudinary";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

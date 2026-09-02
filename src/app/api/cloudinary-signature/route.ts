import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

// Read Cloudinary API keys from your .env.local file
const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "").trim();
const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || "").trim();

// Configure the Cloudinary SDK
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

/**
 * WHAT THIS ENDPOINT DOES:
 * 1. Instead of sending a heavy 20MB video to Vercel (which crashes on Vercel's 4.5MB limit),
 *    the browser asks this endpoint for a lightweight "security token" (signature).
 * 2. This endpoint signs the upload request in 5 milliseconds using your secret key.
 * 3. The browser takes this signature and uploads the 20MB video directly to Cloudinary.
 * Result: 0 bytes pass through Supabase, 0 bytes crash on Vercel.
 */
export async function POST(req: NextRequest) {
  try {
    // Check if Cloudinary keys exist in .env.local
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          error:
            "Cloudinary credentials missing in environment variables. Please ensure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set.",
        },
        { status: 500 }
      );
    }

    // Read the target folder (e.g., "products", "banners", "reels") from request body
    const body = await req.json().catch(() => ({}));
    const folder = body.folder ? `nethiel_jewelry/${body.folder}` : "nethiel_jewelry/general";
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Create parameters to sign
    const paramsToSign: Record<string, string | number> = {
      timestamp,
      folder,
    };

    // Generate cryptographic signature using your API Secret
    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

    // Return the signature & credentials to the browser
    return NextResponse.json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
    });
  } catch (error) {
    console.error("Cloudinary signature error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate Cloudinary signature";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

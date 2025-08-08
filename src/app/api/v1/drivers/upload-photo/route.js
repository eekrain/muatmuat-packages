import { NextResponse } from "next/server";

import {
  authErrorResponse,
  errorResponse,
  invalidFileTypeErrorResponse,
  noFileErrorResponse,
  serverErrorResponse,
  successResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generatePhotoId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generatePhotoUrl(photoId, fileExtension) {
  return `https://storage.muatrans.com/drivers/photos/${photoId}.${fileExtension}`;
}

export async function POST(req) {
  try {
    // Add realistic delay for file upload processing
    await delay(2000);

    // Check for authorization header
    const authHeader = req.headers.get("authorization");

    // Mock validation logic - check if authorization header is present
    if (!authHeader) {
      return NextResponse.json(authErrorResponse, {
        status: authErrorResponse.Message.Code,
      });
    }

    // Handle form data
    const formData = await req.formData();
    const file = formData.get("file");

    // Check if file is provided
    if (!file) {
      return NextResponse.json(noFileErrorResponse, {
        status: noFileErrorResponse.Message.Code,
      });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(invalidFileTypeErrorResponse, {
        status: invalidFileTypeErrorResponse.Message.Code,
      });
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }

    // Mock file processing for photo upload
    // eslint-disable-next-line no-console
    console.log("Processing file:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Convert to base64 for mock response (simulate file storage)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64Data}`;

    // Generate mock photo data
    const photoId = generatePhotoId();
    const fileExtension = file.type.split("/")[1];
    const photoUrl = generatePhotoUrl(photoId, fileExtension);
    const uploadedAt = new Date().toISOString();

    // Mock different photo types based on file name or random selection
    const photoTypes = ["PROFILE", "LICENSE", "ID_CARD", "VEHICLE"];
    const photoType = photoTypes[Math.floor(Math.random() * photoTypes.length)];

    // Return success response with processed photo data
    const response = {
      ...successResponse,
      Data: {
        photoUrl, // Generated mock URL (referensi ke [dbm_mt_driver_photos.photo_url])
        photoType, // Random photo type (referensi ke [dbm_mt_driver_photos.photo_type])
        uploadedAt, // Current timestamp (referensi ke [dbm_mt_driver_photos.created_at])
        // Include the base64 data for frontend preview (mock functionality)
        previewUrl: dataUrl,
        originalFileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      },
    };

    // Log for debugging purposes
    // eslint-disable-next-line no-console
    console.log("Photo uploaded successfully:", {
      photoId,
      photoUrl,
      photoType,
      originalFileName: file.name,
      fileSize: file.size,
      uploadedAt,
    });

    return NextResponse.json(response, {
      status: response.Message.Code,
    });
  } catch (error) {
    // Log error for debugging
    // eslint-disable-next-line no-console
    console.error("API Error:", error);
    return NextResponse.json(serverErrorResponse, {
      status: 500,
    });
  }
}

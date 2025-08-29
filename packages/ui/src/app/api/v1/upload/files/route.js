import { NextResponse } from "next/server";

import {
  errorResponse,
  serverErrorResponse,
  successResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        {
          Message: {
            Code: 400,
            Text: "File is required",
          },
          Data: {
            errors: [
              {
                field: "file",
                message: "File wajib diunggah",
              },
            ],
          },
          Type: "UPLOAD_DRIVER_PHOTO",
        },
        { status: 400 }
      );
    }

    // File size validation (10MB limit)
    if (file.size > 10000000) {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }

    // File type validation
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          Message: {
            Code: 400,
            Text: "Invalid file format",
          },
          Data: {
            errors: [
              {
                field: "file",
                message: "Format file harus JPG, JPEG, atau PNG",
              },
            ],
          },
          Type: "UPLOAD_DRIVER_PHOTO",
        },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await delay(1500);

    // Generate mock file URL and metadata
    const fileName = file.name;
    const fileSize = file.size.toString();
    const mockFileUrl = `https://storage.muatrans.com/drivers/photos/123e4567-e89b-12d3-a456-426614174000.jpg`;

    return NextResponse.json(
      {
        ...successResponse,
        Data: {
          fileUrl: mockFileUrl,
          fileName: fileName,
          fileSize: fileSize,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}

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
    // Add realistic delay for testing
    await delay(2000);

    // Handle form data
    const formData = await req.formData();
    const file = formData.get("document");

    // Mock file processing for file uploads
    if (file) {
      // Add file validation - check file size (10MB limit)
      if (file.size > 10000000) {
        return NextResponse.json(errorResponse, {
          status: errorResponse.Message.Code,
        });
      }

      // Add file type validation
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(errorResponse, {
          status: errorResponse.Message.Code,
        });
      }

      // Generate mock document URL based on file type
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const mockDocumentId = "550e8400-e29b-41d4-a716-446655440005";
      const mockDocumentUrl = `https://cdn.muatrans.com/vehicles/documents/${mockDocumentId}.${fileExtension}`;

      // Return success with processed data
      return NextResponse.json(
        {
          ...successResponse,
          Data: {
            ...successResponse.Data,
            documentUrl: mockDocumentUrl,
            originalFileName: file.name,
            fileSize: file.size,
            uploadedAt: new Date().toISOString(),
          },
        },
        { status: successResponse.Message.Code }
      );
    }

    // If no file provided, return error
    return NextResponse.json(errorResponse, {
      status: errorResponse.Message.Code,
    });
  } catch {
    return NextResponse.json(serverErrorResponse, {
      status: 500,
    });
  }
}

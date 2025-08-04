import { NextResponse } from "next/server";

import { errorResponse, successResponse } from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function POST(req) {
  // console.log(req.body);
  try {
    // Handle form data if needed
    const formData = await req.formData();
    const file = formData.get("file");
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const mimeType = file.type || "application/octet-stream";

    // Convert to base64 Data URL
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64Data}`;
    await delay(2000);
    if (file.size > 100000000) {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }
    return NextResponse.json(
      {
        ...successResponse,
        Data: {
          ...successResponse.Data,
          photoUrl: dataUrl,
        },
      },
      { status: successResponse.Message.Code }
    );
  } catch (_) {
    return NextResponse.json(
      {
        Message: {
          Code: 500,
          Text: "Internal Server Error",
        },
        Data: {
          errors: [
            {
              field: "photo",
              message: "Terjadi kesalahan pada sistem kami",
            },
          ],
        },
        Type: "VEHICLE_PHOTO_UPLOAD",
      },
      { status: 500 }
    );
  }
}

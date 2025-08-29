import { NextResponse } from "next/server";

import {
  errorResponse,
  serverErrorResponse,
  successResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function PATCH(req, { params }) {
  try {
    // Add realistic delay for testing
    await delay(800);

    const { transporterId } = await params;
    const body = await req.json();
    const { isActive, reason } = body.data;
    console.log(body);

    // Mock validation logic
    if (!transporterId) {
      return NextResponse.json(
        {
          ...errorResponse,
          Message: {
            ...errorResponse.Message,
            Text: "ID transporter tidak valid",
          },
          Data: {
            errors: [
              {
                field: "transporterId",
                message: "ID transporter wajib diisi",
              },
            ],
          },
        },
        { status: 400 }
      );
    }

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        {
          ...errorResponse,
          Message: {
            ...errorResponse.Message,
            Text: "Status aktif tidak valid",
          },
          Data: {
            errors: [
              {
                field: "isActive",
                message: "isActive harus berupa boolean (true/false)",
              },
            ],
          },
        },
        { status: 400 }
      );
    }

    // Additional business logic validation
    if (!isActive && transporterId.includes("active-order")) {
      return NextResponse.json(serverErrorResponse, { status: 500 });
    }

    // Mock successful response
    const response = {
      ...successResponse,
      Data: {
        ...successResponse.Data,
        transporterId: transporterId,
        isActive: isActive,
        status: isActive ? "ACTIVE" : "NON_ACTIVE",
        updatedAt: new Date().toISOString(),
        ...(reason && { reason }),
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch {
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}

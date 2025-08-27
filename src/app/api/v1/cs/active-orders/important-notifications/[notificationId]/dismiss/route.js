/* eslint-disable no-console */
import { NextResponse } from "next/server";

import {
  errorResponse,
  serverErrorResponse,
  successResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function PUT(req, { params }) {
  try {
    // Simulate network latency
    await delay(1000);

    const body = await req.json();
    const { action, snoozeUntil } = body || {};
    const { notificationId } = params || {};

    console.log(
      "PUT /v1/cs/active-orders/important-notifications/:notificationId/dismiss",
      {
        notificationId,
        body,
      }
    );

    // Basic validation
    if (!action) {
      return NextResponse.json(
        {
          ...errorResponse,
          Message: {
            ...errorResponse.Message,
            Code: 400,
            Text: "Field 'action' is required",
          },
          Data: {
            errors: [
              {
                field: "action",
                message: "Field 'action' harus diisi (READ|SNOOZE)",
              },
            ],
          },
        },
        { status: 400 }
      );
    }

    if (action === "SNOOZE" && !snoozeUntil) {
      return NextResponse.json(
        {
          ...errorResponse,
          Message: {
            ...errorResponse.Message,
            Code: 400,
            Text: "Field 'snoozeUntil' diperlukan ketika action=SNOOZE",
          },
        },
        { status: 400 }
      );
    }

    // Return success response with realistic processedAt
    const response = {
      ...successResponse,
      Data: {
        ...successResponse.Data,
        notificationId: notificationId ?? null,
        action,
        processedAt: new Date().toISOString(),
        success: true,
      },
    };

    return NextResponse.json(response, { status: response.Message.Code });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}

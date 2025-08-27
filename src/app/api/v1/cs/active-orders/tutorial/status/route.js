/* eslint-disable no-console */
import { NextResponse } from "next/server";

import {
  errorResponse,
  serverErrorResponse,
  successGetResponse,
  successResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function PUT(req) {
  try {
    // Simulate network latency
    await delay(1000);

    const body = await req.json();

    // Basic validation
    if (
      typeof body.showTutorialDaftarPesananAktif !== "boolean" ||
      (body.action &&
        !["DISABLE_TUTORIAL", "COMPLETE_SECTION", "RESET_TUTORIAL"].includes(
          body.action
        ))
    ) {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }

    // Return updated success shape
    const response = {
      ...successResponse,
      Data: {
        userId: body.userId || successResponse.Data.userId,
        showTutorialDaftarPesananAktif: body.showTutorialDaftarPesananAktif,
        updatedAt: new Date().toISOString(),
        success: true,
      },
    };

    console.log("PUT /v1/cs/active-orders/tutorial/status - body:", body);

    return NextResponse.json(response, { status: response.Message.Code });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}

export async function GET(_req) {
  try {
    await delay(500);

    // Optionally parse query params in the future
    return NextResponse.json(successGetResponse, {
      status: successGetResponse.Message.Code,
    });
  } catch (error) {
    console.error("API Error (GET):", error);
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}

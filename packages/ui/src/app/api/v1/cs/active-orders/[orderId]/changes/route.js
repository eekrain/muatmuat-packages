import { NextResponse } from "next/server";

import {
  errorResponse,
  noPriceAdjustmentResponse,
  pickupLocationOnlyResponse,
  serverErrorResponse,
  successResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req, { params }) {
  try {
    // Simulate network latency
    await delay(800);

    const orderId = params?.orderId;

    // Basic validation: orderId must be present and look like a non-empty string
    if (!orderId || typeof orderId !== "string" || orderId.trim() === "") {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }

    // Deep clone so consumers can mutate safely
    let responseData;

    // Return different scenarios based on orderId for testing different LD references
    if (orderId.includes("no-price")) {
      // LD-89: No price adjustment scenario
      responseData = JSON.parse(JSON.stringify(noPriceAdjustmentResponse));
    } else if (orderId.includes("pickup-only")) {
      // LD-91: Only pickup location change
      responseData = JSON.parse(JSON.stringify(pickupLocationOnlyResponse));
    } else if (orderId.includes("time-only")) {
      // LD-90: Only time change
      responseData = JSON.parse(JSON.stringify(noPriceAdjustmentResponse));
      responseData.Data.changeType = "TIME_ONLY";
    } else if (orderId.includes("delivery-only")) {
      // LD-92: Only delivery location change
      responseData = JSON.parse(JSON.stringify(pickupLocationOnlyResponse));
      responseData.Data.changes.locationChanges.pickupLocationChanges = [];
      responseData.Data.changes.locationChanges.deliveryLocationChanges = [
        {
          changeType: "MODIFIED",
          originalLocation: {
            address: "Jl. Ahmad Yani No. 789, Surabaya",
            city: "Surabaya",
            province: "Jawa Timur",
          },
          newLocation: {
            address: "Jl. Diponegoro No. 321, Malang",
            city: "Malang",
            province: "Jawa Timur",
          },
        },
      ];
    } else {
      // LD-88: Default scenario with price adjustment (full changes)
      // LD-93: Combined time + location + delivery changes
      responseData = JSON.parse(JSON.stringify(successResponse));
    }

    // Vary response based on orderId if needed
    if (orderId.includes("empty")) {
      responseData.Data.changes.locationChanges.pickupLocationChanges = [];
      responseData.Data.changes.locationChanges.deliveryLocationChanges = [];
    }

    return NextResponse.json(responseData, {
      status: responseData.Message.Code,
    });
  } catch (error) {
    // Unexpected error - return generic server error
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}

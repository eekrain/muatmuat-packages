import { NextResponse } from "next/server";

import {
  authErrorResponse,
  mockDraftDrivers,
  serverErrorResponse,
  successResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req) {
  try {
    // Add realistic delay for testing
    await delay(1200);

    // Check for authorization header
    const authHeader = req.headers.get("authorization");

    // Mock validation logic - check if authorization header is present
    if (!authHeader) {
      return NextResponse.json(authErrorResponse, {
        status: authErrorResponse.Message.Code,
      });
    }

    // Simulate different draft scenarios
    // 90% chance of having draft drivers, 10% chance of empty drafts
    const hasDraftDrivers = Math.random() > 0.1;

    let driversData;
    let totalDrivers;

    if (hasDraftDrivers) {
      // Return a random subset of draft drivers (1-8 drivers)
      const numDrivers = Math.floor(Math.random() * 8) + 1;
      const shuffledDrivers = [...mockDraftDrivers].sort(
        () => 0.5 - Math.random()
      );
      driversData = shuffledDrivers.slice(0, numDrivers);
      totalDrivers = driversData.length;

      // Update timestamps to be more recent
      driversData = driversData.map((driver) => {
        const now = new Date();
        const hoursAgoCreated = Math.floor(Math.random() * 168); // 0-168 hours ago (1 week)
        const hoursAgoUpdated = Math.floor(
          Math.random() * Math.min(hoursAgoCreated, 24)
        ); // Updated after created, within 24h

        const createdAt = new Date(
          now.getTime() - hoursAgoCreated * 60 * 60 * 1000
        );
        const updatedAt = new Date(
          now.getTime() - hoursAgoUpdated * 60 * 60 * 1000
        );

        return {
          ...driver,
          createdAt: createdAt.toISOString(), // Referensi ke [dbt_mt_drivers.created_at]
          updatedAt: updatedAt.toISOString(), // Referensi ke [dbt_mt_drivers.updated_at]
        };
      });
    } else {
      // Return empty drafts
      driversData = [];
      totalDrivers = 0;
    }

    // Return success response with draft drivers data
    const response = {
      ...successResponse,
      Data: {
        drivers: driversData,
        totalDrivers: totalDrivers,
      },
    };

    // Log for debugging purposes
    // eslint-disable-next-line no-console
    console.log("Draft drivers retrieved:", {
      totalDrivers,
      driversCount: driversData.length,
      driverNames: driversData.map((d) => d.name),
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

import { NextResponse } from "next/server";

import {
  authErrorResponse,
  mockDraftScenarios,
  serverErrorResponse,
  successResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req) {
  try {
    // Add realistic delay for testing
    await delay(800);

    // Check for authorization header
    const authHeader = req.headers.get("authorization");

    // Mock validation logic - check if authorization header is present
    if (!authHeader) {
      return NextResponse.json(authErrorResponse, {
        status: authErrorResponse.Message.Code,
      });
    }

    // Simulate different draft scenarios for testing
    // 80% chance of having drafts, 20% chance of no drafts
    const hasDrafts = Math.random() > 0.2;

    let draftData;
    if (hasDrafts) {
      // Select a random draft scenario with drafts
      const draftScenarios = mockDraftScenarios.filter(
        (scenario) => scenario.hasDraft
      );
      draftData =
        draftScenarios[Math.floor(Math.random() * draftScenarios.length)];
    } else {
      // Use the no-draft scenario
      draftData = mockDraftScenarios.find((scenario) => !scenario.hasDraft);
    }

    // Update lastUpdated to a more recent time if there are drafts
    if (draftData.hasDraft) {
      // Generate a random recent timestamp
      const now = new Date();
      const hoursAgo = Math.floor(Math.random() * 72); // 0-72 hours ago
      const lastUpdated = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
      draftData = {
        ...draftData,
        lastUpdated: lastUpdated.toISOString(),
      };
    }

    // Return success response with draft status
    const response = {
      ...successResponse,
      Data: {
        hasDraft: draftData.hasDraft,
        draftCount: draftData.draftCount,
        lastUpdated: draftData.lastUpdated, // Referensi ke [dbt_mt_drivers.updated_at] di ERD
      },
    };

    // Log for debugging purposes
    // eslint-disable-next-line no-console
    console.log("Draft status retrieved:", {
      hasDraft: response.Data.hasDraft,
      draftCount: response.Data.draftCount,
      lastUpdated: response.Data.lastUpdated,
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

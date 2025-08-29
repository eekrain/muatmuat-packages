import { NextResponse } from "next/server";

import {
  emptyPreviewResponse,
  errorResponse,
  mockFleetData,
  processingErrorResponse,
  serverErrorResponse,
  successResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper function to validate import ID format
function isValidImportId(importId) {
  // Check if it's a valid UUID format or similar ID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(importId) || importId.length > 10;
}

// Helper function to simulate different import statuses
function getImportStatus(importId) {
  // Simulate different scenarios based on import ID
  if (importId.includes("processing")) {
    return "PROCESSING";
  }
  if (importId.includes("failed")) {
    return "FAILED";
  }
  if (importId.includes("empty")) {
    return "EMPTY";
  }
  if (importId.includes("large")) {
    return "LARGE_DATASET";
  }
  return "COMPLETED";
}

export async function GET(req, { params }) {
  try {
    // Add realistic delay for data retrieval
    await delay(800);

    const { importId } = params;

    // Validate import ID format
    if (!importId || !isValidImportId(importId)) {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }

    // Simulate different scenarios based on import ID
    const status = getImportStatus(importId);

    switch (status) {
      case "PROCESSING":
        return NextResponse.json(processingErrorResponse, {
          status: processingErrorResponse.Message.Code,
        });

      case "FAILED":
        return NextResponse.json(errorResponse, {
          status: errorResponse.Message.Code,
        });

      case "EMPTY":
        return NextResponse.json(emptyPreviewResponse, {
          status: emptyPreviewResponse.Message.Code,
        });

      case "LARGE_DATASET": {
        // Generate large dataset for testing pagination/performance
        const largeFleetList = mockFleetData.generateLargeFleetList(100);
        return NextResponse.json(
          {
            ...successResponse,
            Data: {
              ...successResponse.Data,
              bulkImportId: importId,
              totalFleets: largeFleetList.length,
              fleets: largeFleetList,
            },
          },
          { status: successResponse.Message.Code }
        );
      }

      case "COMPLETED":
      default: {
        // Determine fleet count based on import ID characteristics
        let fleetCount = 25; // default
        if (importId.includes("small")) {
          fleetCount = 5;
        } else if (importId.includes("medium")) {
          fleetCount = 15;
        } else if (importId.includes("large")) {
          fleetCount = 50;
        }

        // Use predefined mock data for standard cases
        if (fleetCount <= 25) {
          return NextResponse.json(
            {
              ...successResponse,
              Data: {
                ...successResponse.Data,
                bulkImportId: importId,
                totalFleets: successResponse.Data.fleets.length,
              },
            },
            { status: successResponse.Message.Code }
          );
        } else {
          // Generate dynamic fleet list for larger datasets
          const dynamicFleetList =
            mockFleetData.generateLargeFleetList(fleetCount);
          return NextResponse.json(
            {
              ...successResponse,
              Data: {
                ...successResponse.Data,
                bulkImportId: importId,
                totalFleets: dynamicFleetList.length,
                fleets: dynamicFleetList,
              },
            },
            { status: successResponse.Message.Code }
          );
        }
      }
    }
  } catch {
    return NextResponse.json(serverErrorResponse, {
      status: 500,
    });
  }
}

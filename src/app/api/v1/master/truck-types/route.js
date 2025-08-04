import { NextResponse } from "next/server";

import { serverErrorResponse, successResponse } from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req) {
  try {
    // Add realistic delay for testing
    await delay(1000);

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const isActive = searchParams.get("isActive");

    // Mock: Create a copy of the success response to modify
    const mockData = { ...successResponse };
    let filteredTruckTypes = [...mockData.Data.truckTypes];

    // Filter by search keyword if provided
    if (search) {
      filteredTruckTypes = filteredTruckTypes.filter((truck) =>
        truck.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by isActive status if provided
    if (isActive !== null) {
      // Mock: Simulate some inactive truck types
      const inactiveTruckIds = [
        "550e8400-e29b-41d4-a716-446655440006", // Container
        "550e8400-e29b-41d4-a716-446655440007", // Dump Truck
      ];

      if (isActive === "true") {
        // Return only active truck types
        filteredTruckTypes = filteredTruckTypes.filter(
          (truck) => !inactiveTruckIds.includes(truck.id)
        );
      } else if (isActive === "false") {
        // Return only inactive truck types
        filteredTruckTypes = filteredTruckTypes.filter((truck) =>
          inactiveTruckIds.includes(truck.id)
        );
      }
    }

    // Update the response with filtered data
    mockData.Data.truckTypes = filteredTruckTypes;

    // Update message if no results found
    if (filteredTruckTypes.length === 0) {
      mockData.Message.Text = "Tidak ada jenis truk yang ditemukan";
    }

    // Return success response
    return NextResponse.json(mockData, {
      status: mockData.Message.Code,
    });
  } catch {
    return NextResponse.json(serverErrorResponse, {
      status: 500,
    });
  }
}

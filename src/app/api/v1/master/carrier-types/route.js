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
    const truckTypeId = searchParams.get("truckTypeId");

    // Mock: Create a copy of the success response to modify
    const mockData = { ...successResponse };

    // Update the Type field with the actual truckTypeId if provided
    if (truckTypeId) {
      mockData.Type = `/v1/master/carrier-types?truckTypeId=${truckTypeId}`;
    } else {
      mockData.Type = "/v1/master/carrier-types";
    }

    // Mock: Different carrier types based on truckTypeId
    if (truckTypeId === "550e8400-e29b-41d4-a716-446655440202") {
      // Default carrier types (already in successResponse)
      // Keep existing data
    } else if (truckTypeId === "550e8400-e29b-41d4-a716-446655440203") {
      // Heavy truck carrier types
      mockData.Data.carrierTypes = [
        {
          id: "550e8400-e29b-41d4-a716-446655440051",
          name: "Container",
          icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/carrier/heavy-truck-container.png",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440052",
          name: "Trailer Box",
          icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/carrier/heavy-truck-trailer-box.png",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440053",
          name: "Low Bed",
          icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/carrier/heavy-truck-lowbed.png",
        },
      ];
    } else if (truckTypeId === "550e8400-e29b-41d4-a716-446655440204") {
      // Light truck carrier types
      mockData.Data.carrierTypes = [
        {
          id: "550e8400-e29b-41d4-a716-446655440054",
          name: "Pick Up Bak",
          icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/carrier/pickup-bak.png",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440055",
          name: "Pick Up Box",
          icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/carrier/pickup-box.png",
        },
      ];
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

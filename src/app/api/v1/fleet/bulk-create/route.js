import { NextResponse } from "next/server";

import {
  errorResponse,
  serverErrorResponse,
  successResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req) {
  try {
    // Add realistic delay for testing
    await delay(1000);

    // Parse request body
    const body = await req.json();

    // Validate that body is an array
    if (!Array.isArray(body)) {
      return NextResponse.json(
        {
          Message: {
            Code: 400,
            Text: "Bad Request",
          },
          Data: {
            validationErrors: [
              {
                field: "body",
                value: typeof body,
                message: "Request body must be an array of fleet objects",
              },
            ],
          },
          Type: "SAVE_FLEET_DATA",
        },
        {
          status: 400,
        }
      );
    }

    // Validate required fields for each fleet object
    for (let i = 0; i < body.length; i++) {
      const fleet = body[i];

      // Check required fields
      if (!fleet.licensePlate) {
        return NextResponse.json(
          {
            Message: {
              Code: 400,
              Text: "Bad Request",
            },
            Data: {
              validationErrors: [
                {
                  field: `[${i}].licensePlate`,
                  value: fleet.licensePlate,
                  message: "License plate is required",
                },
              ],
            },
            Type: "SAVE_FLEET_DATA",
          },
          {
            status: 400,
          }
        );
      }

      if (!fleet.truckTypeId) {
        return NextResponse.json(
          {
            Message: {
              Code: 400,
              Text: "Bad Request",
            },
            Data: {
              validationErrors: [
                {
                  field: `[${i}].truckTypeId`,
                  value: fleet.truckTypeId,
                  message: "Truck type ID is required",
                },
              ],
            },
            Type: "SAVE_FLEET_DATA",
          },
          {
            status: 400,
          }
        );
      }

      if (!fleet.carrierTypeId) {
        return NextResponse.json(
          {
            Message: {
              Code: 400,
              Text: "Bad Request",
            },
            Data: {
              validationErrors: [
                {
                  field: `[${i}].carrierTypeId`,
                  value: fleet.carrierTypeId,
                  message: "Carrier type ID is required",
                },
              ],
            },
            Type: "SAVE_FLEET_DATA",
          },
          {
            status: 400,
          }
        );
      }

      // Mock validation for duplicate license plate
      if (fleet.licensePlate === "L1234SS") {
        return NextResponse.json(errorResponse, {
          status: errorResponse.Message.Code,
        });
      }

      // Validate photos array if provided
      if (fleet.photos && Array.isArray(fleet.photos)) {
        for (let j = 0; j < fleet.photos.length; j++) {
          const photo = fleet.photos[j];
          if (!photo.photoType || !photo.photoUrl) {
            return NextResponse.json(
              {
                Message: {
                  Code: 400,
                  Text: "Bad Request",
                },
                Data: {
                  validationErrors: [
                    {
                      field: `[${i}].photos[${j}]`,
                      value: photo,
                      message: "Photo type and URL are required",
                    },
                  ],
                },
                Type: "SAVE_FLEET_DATA",
              },
              {
                status: 400,
              }
            );
          }
        }
      }

      // Validate documents array if provided
      if (fleet.documents && Array.isArray(fleet.documents)) {
        for (let k = 0; k < fleet.documents.length; k++) {
          const document = fleet.documents[k];
          if (!document.documentType || !document.documentUrl) {
            return NextResponse.json(
              {
                Message: {
                  Code: 400,
                  Text: "Bad Request",
                },
                Data: {
                  validationErrors: [
                    {
                      field: `[${i}].documents[${k}]`,
                      value: document,
                      message: "Document type and URL are required",
                    },
                  ],
                },
                Type: "SAVE_FLEET_DATA",
              },
              {
                status: 400,
              }
            );
          }
        }
      }
    }

    // Mock successful response with the number of fleets processed
    const mockSuccessResponse = {
      ...successResponse,
      Data: {
        ...successResponse.Data,
        savedFleets: body.length, // Return actual number of fleets in the request
      },
    };

    // Return success response
    return NextResponse.json(mockSuccessResponse, {
      status: mockSuccessResponse.Message.Code,
    });
  } catch {
    // Handle any parsing or processing errors
    return NextResponse.json(serverErrorResponse, {
      status: 500,
    });
  }
}

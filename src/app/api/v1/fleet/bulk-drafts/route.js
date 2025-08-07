import { NextResponse } from "next/server";

import { duplicateLicensePlateError, serverErrorResponse } from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper function to validate required fields
function validateFleetData(fleetData) {
  const errors = [];

  if (!fleetData.licensePlate) {
    errors.push({
      field: "licensePlate",
      message: "License plate is required",
    });
  }

  if (!fleetData.truckTypeId) {
    errors.push({
      field: "truckTypeId",
      message: "Truck type is required",
    });
  }

  if (!fleetData.carrierTypeId) {
    errors.push({
      field: "carrierTypeId",
      message: "Carrier type is required",
    });
  }

  if (!fleetData.vehicleBrandId) {
    errors.push({
      field: "vehicleBrandId",
      message: "Vehicle brand is required",
    });
  }

  if (!fleetData.vehicleTypeId) {
    errors.push({
      field: "vehicleTypeId",
      message: "Vehicle type is required",
    });
  }

  if (!fleetData.chassisNumber) {
    errors.push({
      field: "chassisNumber",
      message: "Chassis number is required",
    });
  }

  if (
    !fleetData.registrationYear ||
    fleetData.registrationYear < 1900 ||
    fleetData.registrationYear > new Date().getFullYear()
  ) {
    errors.push({
      field: "registrationYear",
      message: "Valid registration year is required",
    });
  }

  // Validate license plate format (Indonesian format)
  const licensePlateRegex = /^[A-Z]{1,2}\s?\d{1,4}\s?[A-Z]{1,3}$/;
  if (
    fleetData.licensePlate &&
    !licensePlateRegex.test(fleetData.licensePlate)
  ) {
    errors.push({
      field: "licensePlate",
      message: "Invalid license plate format",
    });
  }

  return errors;
}

// Helper function to validate documents
function validateDocuments(documents) {
  const errors = [];
  const requiredDocTypes = ["STNK", "KIR"];

  if (!documents || !Array.isArray(documents)) {
    errors.push({
      field: "documents",
      message: "Documents array is required",
    });
    return errors;
  }

  const documentTypes = documents.map((doc) => doc.documentType);

  for (const requiredType of requiredDocTypes) {
    if (!documentTypes.includes(requiredType)) {
      errors.push({
        field: "documents",
        message: `Document type ${requiredType} is required`,
      });
    }
  }

  return errors;
}

// Helper function to validate photos
function validatePhotos(photos) {
  const errors = [];
  const requiredPhotoTypes = ["FRONT", "BACK", "LEFT", "RIGHT"];

  if (!photos || !Array.isArray(photos)) {
    errors.push({
      field: "photos",
      message: "Photos array is required",
    });
    return errors;
  }

  const photoTypes = photos.map((photo) => photo.photoType);

  for (const requiredType of requiredPhotoTypes) {
    if (!photoTypes.includes(requiredType)) {
      errors.push({
        field: "photos",
        message: `Photo type ${requiredType} is required`,
      });
    }
  }

  return errors;
}

export async function POST(req) {
  try {
    // Add realistic delay for testing
    await delay(1500);

    // Parse request body
    const body = await req.json();

    // Add debug logging in development
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("Fleet bulk drafts request:", body);
    }

    // Validate request body is an array
    if (!Array.isArray(body)) {
      return NextResponse.json(
        {
          Message: {
            Code: 400,
            Text: "Request body must be an array",
          },
          Data: {
            errors: [
              {
                field: "body",
                message: "Expected array of fleet data",
              },
            ],
          },
          Type: "VALIDATION_ERROR",
        },
        {
          status: 400,
        }
      );
    }

    // Validate each fleet item
    const allErrors = [];
    const validatedFleets = [];

    for (let i = 0; i < body.length; i++) {
      const fleetData = body[i];
      const fleetErrors = [];

      // Validate basic fleet data
      const basicErrors = validateFleetData(fleetData);
      fleetErrors.push(...basicErrors);

      // Validate documents
      const documentErrors = validateDocuments(fleetData.documents);
      fleetErrors.push(...documentErrors);

      // Validate photos
      const photoErrors = validatePhotos(fleetData.photos);
      fleetErrors.push(...photoErrors);

      if (fleetErrors.length > 0) {
        allErrors.push({
          index: i,
          licensePlate: fleetData.licensePlate || `Item ${i + 1}`,
          errors: fleetErrors,
        });
      } else {
        validatedFleets.push(fleetData);
      }
    }

    // If there are validation errors, return them
    if (allErrors.length > 0) {
      return NextResponse.json(
        {
          Message: {
            Code: 400,
            Text: "Validation failed for some fleet items",
          },
          Data: {
            errors: allErrors,
          },
          Type: "VALIDATION_ERROR",
        },
        {
          status: 400,
        }
      );
    }

    // Mock check for duplicate license plates
    const licensePlates = body.map((fleet) => fleet.licensePlate);
    const duplicates = licensePlates.filter(
      (item, index) => licensePlates.indexOf(item) !== index
    );

    if (duplicates.length > 0) {
      return NextResponse.json(
        {
          ...duplicateLicensePlateError,
          Data: {
            ...duplicateLicensePlateError.Data,
            duplicateLicensePlates: duplicates,
          },
        },
        {
          status: duplicateLicensePlateError.Message.Code,
        }
      );
    }

    // Mock successful response with multiple fleet drafts
    const responseData = {
      Message: {
        Code: 200,
        Text: "Fleet drafts saved successfully",
      },
      Data: {
        savedDrafts: body.map((fleet, index) => ({
          draftId: fleet.draftId || `draft-${Date.now()}-${index}`,
          licensePlate: fleet.licensePlate,
          fleetStatus: "DRAFT",
          completionPercent: Math.floor(Math.random() * 40) + 60, // Random between 60-100
          createdAt: new Date().toISOString(),
          hasPhotos: fleet.photos && fleet.photos.length > 0,
          hasDocuments: fleet.documents && fleet.documents.length > 0,
        })),
        totalSaved: body.length,
        successfulSaves: body.length,
        failedSaves: 0,
      },
      Type: "SAVE_FLEET_BULK_DRAFTS",
    };

    return NextResponse.json(responseData, {
      status: 200,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("API Error:", error);
    return NextResponse.json(serverErrorResponse, {
      status: 500,
    });
  }
}

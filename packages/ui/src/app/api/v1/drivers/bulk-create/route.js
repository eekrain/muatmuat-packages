import { NextResponse } from "next/server";

import {
  authErrorResponse,
  errorResponse,
  generateDriverId,
  noDriversErrorResponse,
  serverErrorResponse,
  successResponse,
  validateDriverData,
  verificationStatuses,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req) {
  try {
    // Add realistic delay for bulk processing
    await delay(2500);

    // Check for authorization header
    const authHeader = req.headers.get("authorization");

    // Mock validation logic - check if authorization header is present
    if (!authHeader) {
      return NextResponse.json(authErrorResponse, {
        status: authErrorResponse.Message.Code,
      });
    }

    // Parse request body
    const body = await req.json();
    const { drivers } = body;

    // Validate drivers array
    if (!drivers || !Array.isArray(drivers) || drivers.length === 0) {
      return NextResponse.json(noDriversErrorResponse, {
        status: noDriversErrorResponse.Message.Code,
      });
    }

    // Validate each driver and collect errors
    const allValidationErrors = [];
    const validDrivers = [];

    drivers.forEach((driver, index) => {
      // Pass options to make duplicate phone number check optional (disabled by default)
      const validationErrors = validateDriverData(driver, {
        checkDuplicatePhoneNumbers: false, // Set to true if you want to enable duplicate checking
      });

      if (validationErrors.length > 0) {
        // Add index information to errors for better debugging
        validationErrors.forEach((error) => {
          allValidationErrors.push({
            ...error,
            driverIndex: index,
          });
        });
      } else {
        validDrivers.push(driver);
      }
    });

    // If there are validation errors, return them
    if (allValidationErrors.length > 0) {
      return NextResponse.json(
        {
          ...errorResponse,
          Data: {
            validationErrors: allValidationErrors,
          },
        },
        {
          status: errorResponse.Message.Code,
        }
      );
    }

    // Process valid drivers - simulate saving to database
    const savedDrivers = validDrivers.map((driver) => {
      const driverId = generateDriverId();
      const verificationStatus =
        verificationStatuses[
          Math.floor(Math.random() * verificationStatuses.length)
        ];
      const createdAt = new Date().toISOString();

      return {
        id: driverId,
        name: driver.name, // Referensi ke [dbt_mt_drivers.name]
        phoneNumber: driver.phoneNumber, // Referensi ke [dbt_mt_drivers.phone_number]
        verificationStatus, // Referensi ke [dbt_mt_drivers.verification_status]
        createdAt, // Referensi ke [dbt_mt_drivers.created_at]
      };
    });

    // Simulate partial success scenario (10% chance)
    const simulatePartialFailure = Math.random() < 0.1;
    let finalSavedDrivers = savedDrivers;

    if (simulatePartialFailure && savedDrivers.length > 1) {
      // Remove last driver to simulate partial failure
      finalSavedDrivers = savedDrivers.slice(0, -1);

      // Add a validation error for the failed driver
      const failedDriver = drivers[drivers.length - 1];
      allValidationErrors.push({
        field: "phoneNumber",
        value: failedDriver.phoneNumber,
        message: "Phone number already exists",
        driverIndex: drivers.length - 1,
      });
    }

    // Return success response with saved drivers
    const response = {
      ...successResponse,
      Data: {
        savedDrivers: finalSavedDrivers,
        totalSaved: finalSavedDrivers.length,
        // Include validation errors if partial failure occurred
        ...(allValidationErrors.length > 0 && {
          validationErrors: allValidationErrors,
        }),
      },
    };

    // Log for debugging purposes
    // eslint-disable-next-line no-console
    console.log("Bulk create drivers processed:", {
      totalDriversReceived: drivers.length,
      totalSaved: finalSavedDrivers.length,
      validationErrors: allValidationErrors.length,
      savedDriverIds: finalSavedDrivers.map((d) => d.id),
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

import { NextResponse } from "next/server";

import {
  authErrorResponse,
  errorResponse,
  generateDraftId,
  isUpdateOperation,
  noDriversErrorResponse,
  serverErrorResponse,
  successResponse,
  validateDraftDriverData,
  verificationStatuses,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req) {
  try {
    // Add realistic delay for bulk draft processing
    await delay(1800);

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
      const validationErrors = validateDraftDriverData(driver);

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

    // Process valid drivers - simulate saving to draft database
    const savedDrivers = validDrivers.map((driver) => {
      const isUpdate = isUpdateOperation(driver);
      const draftId = isUpdate ? driver.draftId : generateDraftId();
      const verificationStatus =
        verificationStatuses[
          Math.floor(Math.random() * verificationStatuses.length)
        ];
      const now = new Date().toISOString();

      // For updates, simulate that created date stays the same
      const createdAt = isUpdate
        ? new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
          ).toISOString() // Random time in last week
        : now;

      return {
        id: draftId,
        name: driver.name, // Referensi ke [dbt_mt_drivers.name]
        phoneNumber: driver.phoneNumber || "", // Referensi ke [dbt_mt_drivers.phone_number]
        profileImage: driver.profileImage || null, // Referensi ke [dbt_mt_drivers.profile_image]
        ktpDocument: driver.ktpDocument || null, // Referensi ke [dbm_mt_driver_documents.document_url]
        simDocument: driver.simDocument || null, // Referensi ke [dbm_mt_driver_documents.document_url]
        simExpiryDate: driver.simExpiryDate || null, // Referensi ke [dbt_mt_drivers.sim_expiry_date]
        verificationStatus, // Referensi ke [dbt_mt_drivers.verification_status]
        createdAt, // Referensi ke [dbt_mt_drivers.created_at]
        updatedAt: now, // Referensi ke [dbt_mt_drivers.updated_at]
        isDraft: true,
        isUpdate,
      };
    });

    // Simulate occasional partial success scenario (5% chance for drafts - lower than published drivers)
    const simulatePartialFailure = Math.random() < 0.05;
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

    // Return only necessary fields in response (matching the specification)
    const responseDrivers = finalSavedDrivers.map((driver) => ({
      id: driver.id,
      name: driver.name,
      phoneNumber: driver.phoneNumber,
      verificationStatus: driver.verificationStatus,
      createdAt: driver.createdAt,
    }));

    // Return success response with saved draft drivers
    const response = {
      ...successResponse,
      Data: {
        savedDrivers: responseDrivers,
        totalSaved: finalSavedDrivers.length,
        // Include validation errors if partial failure occurred
        ...(allValidationErrors.length > 0 && {
          validationErrors: allValidationErrors,
        }),
      },
    };

    // Log for debugging purposes
    // eslint-disable-next-line no-console
    console.log("Bulk draft drivers processed:", {
      totalDriversReceived: drivers.length,
      totalSaved: finalSavedDrivers.length,
      validationErrors: allValidationErrors.length,
      updates: finalSavedDrivers.filter((d) => d.isUpdate).length,
      creates: finalSavedDrivers.filter((d) => !d.isUpdate).length,
      savedDraftIds: responseDrivers.map((d) => d.id),
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

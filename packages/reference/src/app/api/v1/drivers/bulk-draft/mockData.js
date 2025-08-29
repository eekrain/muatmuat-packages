export const successResponse = {
  Message: {
    Code: 201,
    Text: "Draft saved successfully",
  },
  Data: {
    savedDrivers: [
      {
        id: "draft-123e4567-e89b-12d3-a456-426614174000",
        name: "John Doe",
        phoneNumber: "081234567890",
        verificationStatus: "PENDING", // Referensi ke [dbt_mt_drivers.verification_status] di ERD
        createdAt: "2025-07-15T10:30:00Z", // Referensi ke [dbt_mt_drivers.created_at] di ERD
      },
    ],
    totalSaved: 1,
  },
  Type: "SAVE_DRAFT_DATA",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Validation failed",
  },
  Data: {
    validationErrors: [
      {
        field: "phoneNumber",
        value: "0812432423",
        message: "Phone number already exists",
      },
      {
        field: "phoneNumber",
        value: "0812432424",
        message: "Phone number already exists",
      },
    ],
  },
  Type: "SAVE_DRIVER_DATA",
};

// Add additional error responses if needed
export const serverErrorResponse = {
  Message: {
    Code: 500,
    Text: "Internal Server Error",
  },
  Data: {
    errors: [
      {
        field: "general",
        message: "Terjadi kesalahan pada sistem kami",
      },
    ],
  },
  Type: "INTERNAL_SERVER_ERROR",
};

export const authErrorResponse = {
  Message: {
    Code: 401,
    Text: "Unauthorized",
  },
  Data: {
    errors: [
      {
        field: "authorization",
        message: "Authorization header required",
      },
    ],
  },
  Type: "UNAUTHORIZED",
};

export const noDriversErrorResponse = {
  Message: {
    Code: 400,
    Text: "No drivers provided",
  },
  Data: {
    errors: [
      {
        field: "drivers",
        message: "At least one driver is required",
      },
    ],
  },
  Type: "SAVE_DRAFT_DATA",
};

export const invalidDataErrorResponse = {
  Message: {
    Code: 400,
    Text: "Invalid driver data",
  },
  Data: {
    validationErrors: [
      {
        field: "name",
        value: "",
        message: "Name is required",
      },
    ],
  },
  Type: "SAVE_DRAFT_DATA",
};

// Mock existing phone numbers for validation testing
export const existingPhoneNumbers = [
  "081234567890",
  "081298765432",
  "081345678901",
  "081456789012",
  "081567890123",
  "0812432423",
  "0812432424",
  "081999888777",
  "081888777666",
  "081777666555",
];

// Mock existing draft IDs for update scenarios
export const existingDraftIds = [
  "draft-123e4567-e89b-12d3-a456-426614174000",
  "draft-456e7890-e12d-34a5-b678-901234567890",
  "draft-789a0123-b45c-67d8-e901-234567890123",
  "draft-abc1234d-ef56-789g-hij0-123456789abc",
  "draft-def5678e-fg90-123h-ijk4-567890123def",
];

// Mock verification statuses
export const verificationStatuses = ["PENDING", "VERIFIED", "REJECTED"];

// Function to generate draft ID
export function generateDraftId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `draft-${timestamp}-${random}`;
}

// Function to validate draft driver data (more lenient than published drivers)
export function validateDraftDriverData(driver) {
  const errors = [];

  // Name is required for drafts
  if (!driver.name || driver.name.trim() === "") {
    errors.push({
      field: "name",
      value: driver.name || "",
      message: "Name is required",
    });
  }

  // Phone number validation (check for duplicates if provided)
  if (driver.phoneNumber && driver.phoneNumber.trim() !== "") {
    if (existingPhoneNumbers.includes(driver.phoneNumber)) {
      errors.push({
        field: "phoneNumber",
        value: driver.phoneNumber,
        message: "Phone number already exists",
      });
    }
  }

  // SIM expiry date validation (only if provided)
  if (driver.simExpiryDate) {
    const expiryDate = new Date(driver.simExpiryDate);
    const today = new Date();
    if (expiryDate <= today) {
      errors.push({
        field: "simExpiryDate",
        value: driver.simExpiryDate,
        message: "SIM expiry date must be in the future",
      });
    }
  }

  return errors;
}

// Function to determine if this is an update or create operation
export function isUpdateOperation(driver) {
  return driver.draftId && existingDraftIds.includes(driver.draftId);
}

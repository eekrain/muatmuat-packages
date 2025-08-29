export const successResponse = {
  Message: {
    Code: 200,
    Text: "Draft status retrieved successfully",
  },
  Data: {
    hasDraft: true,
    draftCount: 5,
    lastUpdated: "2025-07-15T10:30:00Z", // Referensi ke [dbt_mt_drivers.updated_at] di ERD
  },
  Type: "CHECK_DRAFT_STATUS",
};

export const errorResponse = {
  Message: {
    Code: 401,
    Text: "Unauthorized access",
  },
  Data: null,
  Type: "CHECK_DRAFT_STATUS",
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

// Mock draft scenarios for testing
export const mockDraftScenarios = [
  {
    hasDraft: true,
    draftCount: 5,
    lastUpdated: "2025-07-15T10:30:00Z",
  },
  {
    hasDraft: true,
    draftCount: 12,
    lastUpdated: "2025-07-14T16:45:00Z",
  },
  {
    hasDraft: true,
    draftCount: 1,
    lastUpdated: "2025-07-13T09:15:00Z",
  },
  {
    hasDraft: false,
    draftCount: 0,
    lastUpdated: null,
  },
];

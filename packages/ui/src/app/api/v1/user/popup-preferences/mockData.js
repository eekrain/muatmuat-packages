export const successResponse = {
  Message: {
    Code: 200,
    Text: "Popup preferences updated successfully",
  },
  Data: {
    showBulkDriverPopup: false,
  },
  Type: "UPDATE_POPUP_PREFERENCES",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Invalid request data",
  },
  Data: {
    errors: [
      {
        field: "showBulkDriverPopup",
        message: "Must be a boolean value",
      },
    ],
  },
  Type: "UPDATE_POPUP_PREFERENCES",
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

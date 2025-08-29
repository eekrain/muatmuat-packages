export const successResponse = {
  Message: {
    Code: 200,
    Text: "Popup preferences retrieved successfully",
  },
  Data: {
    showPopup: true, // Referensi ke [dbm_mt_user.show_first_time_popup] di ERD
  },
  Type: "GET_POPUP_PREFERENCES",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Invalid request",
  },
  Data: {
    errors: [
      {
        field: "authorization",
        message: "Authorization header required",
      },
    ],
  },
  Type: "GET_POPUP_PREFERENCES",
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

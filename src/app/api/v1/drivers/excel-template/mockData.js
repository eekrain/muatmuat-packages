export const successResponse = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    templateUrl: "url template",
  },
  Type: "GET_EXCEL_TEMPLATE",
};

export const errorResponse = {
  Message: {
    Code: 404,
    Text: "Template file not found",
  },
  Data: null,
  Type: "GET_EXCEL_TEMPLATE",
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

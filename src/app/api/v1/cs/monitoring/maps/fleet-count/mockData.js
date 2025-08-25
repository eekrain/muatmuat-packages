export const successResponse = {
  data: {
    Message: {
      Code: 200,
      Text: "Fleet count retrieved successfully",
    },
    Data: {
      totalFleet: 0,
      hasFleet: true,
    },
    Type: "GET_FLEET_COUNT",
  },
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Bad Request",
  },
  Data: {
    errors: [
      {
        field: "general",
        message: "Invalid parameters",
      },
    ],
  },
  Type: "GET_FLEET_COUNT_ERROR",
};

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

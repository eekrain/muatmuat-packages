export const successResponse = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    vehicleTypes: [
      // Mitsubishi Fuso types
      {
        id: "0681f5a7-daf0-4581-b593-9d017c2cfd8c",
        name: "FE 71 HD",
        vehicleBrandId: "0681f5a7-daf0-4581-b593-9d017c2cfd85",
      },
      {
        id: "0681f5a7-daf0-4581-b593-9d017c2cfd8a",
        name: "FE 71 L",
        vehicleBrandId: "0681f5a7-daf0-4581-b593-9d017c2cfd85",
      },
      {
        id: "0681f5a7-daf0-4581-b593-9d017c2cfd8b",
        name: "FE 71 S",
        vehicleBrandId: "0681f5a7-daf0-4581-b593-9d017c2cfd85",
      },
      {
        id: "fe85f5a7-daf0-4581-b593-9d017c2cfd90",
        name: "FE 74 HD",
        vehicleBrandId: "0681f5a7-daf0-4581-b593-9d017c2cfd85",
      },
      {
        id: "fe85f5a7-daf0-4581-b593-9d017c2cfd91",
        name: "FG 73",
        vehicleBrandId: "0681f5a7-daf0-4581-b593-9d017c2cfd85",
      },

      // Hino types
      {
        id: "hino1234-daf0-4581-b593-9d017c2cfd95",
        name: "Dutro 130 HD",
        vehicleBrandId: "1234f5a7-daf0-4581-b593-9d017c2cfd86",
      },
      {
        id: "hino1234-daf0-4581-b593-9d017c2cfd96",
        name: "Dutro 130 MDL",
        vehicleBrandId: "1234f5a7-daf0-4581-b593-9d017c2cfd86",
      },
      {
        id: "hino1234-daf0-4581-b593-9d017c2cfd97",
        name: "Ranger FM 260 JD",
        vehicleBrandId: "1234f5a7-daf0-4581-b593-9d017c2cfd86",
      },
      {
        id: "hino1234-daf0-4581-b593-9d017c2cfd98",
        name: "Ranger FM 260 JM",
        vehicleBrandId: "1234f5a7-daf0-4581-b593-9d017c2cfd86",
      },

      // Toyota types
      {
        id: "toyota56-daf0-4581-b593-9d017c2cfd99",
        name: "Dyna 110 ST",
        vehicleBrandId: "5678f5a7-daf0-4581-b593-9d017c2cfd87",
      },
      {
        id: "toyota56-daf0-4581-b593-9d017c2cfd9a",
        name: "Dyna 130 HT",
        vehicleBrandId: "5678f5a7-daf0-4581-b593-9d017c2cfd87",
      },
      {
        id: "toyota56-daf0-4581-b593-9d017c2cfd9b",
        name: "Hiace",
        vehicleBrandId: "5678f5a7-daf0-4581-b593-9d017c2cfd87",
      },

      // Isuzu types
      {
        id: "isuzu9ab-daf0-4581-b593-9d017c2cfd9c",
        name: "ELF NMR 71",
        vehicleBrandId: "9abc5a7-daf0-4581-b593-9d017c2cfd88",
      },
      {
        id: "isuzu9ab-daf0-4581-b593-9d017c2cfd9d",
        name: "ELF NMR 85",
        vehicleBrandId: "9abc5a7-daf0-4581-b593-9d017c2cfd88",
      },
      {
        id: "isuzu9ab-daf0-4581-b593-9d017c2cfd9e",
        name: "GIGA FVM 34",
        vehicleBrandId: "9abc5a7-daf0-4581-b593-9d017c2cfd88",
      },
    ],
    pagination: {
      page: 1,
      limit: 10,
      totalItems: 3,
      totalPages: 1,
    },
  },
  Type: "/v1/master/vehicle-types?vehicleBrandId=0681f5a7-daf0-4581-b593-9d017c2cfd85",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Bad Request",
  },
  Data: {
    errors: [
      {
        field: "vehicleBrandId",
        message: "vehicleBrandId is required",
      },
    ],
  },
  Type: "VALIDATION_ERROR",
};

export const notFoundResponse = {
  Message: {
    Code: 404,
    Text: "Not Found",
  },
  Data: {
    errors: [
      {
        field: "vehicleBrandId",
        message: "Vehicle brand not found",
      },
    ],
  },
  Type: "NOT_FOUND_ERROR",
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

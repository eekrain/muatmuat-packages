export const successResponse = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    vehicleBrands: [
      {
        id: "0681f5a7-daf0-4581-b593-9d017c2cfd85",
        name: "Mitsubishi Fuso",
      },
      {
        id: "1234f5a7-daf0-4581-b593-9d017c2cfd86",
        name: "Hino",
      },
      {
        id: "5678f5a7-daf0-4581-b593-9d017c2cfd87",
        name: "Toyota",
      },
      {
        id: "9abc5a7-daf0-4581-b593-9d017c2cfd88",
        name: "Isuzu",
      },
      {
        id: "def05a7-daf0-4581-b593-9d017c2cfd89",
        name: "Mercedes-Benz",
      },
      {
        id: "12345a7-daf0-4581-b593-9d017c2cfd90",
        name: "Scania",
      },
      {
        id: "67895a7-daf0-4581-b593-9d017c2cfd91",
        name: "Volvo",
      },
      {
        id: "abcd5a7-daf0-4581-b593-9d017c2cfd92",
        name: "MAN",
      },
      {
        id: "efgh5a7-daf0-4581-b593-9d017c2cfd93",
        name: "Daihatsu",
      },
      {
        id: "ijkl5a7-daf0-4581-b593-9d017c2cfd94",
        name: "Suzuki",
      },
    ],
    pagination: {
      page: 1,
      limit: 10,
      totalItems: 10,
      totalPages: 1,
    },
  },
  Type: "/v1/master/vehicle-brands",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Bad Request",
  },
  Data: {
    errors: [
      {
        field: "search",
        message: "Invalid search parameter",
      },
    ],
  },
  Type: "VALIDATION_ERROR",
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

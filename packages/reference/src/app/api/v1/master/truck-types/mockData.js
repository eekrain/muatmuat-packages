export const successResponse = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    truckTypes: [
      {
        id: "550e8400-e29b-41d4-a716-446655440202",
        name: "Colt Diesel Double",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/head/cold-diesel-double.png",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440201",
        name: "Colt Diesel Engkel",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/head/colt-diesel-engkel.png",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440204",
        name: "Medium Truck 4 x 2 + Gandengan",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/head/medium-truck-4x2-gandengan.png",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440205",
        name: "Medium Truck 6 x 2 (Rigid)",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/head/medium-truck-6x2.png",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440206",
        name: "Medium Truck 6 x 4",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/head/medium-truck-6x2.png",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440203",
        name: "Medium Truk 4 x 2 (Rigid)",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/head/cold-diesel-double.png",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440207",
        name: "Tractor Head 4 x 2",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/head/tractor-head-4x2.png",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440208",
        name: "Tractor Head 6 x 4",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/head/Tractor-Head-6x4.png",
      },
    ],
  },
  Type: "/v1/master/truck-types?search=keyword&isActive=true",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Parameter tidak valid",
  },
  Data: {
    errors: [
      {
        field: "general",
        message: "Parameter request tidak valid",
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

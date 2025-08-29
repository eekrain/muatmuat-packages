export const successResponse = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    carrierTypes: [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Bak Terbuka",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/carrier/colt_diesel_engkel_bak_terbuka.png",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        name: "Box",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/carrier/medium-truck-4x2gandengan-box.png",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440015",
        name: "Dump",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/carrier/colt_diesel_engkel_dump.png",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440030",
        name: "Los Bak / Flatbed",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/carrier/Medium-Truck-Reefer.png",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440038",
        name: "Reefer",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/carrier/medium-truck-tronton-reefer.png",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440047",
        name: "Tangki",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/carrier/colt_diesel_engkel_tangki.png",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440050",
        name: "Towing",
        icon: "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/carrier/colt_diesel_engkel_towing.png",
      },
    ],
  },
  Type: "/v1/master/carrier-types?truckTypeId=550e8400-e29b-41d4-a716-446655440202",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Parameter tidak valid",
  },
  Data: {
    errors: [
      {
        field: "truckTypeId",
        message: "truckTypeId tidak valid",
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

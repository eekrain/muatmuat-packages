export const successResponse = {
  Message: {
    Code: 200,
    Text: "Fleet drafts retrieved successfully",
  },
  Data: {
    drafts: [
      {
        id: "87654321-4321-4321-4321-210987654321",
        licensePlate: "B1234CD",
        truckTypeName: "Truk Besar",
        truckTypeId: "550e8400-e29b-41d4-a716-446655440001",
        carrierTypeName: "Box",
        carrierTypeId: "550e8400-e29b-41d4-a716-446655440002",
        vehicleBrand: "Toyota",
        vehicleBrandId: "550e8400-e29b-41d4-a716-446655440003",
        vehicleType: "Dyna",
        vehicleTypeId: "550e8400-e29b-41d4-a716-446655440004",
        carrierLength: 6.5,
        carrierWidth: 2.5,
        carrierHeight: 2.8,
        carrierDimensionUnit: "m",
        registrationYear: 2020,
        chassisNumber: "JHD123456789",
        stnkExpiryDate: "2025-12-31",
        kirNumber: "12463746",
        kirExpiryDate: "2025-06-30",
        gpsInstallationEstimateStartDate: "2024-02-01",
        gpsInstallationEstimateEndDate: "2024-02-03",
        photos: [
          {
            id: "550e8400-e29b-41d4-a716-446655440004",
            photoType: "FRONT",
            photoName: "FRONT.jpg",
            photoUrl:
              "https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
          },
        ],
        documents: [
          {
            id: "550e8400-e29b-41d4-a716-446655440008",
            documentType: "STNK",
            documentName: "STNK.pdf",
            documentUrl:
              "https://cdn.muatrans.com/vehicles/documents/550e8400-e29b-41d4-a716-446655440008.pdf",
          },
        ],
      },
      {
        id: "87654321-4321-4321-4321-210987654322",
        licensePlate: "D5678EF",
        truckTypeName: "Truk Sedang",
        truckTypeId: "550e8400-e29b-41d4-a716-446655440005",
        carrierTypeName: "Terbuka",
        carrierTypeId: "550e8400-e29b-41d4-a716-446655440006",
        vehicleBrand: "Mitsubishi",
        vehicleBrandId: "550e8400-e29b-41d4-a716-446655440007",
        vehicleType: "Canter",
        vehicleTypeId: "550e8400-e29b-41d4-a716-446655440008",
        carrierLength: 4.5,
        carrierWidth: 2.0,
        carrierHeight: 2.0,
        carrierDimensionUnit: "m",
        registrationYear: 2019,
        chassisNumber: "JHD987654321",
        stnkExpiryDate: "2025-10-15",
        kirNumber: "98765432",
        kirExpiryDate: "2025-05-20",
        gpsInstallationEstimateStartDate: "2024-02-05",
        gpsInstallationEstimateEndDate: "2024-02-07",
        photos: [
          {
            id: "550e8400-e29b-41d4-a716-446655440009",
            photoType: "FRONT",
            photoName: "FRONT.jpg",
            photoUrl:
              "https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
          },
          {
            id: "550e8400-e29b-41d4-a716-446655440010",
            photoType: "BACK",
            photoName: "BACK.jpg",
            photoUrl:
              "https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
          },
        ],
        documents: [
          {
            id: "550e8400-e29b-41d4-a716-446655440011",
            documentType: "STNK",
            documentName: "STNK.pdf",
            documentUrl:
              "https://cdn.muatrans.com/vehicles/documents/550e8400-e29b-41d4-a716-446655440011.pdf",
          },
          {
            id: "550e8400-e29b-41d4-a716-446655440012",
            documentType: "KIR",
            documentName: "KIR.pdf",
            documentUrl:
              "https://cdn.muatrans.com/vehicles/documents/550e8400-e29b-41d4-a716-446655440012.pdf",
          },
        ],
      },
      {
        id: "87654321-4321-4321-4321-210987654323",
        licensePlate: "F9012GH",
        truckTypeName: "Truk Kecil",
        truckTypeId: "550e8400-e29b-41d4-a716-446655440013",
        carrierTypeName: "Pickup",
        carrierTypeId: "550e8400-e29b-41d4-a716-446655440014",
        vehicleBrand: "Isuzu",
        vehicleBrandId: "550e8400-e29b-41d4-a716-446655440015",
        vehicleType: "Elf",
        vehicleTypeId: "550e8400-e29b-41d4-a716-446655440016",
        carrierLength: 3.5,
        carrierWidth: 1.8,
        carrierHeight: 1.5,
        carrierDimensionUnit: "m",
        registrationYear: 2021,
        chassisNumber: "ISU456789123",
        stnkExpiryDate: "2026-03-20",
        kirNumber: "55512345",
        kirExpiryDate: "2025-08-10",
        gpsInstallationEstimateStartDate: "2024-02-10",
        gpsInstallationEstimateEndDate: "2024-02-12",
        photos: [
          {
            id: "550e8400-e29b-41d4-a716-446655440017",
            photoType: "FRONT",
            photoName: "FRONT.jpg",
            photoUrl:
              "https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
          },
        ],
        documents: [
          {
            id: "550e8400-e29b-41d4-a716-446655440018",
            documentType: "STNK",
            documentName: "STNK.pdf",
            documentUrl:
              "https://cdn.muatrans.com/vehicles/documents/550e8400-e29b-41d4-a716-446655440018.pdf",
          },
        ],
      },
    ],
  },
  Type: "FLEET_DRAFTS",
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
        message: "Gagal mengambil data draft armada",
      },
    ],
  },
  Type: "VALIDATION_ERROR",
};

export const emptyDraftsResponse = {
  Message: {
    Code: 200,
    Text: "Fleet drafts retrieved successfully",
  },
  Data: {
    drafts: [],
  },
  Type: "FLEET_DRAFTS",
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

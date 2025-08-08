export const successResponse = {
  Message: {
    Code: 200,
    Text: "Draft drivers retrieved successfully",
  },
  Data: {
    drivers: [
      {
        id: "draft-123e4567-e89b-12d3-a456-426614174000",
        name: "John Doe", // Referensi ke [dbt_mt_drivers.name] di ERD
        phoneNumber: "081234567890", // Referensi ke [dbt_mt_drivers.phone_number] di ERD
        profileImage: "https://storage.muatrans.com/drivers/photos/profile.jpg", // Referensi ke [dbt_mt_drivers.profile_image] di ERD
        ktpDocument: "https://storage.muatrans.com/drivers/documents/ktp.jpg", // Referensi ke [dbm_mt_driver_documents.document_url] di ERD
        simDocument: "https://storage.muatrans.com/drivers/documents/sim.jpg", // Referensi ke [dbm_mt_driver_documents.document_url] di ERD
        simExpiryDate: "2026-12-31", // Referensi ke [dbt_mt_drivers.sim_expiry_date] di ERD
        createdAt: "2025-07-15T10:30:00Z", // Referensi ke [dbt_mt_drivers.created_at] di ERD
        updatedAt: "2025-07-15T10:30:00Z", // Referensi ke [dbt_mt_drivers.updated_at] di ERD
      },
    ],
    totalDrivers: 5,
  },
  Type: "GET_DRAFT_DRIVERS",
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

// Mock draft drivers data
export const mockDraftDrivers = [
  {
    id: "draft-123e4567-e89b-12d3-a456-426614174000",
    name: "John Doe",
    phoneNumber: "081234567890",
    profileImage:
      "https://storage.muatrans.com/drivers/photos/john-doe-profile.jpg",
    ktpDocument:
      "https://storage.muatrans.com/drivers/documents/john-doe-ktp.jpg",
    simDocument:
      "https://storage.muatrans.com/drivers/documents/john-doe-sim.jpg",
    simExpiryDate: "2026-12-31",
    createdAt: "2025-07-15T10:30:00Z",
    updatedAt: "2025-07-15T10:30:00Z",
  },
  {
    id: "draft-456e7890-e12d-34a5-b678-901234567890",
    name: "Jane Smith",
    phoneNumber: "081298765432",
    profileImage:
      "https://storage.muatrans.com/drivers/photos/jane-smith-profile.jpg",
    ktpDocument:
      "https://storage.muatrans.com/drivers/documents/jane-smith-ktp.jpg",
    simDocument:
      "https://storage.muatrans.com/drivers/documents/jane-smith-sim.jpg",
    simExpiryDate: "2027-03-15",
    createdAt: "2025-07-14T14:22:00Z",
    updatedAt: "2025-07-14T16:45:00Z",
  },
  {
    id: "draft-789a0123-b45c-67d8-e901-234567890123",
    name: "Mike Johnson",
    phoneNumber: "081345678901",
    profileImage:
      "https://storage.muatrans.com/drivers/photos/mike-johnson-profile.jpg",
    ktpDocument:
      "https://storage.muatrans.com/drivers/documents/mike-johnson-ktp.jpg",
    simDocument:
      "https://storage.muatrans.com/drivers/documents/mike-johnson-sim.jpg",
    simExpiryDate: "2025-11-20",
    createdAt: "2025-07-13T09:15:00Z",
    updatedAt: "2025-07-13T11:30:00Z",
  },
  {
    id: "draft-abc1234d-ef56-789g-hij0-123456789abc",
    name: "Sarah Wilson",
    phoneNumber: "081456789012",
    profileImage:
      "https://storage.muatrans.com/drivers/photos/sarah-wilson-profile.jpg",
    ktpDocument:
      "https://storage.muatrans.com/drivers/documents/sarah-wilson-ktp.jpg",
    simDocument:
      "https://storage.muatrans.com/drivers/documents/sarah-wilson-sim.jpg",
    simExpiryDate: "2026-08-10",
    createdAt: "2025-07-12T16:45:00Z",
    updatedAt: "2025-07-12T18:20:00Z",
  },
  {
    id: "draft-def5678e-fg90-123h-ijk4-567890123def",
    name: "Robert Brown",
    phoneNumber: "081567890123",
    profileImage:
      "https://storage.muatrans.com/drivers/photos/robert-brown-profile.jpg",
    ktpDocument:
      "https://storage.muatrans.com/drivers/documents/robert-brown-ktp.jpg",
    simDocument:
      "https://storage.muatrans.com/drivers/documents/robert-brown-sim.jpg",
    simExpiryDate: "2026-01-25",
    createdAt: "2025-07-11T11:20:00Z",
    updatedAt: "2025-07-11T13:15:00Z",
  },
  {
    id: "draft-ghi9012f-jk34-567i-lmn8-901234567ghi",
    name: "Lisa Anderson",
    phoneNumber: "081678901234",
    profileImage:
      "https://storage.muatrans.com/drivers/photos/lisa-anderson-profile.jpg",
    ktpDocument:
      "https://storage.muatrans.com/drivers/documents/lisa-anderson-ktp.jpg",
    simDocument:
      "https://storage.muatrans.com/drivers/documents/lisa-anderson-sim.jpg",
    simExpiryDate: "2027-05-30",
    createdAt: "2025-07-10T08:45:00Z",
    updatedAt: "2025-07-10T10:20:00Z",
  },
  {
    id: "draft-jkl3456g-mn78-901j-opq2-345678901jkl",
    name: "David Martinez",
    phoneNumber: "081789012345",
    profileImage:
      "https://storage.muatrans.com/drivers/photos/david-martinez-profile.jpg",
    ktpDocument:
      "https://storage.muatrans.com/drivers/documents/david-martinez-ktp.jpg",
    simDocument:
      "https://storage.muatrans.com/drivers/documents/david-martinez-sim.jpg",
    simExpiryDate: "2026-09-12",
    createdAt: "2025-07-09T15:30:00Z",
    updatedAt: "2025-07-09T17:45:00Z",
  },
  {
    id: "draft-mno7890h-pq12-345k-rst6-789012345mno",
    name: "Amanda Taylor",
    phoneNumber: "081890123456",
    profileImage:
      "https://storage.muatrans.com/drivers/photos/amanda-taylor-profile.jpg",
    ktpDocument:
      "https://storage.muatrans.com/drivers/documents/amanda-taylor-ktp.jpg",
    simDocument:
      "https://storage.muatrans.com/drivers/documents/amanda-taylor-sim.jpg",
    simExpiryDate: "2025-12-05",
    createdAt: "2025-07-08T12:15:00Z",
    updatedAt: "2025-07-08T14:30:00Z",
  },
];

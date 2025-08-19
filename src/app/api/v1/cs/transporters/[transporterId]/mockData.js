export const successResponse = {
  Message: {
    Code: 200,
    Text: "Detail transporter berhasil diambil",
  },
  Data: {
    id: "uuid-transporter-1",
    companyName: "PT Transport Jaya",
    companyLogo: "https://storage.url/logo.jpg",
    joinedSince: "2023-01-15T08:30:00Z",
    completedOrders: 150,
    isActive: true,
    status: "ACTIVE",
    cityLocation: "Jakarta",
    registrant: {
      fullName: "John Doe",
      position: "Manager",
      whatsappNumber: "+628123456789",
      email: "john@transport.com",
    },
    company: {
      name: "PT Transport Jaya",
      businessEntity: "PT",
      phoneNumber: "+622123456789",
      address: "Jl. Sudirman No. 1, Jakarta",
      district: "Sudirman",
      city: "Jakarta",
      province: "DKI Jakarta",
      postalCode: "12190",
      latitude: "-6.2088",
      longitude: "106.8456",
    },
    bank: {
      bankName: "Bank BCA",
      accountHolderName: "PT Transport Jaya",
    },
    documents: {
      ktp: {
        number: "1234567890123456",
        files: ["https://storage.url/ktp.pdf"],
      },
      nib: {
        number: "1234567890123456",
        files: ["https://storage.url/nib.pdf"],
      },
      npwp: {
        number: "12.345.678.9-123.456",
        files: ["https://storage.url/npwp.pdf"],
      },
    },
    contacts: [
      {
        name: "John Doe",
        position: "Manager",
        phoneNumber: "+628123456789",
        level: 1,
      },
      {
        name: "Jane Smith",
        position: "Supervisor",
        phoneNumber: "+628234567890",
        level: 2,
      },
      {
        name: "Bob Wilson",
        position: "Coordinator",
        phoneNumber: "+628345678901",
        level: 3,
      },
    ],
    emergency: {
      name: "John Doe",
      position: "Registrant",
      phoneNumber: "+628123456789",
    },
  },
  Type: "GET_TRANSPORTER_DETAILS",
};

export const transporterDetailsErrorResponse = {
  Message: {
    Code: 404,
    Text: "Transporter tidak ditemukan",
  },
  Data: null,
  Type: "GET_TRANSPORTER_DETAILS_ERROR",
};

export const transporterDetailsUnauthorizedResponse = {
  Message: {
    Code: 401,
    Text: "Tidak memiliki akses untuk melihat detail transporter",
  },
  Data: null,
  Type: "UNAUTHORIZED_ACCESS",
};

export const transporterDetailsServerErrorResponse = {
  Message: {
    Code: 500,
    Text: "Terjadi kesalahan server",
  },
  Data: null,
  Type: "SERVER_ERROR",
};

// Additional mock data variations for different transporter scenarios
export const inactiveTransporterResponse = {
  ...successResponse,
  Data: {
    ...successResponse.Data,
    id: "uuid-transporter-inactive",
    companyName: "PT Transport Inactive",
    isActive: false,
    status: "NON_ACTIVE",
    completedOrders: 45,
  },
};

export const newTransporterResponse = {
  ...successResponse,
  Data: {
    ...successResponse.Data,
    id: "uuid-transporter-new",
    companyName: "PT Transport Baru",
    joinedSince: "2024-08-01T10:00:00Z",
    completedOrders: 3,
    cityLocation: "Surabaya",
    company: {
      ...successResponse.Data.company,
      name: "PT Transport Baru",
      city: "Surabaya",
      province: "Jawa Timur",
      address: "Jl. Pemuda No. 25, Surabaya",
    },
  },
};

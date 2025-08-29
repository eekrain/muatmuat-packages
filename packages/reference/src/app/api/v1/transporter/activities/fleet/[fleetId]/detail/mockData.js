export const successResponse = (data) => ({
  Message: {
    Code: 200,
    Text: "Success",
  },
  Data: data,
  Type: "SUCCESS",
});

export const errorResponse = (message) => ({
  Message: {
    Code: 500,
    Text: message,
  },
  Data: null,
  Type: "ERROR",
});

export const validationErrorResponse = (field, value, message) => ({
  Message: {
    Code: 400,
    Text: message,
  },
  Data: {
    field,
    value,
    error: message,
  },
  Type: "VALIDATION_ERROR",
});

export const fleetDetailData = {
  "550e8400-e29b-41d4-a716-446655440000": {
    fleetId: "550e8400-e29b-41d4-a716-446655440000",
    licensePlate: "B 1234 ABC",
    activities: [
      {
        id: "activity-001",
        status: "ON_DUTY",
        driverInfo: {
          name: "Daffa Toldo",
          phoneNumber: "081331994444",
        },
        orderInfo: {
          id: "order-001",
          orderCode: "ORD-2024001",
          invoiceNumber: "INV/MTR/210504/001/AAA",
          pickupLocation: "Surabaya",
          dropoffLocation: "Jakarta",
          loadingTime: "2025-08-20T20:35:00+07:00",
          unloadingTime: "2025-08-21T08:15:00+07:00",
          estimateDistance: 123,
          status: "UNLOADING",
        },
      },
      {
        id: "activity-002",
        status: "SCHEDULED",
        driverInfo: {
          name: "Ahmad Rizki",
          phoneNumber: "081234567890",
        },
        orderInfo: {
          id: "order-002",
          orderCode: "ORD-2024002",
          invoiceNumber: "INV/MTR/210504/002/BBB",
          pickupLocation: "Bandung",
          dropoffLocation: "Semarang",
          loadingTime: "2025-08-22T07:00:00+07:00",
          unloadingTime: null,
          estimateDistance: 250,
          status: "SCHEDULED",
        },
      },
      {
        id: "activity-003",
        status: "COMPLETED",
        driverInfo: {
          name: "Budi Santoso",
          phoneNumber: "082345678901",
        },
        orderInfo: {
          id: "order-003",
          orderCode: "ORD-2024003",
          invoiceNumber: "INV/MTR/210504/003/CCC",
          pickupLocation: "Yogyakarta",
          dropoffLocation: "Solo",
          loadingTime: "2025-08-18T09:30:00+07:00",
          unloadingTime: "2025-08-18T14:45:00+07:00",
          estimateDistance: 65,
          status: "COMPLETED",
        },
      },
      {
        id: "activity-004",
        status: "LOADING",
        driverInfo: {
          name: "Eko Prasetyo",
          phoneNumber: "083456789012",
        },
        orderInfo: {
          id: "order-004",
          orderCode: "ORD-2024004",
          invoiceNumber: "INV/MTR/210504/004/DDD",
          pickupLocation: "Malang",
          dropoffLocation: "Banyuwangi",
          loadingTime: "2025-08-20T06:00:00+07:00",
          unloadingTime: null,
          estimateDistance: 180,
          status: "LOADING",
        },
      },
      {
        id: "activity-005",
        status: "ON_DUTY",
        driverInfo: {
          name: "Fajar Mukti",
          phoneNumber: "084567890123",
        },
        orderInfo: {
          id: "order-005",
          orderCode: "ORD-2024005",
          invoiceNumber: "INV/MTR/210504/005/EEE",
          pickupLocation: "Sidoarjo",
          dropoffLocation: "Gresik",
          loadingTime: "2025-08-19T13:20:00+07:00",
          unloadingTime: "2025-08-19T16:45:00+07:00",
          estimateDistance: 45,
          status: "DELIVERING",
        },
      },
    ],
  },
  "550e8400-e29b-41d4-a716-446655440001": {
    fleetId: "550e8400-e29b-41d4-a716-446655440001",
    licensePlate: "B 5678 DEF",
    activities: [
      {
        id: "activity-006",
        status: "SCHEDULED",
        driverInfo: {
          name: "Galih Pratama",
          phoneNumber: "085678901234",
        },
        orderInfo: {
          id: "order-006",
          orderCode: "ORD-2024006",
          invoiceNumber: "INV/MTR/210504/006/FFF",
          pickupLocation: "Kediri",
          dropoffLocation: "Tulungagung",
          loadingTime: "2025-08-23T08:00:00+07:00",
          unloadingTime: null,
          estimateDistance: 85,
          status: "SCHEDULED",
        },
      },
      {
        id: "activity-007",
        status: "COMPLETED",
        driverInfo: {
          name: "Hendra Wijaya",
          phoneNumber: "086789012345",
        },
        orderInfo: {
          id: "order-007",
          orderCode: "ORD-2024007",
          invoiceNumber: "INV/MTR/210504/007/GGG",
          pickupLocation: "Blitar",
          dropoffLocation: "Madiun",
          loadingTime: "2025-08-17T10:15:00+07:00",
          unloadingTime: "2025-08-17T15:30:00+07:00",
          estimateDistance: 120,
          status: "COMPLETED",
        },
      },
    ],
  },
  "550e8400-e29b-41d4-a716-446655440002": {
    fleetId: "550e8400-e29b-41d4-a716-446655440002",
    licensePlate: "L 8310 SH",
    activities: [],
  },
};

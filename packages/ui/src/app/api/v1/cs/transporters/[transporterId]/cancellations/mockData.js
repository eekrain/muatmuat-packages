export const successResponse = {
  Message: {
    Code: 200,
    Text: "Rekap pembatalan berhasil diambil",
  },
  Data: {
    cancellations: [
      {
        id: "uuid-cancellation-1",
        orderId: "uuid-order-1",
        orderCode: "ORDER-2023-001",
        orderType: "INSTANT",
        pickupLocation: "jakarta",
        dropoffLocation: "surabaya",
        truckType: "Colt Diesel Double",
        truckCarrierType: "Bak Terbuka",
        totalFleets: 1,
        cargos: [
          { name: "Besi 1", weight: 100, weightUnit: "Kg" },
          { name: "Besi 2", weight: 100, weightUnit: "Kg" },
          { name: "Besi 3", weight: 100, weightUnit: "Kg" },
        ],
        totalCargos: 1000,
        cancelledAt: "2023-07-15T14:30:00Z",
        cancelledImage: ["http://s3.webp", "http://s3.webp", "http://s3.webp"],
        reason: "Driver tidak tersedia",
        penaltyPoin: 1,
        status: "CANCELLED",
      },
      {
        id: "uuid-cancellation-2",
        orderId: "uuid-order-2",
        orderCode: "ORDER-2023-002",
        orderType: "SCHEDULED",
        pickupLocation: "bandung",
        dropoffLocation: "yogyakarta",
        truckType: "Engkel Box",
        truckCarrierType: "Box Tertutup",
        totalFleets: 2,
        cargos: [
          { name: "Elektronik", weight: 500, weightUnit: "Kg" },
          { name: "Furniture", weight: 300, weightUnit: "Kg" },
        ],
        totalCargos: 800,
        cancelledAt: "2023-07-14T09:15:00Z",
        cancelledImage: ["http://s3.webp", "http://s3.webp"],
        reason: "Kendaraan mengalami kerusakan",
        penaltyPoin: 2,
        status: "CANCELLED",
      },
      {
        id: "uuid-cancellation-3",
        orderId: "uuid-order-3",
        orderCode: "ORDER-2023-003",
        orderType: "INSTANT",
        pickupLocation: "medan",
        dropoffLocation: "pekanbaru",
        truckType: "Tronton",
        truckCarrierType: "Flatbed",
        totalFleets: 1,
        cargos: [
          { name: "Material Konstruksi", weight: 2000, weightUnit: "Kg" },
        ],
        totalCargos: 2000,
        cancelledAt: "2023-07-13T16:45:00Z",
        cancelledImage: ["http://s3.webp"],
        reason: "Cuaca buruk",
        penaltyPoin: 0,
        status: "CANCELLED",
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 3,
      itemsPerPage: 10,
    },
  },
  Type: "GET_TRANSPORTER_CANCELLATIONS",
};

export const errorResponse = {
  Message: {
    Code: 404,
    Text: "Data transporter tidak ditemukan",
  },
  Data: {
    errors: [
      {
        field: "transporterId",
        message: "Transporter dengan ID tersebut tidak ditemukan",
      },
    ],
  },
  Type: "GET_TRANSPORTER_CANCELLATIONS_ERROR",
};

export const unauthorizedResponse = {
  Message: {
    Code: 401,
    Text: "Tidak memiliki akses untuk melihat data pembatalan",
  },
  Data: null,
  Type: "UNAUTHORIZED_ACCESS",
};

export const serverErrorResponse = {
  Message: {
    Code: 500,
    Text: "Terjadi kesalahan server",
  },
  Data: null,
  Type: "SERVER_ERROR",
};

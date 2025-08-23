export const successResponse = {
  Message: {
    Code: 200,
    Text: "Daftar pesanan aktif berhasil diambil",
  },
  Data: {
    transporters: [
      {
        transporterId: "transporter-uuid-1",
        transporterName: "PT Siba Surya",
        phoneNumber: "081234567890",
        shippers: [
          {
            shipperId: "shipper-uuid-1",
            shipperName: "Kirim Barang Bagus",
            phoneNumber: "089876543210",
            orders: [
              {
                orderId: "order-uuid-1",
                orderNumber: "MT25A002A",
                orderType: "INSTANT",
                orderStatus: "CONFIRMED",
                orderStatusUnit: 1,
                sosUnit: 1,
                loadTimeStart: "2025-01-02T18:00:00+07:00",
                loadTimeEnd: "2025-01-02T20:00:00+07:00",
                pickupLocations: [
                  {
                    locationId: "loc-pickup-1",
                    fullAddress: "Jl. Contoh No.1",
                    city: "Kota Surabaya",
                    district: "Gubeng",
                  },
                ],
                dropoffLocations: [
                  {
                    locationId: "loc-dropoff-1",
                    fullAddress: "Jl. Tujuan No.5",
                    city: "Kota Pasuruan",
                    province: "Jawa Timur",
                  },
                ],
                estimatedDistance: 12000,
                fleetInfo: {
                  vehicleType: "Colt Diesel Double",
                  carrierType: "Bak Terbuka",
                  totalUnits: 1,
                  cargoName: ["Besi"],
                  totalWeight: 1000,
                },
                createdAt: "2025-01-01T10:00:00+07:00",
                updatedAt: "2025-01-02T09:00:00+07:00",
              },
              {
                orderId: "order-uuid-2",
                orderNumber: "MT25A012A",
                orderType: "SCHEDULED",
                orderStatus: "WAITING_CONFIRMATION_SHIPPER",
                orderStatusUnit: 1,
                sosUnit: 0,
                loadTimeStart: "2025-01-05T18:00:00+07:00",
                loadTimeEnd: "2025-01-05T20:00:00+07:00",
                pickupLocations: [
                  {
                    locationId: "loc-pickup-2",
                    fullAddress: "Jl. Lain No.2",
                    city: "Kota Surabaya",
                    district: "Tegalsari",
                  },
                ],
                dropoffLocations: [
                  {
                    locationId: "loc-dropoff-2",
                    fullAddress: "Jl. Tujuan 2",
                    city: "Kota Pasuruan",
                    province: "Jawa Timur",
                  },
                ],
                estimatedDistance: 15000,
                fleetInfo: {
                  vehicleType: "Tractor head 6x4",
                  carrierType: "Skeletal Container",
                  totalUnits: 3,
                  cargoName: ["Peralatan Rumah Tangga"],
                  totalWeight: 2500,
                },
                createdAt: "2025-01-03T10:00:00+07:00",
                updatedAt: "2025-01-04T09:00:00+07:00",
              },
            ],
          },
        ],
      },
      {
        transporterId: "transporter-uuid-2",
        transporterName: "PT Shippindo Teknologi Logistik",
        phoneNumber: "082298765432",
        shippers: [],
      },
    ],
    pagination: {
      totalItems: 2,
      totalPages: 1,
      currentPage: 1,
      itemsPerPage: 10,
    },
  },
  Type: "ACTIVE_ORDERS_LIST",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Parameter tidak valid",
  },
  Data: {
    errors: [
      {
        field: "searchTerm",
        message: "Minimal 3 karakter untuk pencarian",
      },
    ],
  },
  Type: "ACTIVE_ORDERS_ERROR",
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

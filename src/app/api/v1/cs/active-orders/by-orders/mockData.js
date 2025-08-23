export const successResponse = {
  Message: {
    Code: 200,
    Text: "Daftar pesanan aktif berhasil diambil",
  },
  Data: {
    orders: [
      // Variants for ORDER_STATUS_CONFIG testing
      {
        orderId: "order-uuid-2",
        orderNumber: "MT-20250822-0002",
        orderType: "SCHEDULED",
        orderStatus: "WAITING_CONFIRMATION_SHIPPER",
        orderStatusUnit: 0,
        sosUnit: 0,
        transporterInfo: {
          transporterId: "transporter-uuid-2",
          transporterName: "PT Kargo Nusantara",
          phoneNumber: "082233445566",
        },
        shipperInfo: {
          shipperId: "shipper-uuid-2",
          shipperName: "PT Pelayaran Sentosa",
          phoneNumber: "081199223344",
        },
        loadTimeStart: "2025-08-23T09:00:00Z",
        loadTimeEnd: "2025-08-23T11:00:00Z",
        route: {
          pickupLocations: [
            {
              locationId: "loc-pickup-2",
              fullAddress: "Jl. Melati 10",
              city: "Surabaya",
              district: "Genteng",
            },
          ],
          dropoffLocations: [
            {
              locationId: "loc-dropoff-2",
              fullAddress: "Jl. Merdeka 20",
              city: "Malang",
              province: "Jawa Timur",
            },
          ],
          estimatedDistance: 54000,
        },
        fleetInfo: {
          vehicleType: "TRUCK",
          carrierType: "THIRD_PARTY",
          totalUnits: 2,
          cargoName: ["Besi"],
          totalWeight: 3000,
        },
        createdAt: "2025-08-22T09:00:00Z",
        updatedAt: "2025-08-22T09:15:00Z",
      },

      {
        orderId: "order-uuid-3",
        orderNumber: "MT-20250822-0003",
        orderType: "INSTANT",
        orderStatus: "CONFIRMED",
        orderStatusUnit: 0,
        sosUnit: 0,
        // Changed to reuse transporter-uuid-2 to simulate multiple orders for same transporter
        transporterInfo: {
          transporterId: "transporter-uuid-2",
          transporterName: "PT Kargo Nusantara",
          phoneNumber: "082233445566",
        },
        shipperInfo: {
          shipperId: "shipper-uuid-3",
          shipperName: "CV Karya",
          phoneNumber: "089900112233",
        },
        loadTimeStart: "2025-08-22T12:00:00Z",
        loadTimeEnd: "2025-08-22T14:00:00Z",
        route: {
          pickupLocations: [
            {
              locationId: "loc-pickup-3",
              fullAddress: "Jl. Sudirman 45",
              city: "Jakarta",
              district: "Kebayoran",
            },
          ],
          dropoffLocations: [
            {
              locationId: "loc-dropoff-3",
              fullAddress: "Jl. Diponegoro 7",
              city: "Semarang",
              province: "Jawa Tengah",
            },
          ],
          estimatedDistance: 120000,
        },
        fleetInfo: {
          vehicleType: "BOX_TRUCK",
          carrierType: "OWN",
          totalUnits: 1,
          cargoName: ["Elektronik"],
          totalWeight: 500,
        },
        createdAt: "2025-08-22T10:00:00Z",
        updatedAt: "2025-08-22T10:30:00Z",
      },

      {
        orderId: "order-uuid-4",
        orderNumber: "MT-20250822-0004",
        orderType: "SCHEDULED",
        orderStatus: "NEED_ASSIGN_FLEET",
        orderStatusUnit: 0,
        sosUnit: 0,
        transporterInfo: {
          transporterId: "transporter-uuid-4",
          transporterName: "PT Armada Prima",
          phoneNumber: "082199887766",
        },
        shipperInfo: {
          shipperId: "shipper-uuid-4",
          shipperName: "PT Agro Niaga",
          phoneNumber: "081288776655",
        },
        loadTimeStart: "2025-08-24T06:00:00Z",
        loadTimeEnd: "2025-08-24T08:00:00Z",
        route: {
          pickupLocations: [
            {
              locationId: "loc-pickup-4",
              fullAddress: "Jl. Kebon Jeruk 12",
              city: "Jakarta",
              district: "Kebon Jeruk",
            },
          ],
          dropoffLocations: [
            {
              locationId: "loc-dropoff-4",
              fullAddress: "Jl. Soekarno 120",
              city: "Yogyakarta",
              province: "DI Yogyakarta",
            },
          ],
          estimatedDistance: 250000,
        },
        fleetInfo: {
          vehicleType: "FLATBED",
          carrierType: "OWN",
          totalUnits: 3,
          cargoName: ["Bahan Bangunan"],
          totalWeight: 12000,
        },
        createdAt: "2025-08-22T11:00:00Z",
        updatedAt: "2025-08-22T11:05:00Z",
      },

      {
        orderId: "order-uuid-5",
        orderNumber: "MT-20250822-0005",
        orderType: "INSTANT",
        orderStatus: "NEED_CONFIRMATION_READY",
        orderStatusUnit: 0,
        sosUnit: 0,
        // Also reuse transporter-uuid-2 here so transporter-uuid-2 has multiple shippers/orders
        transporterInfo: {
          transporterId: "transporter-uuid-2",
          transporterName: "PT Kargo Nusantara",
          phoneNumber: "082233445566",
        },
        shipperInfo: {
          shipperId: "shipper-uuid-5",
          shipperName: "PT Agro Makmur",
          phoneNumber: "082344556677",
        },
        loadTimeStart: "2025-08-22T15:00:00Z",
        loadTimeEnd: "2025-08-22T17:00:00Z",
        route: {
          pickupLocations: [
            {
              locationId: "loc-pickup-5",
              fullAddress: "Jl. Anggrek 2",
              city: "Bandung",
              district: "Cicendo",
            },
          ],
          dropoffLocations: [
            {
              locationId: "loc-dropoff-5",
              fullAddress: "Jl. Cendrawasih 9",
              city: "Bekasi",
              province: "Jawa Barat",
            },
          ],
          estimatedDistance: 80000,
        },
        fleetInfo: {
          vehicleType: "TRUCK",
          carrierType: "THIRD_PARTY",
          totalUnits: 1,
          cargoName: ["Buah"],
          totalWeight: 800,
        },
        createdAt: "2025-08-22T12:30:00Z",
        updatedAt: "2025-08-22T13:00:00Z",
      },

      {
        orderId: "order-uuid-6",
        orderNumber: "MT-20250822-0006",
        orderType: "SCHEDULED",
        orderStatus: "NEED_CHANGE_RESPONSE",
        orderStatusUnit: 0,
        sosUnit: 0,
        transporterInfo: {
          transporterId: "transporter-uuid-6",
          transporterName: "PT Multi Cargo",
          phoneNumber: "081266778899",
        },
        shipperInfo: {
          shipperId: "shipper-uuid-6",
          shipperName: "PT Sumber Alam",
          phoneNumber: "083322110099",
        },
        loadTimeStart: "2025-08-25T07:00:00Z",
        loadTimeEnd: "2025-08-25T09:00:00Z",
        route: {
          pickupLocations: [
            {
              locationId: "loc-pickup-6",
              fullAddress: "Jl. Mawar 14",
              city: "Semarang",
              district: "Candisari",
            },
          ],
          dropoffLocations: [
            {
              locationId: "loc-dropoff-6",
              fullAddress: "Jl. Pahlawan 88",
              city: "Solo",
              province: "Jawa Tengah",
            },
          ],
          estimatedDistance: 150000,
        },
        fleetInfo: {
          vehicleType: "TRAILER",
          carrierType: "OWN",
          totalUnits: 2,
          cargoName: ["Mesin Industri"],
          totalWeight: 8000,
        },
        createdAt: "2025-08-22T13:00:00Z",
        updatedAt: "2025-08-22T13:20:00Z",
      },

      {
        orderId: "order-uuid-7",
        orderNumber: "MT-20250822-0007",
        orderType: "SCHEDULED",
        orderStatus: "SCHEDULED_FLEET",
        orderStatusUnit: 0,
        sosUnit: 0,
        transporterInfo: {
          transporterId: "transporter-uuid-7",
          transporterName: "PT Armada Sentral",
          phoneNumber: "081233344455",
        },
        shipperInfo: {
          shipperId: "shipper-uuid-7",
          shipperName: "PT Maju Jaya",
          phoneNumber: "082211334455",
        },
        loadTimeStart: "2025-08-26T05:00:00Z",
        loadTimeEnd: "2025-08-26T07:00:00Z",
        route: {
          pickupLocations: [
            {
              locationId: "loc-pickup-7",
              fullAddress: "Jl. Puri 3",
              city: "Medan",
              district: "Polonia",
            },
          ],
          dropoffLocations: [
            {
              locationId: "loc-dropoff-7",
              fullAddress: "Jl. Samudra 2",
              city: "Padang",
              province: "Sumatera Barat",
            },
          ],
          estimatedDistance: 450000,
        },
        fleetInfo: {
          vehicleType: "TRUCK",
          carrierType: "OWN",
          totalUnits: 4,
          cargoName: ["Pupuk"],
          totalWeight: 40000,
        },
        createdAt: "2025-08-22T14:00:00Z",
        updatedAt: "2025-08-22T14:30:00Z",
      },

      {
        orderId: "order-uuid-8",
        orderNumber: "MT-20250822-0008",
        orderType: "INSTANT",
        orderStatus: "LOADING",
        orderStatusUnit: 1,
        sosUnit: 0,
        transporterInfo: {
          transporterId: "transporter-uuid-8",
          transporterName: "PT Cepat Kirim",
          phoneNumber: "081288990011",
        },
        shipperInfo: {
          shipperId: "shipper-uuid-8",
          shipperName: "PT Makanan Segar",
          phoneNumber: "081344556677",
        },
        loadTimeStart: "2025-08-22T08:30:00Z",
        loadTimeEnd: "2025-08-22T10:30:00Z",
        route: {
          pickupLocations: [
            {
              locationId: "loc-pickup-8",
              fullAddress: "Jl. Ikan 5",
              city: "Jakarta",
              district: "Kebon Kacang",
            },
          ],
          dropoffLocations: [
            {
              locationId: "loc-dropoff-8",
              fullAddress: "Jl. Buah 11",
              city: "Bogor",
              province: "Jawa Barat",
            },
          ],
          estimatedDistance: 60000,
        },
        fleetInfo: {
          vehicleType: "MINI_TRUCK",
          carrierType: "THIRD_PARTY",
          totalUnits: 1,
          cargoName: ["Sayur"],
          totalWeight: 200,
        },
        createdAt: "2025-08-22T07:00:00Z",
        updatedAt: "2025-08-22T07:45:00Z",
      },

      {
        orderId: "order-uuid-9",
        orderNumber: "MT-20250822-0009",
        orderType: "INSTANT",
        orderStatus: "UNLOADING",
        orderStatusUnit: 1,
        sosUnit: 2,
        transporterInfo: {
          transporterId: "transporter-uuid-9",
          transporterName: "PT Nusantara Logistik",
          phoneNumber: "081377788899",
        },
        shipperInfo: {
          shipperId: "shipper-uuid-9",
          shipperName: "PT Industri Utama",
          phoneNumber: "082233445566",
        },
        loadTimeStart: "2025-08-22T06:00:00Z",
        loadTimeEnd: "2025-08-22T08:00:00Z",
        route: {
          pickupLocations: [
            {
              locationId: "loc-pickup-9",
              fullAddress: "Jl. Industri 1",
              city: "Cikarang",
              district: "Cikarang Selatan",
            },
          ],
          dropoffLocations: [
            {
              locationId: "loc-dropoff-9",
              fullAddress: "Jl. Gudang 10",
              city: "Tangerang",
              province: "Banten",
            },
          ],
          estimatedDistance: 35000,
        },
        fleetInfo: {
          vehicleType: "TRUCK",
          carrierType: "OWN",
          totalUnits: 2,
          cargoName: ["Sparepart"],
          totalWeight: 2500,
        },
        createdAt: "2025-08-22T05:00:00Z",
        updatedAt: "2025-08-22T06:30:00Z",
      },

      {
        orderId: "order-uuid-10",
        orderNumber: "MT-20250822-0010",
        orderType: "SCHEDULED",
        orderStatus: "PREPARE_DOCUMENT",
        orderStatusUnit: 0,
        sosUnit: 0,
        transporterInfo: {
          transporterId: "transporter-uuid-10",
          transporterName: "PT Dokumen Express",
          phoneNumber: "081299900011",
        },
        shipperInfo: {
          shipperId: "shipper-uuid-10",
          shipperName: "PT Legalitas",
          phoneNumber: "081211122233",
        },
        loadTimeStart: "2025-08-27T09:00:00Z",
        loadTimeEnd: "2025-08-27T11:00:00Z",
        route: {
          pickupLocations: [
            {
              locationId: "loc-pickup-10",
              fullAddress: "Jl. Kantor 1",
              city: "Jakarta",
              district: "Kebon Sirih",
            },
          ],
          dropoffLocations: [
            {
              locationId: "loc-dropoff-10",
              fullAddress: "Jl. Arsip 2",
              city: "Bandung",
              province: "Jawa Barat",
            },
          ],
          estimatedDistance: 90000,
        },
        fleetInfo: {
          vehicleType: "VAN",
          carrierType: "THIRD_PARTY",
          totalUnits: 1,
          cargoName: ["Dokumen"],
          totalWeight: 50,
        },
        createdAt: "2025-08-22T15:00:00Z",
        updatedAt: "2025-08-22T15:30:00Z",
      },

      {
        orderId: "order-uuid-11",
        orderNumber: "MT-20250822-0011",
        orderType: "INSTANT",
        orderStatus: "DOCUMENT_DELIVERY",
        orderStatusUnit: 0,
        sosUnit: 0,
        transporterInfo: {
          transporterId: "transporter-uuid-11",
          transporterName: "PT Kurir Cepat",
          phoneNumber: "081255566677",
        },
        shipperInfo: {
          shipperId: "shipper-uuid-11",
          shipperName: "PT Arsip Kita",
          phoneNumber: "082233344455",
        },
        loadTimeStart: "2025-08-22T13:00:00Z",
        loadTimeEnd: "2025-08-22T14:30:00Z",
        route: {
          pickupLocations: [
            {
              locationId: "loc-pickup-11",
              fullAddress: "Jl. Pos 3",
              city: "Jakarta",
              district: "Senen",
            },
          ],
          dropoffLocations: [
            {
              locationId: "loc-dropoff-11",
              fullAddress: "Jl. Kantor Pos 8",
              city: "Surabaya",
              province: "Jawa Timur",
            },
          ],
          estimatedDistance: 200000,
        },
        fleetInfo: {
          vehicleType: "VAN",
          carrierType: "OWN",
          totalUnits: 1,
          cargoName: ["Surat"],
          totalWeight: 20,
        },
        createdAt: "2025-08-22T12:00:00Z",
        updatedAt: "2025-08-22T12:40:00Z",
      },

      {
        orderId: "order-uuid-12",
        orderNumber: "MT-20250822-0012",
        orderType: "SCHEDULED",
        orderStatus: "COMPLETED",
        orderStatusUnit: 0,
        sosUnit: 0,
        transporterInfo: {
          transporterId: "transporter-uuid-12",
          transporterName: "PT Selesai Selalu",
          phoneNumber: "081233322211",
        },
        shipperInfo: {
          shipperId: "shipper-uuid-12",
          shipperName: "PT Hasil Akhir",
          phoneNumber: "081288877766",
        },
        loadTimeStart: "2025-08-20T08:00:00Z",
        loadTimeEnd: "2025-08-20T10:00:00Z",
        route: {
          pickupLocations: [
            {
              locationId: "loc-pickup-12",
              fullAddress: "Jl. Akhir 1",
              city: "Malang",
              district: "Klojen",
            },
          ],
          dropoffLocations: [
            {
              locationId: "loc-dropoff-12",
              fullAddress: "Jl. Finish 5",
              city: "Bali",
              province: "Bali",
            },
          ],
          estimatedDistance: 600000,
        },
        fleetInfo: {
          vehicleType: "TRUCK",
          carrierType: "OWN",
          totalUnits: 2,
          cargoName: ["Produk Jadi"],
          totalWeight: 15000,
        },
        createdAt: "2025-08-20T06:00:00Z",
        updatedAt: "2025-08-20T11:00:00Z",
      },
    ],
    pagination: {
      totalItems: 1,
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

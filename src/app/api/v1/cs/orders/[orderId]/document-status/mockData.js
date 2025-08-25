export const documentStatusData = {
  "550e8400-e29b-41d4-a716-446655440000": {
    documentStatus: {
      overallStatus: "SHIPPING",
      isPrepared: true,
      isShipped: true,
      isReceived: false,
      preparedAt: "2025-08-05T10:00:00Z",
      shippedAt: "2025-08-05T14:30:00Z",
      receivedAt: null,
    },
    shipments: [
      {
        shipmentId: "550e8400-e29b-41d4-a716-446655440001",
        trackingNumber: "TRK123456789",
        courier: "JNE Express",
        status: "In Transit",
        sentAt: "2025-08-05T14:30:00Z",
        notes: "Package in transit to destination",
        receipt: {
          receiptNumber: "RCP-2025080501",
          receiptCourier: "JNE Express",
          receiptImage: "https://example.com/receipt/rcp-2025080501.jpg",
          issuedAt: "2025-08-05T14:45:00Z",
          estimatedDeliveryDate: "2025-08-07",
        },
        photos: [
          {
            photoId: "550e8400-e29b-41d4-a716-446655440002",
            photoUrl: "https://example.com/photos/shipment1.jpg",
            description: "Package ready for shipping",
            uploadedAt: "2025-08-05T14:35:00Z",
          },
          {
            photoId: "550e8400-e29b-41d4-a716-446655440003",
            photoUrl: "https://example.com/photos/shipment2.jpg",
            description: "Package with courier",
            uploadedAt: "2025-08-05T14:40:00Z",
          },
        ],
      },
    ],
    additionalService: {
      serviceId: "550e8400-e29b-41d4-a716-446655440004",
      serviceName: "Pengiriman Dokumen",
      serviceFee: 25000.0,
      deliveryAddress: "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220",
      specialInstructions:
        "Harap konfirmasi terlebih dahulu sebelum pengiriman",
    },
  },
  "550e8400-e29b-41d4-a716-446655440001": {
    documentStatus: {
      overallStatus: "RECEIVED",
      isPrepared: true,
      isShipped: true,
      isReceived: true,
      preparedAt: "2025-08-04T09:00:00Z",
      shippedAt: "2025-08-04T13:00:00Z",
      receivedAt: "2025-08-05T16:30:00Z",
    },
    shipments: [
      {
        shipmentId: "550e8400-e29b-41d4-a716-446655440005",
        trackingNumber: "TRK987654321",
        courier: "Pos Indonesia",
        status: "Delivered",
        sentAt: "2025-08-04T13:00:00Z",
        notes: "Package delivered successfully",
        receipt: {
          receiptNumber: "RCP-2025080401",
          receiptCourier: "Pos Indonesia",
          receiptImage: "https://example.com/receipt/rcp-2025080401.jpg",
          issuedAt: "2025-08-04T13:15:00Z",
          estimatedDeliveryDate: "2025-08-06",
        },
        photos: [
          {
            photoId: "550e8400-e29b-41d4-a716-446655440006",
            photoUrl: "https://example.com/photos/delivered1.jpg",
            description: "Package delivered to recipient",
            uploadedAt: "2025-08-05T16:35:00Z",
          },
        ],
      },
    ],
    additionalService: {
      serviceId: "550e8400-e29b-41d4-a716-446655440007",
      serviceName: "Pengiriman Dokumen",
      serviceFee: 30000.0,
      deliveryAddress: "Jl. Gatot Subroto No. 456, Bandung, Jawa Barat 40123",
      specialInstructions: "Pengiriman kilat, mohon segera dikirim",
    },
  },
  "550e8400-e29b-41d4-a716-446655440002": {
    documentStatus: {
      overallStatus: "PREPARED",
      isPrepared: true,
      isShipped: false,
      isReceived: false,
      preparedAt: "2025-08-05T15:00:00Z",
      shippedAt: null,
      receivedAt: null,
    },
    shipments: [],
    additionalService: {
      serviceId: "550e8400-e29b-41d4-a716-446655440008",
      serviceName: "Pengiriman Dokumen",
      serviceFee: 20000.0,
      deliveryAddress: "Jl. Ahmad Yani No. 789, Surabaya, Jawa Timur 60234",
      specialInstructions: "Dokumen siap untuk pengiriman",
    },
  },
};

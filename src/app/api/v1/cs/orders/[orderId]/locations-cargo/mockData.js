export const locationsCargoDData = [
  {
    orderId: "dcdaf886-56d6-4d84-89d6-a21ec18d0bc1",
    locations: {
      pickupLocations: [
        {
          locationId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
          sequence: 1,
          fullAddress:
            "Graha Aero, Jl. Kedungdoro 88, Kedungdoro, Kec Tegalsari, Kota Surabaya, Jawa Timur 60261",
          detailAddress: "Depan Toko Bunga Gunungsari",
          coordinates: {
            latitude: -7.266098,
            longitude: 112.739235,
          },
          areaInfo: {
            district: "Tegalsari",
            city: "Surabaya",
            province: "Jawa Timur",
            postalCode: "60261",
          },
          picInfo: {
            picName: "Agus Raharjo",
            picPhoneNumber: "081234567890",
          },
          scanStatus: {
            status: "SCANNED",
            scanTimestamp: "2025-08-05T10:30:00Z",
          },
        },
        {
          locationId: "b2c3d4e5-f6g7-8901-2345-678901bcdefg",
          sequence: 2,
          fullAddress:
            "Jalan Cinta, Kec. Semarang Utara, Kota Semarang, Jawa Tengah, 50243",
          detailAddress: "Depan Toko Bunga Gunungsari",
          coordinates: {
            latitude: -6.966667,
            longitude: 110.416664,
          },
          areaInfo: {
            district: "Semarang Utara",
            city: "Semarang",
            province: "Jawa Tengah",
            postalCode: "50243",
          },
          picInfo: {
            picName: "Budi Wiranto",
            picPhoneNumber: "081234567891",
          },
          scanStatus: {
            status: "PENDING",
            scanTimestamp: null,
          },
        },
      ],
      deliveryLocations: [
        {
          locationId: "c3d4e5f6-g7h8-9012-3456-789012cdefgh",
          sequence: 1,
          fullAddress:
            "Jl. Ambengan No.51, Pacar Keling, Kec. Genteng, Surabaya, Jawa Timur 60272",
          detailAddress: "Depan Toko Bunga Gunungsari",
          coordinates: {
            latitude: -7.263611,
            longitude: 112.752778,
          },
          areaInfo: {
            district: "Genteng",
            city: "Surabaya",
            province: "Jawa Timur",
            postalCode: "60272",
          },
          picInfo: {
            picName: "Jajang Surahman",
            picPhoneNumber: "081234567892",
          },
          scanStatus: {
            status: "NOT_SCANNED",
            scanTimestamp: null,
          },
        },
        {
          locationId: "d4e5f6g7-h8i9-0123-4567-890123defghi",
          sequence: 2,
          fullAddress:
            "Jalan Bunga, Kec. Semarang Timur, Kota Semarang, Jawa Tengah, 50242",
          detailAddress: "Depan Toko Bunga Gunungsari",
          coordinates: {
            latitude: -6.983333,
            longitude: 110.433333,
          },
          areaInfo: {
            district: "Semarang Timur",
            city: "Semarang",
            province: "Jawa Tengah",
            postalCode: "50242",
          },
          picInfo: {
            picName: "Cecep Wijaya",
            picPhoneNumber: "081234567893",
          },
          scanStatus: {
            status: "NOT_SCANNED",
            scanTimestamp: null,
          },
        },
      ],
    },
    cargo: [
      {
        cargoId: "550e8400-e29b-41d4-a716-446655440001",
        sequence: 1,
        name: "Electronics",
        isCustomName: false,
        cargoType: {
          cargoTypeId: "ct-001",
          cargoTypeName: "Electronics",
          cargoCategory: "Fragile",
        },
        weight: {
          value: 300.0,
          unit: "kg",
        },
        dimensions: {
          hasDimensions: true,
          length: 2.0,
          width: 1.0,
          height: 1.5,
          unit: "m",
        },
        photos: [
          {
            photoId: "photo-001",
            photoUrl: "https://picsum.photos/800/600?random=301",
            thumbnailUrl: "https://picsum.photos/200/150?random=301",
            description: "Electronics cargo photo 1",
            uploadedAt: "2025-08-05T09:00:00Z",
            fileSize: 1024000,
            resolution: {
              width: 800,
              height: 600,
            },
          },
          {
            photoId: "photo-002",
            photoUrl: "https://picsum.photos/800/600?random=302",
            thumbnailUrl: "https://picsum.photos/200/150?random=302",
            description: "Electronics cargo photo 2",
            uploadedAt: "2025-08-05T09:05:00Z",
            fileSize: 1150000,
            resolution: {
              width: 800,
              height: 600,
            },
          },
        ],
      },
      {
        cargoId: "550e8400-e29b-41d4-a716-446655440002",
        sequence: 2,
        name: "Besi Baja Custom",
        isCustomName: true,
        cargoType: {
          cargoTypeId: "ct-002",
          cargoTypeName: "Metal",
          cargoCategory: "Heavy",
        },
        weight: {
          value: 200.0,
          unit: "kg",
        },
        dimensions: {
          hasDimensions: true,
          length: 1.5,
          width: 0.8,
          height: 1.2,
          unit: "m",
        },
        photos: [
          {
            photoId: "photo-003",
            photoUrl: "https://picsum.photos/800/600?random=303",
            thumbnailUrl: "https://picsum.photos/200/150?random=303",
            description: "Metal cargo photo",
            uploadedAt: "2025-08-05T09:10:00Z",
            fileSize: 950000,
            resolution: {
              width: 800,
              height: 600,
            },
          },
        ],
      },
    ],
    summary: {
      totalWeight: 500.0,
      totalCargo: 2,
      pickupLocationCount: 2,
      deliveryLocationCount: 2,
      hasMultipleLocations: true,
      hasDimensions: true,
      hasPhotos: true,
      photoCount: 3,
    },
    additionalServices: {
      hasAdditionalServices: true,
      services: [
        {
          serviceId: "service-001",
          serviceName: "Bantuan Tambahan",
          serviceDescription: "Additional helper for loading/unloading",
          serviceFee: 50000,
        },
        {
          serviceId: "service-002",
          serviceName: "Kirim Berkas",
          serviceDescription: "Document delivery service",
          serviceFee: 25000,
        },
      ],
      documentDelivery: {
        hasDocumentDelivery: true,
        deliveryAddress: "Jalan Mayjend Soengkono 33A, Denanyar, Jombang",
        estimatedDelivery: "2025-08-07",
      },
    },
  },
  {
    orderId: "example-order-id-2",
    locations: {
      pickupLocations: [
        {
          locationId: "pickup-location-001",
          sequence: 1,
          fullAddress: "Jl. Sudirman No.123, Jakarta Pusat",
          detailAddress: "Gedung ABC Lantai 5",
          coordinates: {
            latitude: -6.208763,
            longitude: 106.845599,
          },
          areaInfo: {
            district: "Tanah Abang",
            city: "Jakarta Pusat",
            province: "DKI Jakarta",
            postalCode: "10270",
          },
          picInfo: {
            picName: "Ahmad Susanto",
            picPhoneNumber: "081234567894",
          },
          scanStatus: {
            status: "NOT_SCANNED",
            scanTimestamp: null,
          },
        },
      ],
      deliveryLocations: [
        {
          locationId: "delivery-location-001",
          sequence: 1,
          fullAddress: "Jl. Gatot Subroto No.456, Jakarta Selatan",
          detailAddress: "Kantor XYZ",
          coordinates: {
            latitude: -6.231124,
            longitude: 106.799415,
          },
          areaInfo: {
            district: "Setiabudi",
            city: "Jakarta Selatan",
            province: "DKI Jakarta",
            postalCode: "12930",
          },
          picInfo: {
            picName: "Siti Nurhaliza",
            picPhoneNumber: "081234567895",
          },
          scanStatus: {
            status: "NOT_SCANNED",
            scanTimestamp: null,
          },
        },
      ],
    },
    cargo: [
      {
        cargoId: "cargo-001",
        sequence: 1,
        name: "Documents",
        isCustomName: false,
        cargoType: {
          cargoTypeId: "ct-003",
          cargoTypeName: "Documents",
          cargoCategory: "Light",
        },
        weight: {
          value: 5.0,
          unit: "kg",
        },
        dimensions: {
          hasDimensions: false,
          length: null,
          width: null,
          height: null,
          unit: null,
        },
        photos: [],
      },
    ],
    summary: {
      totalWeight: 5.0,
      totalCargo: 1,
      pickupLocationCount: 1,
      deliveryLocationCount: 1,
      hasMultipleLocations: false,
      hasDimensions: false,
      hasPhotos: false,
      photoCount: 0,
    },
    additionalServices: {
      hasAdditionalServices: false,
      services: [],
      documentDelivery: {
        hasDocumentDelivery: false,
        deliveryAddress: null,
        estimatedDelivery: null,
      },
    },
  },
];

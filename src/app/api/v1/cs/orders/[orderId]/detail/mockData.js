export const orderDetailData = [
  {
    orderDetail: {
      orderId: "dcdaf886-56d6-4d84-89d6-a21ec18d0bc1",
      orderCode: "MT25AA004",
      orderStatus: "LOADING",
      orderStatusUnit: 1,
      hasSos: false,
      totalAssignedTruck: 1,
      isCancelable: false,
    },
    otherStatus: [
      {
        orderStatus: "UNLOADING",
        statusName: "Proses Bongkar",
        count: 1,
      },
    ],
    orderSummary: {
      truckCount: 1,
      vehicle: {
        truckTypeId: "62a0f025-3143-4f84-99d3-a1c5ac1b8658",
        truckTypeName: "Medium Truk 4 x 2 (Rigid)",
        vehicleImage: "https://picsum.photos/200?random=123",
      },
      loadTimeStart: "2025-08-05T10:00:00Z",
      loadTimeEnd: "2025-08-05T12:00:00Z",
      estimatedDistance: 123,
      estimatedDistanceUnit: "km",
      locations: [
        {
          locationId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
          locationType: "PICKUP",
          sequence: 1,
          fullAddress:
            "Graha Aero, Jl. Kedungdoro 88, Kedungdoro, Kec Tegalsari, Kota Surabaya, Jawa Timur 60261",
          detailAddress: "Depan Toko Bunga Gunungsari",
          picName: "Agus Raharjo",
        },
        {
          locationId: "a1b2c3d4-e5f6-7890-1234-567890abcde2",
          locationType: "DELIVERY",
          sequence: 2,
          fullAddress:
            "Jl. Raya Darmo 123, Wonokromo, Kec Wonokromo, Kota Surabaya, Jawa Timur 60243",
          detailAddress: "Gedung Plaza Tunjungan Lt. 2",
          picName: "Sari Indah",
        },
      ],
      cargo: {
        totalWeight: 500,
        totalWeightUnit: "kg",
        description:
          "tolong kirim muatan dengan hati hati, jangan sampai rusak dan hancur, terimakasih",
        cargos: [
          {
            cargoId: "550e8400-e29b-41d4-a716-446655440004",
            name: "Electronics",
            weight: 500,
            weightUnit: "kg",
            dimensions: {
              length: 2.0,
              width: 1.0,
              height: 1.5,
              unit: "m",
            },
          },
        ],
      },
    },
    shipperInfo: {
      userId: "62a0f025-3143-4f84-99d3-a1c5ac1b8611",
      fullName: "PT. Airmas International (AIRI)",
      phoneNumber: "0812-4321-6666",
      location: "Kec. Tegalsari, Kota Surabaya",
    },
    transporterInfo: {
      transporterId: "62a0f025-3143-4f84-99d3-a1c5ac1b8612",
      companyName: "PT. Siba Surya",
      totalUnits: 1,
      phoneNumber: "0246-5844-60",
      location: "Kec. Tegalsari, Kota Surabaya",
    },
  },
  {
    orderDetail: {
      orderId: "dcdaf886-56d6-4d84-89d6-a21ec18d0bc2",
      orderCode: "MT25AA005",
      orderStatus: "UNLOADING",
      orderStatusUnit: 1,
      hasSos: true,
      totalAssignedTruck: 2,
      isCancelable: true,
    },
    otherStatus: [
      {
        orderStatus: "LOADING",
        statusName: "Proses Muat",
        count: 1,
      },
    ],
    orderSummary: {
      truckCount: 2,
      vehicle: {
        truckTypeId: "62a0f025-3143-4f84-99d3-a1c5ac1b8659",
        truckTypeName: "Large Truk 6 x 4 (Rigid)",
        vehicleImage: "https://picsum.photos/200?random=124",
      },
      loadTimeStart: "2025-08-06T08:00:00Z",
      loadTimeEnd: "2025-08-06T10:00:00Z",
      estimatedDistance: 250,
      estimatedDistanceUnit: "km",
      locations: [
        {
          locationId: "a1b2c3d4-e5f6-7890-1234-567890abcde3",
          locationType: "PICKUP",
          sequence: 1,
          fullAddress:
            "Jl. Ahmad Yani 45, Gubeng, Kec Gubeng, Kota Surabaya, Jawa Timur 60281",
          detailAddress: "Depan Mall Grand City",
          picName: "Budi Santoso",
        },
        {
          locationId: "a1b2c3d4-e5f6-7890-1234-567890abcde4",
          locationType: "DELIVERY",
          sequence: 2,
          fullAddress:
            "Jl. Diponegoro 78, Kenjeran, Kec Kenjeran, Kota Surabaya, Jawa Timur 60129",
          detailAddress: "Komplek Industri Kenjeran Blok A-12",
          picName: "Rina Wati",
        },
      ],
      cargo: {
        totalWeight: 1200,
        totalWeightUnit: "kg",
        description:
          "Barang pecah belah, mohon penanganan khusus dan hati-hati",
        cargos: [
          {
            cargoId: "550e8400-e29b-41d4-a716-446655440005",
            name: "Furniture",
            weight: 800,
            weightUnit: "kg",
            dimensions: {
              length: 3.0,
              width: 1.5,
              height: 2.0,
              unit: "m",
            },
          },
          {
            cargoId: "550e8400-e29b-41d4-a716-446655440006",
            name: "Ceramics",
            weight: 400,
            weightUnit: "kg",
            dimensions: {
              length: 1.5,
              width: 1.0,
              height: 1.0,
              unit: "m",
            },
          },
        ],
      },
    },
    shipperInfo: {
      userId: "62a0f025-3143-4f84-99d3-a1c5ac1b8613",
      fullName: "CV. Maju Bersama",
      phoneNumber: "0813-5555-7777",
      location: "Kec. Gubeng, Kota Surabaya",
    },
    transporterInfo: {
      transporterId: "62a0f025-3143-4f84-99d3-a1c5ac1b8614",
      companyName: "PT. Logistik Nusantara",
      totalUnits: 2,
      phoneNumber: "0321-8888-90",
      location: "Kec. Gubeng, Kota Surabaya",
    },
  },
];

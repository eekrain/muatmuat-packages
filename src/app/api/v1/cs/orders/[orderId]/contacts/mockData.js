export const contactsData = [
  {
    orderId: "550e8400-e29b-41d4-a716-446655440001",
    shipperContact: {
      userId: 12345,
      fullName: "Alexander Krisna Indra Cahyadi",
      phoneNumber: "082123456789",
      companyPhoneNumber: "021123456789",
      email: "alexander.krisna@shippercorp.com",
      profileImage: "https://example.com/profiles/alexander.jpg",
      isContactAvailable: true,
      picList: [
        {
          locationId: "550e8400-e29b-41d4-a716-446655440001",
          locationType: "PICKUP",
          locationAddress:
            "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10110",
          picName: "Alexander",
          picRole: null,
          picPhoneNumber: "082123456869",
          isWhatsAppAvailable: true,
        },
        {
          locationId: "550e8400-e29b-41d4-a716-446655440002",
          locationType: "DELIVERY",
          locationAddress:
            "Jl. Thamrin No. 456, Jakarta Selatan, DKI Jakarta 12190",
          picName: "Sari Melati",
          picRole: null,
          picPhoneNumber: "082123458686",
          isWhatsAppAvailable: true,
        },
        {
          locationId: "550e8400-e29b-41d4-a716-446655440003",
          locationType: "PICKUP",
          locationAddress:
            "Jl. Gatot Subroto No. 789, Jakarta Selatan, DKI Jakarta 12930",
          picName: "Budi Santoso",
          picRole: null,
          picPhoneNumber: "082134567890",
          isWhatsAppAvailable: false,
        },
      ],
    },
    transporterContacts: [
      {
        transporterId: "550e8400-e29b-41d4-a716-446655440004",
        companyName: "PT Transporter Jaya Mandiri",
        mainContact: {
          userId: 67890,
          fullName: "Indra Kurniawan",
          phoneNumber: "082123458686",
          email: "indra.ops@transporterjaya.com",
          isContactAvailable: true,
        },
        picList: [
          {
            locationId: "550e8400-e29b-41d4-a716-446655440005",
            locationType: "PICKUP",
            locationAddress:
              "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10110",
            picName: "Rani Salsabila",
            picRole: "Koordinator Lapangan",
            picPhoneNumber: "082198765432",
            isWhatsAppAvailable: true,
          },
          {
            locationId: "550e8400-e29b-41d4-a716-446655440006",
            locationType: "DELIVERY",
            locationAddress:
              "Jl. Thamrin No. 456, Jakarta Selatan, DKI Jakarta 12190",
            picName: "Ahmad Fauzi",
            picRole: "Security",
            picPhoneNumber: "082187654321",
            isWhatsAppAvailable: true,
          },
        ],
        driverContacts: [
          {
            driverId: "550e8400-e29b-41d4-a716-446655440007",
            name: "Mulyadi Saputra",
            phoneNumber: "082123458686",
            fleetInfo: {
              fleetId: "550e8400-e29b-41d4-a716-446655440008",
              licensePlate: "B 1234 ABC",
            },
            isWhatsAppVerified: true,
          },
          {
            driverId: "550e8400-e29b-41d4-a716-446655440009",
            name: "Slamet Riyadi",
            phoneNumber: "082156789012",
            fleetInfo: {
              fleetId: "550e8400-e29b-41d4-a716-446655440010",
              licensePlate: "B 5678 DEF",
            },
            isWhatsAppVerified: false,
          },
        ],
      },
    ],
  },
  {
    orderId: "550e8400-e29b-41d4-a716-446655440002",
    shipperContact: {
      userId: 54321,
      fullName: "Maria Gonzalez",
      phoneNumber: "082199876543",
      companyPhoneNumber: "021987654321",
      email: "maria.gonzalez@shipper2.com",
      profileImage: "https://example.com/profiles/maria.jpg",
      isContactAvailable: true,
      picList: [
        {
          locationId: "550e8400-e29b-41d4-a716-446655440011",
          locationType: "PICKUP",
          locationAddress:
            "Jl. Thamrin No. 789, Jakarta Pusat, DKI Jakarta 10230",
          picName: "Rudi Hermawan",
          picRole: "Supervisor",
          picPhoneNumber: "082299876544",
          isWhatsAppAvailable: true,
        },
      ],
    },
    transporterContacts: [
      {
        transporterId: "550e8400-e29b-41d4-a716-446655440012",
        companyName: "CV Trans Sukses",
        mainContact: {
          userId: 98765,
          fullName: "Indra Kurnia",
          phoneNumber: "082387654321",
          email: "indra.kurnia@cvtranssukses.com",
          isContactAvailable: false,
        },
        picList: [
          {
            locationId: "550e8400-e29b-41d4-a716-446655440013",
            locationType: "PICKUP",
            locationAddress:
              "Jl. Thamrin No. 789, Jakarta Pusat, DKI Jakarta 10230",
            picName: "Sari Indah",
            picRole: "Admin",
            picPhoneNumber: "082376543210",
            isWhatsAppAvailable: true,
          },
        ],
        driverContacts: [
          {
            driverId: "550e8400-e29b-41d4-a716-446655440014",
            name: "Benny Wijaya",
            phoneNumber: "082476543210",
            fleetInfo: {
              fleetId: "550e8400-e29b-41d4-a716-446655440015",
              licensePlate: "D 9876 XYZ",
            },
            isWhatsAppVerified: true,
          },
        ],
      },
    ],
  },
];

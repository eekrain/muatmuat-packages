import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Set to true to use mock data, false for a real API call.
const isMockEnabled = true;

// Mock API result matching the /v1/cs/fleet/transporter contract
export const mockApiResultCsFleet = {
  Message: {
    Code: 200,
    Text: "Transporter list retrieved successfully",
  },
  Data: {
    transporters: [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        companyName: "PT Transport Sejahtera",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 1,
          ready: 1,
          onDuty: 0,
          inactive: 0,
        },
        contactInfo: {
          picName1: "Ahmad Suryadi",
          picPosition1: "Manager Operations",
          companyPhone: "+622123456789",
          communicationPreference: "WHATSAPP",
        },
        lastActivity: "2025-08-26T10:29:00Z",
        isActive: true,
        fleets: [
          {
            fleetId: "550e8400-e29b-41d4-a716-446655440000",
            licensePlate: "B 1234 XYZ",
            driver: {
              driverId: "550e8400-e29b-41d4-a716-446655440002",
              name: "Ahmad Suryadi",
              phoneNumber: "+6281234567801",
            },
            lastLocation: {
              latitude: -6.2088,
              longitude: 106.8456,
              address: {
                district: "Menteng",
                city: "Jakarta Pusat",
              },
              lastUpdate: "2025-08-26T10:29:00Z",
            },
            truckType: {
              truckTypeId: "truck-type-1",
              name: "Pickup",
            },
            carrierType: {
              carrierId: "carrier-1",
              name: "Bak Terbuka",
            },
            status: "READY_FOR_ORDER",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: false,
            activeOrder: null,
          },
        ],
      },
      {
        id: "d3b07384-d9a4-4b59-9c1a-2a1b3a7f2222",
        companyName: "CV Surabaya Kargo",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 1,
          ready: 0,
          onDuty: 1,
          inactive: 0,
        },
        contactInfo: {
          picName1: "Slamet Riyadi",
          picPosition1: "Manager Operations",
          companyPhone: "+623123456789",
          communicationPreference: "WHATSAPP",
        },
        lastActivity: "2025-08-26T09:12:34Z",
        isActive: true,
        fleets: [
          {
            fleetId: "d3b07384-d9a4-4b59-9c1a-2a1b3a7f1111",
            licensePlate: "L 4321 AB",
            driver: {
              driverId: "d3b07384-d9a4-4b59-9c1a-2a1b3a7f3333",
              name: "Slamet Riyadi",
              phoneNumber: "+6281234567802",
            },
            lastLocation: {
              latitude: -7.2575,
              longitude: 112.7521,
              address: {
                district: "Gubeng",
                city: "Surabaya",
              },
              lastUpdate: "2025-08-26T09:12:34Z",
            },
            truckType: {
              truckTypeId: "truck-type-2",
              name: "Box",
            },
            carrierType: {
              carrierId: "carrier-2",
              name: "Bak Tertutup",
            },
            status: "WAITING_LOADING_TIME",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: false,
            activeOrder: {
              orderId: "order-uuid-1",
              orderCode: "ORD-2025-001",
              orderStatus: "WAITING_LOADING",
              pickupLocation: [
                {
                  sequence: 1,
                  district: "Pelabuhan Tanjung Perak",
                  city: "Surabaya",
                  latitude: -7.2575,
                  longitude: 112.7521,
                },
              ],
              dropoffLocation: [
                {
                  sequence: 1,
                  district: "Kawasan Industri Rungkut",
                  city: "Surabaya",
                  latitude: -7.339,
                  longitude: 112.75,
                },
              ],
            },
          },
        ],
      },
      {
        id: "a12f5e8c-6b2d-4f9c-b123-77a9f0e25555",
        companyName: "PT Bandung Express",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 1,
          ready: 1,
          onDuty: 0,
          inactive: 0,
        },
        contactInfo: {
          picName1: "Dedi Kurniawan",
          picPosition1: "Manager Operations",
          companyPhone: "+622223456789",
          communicationPreference: "WHATSAPP",
        },
        lastActivity: "2025-08-26T08:05:10Z",
        isActive: true,
        fleets: [
          {
            fleetId: "a12f5e8c-6b2d-4f9c-b123-77a9f0e24444",
            licensePlate: "D 7777 XY",
            driver: {
              driverId: "a12f5e8c-6b2d-4f9c-b123-77a9f0e26666",
              name: "Dedi Kurniawan",
              phoneNumber: "+6281234567803",
            },
            lastLocation: {
              latitude: -6.9147,
              longitude: 107.6098,
              address: {
                district: "Kiaracondong",
                city: "Bandung",
              },
              lastUpdate: "2025-08-26T08:05:10Z",
            },
            truckType: {
              truckTypeId: "truck-type-3",
              name: "Tronton",
            },
            carrierType: {
              carrierId: "carrier-3",
              name: "Container",
            },
            status: "READY_FOR_ORDER",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: false,
            activeOrder: null,
          },
        ],
      },
      {
        id: "f47ac10b-58cc-4372-a567-0e02b2c3d555",
        companyName: "Medan Logistics",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 1,
          ready: 0,
          onDuty: 0,
          inactive: 1,
        },
        contactInfo: {
          picName1: "Iwan Prasetyo",
          picPosition1: "Manager Operations",
          companyPhone: "+626123456789",
          communicationPreference: "SMS",
        },
        lastActivity: "2025-08-25T22:45:00Z",
        isActive: true,
        fleets: [
          {
            fleetId: "f47ac10b-58cc-4372-a567-0e02b2c3d444",
            licensePlate: "BK 9087 CD",
            driver: {
              driverId: "f47ac10b-58cc-4372-a567-0e02b2c3d666",
              name: "Iwan Prasetyo",
              phoneNumber: "+6281234567804",
            },
            lastLocation: {
              latitude: 3.5952,
              longitude: 98.6722,
              address: {
                district: "Medan Baru",
                city: "Medan",
              },
              lastUpdate: "2025-08-25T22:45:00Z",
            },
            truckType: {
              truckTypeId: "truck-type-1",
              name: "Pickup",
            },
            carrierType: {
              carrierId: "carrier-1",
              name: "Bak Terbuka",
            },
            status: "NOT_PAIRED",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: true,
            activeOrder: null,
          },
        ],
      },
      {
        id: "9b2d1c3e-4f77-4d2b-b9a9-123456789def",
        companyName: "Makassar Haul",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 1,
          ready: 0,
          onDuty: 1,
          inactive: 0,
        },
        contactInfo: {
          picName1: "Rizal Maulana",
          picPosition1: "Fleet Coordinator",
          companyPhone: "+62411234567",
          communicationPreference: "WHATSAPP",
        },
        lastActivity: "2025-08-26T07:40:22Z",
        isActive: true,
        fleets: [
          {
            fleetId: "9b2d1c3e-4f77-4d2b-b9a9-123456789abc",
            licensePlate: "DD 1122 EF",
            driver: {
              driverId: "9b2d1c3e-4f77-4d2b-b9a9-123456789001",
              name: "Rizal Maulana",
              phoneNumber: "+6281234567805",
            },
            lastLocation: {
              latitude: -5.1477,
              longitude: 119.4327,
              address: {
                district: "Panakkukang",
                city: "Makassar",
              },
              lastUpdate: "2025-08-26T07:40:22Z",
            },
            truckType: {
              truckTypeId: "truck-type-2",
              name: "Box",
            },
            carrierType: {
              carrierId: "carrier-2",
              name: "Bak Tertutup",
            },
            status: "WAITING_LOADING_TIME",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: false,
            activeOrder: {
              orderId: "order-uuid-2",
              orderCode: "ORD-2025-002",
              orderStatus: "WAITING_LOADING",
              pickupLocation: [
                {
                  sequence: 1,
                  district: "Kawasan Industri Makassar",
                  city: "Makassar",
                  latitude: -5.1477,
                  longitude: 119.4327,
                },
              ],
              dropoffLocation: [
                {
                  sequence: 1,
                  district: "Pelabuhan Soekarno-Hatta",
                  city: "Makassar",
                  latitude: -5.116,
                  longitude: 119.414,
                },
              ],
            },
          },
        ],
      },
      {
        id: "2c7b3f6a-1d3f-4b2a-aa11-222233334555",
        companyName: "Bali Cargo Co",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 1,
          ready: 1,
          onDuty: 0,
          inactive: 0,
        },
        contactInfo: {
          picName1: "Made Wijaya",
          picPosition1: "Operations Manager",
          companyPhone: "+62361234567",
          communicationPreference: "SMS",
        },
        lastActivity: "2025-08-26T06:15:00Z",
        isActive: true,
        fleets: [
          {
            fleetId: "2c7b3f6a-1d3f-4b2a-aa11-222233334444",
            licensePlate: "DK 3344 GH",
            driver: {
              driverId: "2c7b3f6a-1d3f-4b2a-aa11-222233334666",
              name: "Made Wijaya",
              phoneNumber: "+6281234567806",
            },
            lastLocation: {
              latitude: -8.65,
              longitude: 115.2167,
              address: {
                district: "Denpasar Selatan",
                city: "Denpasar",
              },
              lastUpdate: "2025-08-26T06:15:00Z",
            },
            truckType: {
              truckTypeId: "truck-type-4",
              name: "Engkel",
            },
            carrierType: {
              carrierId: "carrier-4",
              name: "Bak Terbuka",
            },
            status: "READY_FOR_ORDER",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: false,
            activeOrder: null,
          },
        ],
      },
      {
        id: "8f14e45f-ceea-4baf-9b1a-333344445666",
        companyName: "Semarang Trans",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 1,
          ready: 0,
          onDuty: 1,
          inactive: 0,
        },
        contactInfo: {
          picName1: "Fajar Nugroho",
          picPosition1: "Director",
          companyPhone: "+62242345678",
          communicationPreference: "EMAIL",
        },
        lastActivity: "2025-08-26T05:58:44Z",
        isActive: true,
        fleets: [
          {
            fleetId: "8f14e45f-ceea-4baf-9b1a-333344445555",
            licensePlate: "H 5566 IJ",
            driver: {
              driverId: "8f14e45f-ceea-4baf-9b1a-333344445777",
              name: "Fajar Nugroho",
              phoneNumber: "+6281234567807",
            },
            lastLocation: {
              latitude: -7.0051,
              longitude: 110.4381,
              address: {
                district: "Candisari",
                city: "Semarang",
              },
              lastUpdate: "2025-08-26T05:58:44Z",
            },
            truckType: {
              truckTypeId: "truck-type-3",
              name: "Tronton",
            },
            carrierType: {
              carrierId: "carrier-3",
              name: "Container",
            },
            status: "WAITING_LOADING_TIME",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: false,
            activeOrder: {
              orderId: "order-uuid-3",
              orderCode: "ORD-2025-003",
              orderStatus: "WAITING_LOADING",
              pickupLocation: [
                {
                  sequence: 1,
                  district: "Pelabuhan Tanjung Emas",
                  city: "Semarang",
                  latitude: -6.96,
                  longitude: 110.43,
                },
              ],
              dropoffLocation: [
                {
                  sequence: 1,
                  district: "Kawasan Industri Wijayakusuma",
                  city: "Semarang",
                  latitude: -6.99,
                  longitude: 110.37,
                },
              ],
            },
          },
        ],
      },
      {
        id: "3c59dc04-8bfa-4b0f-8c2a-444455556777",
        companyName: "Palembang Express",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 1,
          ready: 0,
          onDuty: 1,
          inactive: 0,
        },
        contactInfo: {
          picName1: "Ardiansyah",
          picPosition1: "PIC",
          companyPhone: "+62711234567",
          communicationPreference: "WHATSAPP",
        },
        lastActivity: "2025-08-26T04:20:10Z",
        isActive: true,
        fleets: [
          {
            fleetId: "3c59dc04-8bfa-4b0f-8c2a-444455556666",
            licensePlate: "BG 7788 KL",
            driver: {
              driverId: "3c59dc04-8bfa-4b0f-8c2a-444455556888",
              name: "Ardiansyah",
              phoneNumber: "+6281234567808",
            },
            lastLocation: {
              latitude: -2.9909,
              longitude: 104.7566,
              address: {
                district: "Ilir Timur I",
                city: "Palembang",
              },
              lastUpdate: "2025-08-26T04:20:10Z",
            },
            truckType: {
              truckTypeId: "truck-type-2",
              name: "Box",
            },
            carrierType: {
              carrierId: "carrier-2",
              name: "Bak Tertutup",
            },
            status: "WAITING_LOADING_TIME",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: false,
            activeOrder: {
              orderId: "order-uuid-4",
              orderCode: "ORD-2025-004",
              orderStatus: "WAITING_LOADING",
              pickupLocation: [
                {
                  sequence: 1,
                  district: "Kertapati",
                  city: "Palembang",
                  latitude: -3.016,
                  longitude: 104.74,
                },
              ],
              dropoffLocation: [
                {
                  sequence: 1,
                  district: "Sukarami",
                  city: "Palembang",
                  latitude: -2.91,
                  longitude: 104.69,
                },
              ],
            },
          },
        ],
      },
      {
        id: "6f1ed002-0b6a-4ad3-9d3d-555566667888",
        companyName: "Balikpapan Freight",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 1,
          ready: 1,
          onDuty: 0,
          inactive: 0,
        },
        contactInfo: {
          picName1: "Siti Hasnah",
          picPosition1: "Owner",
          companyPhone: "+62542234567",
          communicationPreference: "SMS",
        },
        lastActivity: "2025-08-26T03:02:05Z",
        isActive: true,
        fleets: [
          {
            fleetId: "6f1ed002-0b6a-4ad3-9d3d-555566667777",
            licensePlate: "KT 9900 MN",
            driver: {
              driverId: "6f1ed002-0b6a-4ad3-9d3d-555566667999",
              name: "Siti Hasnah",
              phoneNumber: "+6281234567809",
            },
            lastLocation: {
              latitude: -1.2684,
              longitude: 116.831,
              address: {
                district: "Balikpapan Selatan",
                city: "Balikpapan",
              },
              lastUpdate: "2025-08-26T03:02:05Z",
            },
            truckType: {
              truckTypeId: "truck-type-1",
              name: "Pickup",
            },
            carrierType: {
              carrierId: "carrier-1",
              name: "Bak Terbuka",
            },
            status: "READY_FOR_ORDER",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: false,
            activeOrder: null,
          },
        ],
      },
      {
        id: "45c48cce-2e2d-4f6a-8fbb-666677778999",
        companyName: "Lombok Movers",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 1,
          ready: 0,
          onDuty: 1,
          inactive: 0,
        },
        contactInfo: {
          picName1: "Budi Santoso",
          picPosition1: "Manager",
          companyPhone: "+62370234567",
          communicationPreference: "WHATSAPP",
        },
        lastActivity: "2025-08-25T23:55:00Z",
        isActive: true,
        fleets: [
          {
            fleetId: "45c48cce-2e2d-4f6a-8fbb-666677778888",
            licensePlate: "DA 1122 OP",
            driver: {
              driverId: "45c48cce-2e2d-4f6a-8fbb-666677779000",
              name: "Budi Santoso",
              phoneNumber: "+6281234567810",
            },
            lastLocation: {
              latitude: -8.5837,
              longitude: 116.1126,
              address: {
                district: "Mataram",
                city: "Mataram",
              },
              lastUpdate: "2025-08-25T23:55:00Z",
            },
            truckType: {
              truckTypeId: "truck-type-3",
              name: "Tronton",
            },
            carrierType: {
              carrierId: "carrier-3",
              name: "Container",
            },
            status: "WAITING_LOADING_TIME",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: false,
            activeOrder: {
              orderId: "order-uuid-5",
              orderCode: "ORD-2025-005",
              orderStatus: "WAITING_LOADING",
              pickupLocation: [
                {
                  sequence: 1,
                  district: "Cakranegara",
                  city: "Mataram",
                  latitude: -8.59,
                  longitude: 116.12,
                },
              ],
              dropoffLocation: [
                {
                  sequence: 1,
                  district: "Ampenan",
                  city: "Mataram",
                  latitude: -8.57,
                  longitude: 116.09,
                },
              ],
            },
          },
        ],
      },
      {
        id: "6512bd43-02b0-4db0-9b11-777788889000",
        companyName: "Banjarmasin Cargo",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 1,
          ready: 0,
          onDuty: 1,
          inactive: 0,
        },
        contactInfo: {
          picName1: "Rahmat Hidayat",
          picPosition1: "PIC",
          companyPhone: "+62511234567",
          communicationPreference: "EMAIL",
        },
        lastActivity: "2025-08-26T01:10:00Z",
        isActive: true,
        fleets: [
          {
            fleetId: "6512bd43-02b0-4db0-9b11-777788889999",
            licensePlate: "KB 3344 QR",
            driver: {
              driverId: "6512bd43-02b0-4db0-9b11-777788889111",
              name: "Rahmat Hidayat",
              phoneNumber: "+6281234567811",
            },
            lastLocation: {
              latitude: -3.3167,
              longitude: 114.5901,
              address: {
                district: "Banjarmasin Tengah",
                city: "Banjarmasin",
              },
              lastUpdate: "2025-08-26T01:10:00Z",
            },
            truckType: {
              truckTypeId: "truck-type-2",
              name: "Box",
            },
            carrierType: {
              carrierId: "carrier-2",
              name: "Bak Tertutup",
            },
            status: "WAITING_LOADING_TIME",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: false,
            activeOrder: {
              orderId: "order-uuid-6",
              orderCode: "ORD-2025-006",
              orderStatus: "WAITING_LOADING",
              pickupLocation: [
                {
                  sequence: 1,
                  district: "Pelabuhan Trisakti",
                  city: "Banjarmasin",
                  latitude: -3.3,
                  longitude: 114.57,
                },
              ],
              dropoffLocation: [
                {
                  sequence: 1,
                  district: "Gambut",
                  city: "Banjar",
                  latitude: -3.42,
                  longitude: 114.68,
                },
              ],
            },
          },
        ],
      },
      {
        id: "c20ad4d7-5a2e-4a7b-9c22-888899990111",
        companyName: "Pontianak Transport",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 1,
          ready: 0,
          onDuty: 1,
          inactive: 0,
        },
        contactInfo: {
          picName1: "Hendra Gunawan",
          picPosition1: "Manager",
          companyPhone: "+62561234567",
          communicationPreference: "SMS",
        },
        lastActivity: "2025-08-26T02:33:21Z",
        isActive: true,
        fleets: [
          {
            fleetId: "c20ad4d7-5a2e-4a7b-9c22-888899990000",
            licensePlate: "KB 5566 ST",
            driver: {
              driverId: "c20ad4d7-5a2e-4a7b-9c22-888899990222",
              name: "Hendra Gunawan",
              phoneNumber: "+6281234567812",
            },
            lastLocation: {
              latitude: -0.026,
              longitude: 109.3333,
              address: {
                district: "Pontianak Kota",
                city: "Pontianak",
              },
              lastUpdate: "2025-08-26T02:33:21Z",
            },
            truckType: {
              truckTypeId: "truck-type-4",
              name: "Engkel",
            },
            carrierType: {
              carrierId: "carrier-4",
              name: "Bak Terbuka",
            },
            status: "WAITING_LOADING_TIME",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: false,
            activeOrder: {
              orderId: "order-uuid-7",
              orderCode: "ORD-2025-007",
              orderStatus: "WAITING_LOADING",
              pickupLocation: [
                {
                  sequence: 1,
                  district: "Siantan",
                  city: "Pontianak",
                  latitude: 0.05,
                  longitude: 109.34,
                },
              ],
              dropoffLocation: [
                {
                  sequence: 1,
                  district: "Sungai Raya",
                  city: "Kubu Raya",
                  latitude: -0.09,
                  longitude: 109.4,
                },
              ],
            },
          },
        ],
      },
      {
        id: "c81e728d-9d4c-4f9b-b111-999900001222",
        companyName: "Manado Logistics",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 1,
          ready: 0,
          onDuty: 1,
          inactive: 0,
        },
        contactInfo: {
          picName1: "Tommy Lumenta",
          picPosition1: "Director",
          companyPhone: "+62431234567",
          communicationPreference: "WHATSAPP",
        },
        lastActivity: "2025-08-26T00:05:00Z",
        isActive: true,
        fleets: [
          {
            fleetId: "c81e728d-9d4c-4f9b-b111-999900001111",
            licensePlate: "DB 7788 UV",
            driver: {
              driverId: "c81e728d-9d4c-4f9b-b111-999900001333",
              name: "Tommy Lumenta",
              phoneNumber: "+6281234567813",
            },
            lastLocation: {
              latitude: 1.474,
              longitude: 124.8489,
              address: {
                district: "Wanea",
                city: "Manado",
              },
              lastUpdate: "2025-08-26T00:05:00Z",
            },
            truckType: {
              truckTypeId: "truck-type-1",
              name: "Pickup",
            },
            carrierType: {
              carrierId: "carrier-1",
              name: "Bak Terbuka",
            },
            status: "WAITING_LOADING_TIME",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: false,
            activeOrder: {
              orderId: "order-uuid-8",
              orderCode: "ORD-2025-008",
              orderStatus: "WAITING_LOADING",
              pickupLocation: [
                {
                  sequence: 1,
                  district: "Bitung",
                  city: "Bitung",
                  latitude: 1.44,
                  longitude: 125.18,
                },
              ],
              dropoffLocation: [
                {
                  sequence: 1,
                  district: "Tomohon",
                  city: "Tomohon",
                  latitude: 1.33,
                  longitude: 124.83,
                },
              ],
            },
          },
        ],
      },
      {
        id: "eccbc87e-4b8b-4b3c-b222-000011112333",
        companyName: "Ambon Fast Movers",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 1,
          ready: 1,
          onDuty: 0,
          inactive: 0,
        },
        contactInfo: {
          picName1: "Yusuf Maulana",
          picPosition1: "Owner",
          companyPhone: "+62911234567",
          communicationPreference: "EMAIL",
        },
        lastActivity: "2025-08-25T18:30:00Z",
        isActive: true,
        fleets: [
          {
            fleetId: "eccbc87e-4b8b-4b3c-b222-000011112222",
            licensePlate: "PA 8899 WX",
            driver: {
              driverId: "eccbc87e-4b8b-4b3c-b222-000011112444",
              name: "Yusuf Maulana",
              phoneNumber: "+6281234567814",
            },
            lastLocation: {
              latitude: -3.6959,
              longitude: 128.183,
              address: {
                district: "Sirimau",
                city: "Ambon",
              },
              lastUpdate: "2025-08-25T18:30:00Z",
            },
            truckType: {
              truckTypeId: "truck-type-2",
              name: "Box",
            },
            carrierType: {
              carrierId: "carrier-2",
              name: "Bak Tertutup",
            },
            status: "READY_FOR_ORDER",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: false,
            activeOrder: null,
          },
        ],
      },
      {
        id: "a87ff679-a2f3-4fbf-b333-111122223444",
        companyName: "Jayapura Freight",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 1,
          ready: 0,
          onDuty: 1,
          inactive: 0,
        },
        contactInfo: {
          picName1: "Petrus Wanggai",
          picPosition1: "Manager",
          companyPhone: "+62967234567",
          communicationPreference: "SMS",
        },
        lastActivity: "2025-08-25T20:20:20Z",
        isActive: true,
        fleets: [
          {
            fleetId: "a87ff679-a2f3-4fbf-b333-111122223333",
            licensePlate: "PA 9900 YZ",
            driver: {
              driverId: "a87ff679-a2f3-4fbf-b333-111122223555",
              name: "Petrus Wanggai",
              phoneNumber: "+6281234567815",
            },
            lastLocation: {
              latitude: -2.5338,
              longitude: 140.7181,
              address: {
                district: "Abepura",
                city: "Jayapura",
              },
              lastUpdate: "2025-08-25T20:20:20Z",
            },
            truckType: {
              truckTypeId: "truck-type-3",
              name: "Tronton",
            },
            carrierType: {
              carrierId: "carrier-3",
              name: "Container",
            },
            status: "WAITING_LOADING_TIME",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: false,
            activeOrder: {
              orderId: "order-uuid-9",
              orderCode: "ORD-2025-009",
              orderStatus: "WAITING_LOADING",
              pickupLocation: [
                {
                  sequence: 1,
                  district: "Sentani",
                  city: "Jayapura",
                  latitude: -2.57,
                  longitude: 140.52,
                },
              ],
              dropoffLocation: [
                {
                  sequence: 1,
                  district: "Waena",
                  city: "Jayapura",
                  latitude: -2.59,
                  longitude: 140.66,
                },
              ],
            },
          },
        ],
      },
      {
        id: "e4da3b7f-bbce-4f09-a444-222233334666",
        companyName: "Jakarta Quick Transport",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 1,
          ready: 0,
          onDuty: 1,
          inactive: 0,
        },
        contactInfo: {
          picName1: "Rina Sari",
          picPosition1: "Coordinator",
          companyPhone: "+622134567890",
          communicationPreference: "WHATSAPP",
        },
        lastActivity: "2025-08-26T11:00:00Z",
        isActive: true,
        fleets: [
          {
            fleetId: "e4da3b7f-bbce-4f09-a444-222233334555",
            licensePlate: "B 4455 AA",
            driver: {
              driverId: "e4da3b7f-bbce-4f09-a444-222233334777",
              name: "Rina Sari",
              phoneNumber: "+6281234567816",
            },
            lastLocation: {
              latitude: -6.1214,
              longitude: 106.7741,
              address: {
                district: "Penjaringan",
                city: "Jakarta Utara",
              },
              lastUpdate: "2025-08-26T11:00:00Z",
            },
            truckType: {
              truckTypeId: "truck-type-4",
              name: "Engkel",
            },
            carrierType: {
              carrierId: "carrier-4",
              name: "Bak Terbuka",
            },
            status: "WAITING_LOADING_TIME",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: false,
            activeOrder: {
              orderId: "order-uuid-10",
              orderCode: "ORD-2025-010",
              orderStatus: "WAITING_LOADING",
              pickupLocation: [
                {
                  sequence: 1,
                  district: "Pluit",
                  city: "Jakarta Utara",
                  latitude: -6.11,
                  longitude: 106.78,
                },
              ],
              dropoffLocation: [
                {
                  sequence: 1,
                  district: "Cengkareng",
                  city: "Jakarta Barat",
                  latitude: -6.14,
                  longitude: 106.73,
                },
              ],
            },
          },
        ],
      },
      {
        id: "1679091c-5a4e-4f1f-b555-333344445777",
        companyName: "Emergency Transport Co",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 1,
          ready: 0,
          onDuty: 0,
          inactive: 1,
        },
        contactInfo: {
          picName1: "Adi Pranata",
          picPosition1: "Fleet Manager",
          companyPhone: "+622111112222",
          communicationPreference: "EMAIL",
        },
        lastActivity: "2025-08-26T11:04:12Z",
        isActive: true,
        fleets: [
          {
            fleetId: "1679091c-5a4e-4f1f-b555-333344445666",
            licensePlate: "B 5566 BB",
            driver: {
              driverId: "1679091c-5a4e-4f1f-b555-333344445888",
              name: "Adi Pranata",
              phoneNumber: "+628999000111",
            },
            lastLocation: {
              latitude: -6.2,
              longitude: 106.8166,
              address: {
                district: "Kebayoran Baru",
                city: "Jakarta Selatan",
              },
              lastUpdate: "2025-08-26T11:04:12Z",
            },
            truckType: {
              truckTypeId: "truck-type-4",
              name: "Engkel",
            },
            carrierType: {
              carrierId: "carrier-4",
              name: "Bak Terbuka",
            },
            status: "INACTIVE",
            isActive: false,
            hasSOSAlert: true,
            detailSOS: {
              sosId: "sos-uuid-1",
              sosCategory: "ACCIDENT",
              description: "SOS button pressed by driver",
              reportAt: "2025-08-26T11:04:12Z",
              completedAt: null,
              photos: [],
              sosStatus: "NEW",
            },
            needsResponseChange: true,
            activeOrder: null,
          },
        ],
      },
      {
        id: "8e296a06-7c5b-4a9d-b666-444455556888",
        companyName: "North Jakarta Haul",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 1,
          ready: 0,
          onDuty: 1,
          inactive: 0,
        },
        contactInfo: {
          picName1: "Maya Dewi",
          picPosition1: "Coordinator",
          companyPhone: "+622198765432",
          communicationPreference: "WHATSAPP",
        },
        lastActivity: "2025-08-26T10:50:00Z",
        isActive: true,
        fleets: [
          {
            fleetId: "8e296a06-7c5b-4a9d-b666-444455556777",
            licensePlate: "B 6677 CC",
            driver: {
              driverId: "8e296a06-7c5b-4a9d-b666-444455556999",
              name: "Maya Dewi",
              phoneNumber: "+6281234567817",
            },
            lastLocation: {
              latitude: -6.15,
              longitude: 106.9,
              address: {
                district: "Cilincing",
                city: "Jakarta Utara",
              },
              lastUpdate: "2025-08-26T10:50:00Z",
            },
            truckType: {
              truckTypeId: "truck-type-1",
              name: "Pickup",
            },
            carrierType: {
              carrierId: "carrier-1",
              name: "Bak Terbuka",
            },
            status: "ON_ROUTE",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: false,
            activeOrder: {
              orderId: "order-uuid-11",
              orderCode: "ORD-2025-011",
              orderStatus: "IN_TRANSIT",
              pickupLocation: [
                {
                  sequence: 1,
                  district: "Marunda",
                  city: "Jakarta Utara",
                  latitude: -6.1,
                  longitude: 106.95,
                },
              ],
              dropoffLocation: [
                {
                  sequence: 1,
                  district: "Kelapa Gading",
                  city: "Jakarta Utara",
                  latitude: -6.16,
                  longitude: 106.9,
                },
              ],
            },
          },
        ],
      },
      {
        id: "c9f0f895-8a6b-4a8f-b777-555566667999",
        companyName: "Central Jakarta Logistics",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 1,
          ready: 1,
          onDuty: 0,
          inactive: 0,
        },
        contactInfo: {
          picName1: "Fitria Lestari",
          picPosition1: "Manager",
          companyPhone: "+622187654321",
          communicationPreference: "SMS",
        },
        lastActivity: "2025-08-26T09:30:00Z",
        isActive: true,
        fleets: [
          {
            fleetId: "c9f0f895-8a6b-4a8f-b777-555566667888",
            licensePlate: "B 7788 DD",
            driver: {
              driverId: "c9f0f895-8a6b-4a8f-b777-555566668000",
              name: "Fitria Lestari",
              phoneNumber: "+6281234567818",
            },
            lastLocation: {
              latitude: -6.3,
              longitude: 106.7,
              address: {
                district: "Cilandak",
                city: "Jakarta Selatan",
              },
              lastUpdate: "2025-08-26T09:30:00Z",
            },
            truckType: {
              truckTypeId: "truck-type-2",
              name: "Box",
            },
            carrierType: {
              carrierId: "carrier-2",
              name: "Bak Tertutup",
            },
            status: "READY_FOR_ORDER",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: false,
            activeOrder: null,
          },
        ],
      },
      {
        id: "45b1a7b2-9f6e-4c3a-b888-666677779000",
        companyName: "South Jakarta Freight",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 1,
          ready: 0,
          onDuty: 1,
          inactive: 0,
        },
        contactInfo: {
          picName1: "Hendra Putra",
          picPosition1: "Owner",
          companyPhone: "+622176543210",
          communicationPreference: "EMAIL",
        },
        lastActivity: "2025-08-26T08:45:00Z",
        isActive: true,
        fleets: [
          {
            fleetId: "45b1a7b2-9f6e-4c3a-b888-666677778999",
            licensePlate: "B 8899 EE",
            driver: {
              driverId: "45b1a7b2-9f6e-4c3a-b888-666677779111",
              name: "Hendra Putra",
              phoneNumber: "+6281234567819",
            },
            lastLocation: {
              latitude: -6.25,
              longitude: 106.9,
              address: {
                district: "Duren Sawit",
                city: "Jakarta Timur",
              },
              lastUpdate: "2025-08-26T08:45:00Z",
            },
            truckType: {
              truckTypeId: "truck-type-3",
              name: "Tronton",
            },
            carrierType: {
              carrierId: "carrier-3",
              name: "Container",
            },
            status: "ON_DELIVERY",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: false,
            activeOrder: {
              orderId: "order-uuid-12",
              orderCode: "ORD-2025-012",
              orderStatus: "IN_TRANSIT",
              pickupLocation: [
                {
                  sequence: 1,
                  district: "Cakung",
                  city: "Jakarta Timur",
                  latitude: -6.2,
                  longitude: 106.94,
                },
              ],
              dropoffLocation: [
                {
                  sequence: 1,
                  district: "Pancoran",
                  city: "Jakarta Selatan",
                  latitude: -6.25,
                  longitude: 106.84,
                },
              ],
            },
          },
        ],
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 20,
      itemsPerPage: 50,
    },
    filterOptions: {
      hasFleetReady: 5,
      hasFleetOnDuty: 12,
      hasFleetSOS: 1,
      hasAnyFleet: 20,
    },
  },
  Type: "TRANSPORTER_LIST",
};

export const useGetFleetList = (params = {}) => {
  const cacheKey = ["monitoring-fleet-list", params];
  return useSWR(cacheKey, () => fetcherFleetList(params));
};

export const fetcherFleetList = async (params = {}) => {
  if (isMockEnabled) {
    const filteredData = {
      ...mockApiResultCsFleet.Data,
      transporters: mockApiResultCsFleet.Data.transporters
        .map((transporter) => ({
          ...transporter,
          fleets: transporter.fleets.filter((fleet) => {
            // Filter by truck status
            if (params.truckStatus && params.truckStatus.length > 0) {
              if (!params.truckStatus.includes(fleet.status)) {
                return false;
              }
            }

            // Filter by has_fleet_status
            if (params.has_fleet_status) {
              if (params.has_fleet_status === "SOS" && !fleet.hasSOSAlert) {
                return false;
              }
              if (
                params.has_fleet_status === "READY" &&
                fleet.status !== "READY_FOR_ORDER"
              ) {
                return false;
              }
              if (
                params.has_fleet_status === "ON_DUTY" &&
                !["WAITING_LOADING_TIME", "ON_ROUTE", "ON_DELIVERY"].includes(
                  fleet.status
                )
              ) {
                return false;
              }
            }

            return true;
          }),
        }))
        .filter((transporter) => transporter.fleets.length > 0), // Only return transporters with fleets after filtering
    };
    return filteredData;
  }
  const result = await fetcherMuatrans.get("/v1/cs/fleet/transporter", {
    params,
  });
  return result?.data?.Data || {};
};

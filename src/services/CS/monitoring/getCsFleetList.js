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
          total: 15,
          ready: 8,
          onDuty: 5,
          inactive: 2,
        },
        contactInfo: {
          picName1: "John Doe",
          picPosition1: "Manager Operations",
          companyPhone: "+622123456789",
          communicationPreference: "WHATSAPP",
        },
        lastActivity: "2024-08-04T09:30:00Z",
        isActive: true,
        fleets: [
          {
            fleetId: "fleet-uuid-1",
            licensePlate: "B1234ABC",
            driver: {
              driverId: "driver-uuid-1",
              name: "John Doe",
              phoneNumber: "+628123456789",
            },
            lastLocation: {
              latitude: -6.2088,
              longitude: 106.8456,
              address: {
                district: "Gubeng",
                city: "Surabaya",
              },
              lastUpdate: "2025-07-25T10:30:00Z",
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
          {
            fleetId: "fleet-uuid-2",
            licensePlate: "B5678XYZ",
            driver: {
              driverId: "driver-uuid-2",
              name: "Jane Smith",
              phoneNumber: "+628987654321",
            },
            lastLocation: {
              latitude: -6.9175,
              longitude: 107.6191,
              address: {
                district: "Kiaracondong",
                city: "Bandung",
              },
              lastUpdate: "2025-07-25T11:00:00Z",
            },
            truckType: {
              truckTypeId: "truck-type-2",
              name: "Box",
            },
            carrierType: {
              carrierId: "carrier-2",
              name: "Bak Tertutup",
            },
            statuDs: "ON_DUTY",
            isActive: true,
            hasSOSAlert: true,
            detailSOS: {
              sosId: "sos-uuid-1",
              sosCategory: "ACCIDENT",
              description: "Kecelakaan di tol km 23",
              reportAt: "2025-07-25T11:20:00Z",
              completedAt: "2025-07-25T11:20:00Z",
              photos: ["/img/kanan.png", "/img/kiri.png"],
              sosStatus: "ACKNOWLEDGE",
            },
            needsResponseChange: false,
            activeOrder: {
              orderId: "order-uuid-1",
              orderCode: "ORD-2025-001",
              orderStatus: "LOADING",
              pickupLocation: [
                {
                  sequence: 1,
                  district: "Jl. Sudirman No. 1",
                  city: "Jakarta Pusat",
                  latitude: -6.2088,
                  longitude: 106.8456,
                },
              ],
              dropoffLocation: [
                {
                  sequence: 1,
                  district: "Jl. Thamrin No. 5",
                  city: "Jakarta Pusat",
                  latitude: -6.2088,
                  longitude: 106.8456,
                },
              ],
            },
          },
          {
            fleetId: "fleet-uuid-3",
            licensePlate: "B9876DEF",
            driver: {
              driverId: "driver-uuid-3",
              name: "Ahmad Rahman",
              phoneNumber: "+628111222333",
            },
            lastLocation: {
              latitude: -6.3025,
              longitude: 106.8951,
              address: {
                district: "Cipayung",
                city: "Jakarta Timur",
              },
              lastUpdate: "2025-07-25T09:45:00Z",
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
              orderId: "order-uuid-2",
              orderCode: "ORD-2025-002",
              orderStatus: "WAITING_LOADING",
              pickupLocation: [
                {
                  sequence: 1,
                  district: "Jl. Gatot Subroto No. 10",
                  city: "Jakarta Selatan",
                  latitude: -6.1753,
                  longitude: 106.8266,
                },
              ],
              dropoffLocation: [
                {
                  sequence: 1,
                  district: "Jl. Hayam Wuruk No. 15",
                  city: "Jakarta Barat",
                  latitude: -6.2618,
                  longitude: 106.8106,
                },
              ],
            },
          },
          {
            fleetId: "fleet-uuid-4",
            licensePlate: "B4321GHI",
            driver: {
              driverId: "driver-uuid-4",
              name: "Sarah Williams",
              phoneNumber: "+628222333444",
            },
            lastLocation: {
              latitude: -6.1753,
              longitude: 106.8266,
              address: {
                district: "Gambir",
                city: "Jakarta Pusat",
              },
              lastUpdate: "2025-07-25T10:15:00Z",
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
          {
            fleetId: "fleet-uuid-5",
            licensePlate: "B2468MNO",
            driver: {
              driverId: "driver-uuid-5",
              name: "Linda Davis",
              phoneNumber: "+628444555666",
            },
            lastLocation: {
              latitude: -6.2618,
              longitude: 106.8106,
              address: {
                district: "Grogol",
                city: "Jakarta Barat",
              },
              lastUpdate: "2025-07-25T10:00:00Z",
            },
            truckType: {
              truckTypeId: "truck-type-4",
              name: "Engkel",
            },
            carrierType: {
              carrierId: "carrier-4",
              name: "Bak Terbuka",
            },
            status: "ON_DUTY",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: false,
            activeOrder: {
              orderId: "order-uuid-3",
              orderCode: "ORD-2025-003",
              orderStatus: "IN_TRANSIT",
              pickupLocation: [
                {
                  sequence: 1,
                  district: "Jl. Mangga Dua No. 20",
                  city: "Jakarta Utara",
                  latitude: -6.1241,
                  longitude: 106.7786,
                },
              ],
              dropoffLocation: [
                {
                  sequence: 1,
                  district: "Jl. Tanah Abang No. 25",
                  city: "Jakarta Pusat",
                  latitude: -6.1753,
                  longitude: 106.8266,
                },
              ],
            },
          },
        ],
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        companyName: "CV Moga Jaya Abadi",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 12,
          ready: 6,
          onDuty: 4,
          inactive: 2,
        },
        contactInfo: {
          picName1: "Robert Brown",
          picPosition1: "Operations Director",
          companyPhone: "+622198765432",
          communicationPreference: "SMS",
        },
        lastActivity: "2024-08-04T08:45:00Z",
        isActive: true,
        fleets: [
          {
            fleetId: "fleet-uuid-6",
            licensePlate: "B7890JKL",
            driver: {
              driverId: "driver-uuid-6",
              name: "Robert Brown",
              phoneNumber: "+628333444555",
            },
            lastLocation: {
              latitude: -6.3972,
              longitude: 106.8249,
              address: {
                district: "Sawangan",
                city: "Depok",
              },
              lastUpdate: "2025-07-25T11:30:00Z",
            },
            truckType: {
              truckTypeId: "truck-type-2",
              name: "Box",
            },
            carrierType: {
              carrierId: "carrier-2",
              name: "Bak Tertutup",
            },
            status: "ON_DUTY",
            isActive: true,
            hasSOSAlert: true,
            detailSOS: {
              sosId: "sos-uuid-2",
              sosCategory: "MECHANICAL_ISSUE",
              description: "Mesin overheating",
              reportAt: "2025-07-25T11:20:00Z",
              completedAt: "2025-07-25T11:20:00Z",
              photos: ["/img/kanan.png", "/img/kiri.png"],
              sosStatus: "NEW",
            },
            needsResponseChange: false,
            activeOrder: {
              orderId: "order-uuid-4",
              orderCode: "ORD-2025-004",
              orderStatus: "IN_TRANSIT",
              pickupLocation: [
                {
                  sequence: 1,
                  district: "Jl. Raya Bogor No. 30",
                  city: "Depok",
                  latitude: -6.3972,
                  longitude: 106.8249,
                },
              ],
              dropoffLocation: [
                {
                  sequence: 1,
                  district: "Jl. Raya Jakarta No. 35",
                  city: "Jakarta Selatan",
                  latitude: -6.1753,
                  longitude: 106.8266,
                },
              ],
            },
          },
          {
            fleetId: "fleet-uuid-7",
            licensePlate: "B1357PQR",
            driver: {
              driverId: "driver-uuid-7",
              name: "James Wilson",
              phoneNumber: "+628555666777",
            },
            lastLocation: {
              latitude: -6.1241,
              longitude: 106.7786,
              address: {
                district: "Penjaringan",
                city: "Jakarta Utara",
              },
              lastUpdate: "2025-07-25T09:30:00Z",
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
          {
            fleetId: "fleet-uuid-8",
            licensePlate: "B8642STU",
            driver: {
              driverId: "driver-uuid-8",
              name: "Patricia Martinez",
              phoneNumber: "+628666777888",
            },
            lastLocation: {
              latitude: -6.5944,
              longitude: 106.7892,
              address: {
                district: "Ciledug",
                city: "Tangerang",
              },
              lastUpdate: "2025-07-25T11:45:00Z",
            },
            truckType: {
              truckTypeId: "truck-type-3",
              name: "Tronton",
            },
            carrierType: {
              carrierId: "carrier-3",
              name: "Container",
            },
            status: "INACTIVE",
            isActive: false,
            hasSOSAlert: true,
            detailSOS: {
              sosId: "sos-uuid-3",
              sosCategory: "MEDICAL",
              description: "Sopir pingsan",
              reportAt: "2025-07-25T11:40:00Z",
              completedAt: "2025-07-25T11:40:00Z",
              photos: [],
              sosStatus: "COMPLETED",
            },
            needsResponseChange: false,
            activeOrder: null,
          },
          {
            fleetId: "fleet-uuid-9",
            licensePlate: "B9753VWX",
            driver: {
              driverId: "driver-uuid-9",
              name: "Siti Rahayu",
              phoneNumber: "+628777888999",
            },
            lastLocation: {
              latitude: -6.9175,
              longitude: 107.6191,
              address: {
                district: "Dago",
                city: "Bandung",
              },
              lastUpdate: "2024-04-01T10:25:00Z",
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
          {
            fleetId: "fleet-uuid-10",
            licensePlate: "B1111AAA",
            driver: {
              driverId: "driver-uuid-10",
              name: "Budi Santoso",
              phoneNumber: "+628888999000",
            },
            lastLocation: {
              latitude: -6.2088,
              longitude: 106.8456,
              address: {
                district: "Menteng",
                city: "Jakarta Pusat",
              },
              lastUpdate: "2025-07-25T12:00:00Z",
            },
            truckType: {
              truckTypeId: "truck-type-1",
              name: "Pickup",
            },
            carrierType: {
              carrierId: "carrier-1",
              name: "Bak Terbuka",
            },
            status: "ON_DUTY",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: true,
            activeOrder: {
              orderId: "order-uuid-5",
              orderCode: "ORD-2025-005",
              orderStatus: "LOADING",
              pickupLocation: [
                {
                  sequence: 1,
                  district: "Jl. Menteng Raya No. 40",
                  city: "Jakarta Pusat",
                  latitude: -6.2088,
                  longitude: 106.8456,
                },
              ],
              dropoffLocation: [
                {
                  sequence: 1,
                  district: "Jl. Sudirman No. 45",
                  city: "Jakarta Pusat",
                  latitude: -6.2088,
                  longitude: 106.8456,
                },
              ],
            },
          },
        ],
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        companyName: "PT Logistik Maju Bersama",
        verificationStatus: "VERIFIED",
        fleetCount: {
          total: 8,
          ready: 4,
          onDuty: 3,
          inactive: 1,
        },
        contactInfo: {
          picName1: "Maria Garcia",
          picPosition1: "Fleet Manager",
          companyPhone: "+622112345678",
          communicationPreference: "EMAIL",
        },
        lastActivity: "2024-08-04T07:15:00Z",
        isActive: true,
        fleets: [
          {
            fleetId: "fleet-uuid-11",
            licensePlate: "B2222BBB",
            driver: {
              driverId: "driver-uuid-11",
              name: "Carlos Rodriguez",
              phoneNumber: "+628999000111",
            },
            lastLocation: {
              latitude: -6.1753,
              longitude: 106.8266,
              address: {
                district: "Kemayoran",
                city: "Jakarta Pusat",
              },
              lastUpdate: "2025-07-25T11:15:00Z",
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
          {
            fleetId: "fleet-uuid-12",
            licensePlate: "B3333CCC",
            driver: {
              driverId: "driver-uuid-12",
              name: "Ana Silva",
              phoneNumber: "+628000111222",
            },
            lastLocation: {
              latitude: -6.2618,
              longitude: 106.8106,
              address: {
                district: "Tanjung Priok",
                city: "Jakarta Utara",
              },
              lastUpdate: "2025-07-25T10:45:00Z",
            },
            truckType: {
              truckTypeId: "truck-type-2",
              name: "Box",
            },
            carrierType: {
              carrierId: "carrier-2",
              name: "Bak Tertutup",
            },
            status: "ON_DUTY",
            isActive: true,
            hasSOSAlert: false,
            detailSOS: null,
            needsResponseChange: false,
            activeOrder: {
              orderId: "order-uuid-6",
              orderCode: "ORD-2025-006",
              orderStatus: "IN_TRANSIT",
              pickupLocation: [
                {
                  sequence: 1,
                  district: "Jl. Pelabuhan No. 50",
                  city: "Jakarta Utara",
                  latitude: -6.2618,
                  longitude: 106.8106,
                },
              ],
              dropoffLocation: [
                {
                  sequence: 1,
                  district: "Jl. Industri No. 55",
                  city: "Bekasi",
                  latitude: -6.1753,
                  longitude: 106.8266,
                },
              ],
            },
          },
          {
            fleetId: "fleet-uuid-13",
            licensePlate: "B4444DDD",
            driver: {
              driverId: "driver-uuid-13",
              name: "Lucas Oliveira",
              phoneNumber: "+628111222333",
            },
            lastLocation: {
              latitude: -6.9175,
              longitude: 107.6191,
              address: {
                district: "Cimahi",
                city: "Bandung",
              },
              lastUpdate: "2025-07-25T09:15:00Z",
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
              orderId: "order-uuid-7",
              orderCode: "ORD-2025-007",
              orderStatus: "WAITING_LOADING",
              pickupLocation: [
                {
                  sequence: 1,
                  district: "Jl. Industri Cimahi No. 60",
                  city: "Bandung",
                  latitude: -6.9175,
                  longitude: 107.6191,
                },
              ],
              dropoffLocation: [
                {
                  sequence: 1,
                  district: "Jl. Raya Bandung No. 65",
                  city: "Bandung",
                  latitude: -6.9175,
                  longitude: 107.6191,
                },
              ],
            },
          },
        ],
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 3,
      totalItems: 25,
      itemsPerPage: 50,
    },
    filterOptions: {
      hasFleetReady: 20,
      hasFleetOnDuty: 15,
      hasFleetSOS: 2,
      hasAnyFleet: 25,
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
              if (fleet.status !== params.has_fleet_status) {
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

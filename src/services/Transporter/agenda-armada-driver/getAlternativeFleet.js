import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { DriverStatusEnum } from "@/lib/constants/Transporter/agendaArmada/agenda.enum";

const useMockData = true; // Set to false to use real API

// Mock API result for development/testing
export const mockAlternativeFleetsResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Armada alternatif berhasil dimuat",
    },
    Data: {
      alternatives: [
        {
          fleetID: "f1e2d3c4-b5a6-7890-1234-56789abcdef0",
          licensePlate: "B 5678 DEF",
          truckTypeName: "Box Truck",
          availableDriver: {
            id: "d1e2f3a4-b5c6-7890-1234-56789abcdef1",
            name: "Jane Smith",
            driverStatus: DriverStatusEnum.AVAILABLE,
          },
          isCompatible: true,
          availabilityScore: 95,
          estimatedReadyTime: "2024-04-01T07:30:00Z",
        },
        {
          fleetID: "a2b3c4d5-e6f7-8901-2345-67890abcdef2",
          licensePlate: "B 1234 ABC",
          truckTypeName: "Wingbox",
          availableDriver: {
            id: "b2c3d4e5-f6a7-8901-2345-67890abcdef3",
            name: "John Doe",
            driverStatus: DriverStatusEnum.NON_ACTIVE,
          },
          isCompatible: false,
          availabilityScore: 80,
          estimatedReadyTime: "2024-04-01T09:00:00Z",
        },
        {
          fleetID: "a2b3c4d5-e6f7-8901-2345-67890abcdef3",
          licensePlate: "B 1234 XYZ",
          truckTypeName: "Wingbox",
          availableDriver: {
            id: "b2c3d4e5-f6a7-8901-2345-67890abcdef3",
            name: "John Doe",
            driverStatus: DriverStatusEnum.ON_DUTY,
          },
          isCompatible: false,
          availabilityScore: 80,
          estimatedReadyTime: "2024-04-01T09:00:00Z",
        },
        {
          fleetID: "a2b3c4d5-e6f7-8901-2345-67890abcdef4",
          licensePlate: "B 1234 XYZ",
          truckTypeName: "Wingbox",
          availableDriver: {
            id: "b2c3d4e5-f6a7-8901-2345-67890abcdef3",
            name: "John Doe",
            driverStatus: DriverStatusEnum.WAITING,
          },
          isCompatible: false,
          availabilityScore: 80,
          estimatedReadyTime: "2024-04-01T09:00:00Z",
        },
        {
          fleetID: "a2b3c4d5-e6f7-8901-2345-67890abcdef5",
          licensePlate: "B 1234 XYZ",
          truckTypeName: "Wingbox",
          availableDriver: {
            id: "b2c3d4e5-f6a7-8901-2345-67890abcdef3",
            name: "John Doe",
            driverStatus: DriverStatusEnum.AVAILABLE,
          },
          isCompatible: false,
          availabilityScore: 80,
          estimatedReadyTime: "2024-04-01T09:00:00Z",
        },
      ],
    },
    Type: "GET_ALTERNATIVE_FLEETS",
  },
};

export const fetcherAlternativeFleet = async (conflictId) => {
  if (useMockData) {
    // Return mock data for development
    return mockAlternativeFleetsResult.data.Data;
  } else {
    const result = await fetcherMuatrans.get(
      `/v1/transporter/agenda-schedules/conflicts/${conflictId}/alternatives`
    );
    return result?.data?.Data || null;
  }
};

export const useGetAlternativeFleet = (conflictId) =>
  useSWR(
    conflictId ? `agenda-schedules/conflicts/${conflictId}` : null,
    fetcherAlternativeFleet
  );

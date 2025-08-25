import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Use mock data for development since server data is not available yet
const useMockData = true;

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Berhasil membatalkan armada B 9876 XYZ",
    },
    Data: {
      cancellationId: "200e8400-e29b-41d4-a716-446655440020",
      orderId: "550e8400-e29b-41d4-a716-446655440000",
      cancelledFleet: {
        fleetId: "880e8400-e29b-41d4-a716-446655440003",
        licensePlate: "B 9876 XYZ",
        driverName: "Sari Dewi",
      },
      cancellationReason: "Kendaraan Bermasalah",
      cancellationTimestamp: "2024-07-28T11:30:00Z",
      newFleetStatus: "MENUNGGU_ARMADA_PENGGANTI",
      replacementSearchStatus: "INITIATED",
      estimatedReplacementTime: "30-60 menit",
      systemMessage:
        "Proses pencarian armada pengganti memerlukan waktu untuk beberapa saat. Terimakasih atas kesabaran kamu",
      changeHistoryId: "210e8400-e29b-41d4-a716-446655440021",
    },
    Type: "FLEET_CANCELLATION_SUCCESS",
  },
};

// Fetcher function
export const cancelFleet = async (orderId, requestBody) => {
  let result;
  if (useMockData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.put(
      `/v1/transporter/orders/${orderId}/fleet-cancellation`,
      requestBody
    );
  }
  const data = result.data.Data;
  return data;
};

// Hook for cancelling fleet
export const useCancelFleet = (orderId, requestBody) =>
  useSWR(requestBody ? `cancel-fleet/${orderId}` : null, () =>
    cancelFleet(orderId, requestBody)
  );

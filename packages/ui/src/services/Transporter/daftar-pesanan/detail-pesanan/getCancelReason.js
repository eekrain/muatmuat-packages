import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Use mock data for development since server data is not available yet
const useMockData = true;

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Cancellation reasons retrieved successfully",
    },
    Data: {
      cancellationReasons: [
        {
          reasonId: "150e8400-e29b-41d4-a716-446655440015",
          name: "Kendaraan Bermasalah",
          description: "Armada mengalami kerusakan atau masalah teknis",
          category: "TECHNICAL",
          requiresEvidence: true,
          isActive: true,
        },
        {
          reasonId: "160e8400-e29b-41d4-a716-446655440016",
          name: "Driver Berhalangan",
          description:
            "Driver tidak dapat melanjutkan perjalanan karena kondisi tertentu",
          category: "PERSONNEL",
          requiresEvidence: true,
          isActive: true,
        },
        {
          reasonId: "170e8400-e29b-41d4-a716-446655440017",
          name: "Bencana Alam",
          description:
            "Kondisi cuaca buruk atau bencana alam yang menghalangi perjalanan",
          category: "NATURAL",
          requiresEvidence: true,
          isActive: true,
        },
        {
          reasonId: "180e8400-e29b-41d4-a716-446655440018",
          name: "Lainnya",
          description:
            "Alasan lain yang tidak tercantum dalam kategori di atas",
          category: "OTHER",
          requiresEvidence: true,
          isActive: true,
        },
      ],
      totalReasons: 4,
    },
    Type: "CANCELLATION_REASONS",
  },
};

// Fetcher function
export const getCancellationReasons = async () => {
  let result;
  if (useMockData) {
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(
      `/v1/transporter/orders/cancellation-reasons`
    );
  }
  const data = result.data.Data;
  return data;
};

// SWR Hook
export const useGetCancellationReasons = () =>
  useSWR(`cancellation-reasons`, () => getCancellationReasons());

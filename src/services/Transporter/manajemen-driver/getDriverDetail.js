import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockGetDriverDetail = false;

const mockGetDriverDetailResponse = {
  Message: {
    Code: 200,
    Text: "Success",
  },
  Data: {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "John Doe Driver",
    phoneNumber: "081234567890",
    profileImage:
      "https://storage.muattrans.com/drivers/photos/profile_123456.jpg",
    simExpiryDate: "2025-12-31",
    documents: [
      {
        id: "aa0e8400-e29b-41d4-a716-446655440000",
        documentType: "KTP",
        documentUrl:
          "https://storage.muattrans.com/drivers/documents/ktp_123456.jpg",
        documentName: "ktp_123456.jpg",
      },
      {
        id: "bb0e8400-e29b-41d4-a716-446655440000",
        documentType: "SIM_B2_UMUM",
        documentUrl:
          "https://storage.muattrans.com/drivers/documents/sim_123456.jpg",
        documentName: "sim_123456.jpg",
      },
    ],
    rejectReason: "Alasan penolakan akan muncul di sini jika ada.",
  },
  Type: "GET_DRIVER_DETAIL",
};

export const getDriverDetail = async (id) => {
  if (isMockGetDriverDetail) {
    return mockGetDriverDetailResponse;
  }

  const result = await fetcherMuatrans.get(`v1/drivers/${id}`);
  return result?.data;
};

export const useGetDriverDetail = (id) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `v1/drivers/${id}` : null,
    () => getDriverDetail(id)
  );

  return {
    data: data?.Data,
    error,
    isLoading,
    mutate,
  };
};

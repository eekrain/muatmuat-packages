import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockGetDriverDetail = true; // Enable mock for testing

const mockGetDriverDetailResponse = {
  Message: {
    Code: 200,
    Text: "Success",
  },
  Data: {
    id: "550e8400-e29b-41d4-a716-446655440000", // Referensi ke [dbt_mt_drivers.id]
    name: "John Doe Driver", // Referensi ke [dbt_mt_drivers.name]
    phoneNumber: "081234567890", // Referensi ke [dbt_mt_drivers.phoneNumber]
    profileImage:
      "/img/mock-armada/047379f720d4d796e68d0fd7a289a30bd4d2e0ac.jpg", // Referensi ke [dbt_mt_drivers.profileImage]
    simExpiryDate: "2025-12-31", // Referensi ke [dbt_mt_drivers.simExpiryDate]
    documents: [
      {
        id: "aa0e8400-e29b-41d4-a716-446655440000", // Referensi ke [dbm_mt_driver_documents.id]
        documentType: "KTP", // Referensi ke [dbm_mt_driver_documents.documentType]
        documentUrl:
          "https://storage.muattrans.com/drivers/documents/ktp_123456.jpg", // Referensi ke [dbm_mt_driver_documents.documentUrl]
        documentName: "ktp_123456.jpg", // Referensi ke [dbm_mt_driver_documents.documentName]
      },
      {
        id: "bb0e8400-e29b-41d4-a716-446655440000",
        documentType: "SIM_B2_UMUM",
        documentUrl:
          "https://storage.muattrans.com/drivers/documents/sim_123456.jpg",
        documentName: "sim_123456.jpg",
      },
    ],
    rejectReason: "tolakkk",
    canEdit: true,
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

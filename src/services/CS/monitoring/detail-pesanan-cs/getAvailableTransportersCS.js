import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Successfully retrieved available transporters",
    },
    Data: [
      {
        transporterId: "d1b3e4c5-1f2a-4b3c-8a9d-0e1f2a3b4c5d",
        companyName: "PT. Truk Jaya Abadi",
        companyPhone: "031-111-2222",
        companyPicture: "https://picsum.photos/100?random=123123",
        availableUnits: 2,
      },

      {
        transporterId: "e2c4f5d6-2g3b-5c4d-9b0e-1f2a3b4c5d6e",
        companyName: "PT. Siba Surya",
        companyPhone: "021-123-4567", // Added phone number
        companyPicture: "https://picsum.photos/100?random=1212312",
        availableUnits: 4,
      },
      {
        transporterId: "f3d5g6e7-3h4c-6d5e-0c1f-2g3b4c5d6e7f",
        companyName: "PT. Truk Laju Logistik Kemana Aja Ayok",
        companyPhone: "031-222-3333", // Added phone number
        companyPicture: "https://picsum.photos/100?random=44542523",
        availableUnits: 3,
      },
      {
        transporterId: "g4e6h7f8-4i5d-7e6f-1d2g-3h4c5d6e7f8g",
        companyName: "CV Surabaya Logistik",
        companyPhone: "031-333-4444", // Added phone number
        companyPicture: "https://picsum.photos/100?random=1241442",
        availableUnits: 6,
      },
      {
        transporterId: "h5f7i8g9-5j6e-8f7g-2e3h-4i5d6e7f8g9h",
        companyName: "Logisdong",
        companyPhone: "031-444-5555", // Added phone number
        companyPicture: "https://picsum.photos/100?random=23536",
        availableUnits: 2,
      },
    ],
  },
};

export const getAvailableTransportersCS = async (orderId) => {
  const response = useMockData
    ? mockAPIResult
    : await fetcherMuatrans.get(
        `/v1/cs/orders/${orderId}/available-transporters`
      );

  const result = response.data?.Data || [];

  // --- FIX IS HERE ---
  // This function must map all the properties needed by the UI,
  // including `logo` from `companyPicture`.
  return result.map((item) => ({
    name: item.companyName,
    value: item.transporterId,
    availableUnits: item.availableUnits,
    phone: item.companyPhone,
    logo: item.companyPicture,
  }));
};

export const useGetAvailableTransportersCS = (orderId) => {
  const { data, error, isLoading } = useSWR(
    orderId ? `/api/v1/orders/${orderId}/available-transporters` : null,
    () => getAvailableTransportersCS(orderId)
  );

  return { data, error, isLoading };
};

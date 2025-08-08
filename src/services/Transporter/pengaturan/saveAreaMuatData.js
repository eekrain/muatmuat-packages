import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

const mockSaveAreaMuatResponse = {
  data: {
    Message: {
      Code: 200,
      Text: "Berhasil menyimpan area muat",
    },
    Data: {
      transporterID: "550e8400-e29b-41d4-a716-446655440001",
      savedAt: new Date().toISOString(),
      totalProvinces: 2,
      totalCities: 5,
      summary: [
        {
          id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
          transporterID: "550e8400-e29b-41d4-a716-446655440001",
          areaName: "Jawa Barat",
          city: "Bandung, Bekasi, Bogor",
          province: "Jawa Barat",
          cityCount: 3,
          isActive: true,
          createdAt: "2025-08-07T15:34:40Z",
          updatedAt: "2025-08-07T15:34:40Z",
        },
        {
          id: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
          transporterID: "550e8400-e29b-41d4-a716-446655440001",
          areaName: "Jawa Tengah",
          city: "Semarang, Solo",
          province: "Jawa Tengah",
          cityCount: 2,
          isActive: true,
          createdAt: "2025-08-07T15:34:40Z",
          updatedAt: "2025-08-07T15:34:40Z",
        },
      ],
      redirectTo: "/pengaturan",
    },
    Type: "SAVE_AREA_MUAT",
  },
};

export const useSaveAreaMuat = () => {
  return useSWRMutation("/v1/area-muat", async (url, { arg: payload }) => {
    // Use mock data if the flag is enabled
    if (useMockData) {
      // Simulate a network delay for a more realistic loading experience
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockSaveAreaMuatResponse.data.Data;
    }

    // Perform the actual API call
    try {
      const result = await fetcherMuatrans.post(url, payload);
      return result?.data?.Data || {};
    } catch (error) {
      // Log and re-throw the error to be caught by the SWR hook
      console.error("Error saving Area Muat:", error);
      throw error;
    }
  });
};

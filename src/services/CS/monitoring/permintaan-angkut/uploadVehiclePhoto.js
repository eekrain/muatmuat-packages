import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockUploadVehiclePhotoResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Photo uploaded successfully",
    },
    Data: {
      photoUrl:
        "https://files.muattrans.co.id/photos/vehicle-photo-1756268870393-1517.jpg",
      originalFileName: "vehicle-inspection.jpg",
      fileSize: 2048576,
    },
    Type: "VEHICLE_PHOTO_UPLOAD_SUCCESS",
  },
};

// Fetcher function
export const uploadVehiclePhoto = async (url, { arg }) => {
  const useMockData = false; // Set to true for development/testing

  if (useMockData) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockUploadVehiclePhotoResult;
  }

  // Don't set Content-Type header for FormData - let axios set it automatically with boundary
  const result = await fetcherMuatrans.post(url, arg);
  return result;
};

// SWR Hook for uploading vehicle photos
export const useUploadVehiclePhoto = () =>
  useSWRMutation(`/v1/upload/vehicle-photos`, uploadVehiclePhoto);

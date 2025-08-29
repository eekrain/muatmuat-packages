import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockUploadResolutionPhotosResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Foto berhasil diunggah dan diproses",
    },
    Data: {
      uploadResults: [
        {
          id: "photo_uuid_1",
          originalName: "resolution_proof_1.jpg",
          url: "https://cdn.example.com/resolutions/photo_uuid_1.jpg",
          thumbnailUrl:
            "https://cdn.example.com/resolutions/photo_uuid_1_thumb.jpg",
          metadata: {
            size: 2048576,
            format: "JPEG",
            dimensions: {
              width: 1920,
              height: 1080,
            },
            uploadedAt: "2025-01-15T15:00:00Z",
            processedAt: "2025-01-15T15:00:15Z",
          },
          processingStatus: "completed",
          cropApplied: {
            x: 0,
            y: 0,
            width: 800,
            height: 600,
            scale: 1.0,
          },
          geoTag: {
            latitude: -6.2088,
            longitude: 106.8456,
            address: "Jakarta Selatan, DKI Jakarta",
          },
          description: "Caption for photo 1",
        },
        {
          id: "photo_uuid_2",
          originalName: "resolution_proof_2.jpg",
          url: "https://cdn.example.com/resolutions/photo_uuid_2.jpg",
          thumbnailUrl:
            "https://cdn.example.com/resolutions/photo_uuid_2_thumb.jpg",
          metadata: {
            size: 1876543,
            format: "JPEG",
            dimensions: {
              width: 1920,
              height: 1080,
            },
            uploadedAt: "2025-01-15T15:00:00Z",
            processedAt: "2025-01-15T15:00:15Z",
          },
          processingStatus: "completed",
          cropApplied: {
            x: 0,
            y: 0,
            width: 800,
            height: 600,
            scale: 1.0,
          },
          geoTag: {
            latitude: -6.2088,
            longitude: 106.8456,
            address: "Jakarta Selatan, DKI Jakarta",
          },
          description: "Caption for photo 2",
        },
      ],
      uploadSummary: {
        totalFiles: 2,
        successfulUploads: 2,
        failedUploads: 0,
        totalSize: 4567890,
        processingTime: "3.2s",
      },
      attachmentIds: ["photo_uuid_1", "photo_uuid_2"],
    },
    Type: "PHOTO_UPLOAD_SUCCESS",
  },
};

// Fetcher function
export const uploadResolutionPhotos = async (url, { arg }) => {
  const useMockData = false; // Set to true for development/testing

  if (useMockData) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockUploadResolutionPhotosResult;
  }

  // Don't set Content-Type header for FormData - let axios set it automatically with boundary
  const result = await fetcherMuatrans.post(url, arg);
  return result;
};

// SWR Hook for uploading resolution photos
export const useUploadResolutionPhotos = (requestId) =>
  useSWRMutation(
    `/v1/cs/transport-request/${requestId}/photos`,
    uploadResolutionPhotos
  );

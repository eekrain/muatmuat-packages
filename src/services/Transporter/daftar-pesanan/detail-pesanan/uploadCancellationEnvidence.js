import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Use mock data for development since server data is not available yet
const useMockData = true;

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Evidence photo uploaded successfully",
    },
    Data: {
      fileId: "190e8400-e29b-41d4-a716-446655440019",
      fileName: "evidence_20240728_111500.jpg",
      fileUrl:
        "https://storage.muattrans.com/evidence/190e8400-e29b-41d4-a716-446655440019.jpg",
      fileSize: 2048576,
      fileType: "image/jpeg",
      uploadTimestamp: "2024-07-28T11:15:00Z",
      isValid: true,
      validationResults: {
        formatValid: true,
        sizeValid: true,
        virusScanPassed: true,
      },
    },
    Type: "FILE_UPLOAD_SUCCESS",
  },
};

// Fetcher function
export const uploadCancellationEvidence = async (evidencePhoto) => {
  let result;
  if (useMockData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    result = mockAPIResult;
  } else {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("evidencePhoto", evidencePhoto);

    result = await fetcherMuatrans.post(
      `/v1/file-upload/cancellation-evidence`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }
  const data = result.data.Data;
  return data;
};

// Hook for uploading cancellation evidence
export const useUploadCancellationEvidence = (evidencePhoto) =>
  useSWR(
    evidencePhoto ? `upload-cancellation-evidence/${evidencePhoto.name}` : null,
    () => uploadCancellationEvidence(evidencePhoto)
  );

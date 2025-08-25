import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  Message: {
    Code: 200,
    Text: "Profile photo uploaded successfully",
  },
  Data: {
    profileImage: "https://cdn.muattrans.com/profiles/uuid_filename.jpg",
    uploadedAt: "2025-08-05T10:30:00Z",
    fileSize: 2048576,
    dimensions: {
      width: 200,
      height: 200,
    },
    optimized: true,
  },
  Type: "UPLOAD_PROFILE_PHOTO",
};

// Mock error responses
export const mockErrorFileSizeResponse = {
  Message: {
    Code: 400,
    Text: "File size exceeds maximum limit",
  },
  Data: {
    errors: [
      {
        field: "file",
        message: "Ukuran file maksimal 10MB",
      },
    ],
    maxSize: 10485760, // 10MB in bytes
    receivedSize: 15728640, // Received size in bytes
  },
  Type: "UPLOAD_PROFILE_PHOTO_ERROR",
};

export const mockErrorInvalidFormatResponse = {
  Message: {
    Code: 400,
    Text: "Invalid file format",
  },
  Data: {
    errors: [
      {
        field: "file",
        message: "Format file tidak sesuai ketentuan",
      },
    ],
    allowedFormats: ["image/jpeg", "image/png"],
    receivedFormat: "image/gif",
  },
  Type: "UPLOAD_PROFILE_PHOTO_ERROR",
};

// Service function to upload profile photo
export const uploadProfilePhoto = async (data) => {
  const formData = new FormData();

  // Append file (binary data)
  formData.append("file", data.file);

  // Append cropData as JSON string with proper structure
  const cropData = {
    x: data.cropData?.x || 0,
    y: data.cropData?.y || 0,
    width: data.cropData?.width || 200,
    height: data.cropData?.height || 200,
    quality: data.cropData?.quality || 0.8,
    rotation: data.cropData?.rotation || 0,
  };

  formData.append("cropData", JSON.stringify(cropData));

  return fetcherMuatrans.post("/v1/transporter/profile/photo", formData);
  // Note: Jangan set Content-Type manual untuk FormData
  // Browser/axios akan otomatis set dengan boundary yang benar
};

// SWR mutation hook for uploading profile photo
export const useUploadProfilePhoto = () =>
  useSWRMutation("/v1/transporter/profile/photo", (url, { arg }) =>
    uploadProfilePhoto(arg)
  );

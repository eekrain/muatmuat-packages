import { fetcherMuatrans } from "@/lib/axios";

import { useSWRMutateHook } from "./use-swr";

/**
 * Custom hook untuk upload dokumen armada
 * @returns {object} - Function untuk upload dokumen
 */
export const useDocumentUpload = () => {
  const { trigger: triggerUpload, isMutating } = useSWRMutateHook(
    "v1/upload/vehicle-documents",
    "POST",
    fetcherMuatrans,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  const uploadDocument = async (file) => {
    try {
      const formData = new FormData();
      formData.append("document", file);

      const response = await triggerUpload(formData);

      if (response?.Message?.Code === 200) {
        return {
          success: true,
          data: {
            url: response.Data.documentUrl,
            name: response.Data.originalFileName,
            size: response.Data.fileSize,
          },
        };
      } else {
        return {
          success: false,
          error: response?.Message?.Text || "Upload failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || "Upload failed",
      };
    }
  };

  return {
    uploadDocument,
    isUploading: isMutating,
  };
};

import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockCompleteTransportRequestResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Permintaan berhasil diselesaikan",
    },
    Data: {
      completionId: "completion-uuid-123",
      requestId: "request-uuid-456",
      status: "COMPLETED",
      completedAt: "2025-01-15T15:30:00Z",
      completionSummary: {
        totalDuration: "5 jam 15 menit",
        resolutionMethod: "Manual completion with CS intervention",
        documentsAttached: 2,
        qualityScore: 5,
      },
      updatedRequestStatus: {
        previousStatus: "CONFIRMED",
        newStatus: "COMPLETED",
        statusHistory: [
          {
            status: "PREPARE_FLEET",
            timestamp: "2025-01-15T10:30:00Z",
          },
          {
            status: "CONFIRMED",
            timestamp: "2025-01-15T11:45:00Z",
          },
          {
            status: "COMPLETED",
            timestamp: "2025-01-15T15:30:00Z",
          },
        ],
      },
      nextSteps: [
        "Dokumentasi disimpan dalam sistem",
        "Notifikasi akan dikirim ke shipper dan transporter",
        "Case akan dipindah ke arsip completed",
      ],
      auditTrail: {
        completedBy: "CS Team Member",
        completionMethod: "Web Dashboard",
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0...",
      },
    },
    Type: "REQUEST_COMPLETION_SUCCESS",
  },
};

// Fetcher function
export const completeTransportRequest = async (url, { arg }) => {
  const useMockData = false; // Set to true for development/testing

  if (useMockData) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockCompleteTransportRequestResult;
  }

  const result = await fetcherMuatrans.post(url, arg);
  return result;
};

// SWR Hook for completing transport request
export const useCompleteTransportRequest = (requestId) =>
  useSWRMutation(
    `/v1/cs/transport-request/${requestId}/complete`,
    completeTransportRequest
  );

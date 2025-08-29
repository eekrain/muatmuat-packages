import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      code: 200,
      text: "Success",
    },
    Data: {
      featureAccess: {
        canCancel: true,
        canModify: false,
        canReorder: false,
        canRate: true,
        canTrackRealtime: true,
        canViewDocuments: true,
        canChatDriver: true,
        canRequestSupport: true,
        restrictions: [
          {
            feature: "MODIFY_ORDER",
            reason: "Order already in progress",
            disabledUntil: null,
          },
        ],
      },
    },
    Type: "FEATURE_ACCESS",
  },
};

const useMockData = false; // mock detailpesanan

export const getFeatureAccess = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];

  let result;

  if (useMockData) {
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(`v1/orders/${orderId}/feature-access`);
  }

  return result?.data?.Data?.featureAccess;
};

export const useGetFeatureAccess = (orderId) =>
  useSWR(`feature-access/${orderId}`, getFeatureAccess);

import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockActiveOrdersCount = true;

const apiResultActiveOrdersCount = {
  Message: {
    Code: 200,
    Text: "Data count pesanan aktif berhasil diambil",
  },
  Data: {
    totalActiveOrders: 1,
    statusCounts: {
      SCHEDULED_FLEET: 15,
      IN_TRANSIT: 10,
      LOADING: 8,
      UNLOADING: 5,
      WAITING_CONFIRMATION: 7,
    },
    availableStatuses: {
      hasNeedChangeResponse: true,
      hasNeedConfirmationReady: false,
      hasNeedAssignVehicle: true,
      totalNeedChangeResponse: 5,
      totalNeedConfirmationReady: 1,
      totalNeedAssignVehicle: 3,
    },
  },
  Type: "ACTIVE_ORDERS_COUNT",
};

export const fetcherActiveOrdersCount = async () => {
  if (isMockActiveOrdersCount) {
    return apiResultActiveOrdersCount.Data;
  }

  const result = await fetcherMuatrans.get("/v1/active-orders/count");
  return result?.data?.Data || {};
};

export const useGetActiveOrdersCount = () => {
  const cacheKey = "monitoring-active-orders-count";

  return useSWR(cacheKey, fetcherActiveOrdersCount);
};

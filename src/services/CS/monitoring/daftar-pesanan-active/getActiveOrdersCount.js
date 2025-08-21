import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockActiveOrdersCount = true;

const apiResultActiveOrdersCount = {
  Message: {
    Code: 200,
    Text: "Data count pesanan aktif berhasil diambil",
  },
  Data: {
    totalActiveOrders: 14,
    statusCounts: {
      WAITING_CONFIRMATION_SHIPPER: 1,
      CONFIRMED: 1,
      NEED_ASSIGN_FLEET: 1,
      NEED_CONFIRMATION_READY: 1,
      NEED_CHANGE_RESPONSE: 2,
      SCHEDULED_FLEET: 1,
      LOADING: 2,
      UNLOADING: 3,
      PREPARE_DOCUMENT: 1,
      DOCUMENT_DELIVERY: 1,
    },
    availableStatuses: {
      hasNeedChangeResponse: false,
      hasNeedConfirmationReady: false,
      hasNeedAssignVehicle: false,
      totalNeedChangeResponse: 2,
      totalNeedConfirmationReady: 1,
      totalNeedAssignVehicle: 1,
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

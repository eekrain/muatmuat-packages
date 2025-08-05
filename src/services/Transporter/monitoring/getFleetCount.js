import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockFleetCount = false;

const apiResultFleetCount = {
  data: {
    Message: {
      Code: 200,
      Text: "Fleet count retrieved successfully",
    },
    Data: {
      totalFleet: 0,
      hasFleet: false,
    },
    Type: "GET_FLEET_COUNT",
  },
};

export const fetcherFleetCount = async () => {
  if (isMockFleetCount) {
    const result = apiResultFleetCount;
    return result.data.Data;
  }

  const result = await fetcherMuatrans.get("v1/monitoring/fleet-count");
  return result?.data?.Data || {};
};

export const useGetFleetCount = () => {
  const cacheKey = "monitoring-fleet-count";

  return useSWR(cacheKey, fetcherFleetCount);
};

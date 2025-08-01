import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Aktifkan mock
const isMockProcessDrivers = true;

const apiResultProcessDrivers = {
  data: {
    Message: {
      Code: 200,
      Text: "Success",
    },
    Data: {
      drivers: [
        {
          id: "111e8400-e29b-41d4-a716-446655440000",
          name: "Rio Haryanto",
          phoneNumber: "081111111111",
          profileImage: "/img/mock-armada/driver-1.jpg",
          submittedDate: "2025-01-20T08:00:00Z",
          processStatus: "PENDING_VERIFICATION",
        },
        {
          id: "111e8400-e29b-41d4-a716-446655440001",
          name: "Siti Aminah",
          phoneNumber: "082222222222",
          profileImage: "/img/mock-armada/driver-2.jpg",
          submittedDate: "2025-01-21T09:15:00Z",
          processStatus: "IN_REVIEW",
        },
        {
          id: "111e8400-e29b-41d4-a716-446655440002",
          name: "Yusuf Wijaya",
          phoneNumber: "083333444555",
          profileImage: "/img/mock-armada/driver-3.jpg",
          submittedDate: "2025-01-22T13:45:00Z",
          processStatus: "ADDITIONAL_DOCS_REQUIRED",
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 3,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      summary: {
        total: 3,
        pending: 1,
        inReview: 1,
        docsRequired: 1,
      },
    },
    Type: "GET_PROCESS_DRIVERS",
  },
};

export const fetcherProcessDrivers = async (cacheKey) => {
  const queryString = cacheKey.includes("?") ? cacheKey.split("?")[1] : "";
  const url = queryString
    ? `v1/drivers/process?${queryString}`
    : "v1/drivers/process";

  if (isMockProcessDrivers) {
    const result = apiResultProcessDrivers;

    // Filter berdasarkan query (contoh: processStatus)
    const urlParams = new URLSearchParams(queryString);
    const statusFilter = urlParams.get("processStatus");

    let filteredDrivers = result.data.Data.drivers;

    if (statusFilter && statusFilter !== "null") {
      filteredDrivers = filteredDrivers.filter(
        (driver) => driver.processStatus === statusFilter
      );
    }

    return {
      ...result.data.Data,
      drivers: filteredDrivers,
      pagination: {
        ...result.data.Data.pagination,
        totalItems: filteredDrivers.length,
      },
    };
  }

  const result = await fetcherMuatrans.get(url);
  return result?.data?.Data || {};
};

export const useGetProcessDriversData = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const cacheKey = `process-drivers${queryParams ? `?${queryParams}` : ""}`;

  return useSWR(cacheKey, fetcherProcessDrivers);
};

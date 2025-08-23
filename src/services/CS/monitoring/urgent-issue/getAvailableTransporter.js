// SWR hook
import useSWR from "swr";

// Mock data untuk Get Available Transporters
const useMockData = true;

export const mockAvailableTransporterList = {
  success: true,
  data: [
    {
      id: "tr002",
      name: "PT Logistik Prima",
      logo: "https://api.muatrans.com/logos/tr002.png",
      vehicle_count: {
        matching: 5,
        active: 3,
        inactive: 2,
      },
      is_recommended: true,
      has_rejected: false,
      distance_km: 12.5,
      phone: "021-9876-5432",
      matching_score: 95,
    },
    {
      id: "tr003",
      name: "PT Angkutan Nusantara",
      logo: "https://api.muatrans.com/logos/tr003.png",
      vehicle_count: {
        matching: 2,
        active: 2,
        inactive: 0,
      },
      is_recommended: false,
      has_rejected: false,
      distance_km: 20.1,
      phone: "021-5555-1234",
      matching_score: 80,
    },
    {
      id: "tr004",
      name: "CV Maju Lancar",
      logo: "https://api.muatrans.com/logos/tr004.png",
      vehicle_count: {
        matching: 1,
        active: 1,
        inactive: 0,
      },
      is_recommended: false,
      has_rejected: true,
      distance_km: 25.0,
      phone: "021-4444-5678",
      matching_score: 70,
    },
  ],
  pagination: {
    total: 3,
    page: 1,
    limit: 10,
  },
};

export const mockAvailableTransporterListError = {
  success: false,
  data: [],
  message: "Invalid issue_id parameter",
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
};

export const getAvailableTransporter = async (cacheKey) => {
  // cacheKey: getAvailableTransporter/{paramsString}
  const params = cacheKey?.split("/")?.[1];
  const searchParams = params
    ? new URLSearchParams(params)
    : new URLSearchParams();

  let result;
  if (useMockData) {
    const issueId = searchParams.get("issue_id");
    if (!issueId) {
      result = mockAvailableTransporterListError;
    } else {
      // Filter dan sort mock data sesuai query
      let data = [...mockAvailableTransporterList.data];
      const search = searchParams.get("search");
      const sortBy = searchParams.get("sort_by") || "recommendation";

      if (search) {
        data = data.filter((tr) =>
          tr.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (sortBy === "recommendation") {
        data.sort(
          (a, b) =>
            b.is_recommended - a.is_recommended ||
            b.matching_score - a.matching_score
        );
      } else if (sortBy === "distance") {
        data.sort((a, b) => a.distance_km - b.distance_km);
      } else if (sortBy === "name") {
        data.sort((a, b) => a.name.localeCompare(b.name));
      }

      // Pagination
      const page = parseInt(searchParams.get("page") || "1", 10);
      const limit = parseInt(searchParams.get("limit") || "10", 10);
      const start = (page - 1) * limit;
      const pagedData = data.slice(start, start + limit);

      result = {
        success: true,
        data: pagedData,
        pagination: {
          total: data.length,
          page,
          limit,
        },
      };
    }
  } else {
    // Implementasi real API call
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    // result = await fetcherMuatrans.get(`/v1/cs/urgent-issues/transporters/available${query}`);
    result = {};
  }

  return result;
};

export const useGetAvailableTransporter = (params) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const { data, error, isLoading } = useSWR(
    `getAvailableTransporter/${paramsString}`,
    getAvailableTransporter
  );
  return {
    data: data?.data || [],
    pagination: data?.pagination || {},
    success: data?.success,
    isLoading,
    isError: !!error,
    raw: data,
  };
};

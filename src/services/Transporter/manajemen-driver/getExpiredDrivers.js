import useSWR from "swr";

const apiResultExpiredDrivers = {
  data: {
    Message: {
      Code: 200,
      Text: "Success",
    },
    Data: {
      drivers: [
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
          name: "John Doe Driver",
          phoneNumber: "081234567890",
          profileImage:
            "/img/mock-armada/96f3e307242fe2a40610399e1d9d7a279944c89c.jpg",
          simExpiryDate: "2025-02-15",
          status: "Nonaktif",
          verificationStatus: "VERIFIED",
          createdAt: "2025-01-16T08:30:00Z",
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 8,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
    Type: "GET_DRIVERS_SIM_EXPIRY",
  },
};

const fetcher = async (url) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return apiResultExpiredDrivers.data.Data;
};

export const useGetExpiredDriversData = ({
  page = 1,
  limit = 10,
  search = "",
  ...filters
}) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...filters,
  });

  const { data, error, isLoading, mutate } = useSWR(
    `/api/drivers/expired?${queryParams.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

// Hook for getting expired drivers summary
export const useGetExpiredDriversSummary = () => {
  const fetcher = async (url) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      totalExpiringDrivers: 0,
      expiringThisWeek: 3,
      expiringThisMonth: 5,
      expired: 0,
    };
  };

  const { data, error, isLoading } = useSWR(
    "/api/drivers/expired-summary",
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data,
    error,
    isLoading,
  };
};

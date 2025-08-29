import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockTransportersWithSOS = {
  data: {
    Message: {
      Code: 200,
      Text: "Transporters with active SOS retrieved successfully",
    },
    Data: {
      transporters: [
        {
          id: "trans123",
          companyName: "PT ABC Transport",
          activeSosCount: 3,
          logoUrl: "https://cdn.example.com/logos/abc-transport.png",
        },
        {
          id: "trans456",
          companyName: "PT XYZ Logistics",
          activeSosCount: 2,
          logoUrl: "https://cdn.example.com/logos/xyz-logistics.png",
        },
        {
          id: "trans789",
          companyName: "PT DEF Cargo",
          activeSosCount: 1,
          logoUrl: "https://cdn.example.com/logos/def-cargo.png",
        },
        {
          id: "trans101",
          companyName: "PT GHI Express",
          activeSosCount: 5,
          logoUrl: "https://cdn.example.com/logos/ghi-express.png",
        },
        {
          id: "trans202",
          companyName: "PT JKL Freight",
          activeSosCount: 0,
          logoUrl: "https://cdn.example.com/logos/jkl-freight.png",
        },
        {
          id: "trans303",
          companyName: "PT MNO Shipping",
          activeSosCount: 4,
          logoUrl: "https://cdn.example.com/logos/mno-shipping.png",
        },
        {
          id: "trans404",
          companyName: "PT PQR Delivery",
          activeSosCount: 1,
          logoUrl: "https://cdn.example.com/logos/pqr-delivery.png",
        },
        {
          id: "trans505",
          companyName: "PT STU Logistics",
          activeSosCount: 2,
          logoUrl: "https://cdn.example.com/logos/stu-logistics.png",
        },
      ],
      total: 8,
    },
    Type: "TRANSPORTERS_WITH_SOS",
  },
};

export const mockTransportersWithSOSFiltered = {
  data: {
    Message: {
      Code: 200,
      Text: "Transporters with active SOS retrieved successfully",
    },
    Data: {
      transporters: [
        {
          id: "trans123",
          companyName: "PT ABC Transport",
          activeSosCount: 3,
          logoUrl: "https://cdn.example.com/logos/abc-transport.png",
        },
        {
          id: "trans456",
          companyName: "PT XYZ Logistics",
          activeSosCount: 2,
          logoUrl: "https://cdn.example.com/logos/xyz-logistics.png",
        },
      ],
      total: 2,
    },
    Type: "TRANSPORTERS_WITH_SOS",
  },
};

export const mockTransportersWithSOSEmpty = {
  data: {
    Message: {
      Code: 200,
      Text: "No transporters with active SOS found",
    },
    Data: {
      transporters: [],
      total: 0,
    },
    Type: "TRANSPORTERS_WITH_SOS_EMPTY",
  },
};

export const getSOSFilterTransporter = async (params = {}) => {
  const { search = "" } = params;

  let result;

  if (useMockData) {
    // Simulate different scenarios based on search parameter
    if (!search || search.trim() === "") {
      // No search term - return all transporters
      result = mockTransportersWithSOS.data;
    } else {
      // Apply search filter
      const searchTerm = search.toLowerCase().trim();

      // Check if search term matches any company names
      const hasMatch = mockTransportersWithSOS.data.Data.transporters.some(
        (transporter) =>
          transporter.companyName.toLowerCase().includes(searchTerm)
      );

      if (hasMatch) {
        // Filter transporters based on search term
        const filteredTransporters =
          mockTransportersWithSOS.data.Data.transporters.filter((transporter) =>
            transporter.companyName.toLowerCase().includes(searchTerm)
          );

        result = {
          ...mockTransportersWithSOS.data,
          Data: {
            transporters: filteredTransporters,
            total: filteredTransporters.length,
          },
        };
      } else {
        // No matches found
        result = mockTransportersWithSOSEmpty.data;
      }
    }
  } else {
    try {
      result = await fetcherMuatrans.get(
        `/v1/cs/sos/transporters/with-active-sos`,
        {
          params: { search },
        }
      );
    } catch (error) {
      // Handle error response
      return {
        data: {
          Message: {
            Code: error.response?.status || 500,
            Text:
              error.response?.data?.Message?.Text ||
              "Failed to retrieve transporters with active SOS",
          },
          Data: {
            transporters: [],
            total: 0,
          },
          Type: "TRANSPORTERS_WITH_SOS_ERROR",
        },
        raw: error.response,
      };
    }
  }

  return {
    data: result?.data || {},
    raw: result,
  };
};

export const useGetSOSFilterTransporter = (params = {}) => {
  const { data, error, isLoading, mutate } = useSWR(
    [`getSOSFilterTransporter`, params],
    () => getSOSFilterTransporter(params),
    {
      refreshInterval: 30000, // Refresh every 30 seconds for real-time updates
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    data: data?.data || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
    mutate, // Expose mutate for manual refresh
  };
};

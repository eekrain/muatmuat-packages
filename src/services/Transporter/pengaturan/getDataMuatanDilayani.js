import useSWR from "swr";

const MOCK_ENABLED = process.env.NEXT_PUBLIC_MOCK_ENABLED === "true";
const URL_MUATAN_DILAYANI = "/v1/transporter/muatan-dilayani";

const mockMuatanDilayani = {
  Message: {
    Code: 200,
    Text: "Data muatan yang dilayani berhasil diambil",
  },
  Data: {
    hasData: true,
    totalTruckTypes: 4,
    servedCargos: [
      {
        truckTypeId: "550e8400-e29b-41d4-a716-446655440001",
        truckTypeName: "CDD",
        totalSubTrucks: 2,
        isAllSubTrucksSelected: false,
        subTrucks: [
          {
            subTruckTypeId: "550e8400-e29b-41d4-a716-446655440011",
            subTruckTypeName: "CDD Bak",
            isActive: true,
            isSelected: true,
          },
          {
            subTruckTypeId: "550e8400-e29b-41d4-a716-446655440012",
            subTruckTypeName: "CDD Box",
            isActive: true,
            isSelected: true,
          },
        ],
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 4,
      itemsPerPage: 10,
    },
  },
  Type: "GET_MUATAN_DILAYANI",
};

export const getMuatanDilayaniData = async (params) => {
  if (MOCK_ENABLED) {
    return mockMuatanDilayani.Data;
  }

  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${URL_MUATAN_DILAYANI}?${queryString}`);
  const result = await response.json();
  return result?.Data || {};
};

export const useGetMuatanDilayaniData = (params) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const { data, error, isLoading } = useSWR(
    `getMuatanDilayaniData/${paramsString}`,
    () => getMuatanDilayaniData(params)
  );

  return {
    data: data?.servedCargos || [],
    totalTruckTypes: data?.totalTruckTypes || 0,
    hasData: data?.hasData || false,
    pagination: data?.pagination || {},
    isLoading,
    isError: !!error,
  };
};

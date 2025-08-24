// SWR hook
import useSWR from "swr";

const useMockData = true;

export const mockTransporterVehicles = {
  success: true,
  data: [
    {
      id: "vh003",
      plate_number: "B 5678 ABC",
      driver_name: "Slamet Widodo",
      vehicle_type: "Truk Fuso",
      carrier_type: "Box",
      capacity: "8 Ton",
      distance_km: 8.2,
      location_address: "Jl. Gatot Subroto No. 45",
      status: "available",
      is_recommended: true,
      matching_score: 98,
      recommendation_reason: "Jenis carrier cocok, jarak terdekat",
    },
    {
      id: "vh004",
      plate_number: "B 1234 XYZ",
      driver_name: "Budi Santoso",
      vehicle_type: "Truk Engkel",
      carrier_type: "Bak",
      capacity: "5 Ton",
      distance_km: 12.5,
      location_address: "Jl. Sudirman No. 10",
      status: "available",
      is_recommended: false,
      matching_score: 85,
      recommendation_reason: "Masih dalam radius pengiriman",
    },
    {
      id: "vh005",
      plate_number: "B 9999 DEF",
      driver_name: "Tono Sugiarto",
      vehicle_type: "Truk Tronton",
      carrier_type: "Box",
      capacity: "12 Ton",
      distance_km: 20.0,
      location_address: "Jl. Thamrin No. 99",
      status: "available",
      is_recommended: false,
      matching_score: 80,
      recommendation_reason: "Kapasitas lebih besar dari kebutuhan",
    },
  ],
  recommendation: "vh003",
  total_matching: 3,
};

export const mockTransporterVehiclesError = {
  success: false,
  data: [],
  message: "Invalid transporter_id or issue_id parameter",
  recommendation: null,
  total_matching: 0,
};

export const getTransporterVehicles = async (cacheKey) => {
  // cacheKey: getTransporterVehicles/{transporter_id}/{paramsString}
  const [_, transporterId, params] = cacheKey?.split("/") || [];
  const searchParams = params
    ? new URLSearchParams(params)
    : new URLSearchParams();

  let result;
  if (useMockData) {
    const issueId = searchParams.get("issue_id");
    if (!transporterId || !issueId) {
      result = mockTransporterVehiclesError;
    } else {
      // Filter dan sort mock data sesuai query
      const data = [...mockTransporterVehicles.data];
      const loadSpec = searchParams.get("load_spec");
      // Untuk demo, filter berdasarkan status dan rekomendasi
      // Bisa ditambah filter sesuai kebutuhan
      // Sort by is_recommended, matching_score
      data.sort(
        (a, b) =>
          b.is_recommended - a.is_recommended ||
          b.matching_score - a.matching_score
      );

      result = {
        success: true,
        data,
        recommendation: mockTransporterVehicles.recommendation,
        total_matching: data.length,
      };
    }
  } else {
    // Implementasi real API call
    // const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    // result = await fetcherMuatrans.get(`/v1/cs/urgent-issues/transporters/${transporterId}/vehicles${query}`);
    result = {};
  }

  return result;
};

export const useGetTransporterVehicles = (transporterId, params) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const { data, error, isLoading } = useSWR(
    transporterId
      ? `getTransporterVehicles/${transporterId}/${paramsString}`
      : null,
    getTransporterVehicles
  );
  return {
    data: data?.data || [],
    recommendation: data?.recommendation,
    total_matching: data?.total_matching,
    success: data?.success,
    isLoading,
    isError: !!error,
    raw: data,
  };
};

import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Dashboard menu options retrieved",
    },
    Data: {
      currentDashboard: "real-time", // analytics, real-time
      dropdownOpen: false,
      availableOptions: [
        {
          type: "analytics",
          label: "Dashboard Analytics",
          url: "/dashboard/analytics",
          isActive: false,
        },
        {
          type: "real-time",
          label: "Dashboard Real-time",
          url: "/dashboard/real-time",
          isActive: true,
        },
      ],
      chevronDirection: "down", // up when dropdown open
      hoverEffects: {
        enabled: true,
        hoverColor: "#f5f5f5",
      },
      navigationItems: [
        "Monitoring",
        "Manajemen Armada",
        "Manajemen Driver",
        "Agenda Armada Driver",
        "Daftar Pesanan",
        "Laporan",
        "Pengaturan",
      ],
    },
    Type: "DASHBOARD_MENU_OPTIONS",
  },
};

// Flag to control mock data usage
const useMockData = true; // Changed to true for testing

// Fetcher function for dashboard menu options
export const getDashboardMenuOptions = async () => {
  console.log("🚀 Fetching dashboard menu options...");

  if (useMockData) {
    console.log("📋 Using mock data for dashboard menu options");
    return mockAPIResult;
  }

  console.log("🌐 Making API call to /v1/transporter/dashboard/menu-options");
  const response = await fetcherMuatrans.get(
    "/v1/transporter/dashboard/menu-options"
  );
  console.log("✅ API Response:", response);
  return response;
};

// SWR hook for dashboard menu options
export const useGetDashboardMenuOptions = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "dashboard-menu-options",
    getDashboardMenuOptions,
    {
      refreshInterval: 300000, // 5 minutes auto-refresh
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    data: data?.data?.Data,
    message: data?.data?.Message,
    type: data?.data?.Type,
    isLoading,
    isError: error,
    mutate,
  };
};

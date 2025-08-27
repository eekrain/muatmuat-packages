import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Dashboard summary retrieved successfully",
    },
    Data: {
      lastUpdated: "2025-01-22T18:15:00Z",
      autoRefreshInterval: 300000,
      dataAvailable: true,
      sections: {
        orders: {
          waitingConfirmation: {
            count: 5,
            tooltip:
              "Daftar pesanan yang menunggu konfirmasi Kamu. Segera konfirmasi untuk melanjutkan proses pengangkutan.",
          },
          confirmed: {
            count: 12,
            tooltip:
              "Daftar pesanan yang telah terkonfirmasi dan sedang dalam tahap persiapan armada untuk pengangkutan.",
          },
          scheduled: {
            count: 8,
            tooltip:
              "Daftar pesanan dengan jadwal keberangkatan yang telah ditetapkan, menunggu proses pemuatan barang.",
          },
          loading: {
            count: 3,
            tooltip:
              "Daftar pesanan yang sedang dalam proses muat barang ke dalam armada di lokasi muat.",
          },
          unloading: {
            count: 2,
            tooltip:
              "Daftar pesanan yang sedang dalam proses bongkar barang dari armada di lokasi bongkar.",
          },
          documentPreparation: {
            count: 4,
            tooltip:
              "Daftar pesanan yang sedang dalam proses penyiapan dan verifikasi dokumen pengiriman.",
          },
          documentDelivery: {
            count: 1,
            tooltip:
              "Daftar pesanan dengan dokumen yang sedang dalam proses pengiriman ke pihak Shipper.",
          },
          completed: {
            count: 25,
            tooltip:
              "Daftar pesanan jasa angkut yang telah selesai diproses, termasuk pengiriman dokumen dan pembayaran.",
          },
        },
        earnings: {
          totalEarnings: 15750000,
          disbursed: 12500000,
          potentialEarnings: 2250000,
          pending: 1000000,
          totalClaims: 150000,
        },
        alerts: {
          needResponse: 3,
          needConfirmation: 2,
          needAssignment: 5,
          newReviews: 8,
          sosReports: 1,
        },
        performance: {
          overallRating: 4.7,
          cancelledOrders: 2,
          penalties: 0,
        },
      },
    },
    Type: "DASHBOARD_SUMMARY",
  },
};

// Flag to control mock data usage
const useMockData = false;

// Fetcher function for dashboard summary
export const getDashboardSummary = async (refresh = false) => {
  if (useMockData) {
    return mockAPIResult;
  }

  const params = new URLSearchParams();
  if (refresh) {
    params.append("refresh", "true");
  }

  const url = `/v1/transporter/dashboard/summary${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  const response = await fetcherMuatrans.get(url);
  return response;
};

// SWR hook for dashboard summary
export const useGetDashboardSummary = (refresh = false) => {
  const { data, error, isLoading, mutate } = useSWR(
    `dashboard-summary${refresh ? "-refresh" : ""}`,
    () => getDashboardSummary(refresh),
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

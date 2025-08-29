import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

export const mockExportWithdrawalData = {
  success: {
    data: {
      Message: {
        Code: 200,
        Text: "Export file generated successfully",
      },
      Data: {
        downloadUrl: "https://api.domain.com/files/export_1234567890.xlsx",
        fileName: "Laporan_Pencairan_Dana_24_Jan_2025.xlsx",
        fileSize: 2048576,
        expiresAt: "2025-01-24T12:00:00Z",
        totalRecords: 150,
      },
      Type: "WITHDRAWAL_EXPORT",
    },
  },
  error: {
    data: {
      Message: {
        Code: 400,
        Text: "No data available for export",
      },
      Data: {
        appliedFilters: {
          accounts: ["uuid1"],
          period: "2025-01-01 to 2025-01-31",
        },
      },
      Type: "WITHDRAWAL_EXPORT_ERROR",
    },
  },
};

export const exportWithdrawalData = async (params, simulateError = false) => {
  let result;

  if (useMockData) {
    result = simulateError
      ? { ...mockExportWithdrawalData.error }
      : { ...mockExportWithdrawalData.success };
  } else {
    try {
      result = await fetcherMuatrans.get(
        "/v1/transporter/withdrawals/export/excel",
        { params }
      );
    } catch (error) {
      return {
        success: false,
        data: error?.response?.data || null,
      };
    }
  }

  return {
    success: result?.data?.Message?.Code === 200,
    data: result?.data || {},
  };
};

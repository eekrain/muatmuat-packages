import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockSavePeriodSearch = {
  success: {
    data: {
      Message: {
        Code: 201,
        Text: "Period search saved successfully",
      },
      Data: {
        searchId: "550e8400-e29b-41d4-a716-446655440001",
        displayText: "01 Jan 2025 - 31 Jan 2025",
      },
      Type: "PERIOD_SEARCH_SAVED",
    },
  },
  error: {
    data: {
      Message: {
        Code: 400,
        Text: "Invalid period range",
      },
      Data: {
        errors: [
          {
            field: "endDate",
            message: "End date cannot be earlier than start date",
          },
        ],
      },
      Type: "PERIOD_SEARCH_ERROR",
    },
  },
};

export const savePeriodSearch = async (payload, simulateError = false) => {
  let result;

  if (useMockData) {
    result = simulateError
      ? { ...mockSavePeriodSearch.error }
      : { ...mockSavePeriodSearch.success };
  } else {
    try {
      result = await fetcherMuatrans.post(
        "/v1/transporter/withdrawals/period-history",
        payload
      );
    } catch (error) {
      return {
        success: false,
        data: error?.response?.data || null,
      };
    }
  }

  return {
    success: result?.data?.Message?.Code === 201,
    data: result?.data || {},
  };
};

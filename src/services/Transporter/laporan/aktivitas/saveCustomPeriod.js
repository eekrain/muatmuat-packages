import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

const isMockSaveCustomPeriod = false;

const mockSaveCustomPeriodResponse = (requestData) => ({
  data: {
    Message: {
      Code: 201,
      Text: "Custom period saved successfully",
    },
    Data: {
      customPeriodId: "550e8400-e29b-41d4-a716-446655440000",
      userId: "550e8400-e29b-41d4-a716-446655440001",
      startDate: requestData.startDate,
      endDate: requestData.endDate,
      label: `${new Date(requestData.startDate).toLocaleDateString("id-ID", { month: "long", year: "numeric" })} - ${new Date(requestData.endDate).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}`,
      module: requestData.module,
      createdAt: new Date().toISOString(),
      isActive: true,
    },
    Type: "SAVE_CUSTOM_PERIOD",
  },
});

const mockErrorResponse = {
  response: {
    status: 400,
    data: {
      Message: {
        Code: 400,
        Text: "Invalid period range",
      },
      Data: {
        errors: [
          {
            field: "startDate",
            message: "Start date cannot be greater than end date",
            code: "INVALID_DATE_RANGE",
          },
        ],
      },
      Type: "SAVE_CUSTOM_PERIOD_ERROR",
    },
  },
};

export const saveCustomPeriod = async (payload) => {
  if (isMockSaveCustomPeriod) {
    // Simulate validation error scenario (10% chance)
    const scenario = Math.random();
    if (scenario < 0.1) {
      throw mockErrorResponse;
    }

    return mockSaveCustomPeriodResponse(payload).data;
  }

  const result = await fetcherMuatrans.post(
    "v1/transporter/custom-periods/save",
    payload
  );
  return result?.data;
};

export const useSaveCustomPeriod = () => {
  return useSWRMutation(
    "v1/transporter/custom-periods/save",
    async (url, { arg }) => {
      if (isMockSaveCustomPeriod) {
        // Simulate validation error scenario (10% chance)
        const scenario = Math.random();
        if (scenario < 0.1) {
          throw mockErrorResponse;
        }

        return mockSaveCustomPeriodResponse(arg).data.Data;
      }

      const result = await fetcherMuatrans.post(url, arg);
      return result?.data?.Data || {};
    }
  );
};

import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

// Mock config for UI state testing
const IS_MOCK = false;

const apiResultAcceptInstantTransport = {
  Message: {
    Code: 200,
    Text: "Instant request accepted successfully",
  },
  Data: {
    id: "uuid",
    orderCode: "MT-2025-001",
    acceptedAt: "2025-01-15T10:30:00+07:00",
    vehicle: {
      id: "uuid",
      licensePlate: "B 1234 XYZ",
      operationalStatus: "ON_DUTY",
    },
    driver: {
      id: "uuid",
      name: "John Driver",
      driverStatus: "BUSY",
    },
    orderDriver: {
      id: "uuid",
      driverStatus: "ASSIGNED",
      driverSubStatus: "HEADING_TO_PICKUP",
    },
    newOrderStatus: "MENUNGGU_KONFIRMASI",
    nextAction: {
      type: "WAIT_CONFIRMATION",
      description: "Waiting for shipper confirmation",
      redirectTo: "/orders/active",
    },
    toast: {
      type: "success",
      message: "Permintaan MT-2025-001 berhasil diterima",
      duration: 6000,
    },
  },
  Type: "ACCEPT_INSTANT_TRANSPORT_REQUEST",
};

const apiErrorResult = {
  Message: {
    Code: 409,
    Text: "Request or vehicle is no longer available",
  },
  Data: {
    errors: [
      {
        field: "vehicleId",
        message: "Selected vehicle is no longer available",
      },
      {
        field: "orderStatus",
        message: "Request has been taken by another transporter",
      },
    ],
  },
  Type: "ACCEPT_INSTANT_TRANSPORT_REQUEST_ERROR",
};

// Function to send the request
const sendAcceptRequest = async (url, { arg }) => {
  if (IS_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Validate payload
    if (!arg.payload.vehicleId || !arg.payload.acceptTerms) {
      return Promise.reject({
        response: {
          data: {
            Message: {
              Code: 400,
              Text: "Bad Request",
            },
            Data: {
              errors: [
                {
                  field: "payload",
                  message: "vehicleId and acceptTerms are required",
                },
              ],
            },
            Type: "ACCEPT_INSTANT_TRANSPORT_REQUEST_ERROR",
          },
        },
      });
    }

    // Simulate conflict error (10% chance)
    if (Math.random() < 0.1) {
      return Promise.reject({
        response: {
          status: 409,
          data: apiErrorResult,
        },
      });
    }

    // Return success response
    const result = JSON.parse(JSON.stringify(apiResultAcceptInstantTransport));
    result.Data.id = arg.id;
    return result;
  }

  // API real
  try {
    const result = await fetcherMuatrans.post(
      `v1/transporter/monitoring/transport-requests/${arg.id}/accept-instant`,
      arg.payload
    );
    return result?.data || {};
  } catch (error) {
    return Promise.reject(error);
  }
};

export const postAcceptInstantTransport = async (id, payload) => {
  if (IS_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Validate payload
    if (!payload.vehicleId || !payload.acceptTerms) {
      return Promise.reject({
        response: {
          data: {
            Message: {
              Code: 400,
              Text: "Bad Request",
            },
            Data: {
              errors: [
                {
                  field: "payload",
                  message: "vehicleId and acceptTerms are required",
                },
              ],
            },
            Type: "ACCEPT_INSTANT_TRANSPORT_REQUEST_ERROR",
          },
        },
      });
    }

    // Simulate conflict error (10% chance)
    if (Math.random() < 0.1) {
      return Promise.reject({
        response: {
          status: 409,
          data: apiErrorResult,
        },
      });
    }

    // Return success response
    const result = JSON.parse(JSON.stringify(apiResultAcceptInstantTransport));
    result.Data.id = id;
    return result;
  }

  // API real
  try {
    const result = await fetcherMuatrans.post(
      `v1/transporter/monitoring/transport-requests/${id}/accept-instant`,
      payload
    );
    return result?.data || {};
  } catch (error) {
    return Promise.reject(error);
  }
};

// SWR Mutation hook for better integration with SWR patterns
export const useAcceptInstantTransport = () => {
  const { trigger, isMutating, data, error } = useSWRMutation(
    "accept-instant-transport",
    sendAcceptRequest
  );

  return {
    acceptTransport: trigger,
    isAccepting: isMutating,
    data,
    error,
  };
};

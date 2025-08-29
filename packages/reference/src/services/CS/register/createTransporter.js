import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

/**
 * Mock API result for development/testing.
 * Simulates a successful transporter creation response.
 */
export const mockAPIResult = {
  data: {
    Message: {
      Code: 201,
      Text: "Transporter created successfully",
    },
    Data: {
      transporterId: "d290f1ee-6c54-4b01-90e6-d701748f0851",
      registrationStatus: "PENDING_VERIFICATION",
    },
    Type: "CREATE_TRANSPORTER_SUCCESS",
  },
};

/**
 * Fetcher function to create a new transporter.
 * @param {string} url - The API endpoint.
 * @param {object} arg - The arguments object from SWRMutation, containing the request body.
 * @param {object} arg.arg - The request body payload.
 * @returns {Promise<any>} A promise that resolves to the API response data.
 */
const createTransporterFetcher = async (url, { arg }) => {
  // fetcherMuatransCS already has Basic Auth configured
  return fetcherMuatrans.post(url, arg).then((res) => res.data);
};

/**
 * SWR Mutation hook for creating a new transporter.
 * @param {object} options - SWR Mutation options, e.g., { onSuccess, onError }.
 * @returns {{
 *   trigger: (payload: object) => Promise<any>,
 *   isMutating: boolean
 * }}
 */
export const useCreateTransporter = (options) => {
  const { trigger, isMutating } = useSWRMutation(
    "/v1/cs/register/transporter/create", // Endpoint yang benar
    createTransporterFetcher,
    options // Pass component-defined options (onSuccess, onError)
  );

  return {
    trigger,
    isMutating,
  };
};

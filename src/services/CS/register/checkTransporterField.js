import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

/**
 * Mock API result for development/testing.
 * This simulates the response when a field is a duplicate.
 */
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    // MOCK DATA DISESUAIKAN dengan kontrak baru
    Data: {
      type: "email",
      value: "backend@company.com",
      duplicate: true, // Key-nya adalah 'duplicate'
    },
    Type: "CUSTOMER_SERVICE_FIELD_CHECKER_TRANSPORTER",
  },
};

/**
 * Fetcher function to check if a specific transporter field value already exists.
 * This is designed to be used with a useSWRMutation hook for triggered checks.
 * @param {string} url - The API endpoint.
 * @param {object} arg - The arguments object from SWRMutation, containing params.
 * @param {object} arg.arg - The parameters for the GET request (e.g., { type, value }).
 * @returns {Promise<any>} A promise that resolves to the API response data.
 */
const checkTransporterField = async (url, { arg }) => {
  return fetcherMuatrans.get(url, { params: arg }).then((res) => res.data);
};

/**
 * SWR Mutation hook to imperatively check if a transporter field (e.g., email, phoneNumber) is already registered.
 * @returns {{
 *   trigger: (params: { type: 'email' | 'phoneNumber' | 'NPWP' | 'NIB', value: string }) => Promise<any>,
 *   isMutating: boolean,
 *   error: any
 * }}
 */
export const useCheckTransporterField = () => {
  const { trigger, isMutating, error } = useSWRMutation(
    "/v1/cs/register/transporter/field-checker",
    checkTransporterField
  );

  return {
    trigger,
    isMutating,
    error,
  };
};

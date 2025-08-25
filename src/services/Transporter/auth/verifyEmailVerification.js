import useSWRMutation from "swr/mutation";

import { fetcherMuatransCS } from "@/lib/fetcherBasicAuth";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 201,
      Text: "Created",
    },
    Data: {
      message: "OTP sent successfully",
      email: "user1@company.com",
      phoneNumber: "081234567100",
      expiresIn: "2025-08-20 15:35:29",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmFuc3BvcnRlcklkIjoiODQ2MjNiYjQtOGZmMS00OTc5LTk3ZGEtNDlkN2ZlYTRlYjA4IiwidHlwZSI6IkVNQUlMX1ZFUklGSUNBVElPTiIsImlhdCI6MTc1NTY3ODU4NiwiZXhwIjoxNzU2MjgzMzg2fQ.bjGS9mIfEOiTE_ZMWb2GZCnq1_YkRohNoW4ScunourA",
    },
    Type: "TRANSPORTER_VERIFY_EMAIL",
  },
};

/**
 * Verify email verification for transporter
 * @param {Object} data - Request body containing email, token, password, and confirmPassword
 * @returns {Promise} API response
 */
export const verifyEmailVerification = async (data) => {
  const response = await fetcherMuatransCS.post(
    "/v1/transporter/auth/email-verification/verify",
    data
  );
  return response;
};

/**
 * SWR mutation hook for verifying email verification
 * @returns {Object} SWR mutation object with trigger, data, error, isMutating
 */
export const useVerifyEmailVerification = () =>
  useSWRMutation(
    "/v1/transporter/auth/email-verification/verify",
    (url, { arg }) => {
      return fetcherMuatransCS.post(url, arg);
    }
  );

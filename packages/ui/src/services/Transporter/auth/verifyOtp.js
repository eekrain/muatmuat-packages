import useSWRMutation from "swr/mutation";
import xior from "xior";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "OTP verified successfully",
    },
    Data: {
      message: "OTP verified successfully",
      transporterId: "a2544dbc-f2e0-48c5-a030-f361d1a6bec9",
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    },
    Type: "TRANSPORTER_VERIFY_OTP",
  },
};

/**
 * Verify OTP for transporter authentication
 * @param {Object} data - Request body containing phoneNumber, otpCode, and token
 * @returns {Promise} API response
 */
export const verifyOtp = async (data) => {
  // Create Basic Auth header using environment variables
  const basicAuth = btoa(
    `${process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME}:${process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD}`
  );

  const response = await xior.post(
    "https://apimtrans-az.assetlogistik.com/v1/transporter/auth/verify-otp",
    data,
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    }
  );
  return response;
};

/**
 * SWR mutation hook for verifying OTP
 * @returns {Object} SWR mutation object with trigger, data, error, isMutating
 */
export const useVerifyOtp = () =>
  useSWRMutation(
    "https://apimtrans-az.assetlogistik.com/v1/transporter/auth/verify-otp",
    (url, { arg }) => {
      // Create Basic Auth header using environment variables
      const basicAuth = btoa(
        `${process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME}:${process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD}`
      );

      return xior.post(url, arg, {
        headers: {
          Authorization: `Basic ${basicAuth}`,
        },
      });
    }
  );

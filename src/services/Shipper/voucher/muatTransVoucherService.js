import { fetcherMuatrans } from "@/lib/axios";

/**
 * Service untuk mendapatkan daftar voucher yang tersedia
 * API: GET /v1/orders/vouchers
 */
export const muatTransGetAvailableVouchers = async (token) => {
  console.log("🚀 muatTransGetAvailableVouchers called with:", {
    token: `${token?.substring(0, 20)}...` || "No token",
    endpoint: "/v1/orders/vouchers",
    timestamp: new Date().toISOString(),
  });

  try {
    console.log("📡 Making real API call to /v1/orders/vouchers...");

    const response = await fetcherMuatrans.get("/v1/orders/vouchers", {
      headers: {
        Authorization: token || "Bearer your_token_here",
      },
    });

    console.log("📥 Raw API Response:", {
      status: response.status,
      statusText: response.statusText,
      messageCode: response.data?.Message?.Code,
      messageText: response.data?.Message?.Text,
      dataLength: response.data?.Data?.vouchers?.length || 0,
    });

    // Validasi response structure
    if (
      response.data &&
      response.data.Message &&
      response.data.Message.Code === 200
    ) {
      const vouchers = response.data.Data?.vouchers || [];

      console.log("✅ API Success - Processing vouchers:", vouchers.length);

      // Transform data untuk konsistensi dengan format yang digunakan di frontend
      const transformedVouchers = vouchers.map((voucher) => ({
        id: voucher.id,
        code: voucher.code,
        name: voucher.name,
        description: voucher.description,
        discountType:
          voucher.discountType === "nominal" ? "FIXED_AMOUNT" : "PERCENTAGE",
        discountAmount: voucher.discountAmount,
        discountPercentage: voucher.discountPercentage,
        minOrderAmount: voucher.minOrderAmount,
        maxDiscountAmount: voucher.maxDiscountAmount,
        validFrom: voucher.validFrom,
        validTo: voucher.validTo,
        termsAndConditions: voucher.termsAndConditions,
        quota: voucher.quota,
        usage: voucher.usage || { globalPercentage: 0 },
        isOutOfStock: voucher.isOutOfStock || false,
      }));

      console.log("🔄 Transformed vouchers:", transformedVouchers.length);
      return transformedVouchers;
    } else {
      const errorMsg =
        response.data?.Message?.Text || "Failed to fetch vouchers";
      console.error("❌ API Response Error:", errorMsg);
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error("💥 muatTransGetAvailableVouchers Error:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      errorData: error.response?.data,
    });

    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.Message?.Text || "Server error";

      if (statusCode === 401) {
        throw new Error("Unauthorized - Please login again");
      } else if (statusCode === 403) {
        throw new Error("Forbidden - Access denied");
      } else if (statusCode === 404) {
        throw new Error("Vouchers not found");
      } else if (statusCode >= 500) {
        throw new Error("Server error - Please try again later");
      } else {
        throw new Error(errorMessage);
      }
    } else if (error.request) {
      // Network error
      throw new Error("Network error - Please check your connection");
    } else {
      // Other error
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
};

/**
 * Service untuk memvalidasi voucher
 * API: POST /v1/orders/vouchers/validate
 */
export const muatTransValidateVoucher = async ({
  voucherId,
  totalAmount,
  token,
}) => {
  try {
    const response = await fetcherMuatrans.post(
      "/v1/orders/vouchers/validate",
      {
        voucherId,
        totalAmount,
      },
      {
        headers: {
          Authorization: token || "Bearer your_token_here",
          "Content-Type": "application/json",
        },
      }
    );

    // Validasi response structure
    if (response.data && response.data.Message) {
      const data = response.data.Data;
      const isValid =
        response.data.Message.Code === 200 && data?.isValid === true;

      return {
        voucherId: data?.voucherId || voucherId,
        code: data?.code || "",
        isValid,
        validationMessages: data?.validationMessages || [],
      };
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Error validating voucher:", error);

    // Handle different error types
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage =
        error.response.data?.Message?.Text || "Validation failed";
      const validationMessages =
        error.response.data?.Data?.validationMessages || [];

      if (statusCode === 400) {
        // Bad request - voucher validation failed
        return {
          voucherId,
          code: "",
          isValid: false,
          validationMessages:
            validationMessages.length > 0 ? validationMessages : [errorMessage],
        };
      } else if (statusCode === 401) {
        throw new Error("Unauthorized - Please login again");
      } else if (statusCode === 403) {
        throw new Error("Forbidden - Access denied");
      } else if (statusCode === 404) {
        return {
          voucherId,
          code: "",
          isValid: false,
          validationMessages: ["Voucher not found"],
        };
      } else if (statusCode >= 500) {
        throw new Error("Server error - Please try again later");
      } else {
        return {
          voucherId,
          code: "",
          isValid: false,
          validationMessages: [errorMessage],
        };
      }
    } else if (error.request) {
      // Network error
      throw new Error("Network error - Please check your connection");
    } else {
      // Other error
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
};

import { useEffect, useState } from "react";

import { mockGetAvailableVouchers } from "@/services/Shipper/voucher/mockVoucherService";
import { muatTransGetAvailableVouchers } from "@/services/Shipper/voucher/muatTransVoucherService";

import { useTokenStore } from "@/store/AuthStore/tokenStore";

export const useVouchers = (token, useMockData = true, mockEmpty = false) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Enhanced debugging
        console.log("🔄 useVouchers Hook - Starting fetch:", {
          useMockData,
          mockEmpty,
          token: `${token?.substring(0, 20)}...` || "No token",
          timestamp: new Date().toISOString(),
        });

        // If mockEmpty is true, return empty array without API call
        if (mockEmpty) {
          console.log("🚫 Using MOCK_EMPTY - returning empty vouchers");
          setVouchers([]);
          return;
        }

        if (useMockData) {
          // Gunakan mock data untuk testing
          console.log("🎭 Using MOCK DATA service");
          const mockVouchers = await mockGetAvailableVouchers();
          console.log(
            "✅ Mock data loaded:",
            mockVouchers?.length || 0,
            "vouchers"
          );
          setVouchers(mockVouchers);
        } else {
          // Gunakan API real dengan service yang sudah dibuat
          console.log("🌐 Using REAL API service");
          console.log(
            "📞 Calling muatTransGetAvailableVouchers with token:",
            `${token?.substring(0, 20)}...`
          );

          try {
            // Check if we have a valid token first
            if (
              !token ||
              token === useTokenStore.getState().token ||
              token === "Bearer null"
            ) {
              throw new Error("Invalid or missing authentication token");
            }

            const realVouchers = await muatTransGetAvailableVouchers(token);
            console.log(
              "✅ Real API data loaded:",
              realVouchers?.length || 0,
              "vouchers"
            );
            setVouchers(realVouchers);
          } catch (apiError) {
            console.error("❌ Real API Error:", apiError.message);
            console.log("🔄 API Error Details:", {
              status: apiError.response?.status,
              statusText: apiError.response?.statusText,
              data: apiError.response?.data,
            });

            // Smart fallback: If it's auth error or server error, fallback to mock data
            const shouldFallbackToMock =
              !token ||
              token === "Bearer your_token_here" ||
              token === "Bearer null" ||
              apiError.response?.status === 401 ||
              apiError.response?.status === 403 ||
              apiError.response?.status >= 500 ||
              apiError.message.includes("Network error") ||
              apiError.message.includes("Invalid or missing");

            if (shouldFallbackToMock) {
              console.log(
                "🔄 Smart Fallback: Using mock data due to API failure"
              );
              console.log(`💡 Reason: ${apiError.message}`);

              // Use mock data as fallback
              const mockVouchers = await mockGetAvailableVouchers();
              console.log(
                "✅ Fallback mock data loaded:",
                mockVouchers?.length || 0,
                "vouchers"
              );
              setVouchers(mockVouchers);

              // Set error message to inform user
              setError(
                `Menggunakan data demo - ${
                  apiError.message.includes("token")
                    ? "Token tidak valid"
                    : "Server tidak tersedia"
                }`
              );
            } else {
              throw apiError; // Re-throw to be caught by outer catch
            }
          }
        }
      } catch (err) {
        console.error("💥 useVouchers Hook Error:", err.message || err);
        setError(err.message || "Gagal memuat voucher");
        console.error("Error fetching vouchers:", err);
        setVouchers([]); // Reset vouchers on error
      } finally {
        setLoading(false);
        console.log("🏁 useVouchers Hook - Fetch completed");
      }
    };

    fetchVouchers();
  }, [token, useMockData, mockEmpty]);

  // Function to refetch vouchers
  const refetch = () => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        setError(null);

        // If mockEmpty is true, return empty array without API call
        if (mockEmpty) {
          setVouchers([]);
          return;
        }

        if (useMockData) {
          const mockVouchers = await mockGetAvailableVouchers();
          setVouchers(mockVouchers);
        } else {
          const realVouchers = await muatTransGetAvailableVouchers(token);
          setVouchers(realVouchers);
        }
      } catch (err) {
        setError(err.message || "Gagal memuat voucher");
        console.error("Error refetching vouchers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  };

  return {
    vouchers,
    loading,
    error,
    refetch,
  };
};

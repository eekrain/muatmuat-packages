import { useEffect, useState } from "react";

import { mockGetAvailableVouchers } from "@/services/Shipper/voucher/mockVoucherService";
import { muatTransGetAvailableVouchers } from "@/services/Shipper/voucher/muatTransVoucherService";

export const useVouchers = (token, useMockData = false, mockEmpty = false) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
          // Gunakan mock data untuk testing
          const mockVouchers = await mockGetAvailableVouchers();
          setVouchers(mockVouchers);
        } else {
          // Gunakan API real dengan service yang sudah dibuat
          const realVouchers = await muatTransGetAvailableVouchers(token);
          setVouchers(realVouchers);
        }
      } catch (err) {
        setError(err.message || "Gagal memuat voucher");
        console.error("Error fetching vouchers:", err);
        setVouchers([]); // Reset vouchers on error
      } finally {
        setLoading(false);
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

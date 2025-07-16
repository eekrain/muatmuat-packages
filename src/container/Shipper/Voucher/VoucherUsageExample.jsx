import { useEffect, useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import VoucherCard from "@/components/Voucher/VoucherCard";
import VoucherEmptyState from "@/components/Voucher/VoucherEmptyState";
import VoucherSearchEmpty from "@/components/Voucher/VoucherSearchEmpty";
import { useVouchers } from "@/hooks/useVoucher";
import { formatDate, formatShortDate } from "@/lib/utils/dateFormat";
import { validateVoucherClientSide } from "@/lib/utils/voucherValidation";
import { muatTransValidateVoucher } from "@/services/Shipper/voucher/muatTransVoucherService";

/**
 * Example component demonstrating how to use the voucher API integration
 * This component shows:
 * - How to fetch vouchers using the hook
 * - How to validate vouchers (client-side and server-side)
 * - How to handle loading/error states
 * - How to apply discounts
 * - New: Expired warning and proper error messages
 */
const VoucherUsageExample = () => {
  // API Configuration
  const token = "Bearer your_actual_token_here"; // Replace with real token
  const useMockData = true; // Set to true for testing, false for production
  const mockEmpty = false; // Set to true to simulate empty voucher list

  // Transaction data - using low amount to test minimum transaction validation
  const [orderAmount] = useState(50000); // 50 ribu rupiah untuk testing validation
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(orderAmount);

  // Voucher state
  const [searchQuery, setSearchQuery] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [validatingVoucher, setValidatingVoucher] = useState(null);

  // Fetch vouchers using the hook
  const { vouchers, loading, error, refetch } = useVouchers(
    token,
    useMockData,
    mockEmpty
  );

  // Filter vouchers based on search
  const filteredVouchers =
    vouchers?.filter((voucher) =>
      voucher.code.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // Calculate discount amount
  const calculateDiscount = (voucher, amount) => {
    if (!voucher || !amount) return 0;

    if (voucher.discountType === "PERCENTAGE") {
      const discountAmount = (amount * voucher.discountPercentage) / 100;
      return Math.min(
        discountAmount,
        voucher.maxDiscountAmount || discountAmount
      );
    } else if (voucher.discountType === "FIXED_AMOUNT") {
      return voucher.discountAmount;
    }

    return 0;
  };

  // Handle voucher selection and validation
  const handleVoucherSelect = async (voucher) => {
    try {
      setValidationErrors({});
      setValidatingVoucher(voucher.id);

      // Client-side validation first
      const clientValidation = validateVoucherClientSide(voucher, orderAmount);
      if (!clientValidation.isValid) {
        setValidationErrors({
          [voucher.id]: clientValidation.errorMessage,
        });
        return;
      }

      // Server-side validation if client validation passes
      const validationResult = await muatTransValidateVoucher({
        voucherId: voucher.id,
        totalAmount: orderAmount,
        token: token,
      });

      if (validationResult.isValid) {
        // Voucher is valid - apply it
        setSelectedVoucher({
          ...voucher,
          validationResult,
        });

        // Calculate discount
        const discountAmount = calculateDiscount(voucher, orderAmount);
        setDiscount(discountAmount);
        setFinalAmount(orderAmount - discountAmount);

        console.log("Voucher applied successfully:", voucher.code);
      } else {
        // Voucher is invalid - show server errors
        setValidationErrors({
          [voucher.id]:
            validationResult.validationMessages?.join(", ") ||
            "Voucher tidak valid",
        });
      }
    } catch (err) {
      console.error("Error validating voucher:", err);
      setValidationErrors({
        [voucher.id]: err.message || "Gagal memvalidasi voucher",
      });
    } finally {
      setValidatingVoucher(null);
    }
  };

  // Remove voucher
  const handleRemoveVoucher = () => {
    setSelectedVoucher(null);
    setDiscount(0);
    setFinalAmount(orderAmount);
    setValidationErrors({});
  };

  // Update final amount when order amount changes
  useEffect(() => {
    if (selectedVoucher) {
      const discountAmount = calculateDiscount(selectedVoucher, orderAmount);
      setDiscount(discountAmount);
      setFinalAmount(orderAmount - discountAmount);
    } else {
      setFinalAmount(orderAmount);
    }
  }, [orderAmount, selectedVoucher]);

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Voucher API Integration Example
      </h1>

      {/* Test Info */}
      <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
        <h3 className="mb-2 text-sm font-semibold text-yellow-800">
          Testing Info
        </h3>
        <p className="text-xs text-yellow-700">
          Order amount diset ke Rp 50.000 untuk testing validation error.
          Beberapa voucher memiliki minimum transaksi lebih tinggi.
        </p>
      </div>

      {/* Order Summary */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Order Summary
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Order Amount:</span>
            <span className="font-medium">
              Rp {orderAmount.toLocaleString("id-ID")}
            </span>
          </div>
          {selectedVoucher && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({selectedVoucher.code}):</span>
              <span className="font-medium">
                -Rp {discount.toLocaleString("id-ID")}
              </span>
            </div>
          )}
          <div className="flex justify-between border-t pt-2 text-lg font-bold">
            <span>Total:</span>
            <span>Rp {finalAmount.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>

      {/* Selected Voucher */}
      {selectedVoucher && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-800">Voucher Applied</h3>
              <p className="text-sm text-green-600">{selectedVoucher.code}</p>
            </div>
            <button
              onClick={handleRemoveVoucher}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center">
            <IconComponent src="/icons/search16.svg" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vouchers..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
      </div>

      {/* Voucher List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm text-gray-600">Loading vouchers...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="mb-2 text-center text-sm font-medium text-red-600">
              {error}
            </p>
            <button
              onClick={refetch}
              className="text-sm text-blue-600 underline hover:text-blue-800"
            >
              Retry
            </button>
          </div>
        ) : searchQuery && filteredVouchers.length === 0 ? (
          <VoucherSearchEmpty />
        ) : filteredVouchers.length === 0 ? (
          <VoucherEmptyState />
        ) : (
          <>
            <p className="text-sm text-gray-600">
              Found {filteredVouchers.length} voucher(s)
            </p>
            {filteredVouchers.map((voucher) => (
              <VoucherCard
                key={voucher.id}
                title={voucher.code}
                discountInfo={voucher.description}
                discountAmount={voucher.discountAmount}
                discountPercentage={voucher.discountPercentage}
                discountType={voucher.discountType}
                minTransaksi={voucher.minOrderAmount}
                kuota={voucher.quota}
                usagePercentage={voucher.usage?.globalPercentage || 0}
                isOutOfStock={voucher.isOutOfStock || false}
                startDate={formatShortDate(voucher.validFrom)}
                endDate={formatDate(voucher.validTo)}
                isActive={selectedVoucher?.id === voucher.id}
                onSelect={() => handleVoucherSelect(voucher)}
                validationError={validationErrors[voucher.id]}
                isValidating={validatingVoucher === voucher.id}
              />
            ))}
          </>
        )}
      </div>

      {/* API Status */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-900">API Status</h3>
        <div className="space-y-1 text-xs text-gray-600">
          <p>Mode: {useMockData ? "Mock Data" : "Real API"}</p>
          <p>Mock Empty: {mockEmpty ? "Yes" : "No"}</p>
          <p>Token: {token ? "Present" : "Missing"}</p>
          <p>Vouchers Loaded: {vouchers?.length || 0}</p>
          <p>Selected: {selectedVoucher ? selectedVoucher.code : "None"}</p>
          <p>
            Order Amount: Rp {orderAmount.toLocaleString("id-ID")} (for testing
            validation)
          </p>
        </div>
      </div>

      {/* Validation Examples */}
      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-blue-800">
          Expected Validation Behaviors
        </h3>
        <div className="space-y-1 text-xs text-blue-700">
          <p>
            <strong>Regular Validation:</strong>
          </p>
          <p>
            • DISKON50K: Error &quot;Minimal Transaksi Rp 300.000&quot; (current
            order: Rp 50.000)
          </p>
          <p>• DISKONPENGGUNABARU: Should work (min: Rp 50.000)</p>
          <p>• HEMAT20: Should work (min: Rp 50.000)</p>
          <p>
            • GRATIS10K: Error &quot;Kuota voucher sudah habis&quot;
            (client-side)
          </p>
          <p>• MURAH15: Should work (min: Rp 25.000)</p>

          <p className="pt-2">
            <strong>Race Condition Testing:</strong>
          </p>
          <p>
            • FLASH25K: Available di client → Error &quot;Kode voucher telah
            habis&quot; (server)
          </p>
          <p>
            • VIRAL30: Available di client → Error &quot;Kode voucher telah
            habis&quot; (server)
          </p>
          <p>
            • HOKI88: Available di client → Error &quot;Kode voucher telah
            habis&quot; (server)
          </p>

          <p className="pt-2">
            <strong>Other:</strong>
          </p>
          <p>
            • Expired vouchers: Show &quot;⚠️ Voucher akan berakhir dalam 3
            hari&quot; warning
          </p>
        </div>
      </div>

      {/* Race Condition Info */}
      <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-orange-800">
          Race Condition Simulation
        </h3>
        <div className="space-y-1 text-xs text-orange-700">
          <p>
            Voucher FLASH25K, VIRAL30, dan HOKI88 disimulasikan sebagai voucher
            yang:
          </p>
          <p>
            • Terlihat <strong>available</strong> di client (isOutOfStock:
            false)
          </p>
          <p>• Usage percentage tinggi (95%+) - menunjukkan hampir habis</p>
          <p>
            • Gagal validasi di server dengan pesan &quot;Kode voucher telah
            habis&quot;
          </p>
          <p>
            • Mensimulasikan kondisi multiple users menggunakan voucher
            bersamaan
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoucherUsageExample;

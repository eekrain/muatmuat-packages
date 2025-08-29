import { useEffect, useState } from "react";

import { mockValidateVoucher } from "@/services/Shipper/voucher/mockVoucherService";
import { muatTransValidateVoucher } from "@/services/Shipper/voucher/muatTransVoucherService";

import { usePrevious } from "@/hooks/use-previous";
import { useTranslation } from "@/hooks/use-translation";
import { useVouchers } from "@/hooks/useVoucher";

import { toast } from "@/lib/toast";
import { validateVoucherClientSide } from "@/lib/utils/voucherValidation";

export const useVoucher = ({
  token = "Bearer your_token_here",
  useMockData = true,
  mockEmpty = false,
  baseOrderAmount = 5000000,
  adminFee = 10000,
  taxAmount = 21300,
  calculatedPriceTotal = null, // New parameter for calculatedPrice.totalPrice
}) => {
  const { t } = useTranslation();
  // Use calculatedPriceTotal if available, otherwise calculate from components
  const baseTotal =
    calculatedPriceTotal || baseOrderAmount + adminFee + taxAmount;

  // Voucher data fetching
  const {
    vouchers: voucherList,
    loading,
    error,
    refetch,
  } = useVouchers(token, useMockData, mockEmpty);

  // Voucher state
  const [currentTotal, setCurrentTotal] = useState(baseTotal);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [isBottomsheetOpen, setIsBottomsheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelectedVoucher, setTempSelectedVoucher] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showTransactionSummary, setShowTransactionSummary] = useState(false);
  const [validatingVoucher, setValidatingVoucher] = useState(null);

  const previousIsBottomsheetOpen = usePrevious(isBottomsheetOpen);

  // Calculate discount amount based on voucher type
  const calculateDiscountAmount = (voucher, total) => {
    if (!voucher || !total) return 0;

    if (
      voucher.discountType === "PERCENTAGE" ||
      voucher.discountType === "percentage"
    ) {
      const discountAmount = (total * voucher.discountPercentage) / 100;
      return Math.min(
        discountAmount,
        voucher.maxDiscountAmount || discountAmount
      );
    } else if (
      voucher.discountType === "FIXED_AMOUNT" ||
      voucher.discountType === "fixed"
    ) {
      return voucher.discountAmount;
    }

    return voucher.discountAmount || 0;
  };

  // Update total when voucher discount changes
  useEffect(() => {
    const newTotal = baseTotal - voucherDiscount;
    setCurrentTotal(newTotal);
  }, [baseTotal, voucherDiscount]);

  // Calculate discount when voucher changes
  useEffect(() => {
    if (selectedVoucher && selectedVoucher.isValid) {
      const discount = calculateDiscountAmount(selectedVoucher, baseTotal);
      setVoucherDiscount(discount);
    } else {
      setVoucherDiscount(0);
    }
  }, [selectedVoucher, baseTotal]);

  // Reset search when bottomsheet opens
  useEffect(() => {
    if (isBottomsheetOpen && !previousIsBottomsheetOpen) {
      setSearchQuery("");
      setTempSelectedVoucher(selectedVoucher);
    }
  }, [isBottomsheetOpen, previousIsBottomsheetOpen, selectedVoucher]);

  // Handle voucher selection (temporary selection in the bottomsheet for UI only)
  const handleSelectVoucher = (voucher) => {
    setTempSelectedVoucher(
      voucher.id === tempSelectedVoucher?.id ? null : voucher
    );
  };

  // Handle voucher selection with validation
  const handleConfirmVoucherSelection = async (voucher) => {
    await handleVoucherSelect(voucher);
  };

  // Apply selected voucher (confirm selection when closing the bottomsheet)
  const handleVoucherSelect = async (voucher) => {
    try {
      setValidationErrors({});
      setValidatingVoucher(voucher.id);

      // Client-side validation first
      const clientValidation = validateVoucherClientSide(voucher, baseTotal);
      if (!clientValidation.isValid) {
        setValidationErrors({
          [voucher.id]: clientValidation.errorMessage,
        });
        return;
      }

      // Server-side validation if client validation passes
      const validationResult = useMockData
        ? await mockValidateVoucher({
            voucherId: voucher.id,
            totalAmount: baseTotal,
          })
        : await muatTransValidateVoucher({
            voucherId: voucher.id,
            totalAmount: baseTotal,
            token: token,
          });

      if (validationResult.isValid) {
        const validatedVoucher = {
          ...voucher,
          isValid: true,
          validationResult: validationResult,
        };

        setTempSelectedVoucher(validatedVoucher);
        setSelectedVoucher(validatedVoucher);
        setIsBottomsheetOpen(false);
        toast.success(`Voucher ${voucher.code} berhasil diterapkan!`);

        setTimeout(() => {
          setShowTransactionSummary(true);
        }, 500);
      } else {
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

  // Apply voucher (confirm selection)
  const handleApplyVoucher = () => {
    if (tempSelectedVoucher) {
      setSelectedVoucher(tempSelectedVoucher);
      setIsBottomsheetOpen(false);
      toast.success(`Voucher ${tempSelectedVoucher.code} berhasil diterapkan!`);

      setTimeout(() => {
        setShowTransactionSummary(true);
      }, 500);
    } else {
      setSelectedVoucher(null);
      setIsBottomsheetOpen(false);
    }
  };

  // Remove voucher
  const handleRemoveVoucher = () => {
    setSelectedVoucher(null);
    setTempSelectedVoucher(null);
    setVoucherDiscount(0);
    setShowTransactionSummary(false);
    toast.success("Voucher berhasil dihapus");
  };

  // Show transaction summary
  const handleShowTransactionSummary = () => {
    if (selectedVoucher) {
      setShowTransactionSummary(true);
    } else {
      setIsBottomsheetOpen(true);
    }
  };

  // Filter voucherList based on search query
  const filteredVouchers =
    voucherList?.filter((voucher) =>
      voucher.code.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return {
    // State
    voucherList,
    loading,
    error,
    currentTotal,
    voucherDiscount,
    isBottomsheetOpen,
    searchQuery,
    tempSelectedVoucher,
    selectedVoucher,
    validationErrors,
    showTransactionSummary,
    validatingVoucher,
    filteredVouchers,
    baseTotal,

    // Actions
    setSearchQuery,
    setIsBottomsheetOpen,
    setShowTransactionSummary,
    handleSelectVoucher,
    handleConfirmVoucherSelection,
    handleApplyVoucher,
    handleRemoveVoucher,
    handleShowTransactionSummary,
    refetch,
    calculateDiscountAmount,
  };
};

import { useEffect, useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import VoucherCard from "@/components/Voucher/VoucherCard";
import VoucherEmptyState from "@/components/Voucher/VoucherEmptyState";
import VoucherPopup from "@/components/Voucher/VoucherPopup";
import VoucherSearchEmpty from "@/components/Voucher/VoucherSearchEmpty";
import { formatDate, formatShortDate } from "@/lib/utils/dateFormat";
import {
  mockGetAvailableVouchers,
  mockValidateVoucher,
} from "@/services/voucher/mockVoucherService";
import {
  muatTransGetAvailableVouchers,
  muatTransValidateVoucher,
} from "@/services/voucher/muatTransVoucherService";

const MOCK_EMPTY = false;
export const VoucherContainer = ({
  selectedVoucher,
  baseOrderAmount,
  onVoucherSelect,
  useMockData = false, // Add flag for testing
}) => {
  // Voucher related state and hooks
  const [voucherList, setVoucherList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const [showVoucherPopup, setShowVoucherPopup] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Fetch vouchers when component mounts
  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      setError(null);
      try {
        // If MOCK_EMPTY is true, return empty array without API call
        if (MOCK_EMPTY) {
          setVoucherList([]);
          return;
        }

        // Use mock data if flag is set, otherwise use real API
        const vouchers = useMockData
          ? await mockGetAvailableVouchers()
          : await muatTransGetAvailableVouchers();
        setVoucherList(vouchers);
      } catch (err) {
        setError("Gagal memuat daftar voucher");
        console.error("Error fetching vouchers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [useMockData, MOCK_EMPTY]);

  useEffect(() => {
    if (selectedVoucher) {
      const discount = calculateDiscountAmount(
        selectedVoucher,
        baseOrderAmount
      );
      //setCurrentTotal(baseOrderAmount - discount);
    } else {
      //setCurrentTotal(baseOrderAmount);
    }
  }, [selectedVoucher, baseOrderAmount]);

  const filteredVouchers = voucherList.filter(
    (v) =>
      v.code?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      v.description?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // Function to open voucher popup
  const openVoucherPopup = () => {
    setShowVoucherPopup(true);
  };

  // Function to calculate discount amount based on voucher type
  const calculateDiscountAmount = (voucher, total) => {
    if (!voucher || !total) return 0;

    // Handle different discount types (support both formats for consistency)
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

  const handleVoucherSelect = async (voucher) => {
    console.log("here", voucher);
    try {
      // Clear previous validation errors for all vouchers
      setValidationErrors({});

      // Use mock validation if flag is set, otherwise use real API
      const validationResult = useMockData
        ? await mockValidateVoucher({
            voucherId: voucher.id,
            totalAmount: baseOrderAmount,
          })
        : await muatTransValidateVoucher({
            voucherId: voucher.id,
            totalAmount: baseOrderAmount,
            token: "Bearer your_token_here",
          });

      if (validationResult.isValid) {
        // Voucher is valid, proceed with selection
        if (onVoucherSelect) {
          onVoucherSelect(voucher);
        }
        setShowVoucherPopup(false);
      } else {
        // Voucher is invalid, show error
        setValidationErrors({
          [voucher.id]:
            validationResult.validationMessages?.join(", ") ||
            "Voucher tidak valid",
        });
      }
    } catch (err) {
      console.error("Error validating voucher:", err);
      setValidationErrors({
        [voucher.id]: "Gagal memvalidasi voucher",
      });
    }
  };

  return {
    // UI Component
    VoucherModal: (
      <>
        {/* MODAL PILIH VOUCHER */}
        <Modal open={showVoucherPopup} onOpenChange={setShowVoucherPopup}>
          <ModalContent className="max-h-[80vh] min-h-fit w-[386px] rounded-xl bg-white px-6 py-6 shadow-2xl">
            <button
              onClick={() => setShowVoucherPopup(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close"
            ></button>

            <h2 className="mb-4 text-center text-base font-semibold">
              Pilih Voucher
            </h2>

            <div className="relative mb-4">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <IconComponent src="/icons/search.svg" width={20} height={20} />
              </div>
              <input
                disabled={filteredVouchers.length === 0 ? true : false}
                type="text"
                placeholder="Cari Kode Voucher"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="h-[32px] w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-3 pb-6">
              {loading ? (
                <div className="text-center text-sm text-gray-500">
                  Memuat voucher...
                </div>
              ) : error ? (
                <div className="text-center text-sm text-red-500">
                  Gagal memuat voucher.
                </div>
              ) : searchKeyword.length > 0 && filteredVouchers.length === 0 ? (
                <VoucherSearchEmpty />
              ) : filteredVouchers.length === 0 ? (
                <VoucherEmptyState />
              ) : (
                <>
                  <p className="mb-4 text-xs text-gray-500">
                    Hanya bisa dipilih 1 Voucher
                  </p>
                  {filteredVouchers.map((v) => (
                    <VoucherCard
                      key={v.id}
                      title={v.code}
                      discountInfo={v.description}
                      discountAmount={v.discountAmount}
                      discountPercentage={v.discountPercentage}
                      discountType={v.discountType}
                      minTransaksi={v.minOrderAmount}
                      kuota={v.quota}
                      usagePercentage={v.usage?.globalPercentage || 0}
                      isOutOfStock={v.isOutOfStock || false}
                      startDate={formatShortDate(v.validFrom)}
                      endDate={formatDate(v.validTo)}
                      isActive={selectedVoucher?.id === v.id}
                      onSelect={() => handleVoucherSelect(v)}
                      validationError={validationErrors[v.id]}
                    />
                  ))}
                </>
              )}
            </div>
          </ModalContent>
        </Modal>

        {/* POPUP INFO VOUCHER */}
        {showInfoPopup && (
          <VoucherPopup
            open={showVoucherPopup}
            onOpenChange={setShowVoucherPopup}
            closeOnOutsideClick={true}
          />
        )}
      </>
    ),
    // Functions
    openVoucherPopup,
    calculateDiscountAmount,
    // Data
    voucherList,
    loading,
    error,
    selectedVoucher,
  };
};

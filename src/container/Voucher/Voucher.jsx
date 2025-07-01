import { useEffect, useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import VoucherCard from "@/components/Voucher/VoucherCard";
import VoucherEmptyState from "@/components/Voucher/VoucherEmptyState";
import VoucherPopup from "@/components/Voucher/VoucherPopup";
import VoucherSearchEmpty from "@/components/Voucher/VoucherSearchEmpty";
import { useVouchers } from "@/hooks/useVoucher";
import { fetcherMuatrans } from "@/lib/axios";
import { formatDate, formatShortDate } from "@/lib/utils/dateFormat";

export const VoucherContainer = ({ selectedVoucher, baseOrderAmount }) => {
  const token = "Bearer your_token_here";
  let { vouchers: voucherList, loading, error } = useVouchers(token);

  // Voucher related state and hooks
  const MOCK_EMPTY = false;
  if (MOCK_EMPTY && !loading && !error) {
    voucherList = [];
  }
  const [showVoucherPopup, setShowVoucherPopup] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
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

  // Function to calculate discount amount based on voucher type
  const calculateDiscountAmount = (voucher, total) => {
    if (!voucher) return 0;

    if (voucher.discountPercentage !== null) {
      const pct = parseFloat(voucher.discountPercentage) || 0;
      return total * (pct / 100);
    } else {
      // Use the fixed discountAmount key directly
      return parseFloat(voucher.discountAmount) || 0;
    }
  };

  const handleVoucherSelect = async (voucher) => {
    try {
      // Clear previous validation errors for all vouchers
      setValidationErrors({});

      const totalAmountForValidation = baseOrderAmount;
      const res = await fetcherMuatrans.post(
        "/v1/orders/vouchers/validate",
        {
          voucherId: voucher.id,
          totalAmount: totalAmountForValidation,
        },
        {
          headers: { Authorization: token },
        }
      );

      const isValid = res.data.Data.isValid;
      if (isValid !== false) {
        // Voucher is valid
        const discountValue = calculateDiscountAmount(
          voucher,
          totalAmountForValidation
        );

        setCurrentTotal(res.data.Data.finalAmount);

        setSelectedVoucher({
          ...voucher,
          discountAmount: discountValue, // This 'discountAmount' will hold the FINAL numerical discount value
        });
        setShowVoucherPopup(false);
      } else {
        // Voucher is invalid
        // Set validation error for this specific voucher
        const validationMessage =
          res.data.Data.validationMessages || "Voucher tidak valid";

        setValidationErrors({
          ...validationErrors,
          [voucher.id]: validationMessage,
        });

        // Keep the popup open so user can see the error
        setSelectedVoucher(null);
      }
    } catch (err) {
      console.log("error116", err);
      setSelectedVoucher(null);

      // Check if we have error response data (400 status code with validation message)
      if (err.response && err.response.data && err.response.data.Data) {
        const errorData = err.response.data.Data;
        const validationMessage =
          errorData.validationMessages || "Voucher tidak valid";
        // labelAlertVoucherMTExpired
        // labelAlertVoucherMTMinimumOrder
        // labelAlertVoucherMTKuotaHabis
        if (validationMessage == "labelAlertVoucherMTExpired") {
          console.log("err expired");
          validationMessage = "labelAlertVoucherMTExpired";
        } else if (validationMessage == "labelAlertVoucherMTMinimumOrder") {
          console.log("err order");
          validationMessage = `Minimal Transaksi ${idrFormat(voucher.minOrderAmount)}
          `;
        } else if (validationMessage == "labelAlertVoucherMTKuotaHabis") {
          console.log("err qty");
          validationMessage = "labelAlertVoucherMTKuotaHabis";
        }

        setValidationErrors({
          ...validationErrors,
          [voucher.id]: validationMessage,
        });
      } else {
        // General error fallback
        setValidationErrors({
          ...validationErrors,
          [voucher.id]: "Terjadi kesalahan. Silakan coba lagi.",
        });
      }
    }
  };

  return (
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
                    usagePercentage={v.usage["globalPercentage"] || 0}
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
  );
};

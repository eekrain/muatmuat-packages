// components/Voucher/VoucherCard.jsx
import Image from "next/image";
import { useState } from "react";

import { useCountdown } from "@/hooks/use-countdown";
import { useTranslation } from "@/hooks/use-translation";

import { idrFormat } from "@/lib/utils/formatters";
import { isVoucherExpiringSoon } from "@/lib/utils/voucherValidation";

import VoucherInfoPopup from "./VoucherInfoPopup";

export default function VoucherCard({
  title,
  discountInfo, // This prop is for the general description bullet points
  discountAmount,
  discountPercentage,
  discountType,
  minTransaksi,
  kuota,
  usagePercentage = 0,
  startDate,
  endDate,
  isActive,
  isOutOfStock = false,
  onSelect,
  validationError,
  isValidating = false, // Loading state for validation
}) {
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const { t } = useTranslation();

  // This function is purely for text display in VoucherCard if needed,
  // the actual calculation happens in SummaryPanel.
  const getDiscountDisplay = () => {
    if (
      discountType.toLowerCase() === "percentage" &&
      typeof discountPercentage === "number"
    ) {
      return `${t("labelDiscount")} ${discountPercentage}%`; // Display as percentage
    } else if (
      discountType.toLowerCase() === "fixed" &&
      typeof discountAmount === "number"
    ) {
      return `${t("labelDiscount")} Rp ${discountAmount.toLocaleString("id-ID")}`;
    }
    return ""; // No specific discount display if type/value is missing
  };

  const discountText = getDiscountDisplay(); // Use this if you want to explicitly show this text on the card.
  // Currently, it's not being rendered in the visible part of the card.
  // The description (discountInfo) and "Pakai" button are there.

  const bulletPoints = discountInfo?.split("\n") || [];
  const getExpiryWarning = (endDate) => {
    if (!endDate) return null;

    const now = new Date();
    const expiry = endDate instanceof Date ? endDate : new Date(endDate);
    const diffMs = expiry - now;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = Math.ceil(diffHours / 24);

    if (diffHours < 24 && diffHours > 0) {
      const hours = Math.floor(diffHours);
      return `Sisa ${hours} jam lagi`;
    }

    if (diffDays <= 3 && diffDays > 0) {
      return `Berakhir ${diffDays} hari lagi`;
    }

    return null;
  };

  // Prepare voucher data for the info popup
  const voucherData = {
    code: title,
    nominal: discountType.toLowerCase() === "fixed" ? discountAmount : 0,
    validFrom: startDate,
    validTo: endDate,
    expiryWarning: getExpiryWarning(endDate),
    usagePercentage: usagePercentage,
    minOrderAmount: minTransaksi,
    termsAndConditions: [
      `${t("descMaxApplicable")} ${discountText}`,
      `${t("descMinPurchase")} ${idrFormat(minTransaksi)}`,
      t("descPaymentMethod"),
      t("descPromoLimit"),
      t("descPromoNotCombinable"),
      t("descAppCompatibility"),
    ],
    usageInstructions: [t("descUsageInstruction")],
  };

  // Countdown for vouchers expiring soon
  const { countdown } = useCountdown({
    endingDate: endDate,
    isNeedCountdown: isVoucherExpiringSoon(endDate, 1),
  });

  return (
    <div>
      {console.log("VoucherCard active:", isActive)}
      <div
        className={`relative rounded-lg border transition-colors duration-200 ${
          validationError
            ? "border-red-500 bg-white"
            : isActive
              ? "border-primary-700 bg-primary-50"
              : "border-gray-200 bg-white"
        } ${isOutOfStock ? "opacity-70" : ""}`}
        onClick={isOutOfStock || validationError ? null : onSelect}
      >
        <div className="flex pl-[12px] pr-[12px] pt-[12px]">
          <div className="mr-3 flex items-center">
            <div className="relative flex h-16 w-16 overflow-hidden rounded">
              <Image
                src="/img/iconVoucher2.png"
                alt={t("VoucherCard.altVoucher", {}, "Voucher")}
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between">
              <h4 className="text-sm font-bold text-neutral-900">{title}</h4>
              <button
                className="text-blue-500"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInfoPopup(true);
                }}
              >
                <Image
                  src="/icons/information.png"
                  alt={t("VoucherCard.altInfo", {}, "VoucherInfo")}
                  width={16}
                  height={16}
                  className="object-cover"
                />
              </button>
            </div>

            <ul className="mb-2 list-disc pl-4 text-xs text-neutral-700">
              {bulletPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
              {/* If you want to show the specific discount type and amount/percentage on the card: */}
              {discountText && <li>{discountText}</li>}
              {minTransaksi && (
                <li>
                  {t("labelMinTransaction")}: {idrFormat(minTransaksi)}
                </li>
              )}
              {kuota && (
                <li>
                  {t("labelQuota")}: {kuota}
                </li>
              )}
            </ul>

            <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${usagePercentage}%` }}
              ></div>
            </div>

            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-gray-600">
                {t("descQuotaUsed")} {usagePercentage}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pl-4">
          <span className="text-xs text-gray-500">
            {startDate} - {endDate}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!validationError && !isValidating) {
                onSelect();
              }
            }}
            className={`rounded px-4 py-1 text-sm font-medium ${
              isOutOfStock
                ? "cursor-not-allowed bg-gray-300 text-gray-500"
                : validationError
                  ? "cursor-default bg-transparent text-blue-500"
                  : isValidating
                    ? "cursor-default bg-gray-100 text-gray-500"
                    : isActive
                      ? "bg-blue-50 bg-transparent text-blue-500"
                      : "bg-blue-50 bg-transparent text-blue-500"
            }`}
            disabled={isOutOfStock || validationError || isValidating}
          >
            {isValidating ? (
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 animate-spin rounded-full border border-gray-400 border-t-transparent"></div>
                {t("buttonValidating")}
              </div>
            ) : isActive ? (
              t("buttonApplied")
            ) : (
              t("buttonUse")
            )}
          </button>
        </div>
      </div>
      {validationError && (
        <div className="w-full border-red-300 py-1 text-xs font-medium text-red-500">
          {validationError}
        </div>
      )}

      {isOutOfStock && !validationError && (
        <div className="w-full border-red-300 py-1 text-xs font-medium text-red-500">
          {t("errorVoucherOutOfStock")}
        </div>
      )}

      {/* Expired warning - show if voucher is expiring within 4 days */}
      {!validationError &&
        !isOutOfStock &&
        isVoucherExpiringSoon(endDate, 4) && (
          <div className="w-full py-1 text-xs font-medium text-red-500">
            {(() => {
              // If less than 1 day, show countdown in hours
              const now = new Date();
              const expiry = new Date(endDate);
              const diffMs = expiry - now;
              const diffHours = diffMs / (1000 * 60 * 60);
              if (diffHours < 24) {
                return t(
                  "VoucherCard.timeRemainingHours",
                  { countdown },
                  `Sisa ${countdown} jam lagi`
                );
              } else {
                // Otherwise, show days left
                const diffDays = Math.ceil(diffHours / 24);
                return t(
                  "VoucherCard.expiresInDays",
                  { days: diffDays },
                  `Berakhir ${diffDays} hari lagi`
                );
              }
            })()}
          </div>
        )}

      {/* Voucher Info Popup */}
      <VoucherInfoPopup
        open={showInfoPopup}
        onOpenChange={setShowInfoPopup}
        voucher={voucherData}
      />
    </div>
  );
}

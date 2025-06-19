import Image from "next/image";

import { idrFormat } from "@/lib/utils/formatters";

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
}) {
  // This function is purely for text display in VoucherCard if needed,
  // the actual calculation happens in SummaryPanel.
  const getDiscountDisplay = () => {
    if (
      discountType === "percentage" &&
      typeof discountPercentage === "number"
    ) {
      return `Diskon ${discountPercentage}%`; // Display as percentage
    } else if (discountType === "fixed" && typeof discountAmount === "number") {
      return `Diskon Rp ${discountAmount.toLocaleString("id-ID")}`;
    }
    return ""; // No specific discount display if type/value is missing
  };

  const discountText = getDiscountDisplay(); // Use this if you want to explicitly show this text on the card.
  // Currently, it's not being rendered in the visible part of the card.
  // The description (discountInfo) and "Pakai" button are there.

  const bulletPoints = discountInfo?.split("\n") || [];

  return (
    <div>
      <div
        className={`relative rounded-lg border ${validationError ? "border-red-500" : isActive ? "border-blue-500 bg-primary-50" : "border-gray-200"} ${isOutOfStock ? "opacity-70" : ""}`}
        onClick={isOutOfStock || validationError ? null : onSelect}
      >
        <div className="flex pl-[12px] pr-[12px] pt-[12px]">
          <div className="mr-3 flex items-center">
            <div className="relative flex h-16 w-16 overflow-hidden rounded">
              <Image
                src="/img/iconVoucher2.png"
                alt="Voucher"
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
                  // Handle info button click
                }}
              >
                <Image
                  src="/icons/information.png"
                  alt="VoucherInfo"
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
                <li>Min. Transaksi: {idrFormat(minTransaksi)}</li>
              )}
              {kuota && <li>Kuota: {kuota}</li>}
            </ul>

            <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${usagePercentage}%` }}
              ></div>
            </div>

            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-gray-600">
                Kuota Voucher Telah Terpakai {usagePercentage}%
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
              if (!validationError) {
                onSelect();
              }
            }}
            className={`rounded px-4 py-1 text-sm font-medium ${
              isOutOfStock
                ? "cursor-not-allowed bg-gray-300 text-gray-500"
                : validationError
                  ? "cursor-default bg-transparent text-blue-500"
                  : isActive
                    ? "bg-transparent text-blue-500 hover:bg-blue-50"
                    : "bg-transparent text-blue-500 hover:bg-blue-50"
            }`}
            disabled={isOutOfStock || validationError}
          >
            {isActive ? "Dipakai" : "Pakai"}
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
          Kuota Voucher sudah habis
        </div>
      )}
    </div>
  );
}

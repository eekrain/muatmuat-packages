import Image from "next/image";

import IconComponent from "@/components/IconComponent/IconComponent";

export default function VoucherCard({
  title,
  discountInfo,
  minTransaksi,
  kuota,
  usagePercentage = 0, // Default to 0% used
  startDate,
  endDate,
  isActive,
  isOutOfStock = false, // Flag for depleted vouchers
  onSelect,
}) {
  // Format the bullet points based on discount info
  const bulletPoints = discountInfo?.split("\n") || [];

  return (
    <div
      className={`relative mb-4 rounded-lg border ${isActive ? "border-blue-500" : "border-gray-200"} ${isOutOfStock ? "opacity-70" : ""}`}
    >
      {/* Left side with icon */}
      <div className="flex p-4">
        <div className="mr-3">
          <div className="relative h-16 w-16 overflow-hidden rounded">
            <Image
              src="/img/iconVoucher2.png"
              alt="Voucher"
              width={64}
              height={64}
              className="object-cover"
            />
            {/* Blue circular badge with X */}
          </div>
        </div>

        {/* Right side with content */}
        <div className="flex-1">
          {/* Title and info button */}
          <div className="mb-1 flex items-center justify-between">
            <h4 className="text-sm font-bold text-neutral-900">{title}</h4>
            <button
              className="text-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                // Handle info button click
              }}
            >
              <IconComponent
                src="/icons/info-circle.svg"
                width={16}
                height={16}
              />
            </button>
          </div>

          {/* Bullet points */}
          <ul className="mb-2 list-disc pl-4 text-xs text-neutral-700">
            {bulletPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>

          {/* Progress bar */}
          <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>

          {/* Usage text */}
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-gray-600">
              Kuota Voucher Telah Terpakai {usagePercentage}%
            </span>
          </div>

          {/* Date range and use button */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {startDate} - {endDate}
            </span>
            <button
              onClick={onSelect}
              className={`rounded px-4 py-1 text-sm font-medium ${
                isOutOfStock
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : "bg-white text-blue-500 hover:bg-blue-50"
              }`}
              disabled={isOutOfStock}
            >
              Pakai
            </button>
          </div>
        </div>
      </div>

      {/* Out of stock banner */}
      {isOutOfStock && (
        <div className="absolute bottom-0 left-0 w-full border-t border-red-300 bg-red-50 px-4 py-1 text-center text-xs font-medium text-red-500">
          Kuota Voucher sudah habis
        </div>
      )}
    </div>
  );
}

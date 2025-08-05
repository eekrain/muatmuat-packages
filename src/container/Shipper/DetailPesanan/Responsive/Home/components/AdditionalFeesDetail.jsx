import {
  BottomSheet,
  BottomSheetTrigger,
} from "@/components/BottomSheet/BottomSheetUp";
import { idrFormat } from "@/lib/utils/formatters";

import BottomsheetWaitingTimeDetails from "./Popup/BottomsheetWaitingTimeDetails";

/**
 * Komponen utama yang menampilkan detail biaya tambahan.
 * Menggunakan BottomSheet untuk menampilkan detail waktu tunggu.
 */
const AdditionalFeesDetail = ({ priceCharge }) => {
  // Jika tidak ada biaya tambahan, jangan tampilkan komponen
  if (
    !priceCharge ||
    (!priceCharge.waitingFee?.totalAmount &&
      !priceCharge.adminFee &&
      !priceCharge.overloadFee?.totalAmount)
  ) {
    return null;
  }

  const hasWaitingFee = priceCharge.waitingFee?.totalAmount > 0;
  const hasAdminFee = priceCharge.adminFee > 0;
  const hasOverloadFee = priceCharge.overloadFee?.totalAmount > 0;

  return (
    <div className="bg-white px-4 py-5">
      <h2 className="mb-4 text-base font-bold text-neutral-900">
        Detail Tambahan Biaya
      </h2>

      {/* Bagian Biaya Waktu Tunggu */}
      {hasWaitingFee && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-neutral-900">
            Biaya Waktu Tunggu
          </p>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-neutral-800">
                Nominal Waktu Tunggu ({priceCharge.waitingFee.totalDriver || 0}{" "}
                Driver)
              </span>
              {/* BottomSheet untuk detail waktu tunggu */}
              <BottomSheet>
                <BottomSheetTrigger asChild>
                  <button
                    type="button"
                    className="rounded text-left text-sm font-medium text-primary-700 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                  >
                    Lihat Detail Waktu Tunggu
                  </button>
                </BottomSheetTrigger>
                <BottomsheetWaitingTimeDetails
                  waitingFee={priceCharge.waitingFee}
                />
              </BottomSheet>
            </div>
            <span className="text-sm font-semibold text-neutral-900">
              {idrFormat(priceCharge.waitingFee.totalAmount)}
            </span>
          </div>
        </div>
      )}

      {/* Bagian Biaya Kelebihan Muatan */}
      {hasOverloadFee && (
        <div className={`flex flex-col gap-2 ${hasWaitingFee ? "mt-4" : ""}`}>
          <p className="text-sm font-bold text-neutral-900">
            Biaya Kelebihan Muatan
          </p>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-neutral-800">
                Kelebihan Muatan ({priceCharge.overloadFee.totalWeight}{" "}
                {priceCharge.overloadFee.weightUnit})
              </span>
            </div>
            <span className="text-sm font-semibold text-neutral-900">
              {idrFormat(priceCharge.overloadFee.totalAmount)}
            </span>
          </div>
        </div>
      )}

      {(hasWaitingFee || hasOverloadFee) && hasAdminFee && (
        <hr className="my-4 border-t border-neutral-200" />
      )}

      {/* Bagian Biaya Lainnya */}
      {hasAdminFee && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-neutral-900">Biaya Lainnya</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-800">Admin Layanan</span>
            <span className="text-sm font-semibold text-neutral-900">
              {idrFormat(priceCharge.adminFee)}
            </span>
          </div>
        </div>
      )}

      {/* Total Biaya Tambahan */}
      {priceCharge.totalCharge > 0 && (
        <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
          <span className="text-sm font-bold text-neutral-900">
            Total Biaya Tambahan
          </span>
          <span className="text-sm font-bold text-neutral-900">
            {idrFormat(priceCharge.totalCharge)}
          </span>
        </div>
      )}

      {/* Status Pembayaran */}
      {priceCharge.totalCharge > 0 && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-neutral-800">Status Pembayaran</span>
          <span
            className={`text-sm font-semibold ${
              priceCharge.isPaid ? "text-success-700" : "text-error-700"
            }`}
          >
            {priceCharge.isPaid ? "Sudah Dibayar" : "Belum Dibayar"}
          </span>
        </div>
      )}
    </div>
  );
};

export default AdditionalFeesDetail;

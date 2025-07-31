import {
  BottomSheet,
  BottomSheetTrigger,
} from "@/components/Bottomsheet/Bottomsheet";

import BottomsheetWaitingTimeDetails from "./Bottomsheet/BottomsheetWaitingTimeDetails";

/**
 * Fungsi pembantu untuk memformat angka menjadi format mata uang Rupiah (IDR).
 * @param {number} amount - Jumlah uang yang akan diformat.
 * @returns {string} String yang telah diformat sebagai mata uang.
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Komponen utama yang menampilkan detail biaya tambahan.
 * Menggunakan BottomSheet untuk menampilkan detail waktu tunggu.
 */
const AdditionalCostDetails = () => {
  return (
    <div className="bg-white px-4 py-5">
      <h2 className="mb-4 text-base font-bold text-neutral-900">
        Detail Tambahan Biaya
      </h2>

      {/* Bagian Biaya Waktu Tunggu */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold text-neutral-900">Biaya Waktu Tunggu</p>
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-sm text-neutral-800">
              Nominal Waktu Tunggu (3 Driver)
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
              <BottomsheetWaitingTimeDetails />
            </BottomSheet>
          </div>
          <span className="text-sm font-semibold text-neutral-900">
            {formatCurrency(300000)}
          </span>
        </div>
      </div>

      <hr className="my-4 border-t border-neutral-200" />

      {/* Bagian Biaya Lainnya */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold text-neutral-900">Biaya Lainnya</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-800">Admin Layanan</span>
          <span className="text-sm font-semibold text-neutral-900">
            {formatCurrency(10000)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdditionalCostDetails;

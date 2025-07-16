"use client";

import { useState } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { VoucherContainer } from "@/container/Shipper/Voucher/Voucher";

// Komponen Ringkasan Transaksi
const TransactionSummary = ({ selectedVoucher, voucherDiscount }) => {
  // Data dummy sesuai screenshot
  const transactionData = {
    biayaPesanJasaAngkut: 950000,
    biayaAsuransiBarang: 10000,
    biayaLayananTambahan: 35000,
    nominalBantuanTambahan: 100000,
    adminLayanan: 10000,
    pajak: -21300, // Pajak negatif sesuai screenshot
  };

  const subtotal =
    transactionData.biayaPesanJasaAngkut +
    transactionData.biayaAsuransiBarang +
    transactionData.biayaLayananTambahan +
    transactionData.nominalBantuanTambahan;

  const totalBiayaLainnya =
    transactionData.adminLayanan + transactionData.pajak;
  const totalBiaya = subtotal + totalBiayaLainnya - voucherDiscount;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("IDR", "Rp");
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Ringkasan Transaksi
      </h2>

      {/* Biaya Pesan Jasa Angkut */}
      <div className="mb-6">
        <h3 className="mb-3 text-base font-semibold text-gray-900">
          Biaya Pesan Jasa Angkut
        </h3>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">
            Nominal Pesan Jasa Angkut
            <br />
            (1 Unit)
          </span>
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(transactionData.biayaPesanJasaAngkut)}
          </span>
        </div>
      </div>

      {/* Biaya Asuransi Barang */}
      <div className="mb-6">
        <h3 className="mb-3 text-base font-semibold text-gray-900">
          Biaya Asuransi Barang
        </h3>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">
            Nominal Premi Asuransi (1 Unit)
          </span>
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(transactionData.biayaAsuransiBarang)}
          </span>
        </div>
      </div>

      {/* Biaya Layanan Tambahan */}
      <div className="mb-6">
        <h3 className="mb-3 text-base font-semibold text-gray-900">
          Biaya Layanan Tambahan
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">
              Nominal Kirim Bukti Fisik
              <br />
              Penerimaan Barang
            </span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(transactionData.biayaLayananTambahan)}
            </span>
          </div>
          <div className="flex justify-between">
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Lihat Detail Pengiriman Dokumen
            </button>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">
              Nominal Bantuan Tambahan
            </span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(transactionData.nominalBantuanTambahan)}
            </span>
          </div>
        </div>
      </div>

      {/* Diskon Voucher */}
      {selectedVoucher && voucherDiscount > 0 && (
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900">Diskon</h3>
            <span className="rounded bg-yellow-200 px-2 py-1 text-xs font-medium text-yellow-800">
              Voucher
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-blue-600">
              Voucher
              <br />({selectedVoucher.code})
            </span>
            <span className="text-sm font-medium text-red-600">
              -{formatCurrency(voucherDiscount)}
            </span>
          </div>
        </div>
      )}

      {/* Biaya Lainnya */}
      <div className="mb-6">
        <h3 className="mb-3 text-base font-semibold text-gray-900">
          Biaya Lainnya
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Admin Layanan</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(transactionData.adminLayanan)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Pajak</span>
            <span className="text-sm font-medium text-red-600">
              {formatCurrency(transactionData.pajak)}
            </span>
          </div>
        </div>
      </div>

      {/* Total Biaya */}
      <div className="mb-6 border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">Total Biaya</span>
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(totalBiaya)}
          </span>
        </div>
      </div>

      {/* Status Voucher */}
      {selectedVoucher && (
        <div className="mb-6">
          <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-blue-900">
                1 Voucher Terpakai
              </span>
            </div>
            <IconComponent
              src="/icons/arrow-right.svg"
              width={16}
              height={16}
            />
          </div>
        </div>
      )}

      {/* Action Button */}
      <Button className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700">
        Lanjut
      </Button>
    </div>
  );
};

export default function TestAPIPage() {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [baseOrderAmount] = useState(950000); // Sesuai screenshot
  const [useMockData, setUseMockData] = useState(true);

  const handleVoucherSelect = (voucher) => {
    setSelectedVoucher(voucher);
    console.log("Selected voucher:", voucher);
  };

  const handleRemoveVoucher = () => {
    setSelectedVoucher(null);
  };

  const { VoucherModal, openVoucherPopup, calculateDiscountAmount } =
    VoucherContainer({
      selectedVoucher,
      baseOrderAmount,
      onVoucherSelect: handleVoucherSelect,
      useMockData: useMockData,
    });

  const discountAmount = selectedVoucher
    ? calculateDiscountAmount(selectedVoucher, baseOrderAmount)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">
            Test API - Ringkasan Transaksi
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Halaman testing untuk integrasi API voucher
          </p>

          {/* Mock Data Toggle */}
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="checkbox"
              id="mockToggle"
              checked={useMockData}
              onChange={(e) => setUseMockData(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="mockToggle" className="text-sm text-gray-700">
              Gunakan Mock Data (untuk testing)
            </label>
          </div>
        </div>

        {/* Voucher Selection */}
        <div className="mb-6">
          <Button
            onClick={openVoucherPopup}
            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
          >
            {selectedVoucher ? "Ganti Voucher" : "Pilih Voucher"}
          </Button>

          {selectedVoucher && (
            <div className="mt-3 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-green-800">
                  {selectedVoucher.code}
                </span>
                <span className="text-xs text-green-600">
                  Hemat{" "}
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                    .format(discountAmount)
                    .replace("IDR", "Rp")}
                </span>
              </div>
              <button
                onClick={handleRemoveVoucher}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Hapus
              </button>
            </div>
          )}
        </div>

        {/* Transaction Summary */}
        <TransactionSummary
          selectedVoucher={selectedVoucher}
          voucherDiscount={discountAmount}
        />
      </div>

      {/* Voucher Modal */}
      {VoucherModal}
    </div>
  );
}

// components/SummaryPanel/SummaryPanel.jsx
import Image from "next/image";
import { useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import VoucherCard from "@/components/Voucher/VoucherCard";
import VoucherEmptyState from "@/components/Voucher/VoucherEmptyState";
import VoucherPopup from "@/components/Voucher/VoucherInfoPopup";
import VoucherSearchEmpty from "@/components/Voucher/VoucherSearchEmpty";
import { useVouchers } from "@/hooks/useVoucher";
import axios from "@/lib/axios";

const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 transform items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-white shadow-lg">
    <span>{message}</span>
    <button onClick={onClose} className="font-bold text-white">
      ×
    </button>
  </div>
);

export const SummaryPanel = () => {
  const token = "Bearer your_token_here";
  const { vouchers: voucherList, loading, error } = useVouchers(token);

  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [showVoucherPopup, setShowVoucherPopup] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const filteredVouchers = voucherList.filter((v) =>
    v.title?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const handleVoucherSelect = async (voucher) => {
    try {
      const totalAmount = 1077490;
      const res = await axios.post(
        "/v1/orders/vouchers/validate",
        {
          voucherId: voucher.id,
          totalAmount: totalAmount,
        },
        {
          headers: { Authorization: token },
        }
      );

      const isValid = res.data.Data.isValid;
      if (isValid) {
        setSelectedVoucher(voucher);
        setShowVoucherPopup(false);
      } else {
        setToastMessage(
          `Voucher tidak valid: ${res.data.data.validationMessages?.[0]}` || ""
        );
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message?.text || "Gagal validasi voucher.";
      setToastMessage(msg);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
    });
  };

  return (
    <div className="inline-block">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-4 shadow-md">
        <h2 className="mb-4 text-base font-semibold text-gray-800">
          Ringkasan Transaksi
        </h2>

        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Biaya Pesan Jasa Angkut</span>
            <span className="font-medium">Rp 950.000</span>
          </div>
          <div className="flex justify-between">
            <span>Biaya Asuransi Barang</span>
            <span className="font-medium">Rp 0</span>
          </div>
          {selectedVoucher && (
            <div className="flex justify-between">
              <span>Diskon Voucher</span>
              <span className="font-medium text-red-500">
                -Rp {selectedVoucher.discountAmount?.toLocaleString("id-ID")}
              </span>
            </div>
          )}
        </div>

        {/* ✅ TOTAL DINAMIS */}
        <div className="my-4 flex items-center justify-between border-t border-gray-200 pt-4 text-base font-bold">
          <span>Total</span>
          <span className="text-xl">
            Rp{" "}
            {(950000 - (selectedVoucher?.discountAmount || 0)).toLocaleString(
              "id-ID"
            )}
          </span>
        </div>

        {/* ✅ TOMBOL VOUCHER DENGAN ICON */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setShowVoucherPopup(true)}
            className="flex w-full items-center justify-between rounded-md border border-blue-600 bg-white px-4 py-3 text-sm text-blue-700 hover:bg-blue-50"
          >
            <div className="flex items-center gap-2">
              <Image
                src="/img/iconVoucher2.png"
                alt="Voucher"
                width={25}
                height={25}
              />
              <span>Makin hemat pakai voucher</span>
            </div>
            <Image
              src="/icons/right-arrow-voucher.png"
              width={18}
              height={18}
            />
          </button>

          <button
            onClick={() => setShowConfirmPopup(true)}
            className="w-full rounded-md bg-blue-600 py-3 text-sm font-semibold text-white"
          >
            Lanjut Pembayaran
          </button>
        </div>
      </div>

      {/* MODAL PILIH VOUCHER */}
      <Modal open={showVoucherPopup} onOpenChange={setShowVoucherPopup}>
        <ModalContent className="max-h-[80vh] w-[386px] overflow-y-auto rounded-xl bg-white px-6 py-6 shadow-2xl">
          <h2 className="mb-4 text-center text-base font-semibold">
            Pilih Voucher
          </h2>

          <div className="relative mb-4">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <IconComponent src="/icons/search.svg" width={20} height={20} />
            </div>
            <input
              type="text"
              placeholder="Cari Kode Voucher"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <p className="mb-4 text-center text-xs text-gray-500">
            Hanya bisa dipilih 1 Voucher
          </p>

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
              filteredVouchers.map((v) => (
                <VoucherCard
                  key={v.id}
                  title={v.code}
                  discountInfo={v.description}
                  minTransaksi={v.minOrderAmount}
                  kuota={v.quota}
                  startDate={formatShortDate(v.validFrom)}
                  endDate={formatDate(v.validTo)}
                  isActive={selectedVoucher?.id === v.id}
                  onSelect={() => handleVoucherSelect(v)}
                />
              ))
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

      {/* CONFIRMATION MODAL */}
      <Modal open={showConfirmPopup} onOpenChange={setShowConfirmPopup}>
        <ModalContent className="mx-auto max-w-md overflow-hidden rounded-xl bg-white">
          <ModalHeader type="muattrans" />
          <div className="p-6 text-center">
            <h2 className="mb-3 text-base font-semibold">Informasi</h2>
            <div className="mb-4 rounded-md border border-yellow-300 bg-yellow-100 p-3 text-sm text-yellow-800">
              Jika ada kendala pada persiapan atau perjalanan ke lokasi muat,
              pengiriman mungkin tidak bisa dilanjutkan.
            </div>
            <p className="mb-2 text-sm text-gray-700">
              Apakah kamu yakin data yang kamu isi sudah benar?
            </p>
            <p className="mt-4 text-xs text-gray-500">
              *Dengan memesan jasa angkut ini, kamu telah menyetujui <br />
              <span className="cursor-pointer text-blue-600 underline">
                Syarat dan Ketentuan Muatrans
              </span>
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="w-full rounded-md border border-gray-300 py-2 font-medium text-gray-700"
              >
                Kembali
              </button>
              <button className="w-full rounded-md bg-blue-600 py-2 font-medium text-white">
                Pesan Sekarang
              </button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* TOAST */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </div>
  );
};

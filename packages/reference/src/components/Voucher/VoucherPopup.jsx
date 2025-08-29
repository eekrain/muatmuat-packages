"use client";

import { useState } from "react";

import { useTranslation } from "@/hooks/use-translation";
import { useVouchers } from "@/hooks/useVoucher";

export default function VoucherPopup({ token, onSelect, onClose }) {
  const { vouchers, loading, error } = useVouchers(token);
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  const filtered = vouchers.filter((v) =>
    v.code.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return <div>{t("VoucherPopup.loading", {}, "Loading voucher...")}</div>;
  if (error)
    return <div>{t("VoucherPopup.errorLoad", {}, "Gagal load voucher")}</div>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      <div className="max-h-[80vh] w-[400px] overflow-auto rounded-xl bg-white p-4">
        <h2 className="mb-2 text-lg font-bold">
          {t("VoucherPopup.title", {}, "Pilih Voucher")}
        </h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("VoucherPopup.placeholder", {}, "Cari kode voucher")}
          className="mb-2 w-full rounded border p-2"
        />
        {filtered.length === 0 ? (
          <div className="text-center text-gray-500">
            {t("VoucherPopup.emptyState", {}, "Belum Ada Voucher")}
          </div>
        ) : (
          filtered.map((v) => (
            <div
              key={v.id}
              className="mb-2 flex items-center justify-between rounded border p-2"
            >
              <div>
                <div className="font-bold">{v.name}</div>
                <div className="text-sm text-gray-600">{v.description}</div>
              </div>
              <button
                className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
                onClick={() => {
                  onSelect(v);
                  onClose();
                }}
              >
                {t("VoucherPopup.buttonUse", {}, "Pakai")}
              </button>
            </div>
          ))
        )}
        <button
          onClick={onClose}
          className="mt-2 text-sm text-gray-600 underline"
        >
          {t("VoucherPopup.buttonClose", {}, "Tutup")}
        </button>
      </div>
    </div>
  );
}

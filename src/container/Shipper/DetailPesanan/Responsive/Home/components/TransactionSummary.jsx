import { useState } from "react";

import CardPayment from "@/components/Card/CardPayment";
import { useTranslation } from "@/hooks/use-translation";
import { idrFormat } from "@/lib/utils/formatters";

import { BottomsheetDetailPengirimanDokumen } from "./Popup/BottomsheetDetailPengirimanDokumen";

const dataRingkasanPembayaran = {
  insuranceFee: 50000,
  documentShippingFee: 25000,
  otherAdditionalService: { totalPrice: 15000 },
  voucherDiscount: 20000,
  adminFee: 10000,
  tax: 5000,
  totalPrice: 1200000,
};

export const TransactionSummary = ({ documentShippingDetail }) => {
  const isRingkasanTransaksi = true;
  const { t } = useTranslation();

  const transportFee = 950000;

  const [isDocumentShippingDetailOpen, setDocumentShippingDetailOpen] =
    useState(false);

  // Use the data from props or fallback to example data
  const shippingData = documentShippingDetail || {
    recipientName: "Cakra",
    recipientPhone: "081249088083",
    fullAddress: "Jl. Sudirman No. 123, Jakarta Pusat",
    detailAddress: "Gedung ABC Lantai 5",
    district: "Tanah Abang",
    city: "Jakarta Pusat",
    province: "DKI Jakarta",
    postalCode: "10270",
    courier: "JNE",
    courierPrice: 200000,
    insurancePrice: 10000,
    totalPrice: 210000,
  };
  return (
    <>
      <div className="bg-white px-4 py-5">
        <CardPayment.Root className="mx-auto w-full">
          <CardPayment.Header className="py-0">
            {isRingkasanTransaksi
              ? "Ringkasan Transaksi"
              : "Ringkasan Pembayaran"}
          </CardPayment.Header>

          <CardPayment.Body className="mt-6">
            {/* Main content area with bottom border */}
            <div className="flex flex-col gap-6 border-neutral-400">
              <CardPayment.Section title="Biaya Pesan Jasa Angkut">
                <CardPayment.LineItem
                  label="Nominal Pesan Jasa Angkut (1 Unit)"
                  value={idrFormat(transportFee)}
                />
              </CardPayment.Section>

              {dataRingkasanPembayaran?.insuranceFee > 0 && (
                <CardPayment.Section title="Biaya Asuransi Barang">
                  <CardPayment.LineItem
                    label="Nominal Premi Asuransi (1 Unit)"
                    value={idrFormat(dataRingkasanPembayaran.insuranceFee)}
                  />
                </CardPayment.Section>
              )}

              <CardPayment.Section title="Biaya Layanan Tambahan">
                <CardPayment.LineItem
                  label="Nominal Kirim Bukti Fisik Penerimaan Barang"
                  labelClassName="w-[200px]"
                  value={idrFormat(dataRingkasanPembayaran.documentShippingFee)}
                >
                  <button
                    onClick={() => setDocumentShippingDetailOpen(true)}
                    className="text-xs font-semibold leading-tight text-primary-700"
                  >
                    Lihat Detail Pengiriman Dokumen
                  </button>
                </CardPayment.LineItem>
                <CardPayment.LineItem
                  label="Nominal Bantuan Tambahan"
                  value={idrFormat(
                    dataRingkasanPembayaran.otherAdditionalService?.totalPrice
                  )}
                />
              </CardPayment.Section>

              {dataRingkasanPembayaran?.voucherDiscount > 0 && (
                <CardPayment.Section title="Diskon Voucher">
                  <CardPayment.LineItem
                    label="Voucher (DISKONPENGGUNABARU)"
                    variant="danger"
                    value={`-${idrFormat(
                      dataRingkasanPembayaran.voucherDiscount
                    )}`}
                  />
                </CardPayment.Section>
              )}
            </div>
            <hr className="my-6" />
            {/* 'Biaya Lainnya' Section */}
            <div className="flex flex-col gap-6">
              <CardPayment.Section title="Biaya Lainnya">
                <CardPayment.LineItem
                  label="Admin Layanan"
                  value={idrFormat(dataRingkasanPembayaran.adminFee)}
                />
                <CardPayment.LineItem
                  label="Pajak"
                  variant="danger"
                  value={`-${idrFormat(dataRingkasanPembayaran.tax)}`}
                />
              </CardPayment.Section>
            </div>
          </CardPayment.Body>
        </CardPayment.Root>
      </div>

      {/* Bottomsheet Detail Pengiriman Dokumen */}
      <BottomsheetDetailPengirimanDokumen
        open={isDocumentShippingDetailOpen}
        onOpenChange={setDocumentShippingDetailOpen}
        documentShippingDetail={{
          recipientName: "Cakra",
          recipientPhone: "081249088083",
          fullAddress: "Jl. Sudirman No. 123, Jakarta Pusat",
          detailAddress: "Gedung ABC Lantai 5",
          district: "Tanah Abang",
          city: "Jakarta Pusat",
          province: "DKI Jakarta",
          postalCode: "10270",
          courier: "JNE",
          courierPrice: 200000,
          insurancePrice: 10000,
          totalPrice: 210000,
        }}
      />
    </>
  );
};

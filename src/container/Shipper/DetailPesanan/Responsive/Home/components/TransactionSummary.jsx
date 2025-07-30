import { useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import CardPayment from "@/components/Card/CardPayment";
import { useTranslation } from "@/hooks/use-translation";
import { idrFormat } from "@/lib/utils/formatters";

// Dummy components and data for completion
const ModalDetailPengirimanDokumen = ({ dataRingkasanPembayaran }) => <div />;
const ModalDetailWaktuTunggu = ({ driver }) => <div />;
const ModalDetailOverloadMuatan = ({ dataRingkasanPembayaran }) => <div />;

// Dummy data for demonstration
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

  const expiredAt = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();
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
      <BottomSheet
        open={isDocumentShippingDetailOpen}
        onOpenChange={setDocumentShippingDetailOpen}
      >
        <BottomSheetContent>
          <BottomSheetHeader>
            {t("Detail Pengiriman Dokumen")}
          </BottomSheetHeader>

          <div className="my-6 mr-1 h-[68vh] overflow-y-auto px-4 text-xs text-neutral-900">
            <div className="divide-y divide-neutral-200">
              {/* Recipient Info Section */}
              <div className="py-4 first:pt-0">
                <h3 className="mb-2 font-semibold">{t("Nama Penerima")}</h3>
                <p className="font-medium text-neutral-600">
                  {shippingData.recipientName}
                </p>
              </div>

              <div className="py-4">
                <h3 className="mb-2 font-semibold">
                  {t("Nomor Handphone Penerima")}
                </h3>
                <p className="font-medium text-neutral-600">
                  {shippingData.recipientPhone}
                </p>
              </div>

              {/* Address Info Section */}
              <div className="py-4">
                <h3 className="mb-2 font-semibold">{t("Alamat Tujuan")}</h3>
                <p className="font-medium text-neutral-600">
                  {shippingData.fullAddress}
                </p>
              </div>

              <div className="py-4">
                <h3 className="mb-2 font-semibold">
                  {t("Detail Alamat Tujuan")}
                </h3>
                <p className="font-medium text-neutral-600">
                  {shippingData.detailAddress}
                </p>
              </div>

              <div className="py-4">
                <h3 className="mb-2 font-semibold">{t("Kecamatan")}</h3>
                <p className="font-medium text-neutral-600">
                  {shippingData.district}
                </p>
              </div>

              <div className="py-4">
                <h3 className="mb-2 font-semibold">{t("Kabupaten/Kota")}</h3>
                <p className="font-medium text-neutral-600">
                  {shippingData.city}
                </p>
              </div>

              <div className="py-4">
                <h3 className="mb-2 font-semibold">{t("Provinsi")}</h3>
                <p className="font-medium text-neutral-600">
                  {shippingData.province}
                </p>
              </div>

              <div className="py-4">
                <h3 className="mb-2 font-semibold">{t("Kode Pos")}</h3>
                <p className="font-medium text-neutral-600">
                  {shippingData.postalCode}
                </p>
              </div>

              {/* Shipping Info Section */}
              <div className="py-4">
                <h3 className="mb-2 font-semibold">{t("Nama Ekspedisi")}</h3>
                <p className="font-medium text-neutral-600">
                  {shippingData.courier}
                </p>
              </div>
              <div className="py-4 last:pb-0">
                <h3 className="mb-2 font-semibold">
                  {t("Asuransi Pengiriman")}
                </h3>
                <p className="font-medium text-neutral-600">
                  {idrFormat(shippingData.insurancePrice)}
                </p>
              </div>
            </div>
          </div>
        </BottomSheetContent>
      </BottomSheet>
    </>
  );
};

import { useState } from "react";

import {
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/BottomSheet/BottomSheetUp";
import CardPayment from "@/components/Card/CardPayment";
import { useTranslation } from "@/hooks/use-translation";
import { idrFormat } from "@/lib/utils/formatters";

import { BottomsheetDetailPengirimanDokumen } from "./Popup/BottomsheetDetailPengirimanDokumen";

export const TransactionSummary = ({ dataRingkasanPembayaran }) => {
  const isRingkasanTransaksi = true;
  const { t } = useTranslation();

  const [isDocumentShippingDetailOpen, setDocumentShippingDetailOpen] =
    useState(false);
  if (!dataRingkasanPembayaran) return null;
  console.log(dataRingkasanPembayaran, "data");
  const {
    transportFee = 0,
    insuranceFee = 0,
    documentShippingDetail = null,
    otherAdditionalService = { totalPrice: 0 },
    voucherDiscount = 0,
    adminFee = 0,
    taxAmount = 0,
    totalPrice = 0,
    totalTruckUnit = 1,
  } = dataRingkasanPembayaran;

  const documentShippingFee = documentShippingDetail?.totalPrice || 0;

  // Use the data from props
  const shippingData = documentShippingDetail;
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
                  label={`Nominal Pesan Jasa Angkut (${totalTruckUnit} Unit)`}
                  value={idrFormat(transportFee)}
                />
              </CardPayment.Section>

              {insuranceFee > 0 && (
                <CardPayment.Section title="Biaya Asuransi Barang">
                  <CardPayment.LineItem
                    label={`Nominal Premi Asuransi (${totalTruckUnit} Unit)`}
                    value={idrFormat(insuranceFee)}
                  />
                </CardPayment.Section>
              )}

              {(documentShippingFee > 0 ||
                otherAdditionalService?.totalPrice > 0) && (
                <CardPayment.Section title="Biaya Layanan Tambahan">
                  {documentShippingFee > 0 && (
                    <CardPayment.LineItem
                      label="Nominal Kirim Bukti Fisik Penerimaan Barang"
                      labelClassName="w-[200px]"
                      value={idrFormat(documentShippingFee)}
                    >
                      <button
                        onClick={() => setDocumentShippingDetailOpen(true)}
                        className="text-xs font-semibold leading-tight text-primary-700"
                      >
                        Lihat Detail Pengiriman Dokumen
                      </button>
                    </CardPayment.LineItem>
                  )}
                  {otherAdditionalService?.totalPrice > 0 && (
                    <CardPayment.LineItem
                      label="Nominal Bantuan Tambahan"
                      value={idrFormat(otherAdditionalService.totalPrice)}
                    />
                  )}
                </CardPayment.Section>
              )}

              {voucherDiscount > 0 && (
                <CardPayment.Section title="Diskon Voucher">
                  <CardPayment.LineItem
                    label="Voucher (DISKONPENGGUNABARU)"
                    variant="danger"
                    value={`-${idrFormat(voucherDiscount)}`}
                  />
                </CardPayment.Section>
              )}
            </div>
            <hr className="my-6" />
            {/* 'Biaya Lainnya' Section */}
            <div className="flex flex-col gap-6">
              <CardPayment.Section title="Biaya Lainnya">
                {adminFee > 0 && (
                  <CardPayment.LineItem
                    label="Admin Layanan"
                    value={idrFormat(adminFee)}
                  />
                )}
                {taxAmount !== 0 && (
                  <CardPayment.LineItem
                    label="Pajak"
                    variant={taxAmount < 0 ? "danger" : "default"}
                    value={
                      taxAmount < 0
                        ? `-${idrFormat(Math.abs(taxAmount))}`
                        : idrFormat(taxAmount)
                    }
                  />
                )}
              </CardPayment.Section>
            </div>

            {/* Total section with top border */}
            <div className="mt-6 border-t border-neutral-200 pt-6">
              <CardPayment.LineItem
                label="Total Pembayaran"
                variant="total"
                value={idrFormat(totalPrice)}
              />
            </div>
          </CardPayment.Body>
        </CardPayment.Root>
      </div>

      {/* Bottomsheet Detail Pengiriman Dokumen */}
      <BottomsheetDetailPengirimanDokumen
        open={isDocumentShippingDetailOpen}
        onOpenChange={setDocumentShippingDetailOpen}
      >
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetClose />
            <BottomSheetTitle>
              {t("Detail Pengiriman Dokumen")}
            </BottomSheetTitle>
          </BottomSheetHeader>

          <div className="mr-1 h-[68vh] overflow-y-auto pb-6 pl-4 pr-3 text-xs text-neutral-900">
            {shippingData ? (
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
            ) : (
              <div className="py-4 text-center text-neutral-500">
                {t("Data pengiriman dokumen tidak tersedia")}
              </div>
            )}
          </div>
        </BottomSheetContent>
      </BottomsheetDetailPengirimanDokumen>
    </>
  );
};

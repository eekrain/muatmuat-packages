import { useState } from "react";

import CardPayment from "@/components/Card/CardPayment";

import { useTranslation } from "@/hooks/use-translation";

import { idrFormat } from "@/lib/utils/formatters";

import { BottomsheetDetailPengirimanDokumen } from "./Popup/BottomsheetDetailPengirimanDokumen";

export const TransactionSummary = ({
  dataRingkasanPembayaran,
  documentShippingDetail,
}) => {
  const { t } = useTranslation();
  const isRingkasanTransaksi = true;

  const [isDocumentShippingDetailOpen, setDocumentShippingDetailOpen] =
    useState(false);
  const documentShippingFee = documentShippingDetail?.totalPrice || 0;
  const shippingData = documentShippingDetail;

  if (!dataRingkasanPembayaran) return null;

  const {
    transportFee = 0,
    insuranceFee = 0,
    otherAdditionalService = { totalPrice: 0 },
    voucher = null,
    adminFee = 0,
    taxAmount = 0,
    totalPrice = 0,
    totalTruckUnit = 1,
  } = dataRingkasanPembayaran;

  // Use the data from props
  return (
    <>
      <div className="bg-white px-4 py-5">
        <CardPayment.Root className="mx-auto w-full">
          <CardPayment.Header className="py-0">
            {isRingkasanTransaksi
              ? t(
                  "TransactionSummary.headerTransaction",
                  {},
                  "Ringkasan Transaksi"
                )
              : t(
                  "TransactionSummary.headerPayment",
                  {},
                  "Ringkasan Pembayaran"
                )}
          </CardPayment.Header>

          <CardPayment.Body className="mt-6">
            {/* Main content area with bottom border */}
            <div className="flex flex-col gap-6 border-neutral-400">
              <CardPayment.Section
                title={t(
                  "TransactionSummary.transportFeeTitle",
                  {},
                  "Biaya Pesan Jasa Angkut"
                )}
              >
                <CardPayment.LineItem
                  label={t(
                    "TransactionSummary.transportFeeLabel",
                    { totalTruckUnit },
                    `Nominal Pesan Jasa Angkut<br/>(${totalTruckUnit} Unit)`
                  )}
                  value={idrFormat(transportFee)}
                />
              </CardPayment.Section>

              {insuranceFee > 0 && (
                <CardPayment.Section
                  title={t(
                    "TransactionSummary.insuranceFeeTitle",
                    {},
                    "Biaya Asuransi Barang"
                  )}
                >
                  <CardPayment.LineItem
                    label={t(
                      "TransactionSummary.insuranceFeeLabel",
                      { totalTruckUnit },
                      `Nominal Premi Asuransi (${totalTruckUnit} Unit)`
                    )}
                    value={idrFormat(insuranceFee)}
                  />
                </CardPayment.Section>
              )}

              {(documentShippingFee > 0 ||
                otherAdditionalService?.totalPrice > 0) && (
                <CardPayment.Section
                  title={t(
                    "TransactionSummary.additionalServiceTitle",
                    {},
                    "Biaya Layanan Tambahan"
                  )}
                >
                  {documentShippingFee > 0 && (
                    <CardPayment.LineItem
                      label={t(
                        "TransactionSummary.documentShippingLabel",
                        {},
                        "Nominal Kirim Bukti Fisik Penerimaan Barang"
                      )}
                      labelClassName="w-[200px]"
                      value={idrFormat(documentShippingFee)}
                    >
                      <button
                        onClick={() => setDocumentShippingDetailOpen(true)}
                        className="text-xs font-semibold leading-tight text-primary-700"
                      >
                        {t(
                          "TransactionSummary.viewDocumentShippingDetail",
                          {},
                          "Lihat Detail Pengiriman Dokumen"
                        )}
                      </button>
                    </CardPayment.LineItem>
                  )}
                  {otherAdditionalService?.totalPrice > 0 && (
                    <CardPayment.LineItem
                      label={t(
                        "TransactionSummary.otherAdditionalServiceLabel",
                        {},
                        "Nominal Bantuan Tambahan"
                      )}
                      value={idrFormat(otherAdditionalService.totalPrice)}
                    />
                  )}
                </CardPayment.Section>
              )}

              {(voucher?.discount ?? 0) > 0 && (
                <CardPayment.Section
                  title={t(
                    "TransactionSummary.voucherDiscountTitle",
                    {},
                    "Diskon Voucher"
                  )}
                >
                  <CardPayment.LineItem
                    label={`Voucher (${voucher?.code ?? ""})`}
                    variant="danger"
                    value={`-${idrFormat(voucher?.discount ?? 0)}`}
                  />
                </CardPayment.Section>
              )}
            </div>
            <hr className="my-6" />
            {/* 'Biaya Lainnya' Section */}
            <div className="flex flex-col gap-6">
              <CardPayment.Section
                title={t(
                  "TransactionSummary.otherFeesTitle",
                  {},
                  "Biaya Lainnya"
                )}
              >
                {adminFee > 0 && (
                  <CardPayment.LineItem
                    label={t(
                      "TransactionSummary.adminServiceLabel",
                      {},
                      "Admin Layanan"
                    )}
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
                label={t(
                  "TransactionSummary.totalPaymentLabel",
                  {},
                  "Total Pembayaran"
                )}
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
        documentShippingDetail={shippingData}
      />
    </>
  );
};

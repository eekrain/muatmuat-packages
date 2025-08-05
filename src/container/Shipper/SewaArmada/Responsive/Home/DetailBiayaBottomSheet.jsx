"use client";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/BottomSheet/BottomSheetUp";
import Button from "@/components/Button/Button";
import CardPayment from "@/components/Card/CardPayment";
import IconComponent from "@/components/IconComponent/IconComponent";
import { idrFormat } from "@/lib/utils/formatters";

// Using the project's standard formatter

/**
 * A controlled bottom sheet component to display a detailed breakdown of transaction costs.
 * It is now driven by props for state and data, and built using the reusable CardPayment component.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls if the bottom sheet is open.
 * @param {function} props.onOpenChange - Function to handle state changes.
 * @param {object} props.transactionData - Object containing cost details.
 * @param {object} props.selectedVoucher - Object with selected voucher info.
 * @param {number} props.voucherDiscount - The calculated discount amount.
 * @param {function} props.onContinue - Callback for the continue button.
 */
const DetailBiayaBottomSheet = ({
  isOpen,
  onOpenChange,
  transactionData,
  selectedVoucher,
  voucherDiscount,
  onContinue,
}) => {
  // Calculate the final total based on the provided data
  const finalTotal =
    (transactionData?.biayaPesanJasaAngkut || 0) +
    (transactionData?.biayaAsuransiBarang || 0) +
    (transactionData?.biayaLayananTambahan || 0) +
    (transactionData?.nominalBantuanTambahan || 0) +
    (transactionData?.adminLayanan || 0) +
    (transactionData?.pajak || 0) -
    (voucherDiscount || 0);

  // Return null if there's no data to display
  if (!transactionData) {
    return null;
  }

  return (
    <BottomSheet open={isOpen} onOpenChange={onOpenChange}>
      <BottomSheetContent className="flex max-h-[90vh] w-full flex-col p-0">
        {/* Header Section */}
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>Detail Biaya</BottomSheetTitle>
        </BottomSheetHeader>

        {/* Scrollable Body Section */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-6 border-b border-neutral-400 pb-6">
              <CardPayment.Section
                title="Biaya Pesan Jasa Angkut"
                className="gap-4"
              >
                <CardPayment.LineItem
                  label={"Nominal Pesan Jasa Angkut\n(1 Unit)"}
                  value={idrFormat(transactionData.biayaPesanJasaAngkut)}
                />
              </CardPayment.Section>

              <CardPayment.Section
                title="Biaya Asuransi Barang"
                className="gap-4"
              >
                <CardPayment.LineItem
                  label="Nominal Premi Asuransi (1 Unit)"
                  value={idrFormat(transactionData.biayaAsuransiBarang)}
                />
              </CardPayment.Section>

              <CardPayment.Section
                title="Biaya Layanan Tambahan"
                className="gap-4"
              >
                <CardPayment.LineItem
                  label="Nominal Kirim Bukti Fisik\nPenerimaan Barang"
                  value={idrFormat(transactionData.biayaLayananTambahan)}
                />
                <CardPayment.LineItem
                  label="Nominal Bantuan Tambahan"
                  value={idrFormat(transactionData.nominalBantuanTambahan)}
                />
              </CardPayment.Section>

              <CardPayment.Section title="Diskon Voucher" className="gap-4">
                <CardPayment.LineItem
                  label={"-"}
                  value={voucherDiscount > 0 ? idrFormat(voucherDiscount) : ""}
                  variant="danger"
                />
              </CardPayment.Section>
            </div>

            <div className="flex flex-col gap-4 border-b border-neutral-400 pb-6 pt-4">
              <CardPayment.Section title="Biaya Lainnya" className="gap-4">
                <CardPayment.LineItem
                  label="Admin Layanan"
                  value={idrFormat(transactionData.adminLayanan)}
                />
                <CardPayment.LineItem
                  label="Pajak"
                  value={idrFormat(transactionData.pajak)}
                />
              </CardPayment.Section>
            </div>

            {/* Conditionally render voucher status */}
            {selectedVoucher && (
              <div className="mt-2 flex items-center justify-between rounded-lg bg-primary-50 p-3">
                <div className="flex items-center gap-2">
                  <IconComponent
                    src="/icons/success-filled.svg"
                    className="h-5 w-5 text-primary-700"
                  />
                  <span className="text-xs font-medium text-primary-900">
                    1 Voucher Terpakai
                  </span>
                </div>
                <IconComponent
                  src="/icons/arrow-right.svg"
                  width={12}
                  height={12}
                />
              </div>
            )}
          </div>
        </div>
        <BottomSheetFooter>
          <CardPayment.Total
            label="Total Biaya"
            value={idrFormat(finalTotal)}
            variant="bottomsheet"
          />
          <Button
            variant="muatparts-primary"
            className="mt-4 h-10 w-full rounded-[20px] text-sm font-semibold leading-tight"
            onClick={() => {
              onOpenChange(false);
              if (onContinue) {
                onContinue();
              }
            }}
          >
            Lanjut
          </Button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default DetailBiayaBottomSheet;

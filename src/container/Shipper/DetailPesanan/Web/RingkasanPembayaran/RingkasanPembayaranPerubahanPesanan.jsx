import { useState } from "react";

import Button from "@/components/Button/Button";
import CardPayment from "@/components/Card/CardPayment";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from "@/components/Modal/Modal";
import { ModalOpsiPembayaran } from "@/components/Modal/ModalOpsiPembayaran";
import { useSWRHook } from "@/hooks/use-swr";
import { useTranslation } from "@/hooks/use-translation";
import { fetcherPayment } from "@/lib/axios";
import { idrFormat } from "@/lib/utils/formatters";

export const RingkasanPembayaranPerubahanPesanan = ({
  dataRingkasanPembayaran,
}) => {
  const { t } = useTranslation();

  // Fetch payment methods using SWR
  const { data: paymentMethodsData } = useSWRHook(
    "v1/payment/methods",
    fetcherPayment
  );

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);

  const priceChange = dataRingkasanPembayaran?.priceChange;
  const additionalCost = priceChange?.additionalCost;
  const penaltyFee = priceChange?.penaltyFee;
  const adminFee = priceChange?.adminFee;
  const taxAmount = priceChange?.taxAmount;
  const totalAdjustment = priceChange?.totalAdjustment;

  return (
    <div className="flex h-[453px] w-full flex-col gap-4">
      <CardPayment.Root className="flex w-full flex-col">
        <CardPayment.Header>
          {t(
            "RingkasanPembayaranPerubahanPesanan.headerDetailTambahanBiaya",
            {},
            "Detail Tambahan Biaya"
          )}
        </CardPayment.Header>

        <CardPayment.Body>
          <CardPayment.Section
            title={t(
              "RingkasanPembayaranPerubahanPesanan.sectionBiayaPerubahanRute",
              {},
              "Biaya Perubahan Rute"
            )}
          >
            <CardPayment.LineItem
              label={t(
                "RingkasanPembayaranPerubahanPesanan.labelSelisihJarakPerubahanLokasi",
                {},
                "Selisih Jarak Perubahan Lokasi Bongkar"
              )}
              value={idrFormat(additionalCost)}
            />
          </CardPayment.Section>

          <CardPayment.Section
            title={t(
              "RingkasanPembayaranPerubahanPesanan.sectionBiayaAdministrasi",
              {},
              "Biaya Administrasi"
            )}
          >
            <CardPayment.LineItem
              label={t(
                "RingkasanPembayaranPerubahanPesanan.labelAdminUbahPesanan",
                {},
                "Admin Ubah Pesanan"
              )}
              value={idrFormat(penaltyFee)}
            />
          </CardPayment.Section>

          <CardPayment.Section
            title={t(
              "RingkasanPembayaranPerubahanPesanan.sectionBiayaLainnya",
              {},
              "Biaya Lainnya"
            )}
          >
            <CardPayment.LineItem
              label={t(
                "RingkasanPembayaranPerubahanPesanan.labelAdminLayanan",
                {},
                "Admin Layanan"
              )}
              value={idrFormat(adminFee)}
            />
            <CardPayment.LineItem
              label={t(
                "RingkasanPembayaranPerubahanPesanan.labelPajak",
                {},
                "Pajak"
              )}
              value={idrFormat(taxAmount)}
            />
          </CardPayment.Section>
        </CardPayment.Body>

        <CardPayment.Footer className="mt-auto flex flex-col">
          <CardPayment.Total
            label={t(
              "RingkasanPembayaranPerubahanPesanan.labelTotalTambahanBiaya",
              {},
              "Total Tambahan<br/>Biaya"
            )}
            value={idrFormat(totalAdjustment)}
          />
          <ModalOpsiPembayaran
            paymentMethods={paymentMethodsData?.Data}
            selectedPaymentMethodId={selectedPaymentMethodId}
            onSelectedPaymentMethodId={setSelectedPaymentMethodId}
            className="mt-4"
          />
        </CardPayment.Footer>
      </CardPayment.Root>

      <ModalBatalkanPerubahanPesanan />
    </div>
  );
};

const ModalBatalkanPerubahanPesanan = () => {
  const { t } = useTranslation();

  return (
    <Modal>
      <ModalTrigger>
        <Button
          variant="muattrans-error-secondary"
          className="h-8 w-full"
          type="button"
        >
          {t(
            "RingkasanPembayaranPerubahanPesanan.buttonBatalkanPerubahan",
            {},
            "Batalkan Perubahan"
          )}
        </Button>
      </ModalTrigger>

      <ModalContent className="w-modal-small" type="muattrans">
        <ModalHeader size="small" />

        <div className="flex flex-col items-center gap-6 px-6 py-9 text-neutral-900">
          <h2 className="text-center text-base font-bold">
            {t(
              "RingkasanPembayaranPerubahanPesanan.modalTitleBatalkanPerubahan",
              {},
              "Batalkan Perubahan"
            )}
          </h2>

          <p className="text-center text-sm leading-[1.1]">
            {t(
              "RingkasanPembayaranPerubahanPesanan.modalDescriptionKonfirmasiBatal",
              {},
              "Apakah kamu yakin ingin membatalkan perubahan?"
            )}
            <br />
            <br />
            {t(
              "RingkasanPembayaranPerubahanPesanan.modalDescriptionKonsekuensiBatal",
              {},
              "Jika kamu melakukan pembatalan, kamu tidak dapat melakukan perubahan pesanan lagi"
            )}
          </p>

          <Button variant="muatparts-primary-secondary" className="w-[178px]">
            {t(
              "RingkasanPembayaranPerubahanPesanan.modalButtonBatalkanPerubahan",
              {},
              "Batalkan Perubahan"
            )}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

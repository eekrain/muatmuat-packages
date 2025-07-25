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
import { fetcherPayment } from "@/lib/axios";
import { idrFormat } from "@/lib/utils/formatters";

export const RingkasanPembayaranPerubahanPesanan = ({
  dataRingkasanPembayaran,
}) => {
  // Fetch payment methods using SWR
  const { data: paymentMethodsData } = useSWRHook(
    "v1/payment/methods",
    fetcherPayment
  );

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);

  return (
    <div className="flex h-[453px] w-full flex-col gap-4">
      <CardPayment.Root className="flex w-full flex-col">
        <CardPayment.Header>Detail Tambahan Biaya</CardPayment.Header>

        <CardPayment.Body>
          <CardPayment.Section title="Biaya Perubahan Rute">
            <CardPayment.LineItem
              label="Selisih Jarak Perubahan Lokasi Bongkar"
              value={idrFormat(150000)}
            />
          </CardPayment.Section>

          <CardPayment.Section title="Biaya Administrasi">
            <CardPayment.LineItem
              label="Admin Ubah Pesanan"
              value={idrFormat(50000)}
            />
          </CardPayment.Section>

          <CardPayment.Section title="Biaya Lainnya">
            <CardPayment.LineItem
              label="Admin Layanan"
              value={idrFormat(10000)}
            />
            <CardPayment.LineItem label="Pajak" value={idrFormat(10000)} />
          </CardPayment.Section>
        </CardPayment.Body>

        <CardPayment.Footer className="mt-auto flex flex-col">
          <CardPayment.Total
            label="Total Tambahan Biaya"
            value={idrFormat(250000)}
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
  return (
    <Modal>
      <ModalTrigger>
        <Button
          variant="muattrans-error-secondary"
          className="h-8 w-full"
          type="button"
        >
          Batalkan Perubahan
        </Button>
      </ModalTrigger>

      <ModalContent className="w-modal-small" type="muattrans">
        <ModalHeader size="small" />

        <div className="flex flex-col items-center gap-6 px-6 py-9 text-neutral-900">
          <h2 className="text-center text-base font-bold">
            Batalkan Perubahan
          </h2>

          <p className="text-center text-sm leading-[1.1]">
            Apakah kamu yakin ingin membatalkan perubahan?
            <br />
            <br />
            Jika kamu melakukan pembatalan, kamu tidak dapat melakukan perubahan
            pesanan lagi
          </p>

          <Button variant="muatparts-primary-secondary" className="w-[178px]">
            Batalkan Perubahan
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

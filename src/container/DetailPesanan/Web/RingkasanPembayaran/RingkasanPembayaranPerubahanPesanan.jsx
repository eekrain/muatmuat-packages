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
  const { data: paymentMethodsData, mutate: mutatePaymentMethods } = useSWRHook(
    "v1/payment/methods",
    fetcherPayment
  );

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);

  return (
    <div className="flex h-[453px] w-full flex-col gap-4">
      <CardPayment.Root className="w-full">
        <CardPayment.Header>Detail Tambahan Biaya</CardPayment.Header>

        <CardPayment.Content noScroll>
          <CardPayment.ContainerItem title="Biaya Perubahan Rute">
            <CardPayment.Item
              label="Selisih Jarak Perubahan Lokasi Bongkar"
              value={idrFormat(150000)}
            />
          </CardPayment.ContainerItem>

          <CardPayment.ContainerItem title="Biaya Administrasi">
            <CardPayment.Item
              label="Admin Ubah Pesanan"
              value={idrFormat(50000)}
              className="h-auto"
            />
          </CardPayment.ContainerItem>

          <CardPayment.ContainerItem title="Biaya Lainnya">
            <div className="flex flex-col gap-1">
              <CardPayment.Item
                label="Admin Layanan"
                value={idrFormat(10000)}
              />

              <CardPayment.Item label="Pajak" value={idrFormat(10000)} />
            </div>
          </CardPayment.ContainerItem>
        </CardPayment.Content>

        <CardPayment.FooterTotal
          label="Total Tambahan Biaya"
          value={idrFormat(250000)}
          className="gap-20"
        >
          <ModalOpsiPembayaran
            paymentMethods={paymentMethodsData?.Data}
            selectedPaymentMethodId={selectedPaymentMethodId}
            onSelectedPaymentMethodId={setSelectedPaymentMethodId}
            className="mt-6"
          />
        </CardPayment.FooterTotal>
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

      <ModalContent className="w-modal-small">
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

          <Button variant="muatparts-primary-secondary" className="w-[178px]]">
            Batalkan Perubahan
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

import { useState } from "react";

import CardPayment from "@/components/Card/CardPayment";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import { ModalDetailWaktuTunggu } from "@/components/Modal/ModalDetailWaktuTunggu";
import { ModalOpsiPembayaran } from "@/components/Modal/ModalOpsiPembayaran";
import { useSWRHook } from "@/hooks/use-swr";
import { fetcherPayment } from "@/lib/axios";
import { idrFormat } from "@/lib/utils/formatters";

export const RingkasanPembayaranTambahanBiaya = ({
  dataRingkasanPembayaran,
}) => {
  // Fetch payment methods using SWR
  const { data: paymentMethodsData, mutate: mutatePaymentMethods } = useSWRHook(
    "v1/payment/methods",
    fetcherPayment
  );

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);

  return (
    <div className="flex w-full flex-col gap-4">
      <CardPayment.Root className="w-full">
        <CardPayment.Header>Detail Tambahan Biaya</CardPayment.Header>

        <CardPayment.Content>
          <CardPayment.ContainerItem title="Biaya Waktu Tunggu">
            <CardPayment.Item
              label="Nominal Waktu Tunggu (1 Driver)"
              value={idrFormat(200000)}
            />
            <ModalDetailWaktuTunggu
              driver={{
                name: "Daffa Toldo",
                detail: "Lokasi Muat 1 : 1 Jam 59 Menit",
                startDate: "22 Nov 2024 15:00 WIB",
                endDate: "22 Nov 2024 16:59 WIB",
                totalPrice: "Rp100.000",
              }}
            />
          </CardPayment.ContainerItem>

          <CardPayment.ContainerItem title="Biaya Overload Muatan">
            <CardPayment.Item
              label="Nominal Overload Muatan (2.000 kg)"
              value={idrFormat(100000)}
              className="h-auto"
            />
            <ModalDetailOverloadMuatan
              dataRingkasanPembayaran={dataRingkasanPembayaran}
            />
          </CardPayment.ContainerItem>

          <CardPayment.ContainerItem title="Biaya Lainnya">
            <CardPayment.Item label="Admin Layanan" value={idrFormat(10000)} />
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
    </div>
  );
};

const ModalDetailOverloadMuatan = ({
  data = {
    driverName: "Noel Gallagher",
    amount: "Rp100.000",
    overloadWeight: "1.000 kg",
  },
}) => {
  return (
    <Modal closeOnOutsideClick>
      <ModalTrigger>
        <button
          type="button"
          className="text-[12px] font-medium leading-[14.4px] text-primary-700"
        >
          Lihat Detail Overload Muatan
        </button>
      </ModalTrigger>
      <ModalContent className="w-[578px]">
        <div className="w-[578px] p-6 text-xs font-medium leading-[1.2]">
          {/* Header */}
          <h2 className="text-center text-[16px] font-bold text-neutral-900">
            Detail Overload Muatan
          </h2>

          <div className="w-full">
            <div className="flex items-baseline justify-between">
              <span className="h-2.5 text-sm font-semibold text-neutral-900">
                Driver : {data.driverName}
              </span>

              <span className="h-2.5 text-right text-neutral-900">
                {data.amount}
              </span>
            </div>

            <span className="mt-3 block h-2 text-xs font-medium leading-[14.4px] text-neutral-600">
              Nominal Overload Muatan ({data.overloadWeight})
            </span>
          </div>

          <hr className="my-6 block" />

          <div className="flex items-center justify-between text-base font-bold text-neutral-900">
            <span className="">Total</span>
            <span className="">{data.amount}</span>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

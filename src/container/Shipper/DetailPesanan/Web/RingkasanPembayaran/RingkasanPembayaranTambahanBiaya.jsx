import { useState } from "react";

import CardPayment from "@/components/Card/CardPayment";
import { ModalDetailOverloadMuatan } from "@/components/Modal/ModalDetailOverloadMuatan";
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

        <CardPayment.Content noScroll>
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
    </div>
  );
};

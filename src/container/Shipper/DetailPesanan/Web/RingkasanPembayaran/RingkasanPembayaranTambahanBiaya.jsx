import { useState } from "react";

import CardPayment from "@/components/Card/CardPayment";
import { ModalDetailOverloadMuatan } from "@/components/Modal/ModalDetailOverloadMuatan";
import { ModalDetailWaktuTunggu } from "@/components/Modal/ModalDetailWaktuTunggu";
import { ModalOpsiPembayaran } from "@/components/Modal/ModalOpsiPembayaran";
import { useSWRHook } from "@/hooks/use-swr";
import { fetcherPayment } from "@/lib/axios";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
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
          {dataRingkasanPembayaran?.priceCharge?.waitingFee?.totalAmount &&
          dataRingkasanPembayaran?.priceCharge?.waitingFee?.totalAmount > 0 ? (
            <CardPayment.ContainerItem title="Biaya Waktu Tunggu">
              <CardPayment.Item
                label={`Nominal Waktu Tunggu (${dataRingkasanPembayaran?.priceCharge?.waitingFee?.totalDriver} Driver)`}
                value={idrFormat(
                  dataRingkasanPembayaran?.priceCharge?.waitingFee?.totalAmount
                )}
              />
              <ModalDetailWaktuTunggu />
            </CardPayment.ContainerItem>
          ) : null}

          {dataRingkasanPembayaran?.priceCharge?.overloadFee?.totalAmount &&
          dataRingkasanPembayaran?.priceCharge?.overloadFee?.totalAmount > 0 ? (
            <CardPayment.ContainerItem title="Biaya Overload Muatan">
              <CardPayment.Item
                label={`Nominal Overload Muatan (${Number(dataRingkasanPembayaran?.priceCharge?.overloadFee?.totalWeight).toLocaleString("id-ID")} ${dataRingkasanPembayaran?.priceCharge?.overloadFee?.weightUnit})`}
                value={idrFormat(
                  dataRingkasanPembayaran?.priceCharge?.overloadFee?.totalAmount
                )}
                className="h-auto"
              />
              <ModalDetailOverloadMuatan
                dataRingkasanPembayaran={dataRingkasanPembayaran}
              />
            </CardPayment.ContainerItem>
          ) : null}

          {Boolean(dataRingkasanPembayaran?.priceCharge?.adminFee) ||
          Boolean(dataRingkasanPembayaran?.priceCharge?.taxAmount) ? (
            <CardPayment.ContainerItem title="Biaya Lainnya">
              <div className="flex flex-col gap-1">
                <CardPayment.Item
                  label="Admin Layanan"
                  value={idrFormat(
                    dataRingkasanPembayaran?.priceCharge?.adminFee || 0
                  )}
                />

                <CardPayment.Item
                  label="Pajak"
                  value={idrFormat(
                    dataRingkasanPembayaran?.priceCharge?.taxAmount || 0
                  )}
                />
              </div>
            </CardPayment.ContainerItem>
          ) : null}
        </CardPayment.Content>

        <CardPayment.FooterTotal
          label="Total Tambahan Biaya"
          value={idrFormat(250000)}
          className="gap-20"
        >
          {dataRingkasanPembayaran?.orderStatus ===
            OrderStatusEnum.WAITING_REPAYMENT_1 && (
            <ModalOpsiPembayaran
              paymentMethods={paymentMethodsData?.Data}
              selectedPaymentMethodId={selectedPaymentMethodId}
              onSelectedPaymentMethodId={setSelectedPaymentMethodId}
              className="mt-6"
            />
          )}
        </CardPayment.FooterTotal>
      </CardPayment.Root>
    </div>
  );
};

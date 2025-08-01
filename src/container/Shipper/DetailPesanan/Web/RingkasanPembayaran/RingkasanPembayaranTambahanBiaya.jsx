import { useParams } from "next/navigation";
import { useState } from "react";

import CardPayment from "@/components/Card/CardPayment";
import { ModalDetailOverloadMuatan } from "@/components/Modal/ModalDetailOverloadMuatan";
import { ModalDetailWaktuTunggu } from "@/components/Modal/ModalDetailWaktuTunggu";
import { ModalOpsiPembayaran } from "@/components/Modal/ModalOpsiPembayaran";
import { useSWRHook } from "@/hooks/use-swr";
import { fetcherPayment } from "@/lib/axios";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { idrFormat } from "@/lib/utils/formatters";
import { useGetOverloadData } from "@/services/Shipper/detailpesanan/getOverloadData";
import { useGetWaitingTime } from "@/services/Shipper/detailpesanan/getWaitingTime";

export const RingkasanPembayaranTambahanBiaya = ({
  dataRingkasanPembayaran,
}) => {
  const params = useParams();
  // Fetch payment methods using SWR
  const { data: paymentMethodsData } = useSWRHook(
    "v1/payment/methods",
    fetcherPayment
  );
  const { data: waitingTimeRaw } = useGetWaitingTime(params.orderId);
  const { data: overloadData } = useGetOverloadData(params.orderId);
  console.log(waitingTimeRaw, "tes");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);

  // Transform waiting time data to match the expected structure
  // const transformedWaitingTime = waitingTimeRaw?.map((item) => {
  //   const waitingTimeHours = parseFloat(item.waitingTime);
  //   const formattedWaitingTime = waitingTimeHours >= 1
  //     ? `${waitingTimeHours} Jam`
  //     : `${Math.round(waitingTimeHours * 60)} Menit`;

  //   return {
  //     name: item.name,
  //     durasiTotal: formattedWaitingTime,
  //     data: [
  //       {
  //         detail: `${item.locationType === 'PICKUP' ? 'Lokasi Muat' : 'Lokasi Bongkar'} ${item.locationSequence} : ${formattedWaitingTime}`,
  //         startDate: item.startWaitingTime,
  //         endDate: item.endWaitingTime,
  //         totalPrice: item.waitingFee,
  //       },
  //     ],
  //   };
  // }) || [];

  // Transform overload data to match the expected structure
  // const transformedOverloadData = overloadData?.map((item) => ({
  //   driverName: item.name,
  //   amount: item.overloadFee,
  //   overloadWeight: `${item.weight.toLocaleString("id-ID")} ${item.weightUnit}`,
  // })) || [];

  const waitingFee = dataRingkasanPembayaran?.priceCharge?.waitingFee;
  const overloadFee = dataRingkasanPembayaran?.priceCharge?.overloadFee;
  const totalCharge = dataRingkasanPembayaran?.priceCharge?.totalCharge;
  const adminFee = dataRingkasanPembayaran?.priceCharge?.adminFee;
  const taxAmount = dataRingkasanPembayaran?.priceCharge?.taxAmount;
  return (
    <div className="flex w-full flex-col gap-4">
      <CardPayment.Root className="flex w-full flex-col">
        <CardPayment.Header>Detail Tambahan Biaya</CardPayment.Header>

        <CardPayment.Body>
          {waitingFee?.totalAmount > 0 && (
            <CardPayment.Section title="Biaya Waktu Tunggu">
              <CardPayment.LineItem
                label={`Nominal Waktu Tunggu (${waitingFee.totalDriver} Driver)`}
                value={idrFormat(waitingFee.totalAmount)}
              />
              <ModalDetailWaktuTunggu drivers={waitingTimeRaw} />
            </CardPayment.Section>
          )}

          {overloadFee?.totalAmount > 0 && (
            <CardPayment.Section title="Biaya Overload Muatan">
              <CardPayment.LineItem
                label={`Nominal Overload Muatan (${Number(
                  overloadFee.totalWeight
                ).toLocaleString("id-ID")} ${overloadFee.weightUnit})`}
                value={idrFormat(overloadFee.totalAmount)}
              />
              <ModalDetailOverloadMuatan drivers={overloadData} />
            </CardPayment.Section>
          )}

          {(adminFee || taxAmount) && (
            <CardPayment.Section title="Biaya Lainnya">
              <CardPayment.LineItem
                label="Admin Layanan"
                value={idrFormat(adminFee || 0)}
              />
              <CardPayment.LineItem
                label="Pajak"
                value={idrFormat(taxAmount || 0)}
              />
            </CardPayment.Section>
          )}
        </CardPayment.Body>

        <CardPayment.Footer className="mt-auto flex flex-col">
          <CardPayment.Total
            label="Total Tambahan Biaya"
            value={idrFormat(totalCharge || 0)}
          />
          {dataRingkasanPembayaran?.orderStatus ===
            OrderStatusEnum.WAITING_REPAYMENT_1 && (
            <ModalOpsiPembayaran
              paymentMethods={paymentMethodsData?.Data}
              selectedPaymentMethodId={selectedPaymentMethodId}
              onSelectedPaymentMethodId={setSelectedPaymentMethodId}
              className="mt-4"
            />
          )}
        </CardPayment.Footer>
      </CardPayment.Root>
    </div>
  );
};

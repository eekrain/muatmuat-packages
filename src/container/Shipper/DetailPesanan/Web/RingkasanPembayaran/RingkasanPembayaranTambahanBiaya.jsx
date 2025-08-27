import { useParams } from "next/navigation";
import { useState } from "react";

import { useGetOverloadData } from "@/services/Shipper/detailpesanan/getOverloadData";
import { useGetWaitingTime } from "@/services/Shipper/detailpesanan/getWaitingTime";

import CardPayment from "@/components/Card/CardPayment";
import { ModalDetailOverloadMuatan } from "@/components/Modal/ModalDetailOverloadMuatan";
import { ModalDetailWaktuTunggu } from "@/components/Modal/ModalDetailWaktuTunggu";
import { ModalOpsiPembayaran } from "@/components/Modal/ModalOpsiPembayaran";

import { useSWRHook, useSWRMutateHook } from "@/hooks/use-swr";

import { fetcherPayment } from "@/lib/axios";
import { OrderStatusEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import { idrFormat } from "@/lib/utils/formatters";

export const RingkasanPembayaranTambahanBiaya = ({
  dataRingkasanPembayaran,
  mutateDetailPesanan,
}) => {
  const params = useParams();
  // Fetch payment methods using SWR
  const { data: paymentMethodsData } = useSWRHook(
    "v1/payment/methods",
    fetcherPayment
  );
  const { data: waitingTimeData } = useGetWaitingTime(params.orderId);
  const { data: overloadData } = useGetOverloadData(params.orderId);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
  const { trigger: paymentProcess, isMutating: isLoading } = useSWRMutateHook(
    params.orderId ? `v1/orders/${params.orderId}/repayment-process` : null,
    "POST"
  );
  const handleLanjutPembayaran = async () => {
    if (!paymentProcess) return;

    try {
      const result = await paymentProcess({
        paymentMethodId: selectedPaymentMethodId,
        repaymentType: "CHARGE",
      });
      console.log("Pembayaran berhasil:", result);
      if (mutateDetailPesanan) {
        mutateDetailPesanan();
      }
    } catch (err) {
      console.error("Gagal lanjut pembayaran:", err);
      // toast.error("Terjadi kesalahan saat memproses pembayaran");
    }
  };
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
              {waitingTimeData && waitingTimeData.length > 0 && (
                <ModalDetailWaktuTunggu drivers={waitingTimeData} />
              )}
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
              {overloadData && overloadData.length > 0 && (
                <ModalDetailOverloadMuatan drivers={overloadData} />
              )}
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
              onProceedPayment={handleLanjutPembayaran}
              className="mt-4"
            />
          )}
        </CardPayment.Footer>
      </CardPayment.Root>
    </div>
  );
};

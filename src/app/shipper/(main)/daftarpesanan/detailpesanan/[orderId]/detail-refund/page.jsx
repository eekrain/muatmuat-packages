"use client";

import { useParams } from "next/navigation";

import DetailRefundPesananResponsive from "@/container/Shipper/DetailRefundPesanan/Responsive/DetailRefundPesananResponsive";
import DetailRefundPesananWeb from "@/container/Shipper/DetailRefundPesanan/Web/DetailRefundPesananWeb";
import useDevice from "@/hooks/use-device";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useGetRefundDetails } from "@/services/Shipper/detail-refund/getRefundDetails";
import { useGetWaitingTime } from "@/services/Shipper/detailpesanan/getWaitingTime";

export default function DetailRefundPage() {
  const params = useParams();
  const { isMobile } = useDevice();

  // Fetch refund details
  const { data: refundData } = useGetRefundDetails(params.orderId);

  const { data: waitingTimeRawData } = useGetWaitingTime(params.orderId);
  const waitingTimeRaw = useShallowMemo(
    () => waitingTimeRawData || [],
    [waitingTimeRawData]
  );

  if (isMobile) {
    return (
      <DetailRefundPesananResponsive
        refundData={refundData}
        waitingTimeRaw={waitingTimeRaw}
      />
    );
  }
  return (
    <DetailRefundPesananWeb
      refundData={refundData}
      waitingTimeRaw={waitingTimeRaw}
    />
  );
}

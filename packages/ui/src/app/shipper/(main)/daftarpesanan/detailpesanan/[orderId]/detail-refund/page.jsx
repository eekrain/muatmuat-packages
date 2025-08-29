"use client";

import { useParams } from "next/navigation";

import { useGetRefundDetails } from "@/services/Shipper/detail-refund/getRefundDetails";
import { useGetWaitingTime } from "@/services/Shipper/detailpesanan/getWaitingTime";

import DetailRefundPesananResponsive from "@/container/Shipper/DetailRefundPesanan/Responsive/DetailRefundPesananResponsive";
import DetailRefundPesananWeb from "@/container/Shipper/DetailRefundPesanan/Web/DetailRefundPesananWeb";

import useDevice from "@/hooks/use-device";

export default function DetailRefundPage() {
  const params = useParams();
  const { isMobile } = useDevice();

  // Fetch refund details
  const { data: refundData } = useGetRefundDetails(params.orderId);

  const { data: waitingTimeData } = useGetWaitingTime(params.orderId);

  if (isMobile) {
    return (
      <DetailRefundPesananResponsive
        refundData={refundData}
        waitingTimeData={waitingTimeData}
      />
    );
  }
  return (
    <DetailRefundPesananWeb
      refundData={refundData}
      waitingTimeData={waitingTimeData}
    />
  );
}

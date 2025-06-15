"use client";

import { useMemo } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Card, { CardContent } from "@/components/Card/Card";
import Stepper from "@/components/Stepper/Stepper";
import {
  ALL_ORDER_STATUS,
  ORDER_STATUS_TIMELINE_WITHOUT_ADDITIONAL_SERVICE,
  ORDER_STATUS_TIMELINE_WITH_ADDITIONAL_SERVICE,
} from "@/lib/constants/detailpesanan/detailpesanan.constants";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

import { AlertStatusPesanan } from "./AlertStatusPesanan";

// Header Component
const StatusPesananHeader = ({ orderCode, orderStatus }) => {
  const orderStatusLabel = useMemo(() => {
    return ALL_ORDER_STATUS.find((val) => val.status === orderStatus)?.label;
  }, [orderStatus]);

  const getVariantBadge = () => {
    if (orderStatus === OrderStatusEnum.PENDING_PAYMENT) return "warning";
    return "primary";
  };

  return (
    <div className="flex w-full items-center gap-x-3">
      {/* Kode Pesanan */}
      <div className="flex w-[220px] flex-col gap-y-2">
        <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
          Kode Pesanan
        </span>
        <span className="text-[14px] font-bold leading-[16.8px] text-neutral-900">
          {orderCode}
        </span>
      </div>

      {/* Status Pesanan */}
      <div className="flex flex-col gap-y-2">
        <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
          Status Pesanan
        </span>
        <div className="flex flex-row flex-wrap items-start gap-2">
          <BadgeStatusPesanan variant={getVariantBadge()} className="w-fit">
            {orderStatusLabel}
          </BadgeStatusPesanan>
        </div>
      </div>
    </div>
  );
};

/**
 * @typedef {Object} StatusPesananProps - Mengambil dari: src/lib/normalizers/detailpesanan/normalizeDetailPesananData.js
 * @property {string} orderCode - Kode Pesanan
 * @property {string} orderStatus - Status Pesanan
 * @property {boolean} withShippingAdditionalService - Apakah ada layanan tambahan
 */

/**
 * @param {Object} props
 * @param {StatusPesananProps} props.dataStatusPesanan
 */
const StatusPesanan = ({ dataStatusPesanan }) => {
  const stepperData = useMemo(() => {
    let timeline = null;
    if (dataStatusPesanan.withShippingAdditionalService) {
      timeline = ORDER_STATUS_TIMELINE_WITH_ADDITIONAL_SERVICE;
    } else {
      timeline = ORDER_STATUS_TIMELINE_WITHOUT_ADDITIONAL_SERVICE;
    }

    const activeIndex = timeline.findIndex(
      (step) => step.status === dataStatusPesanan.orderStatus
    );

    return {
      timeline,
      activeIndex,
    };
  }, [
    dataStatusPesanan.withShippingAdditionalService,
    dataStatusPesanan.orderStatus,
  ]);

  const isShowTimeline =
    dataStatusPesanan.orderStatus !== OrderStatusEnum.SEARCHING_FLEET &&
    dataStatusPesanan.orderStatus !== OrderStatusEnum.PENDING_PAYMENT;

  return (
    <>
      <AlertStatusPesanan
        orderStatus={dataStatusPesanan.orderStatus}
        paymentDueDateTime={dataStatusPesanan?.paymentDueDateTime}
      />
      <Card className="w-full rounded-xl border-none">
        <CardContent className="px-9 py-6">
          <div className="flex flex-col items-end gap-6">
            {/* Header Section */}
            <StatusPesananHeader
              orderCode={dataStatusPesanan.orderCode}
              orderStatus={dataStatusPesanan.orderStatus}
            />

            {/* Timeline Section */}
            {isShowTimeline && (
              <div className="w-full rounded-xl border border-neutral-400 px-4 py-5">
                <Stepper
                  steps={stepperData.timeline}
                  currentStep={stepperData.activeIndex}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default StatusPesanan;

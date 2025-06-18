"use client";

import { useMemo, useState } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Card, { CardContent } from "@/components/Card/Card";
import IconComponent from "@/components/IconComponent/IconComponent";
import LightboxTrigger, {
  LightboxProvider,
} from "@/components/Lightbox/Lighbox";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import Stepper from "@/components/Stepper/Stepper";
import {
  ALL_ORDER_STATUS,
  ORDER_STATUS_TIMELINE_WITHOUT_ADDITIONAL_SERVICE,
  ORDER_STATUS_TIMELINE_WITH_ADDITIONAL_SERVICE,
} from "@/lib/constants/detailpesanan/detailpesanan.constants";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

import DriverStatusCard from "./DriverStatusCard";

// Header Component
const StatusPesananHeader = ({ orderCode, orderStatus }) => {
  const [
    isDocumentDeliveryEvidenceModalOpen,
    setIsDocumentDeliveryEvidenceModalOpen,
  ] = useState(false);
  const orderStatusLabel = useMemo(() => {
    return ALL_ORDER_STATUS.find((val) => val.status === orderStatus)?.label;
  }, [orderStatus]);

  const getVariantBadge = () => {
    if (orderStatus === OrderStatusEnum.PENDING_PAYMENT) return "warning";
    return "primary";
  };

  const dummyPhoto = [
    "/img/muatan1.png",
    "/img/muatan2.png",
    "/img/muatan3.png",
    "/img/muatan4.png",
  ];

  return (
    <>
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
          <div className="flex items-center gap-x-2">
            <BadgeStatusPesanan variant={getVariantBadge()} className="w-fit">
              {orderStatusLabel}
            </BadgeStatusPesanan>
            {orderStatus === OrderStatusEnum.DOCUMENT_SHIPPING ? (
              <button
                className="flex items-center gap-x-1"
                onClick={() => setIsDocumentDeliveryEvidenceModalOpen(true)}
              >
                <span className="text-[12px] font-medium leading-[14.4px] text-primary-700">
                  Lihat Bukti Pengiriman
                </span>
                <IconComponent
                  src="/icons/chevron-right.svg"
                  className="icon-blue"
                />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Modal Bukti Pengiriman Dokumen */}
      <Modal
        closeOnOutsideClick={false}
        open={isDocumentDeliveryEvidenceModalOpen}
        onOpenChange={setIsDocumentDeliveryEvidenceModalOpen}
      >
        <ModalContent>
          <div className="flex w-[472px] flex-col gap-y-6 px-6 py-8">
            <h1 className="text-center text-[16px] font-bold leading-[19.2px] text-neutral-900">
              Bukti Pengiriman Dokumen
            </h1>
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-3">
                <span className="text-[12px] font-semibold leading-[14.4px] text-neutral-900">
                  Tanggal
                </span>
                <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                  04 Okt 2024 18:00 WIB
                </span>
              </div>
              <div className="flex flex-col gap-y-3">
                <span className="text-[12px] font-semibold leading-[14.4px] text-neutral-900">
                  Foto Bukti Pengiriman
                </span>
                <div className="flex items-center gap-x-4">
                  <LightboxProvider
                    images={dummyPhoto}
                    title="Foto Bukti Pengiriman"
                  >
                    {dummyPhoto.map((image, index) => (
                      <LightboxTrigger
                        key={image}
                        image={image}
                        alt={`Dokumen ${index + 1}`}
                        className="size-[56px]"
                        withZoom={true}
                      />
                    ))}
                  </LightboxProvider>
                </div>
              </div>
              {/* LOGIC BUAT ADA CATATAN ATAU TIDAK */}
              {true ? (
                <div className="flex flex-col gap-y-3">
                  <span className="text-[12px] font-semibold leading-[14.4px] text-neutral-900">
                    Catatan
                  </span>
                  <p className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                    Kami informasikan bahwa dokumen telah kami kirim dan saat
                    ini sudah diterima oleh Bapak Ervin Sudjatmiko. Mohon
                    konfirmasi apabila ada hal yang perlu ditindaklanjuti lebih
                    lanjut. Kami siap membantu apabila dibutuhkan klarifikasi
                    atau kelengkapan tambahan. Terima kasih atas perhatian dan
                    kerja samanya.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
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
  console.log("dataStatusPesanan", dataStatusPesanan);
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
  const showDriverStatuses = [
    OrderStatusEnum.LOADING_PROCESS,
    OrderStatusEnum.UNLOADING_PROCESS,
    OrderStatusEnum.DOCUMENT_PREPARATION,
    OrderStatusEnum.DOCUMENT_SHIPPING,
    OrderStatusEnum.COMPLETED,
  ];
  const isShowDriver = showDriverStatuses.includes(
    dataStatusPesanan.orderStatus
  );

  return (
    <>
      {/* <AlertStatusPesanan
        orderStatus={dataStatusPesanan.orderStatus}
        paymentDueDateTime={dataStatusPesanan?.paymentDueDateTime}
      /> */}
      <Card className="w-full rounded-xl border-none">
        <CardContent className="px-9 py-6">
          <div className="flex flex-col items-end gap-6">
            {/* Header Section */}
            <StatusPesananHeader
              orderCode={dataStatusPesanan.orderCode}
              orderStatus={dataStatusPesanan.orderStatus}
            />

            {/* Timeline Section */}
            {!isShowDriver ? (
              <DriverStatusCard stepperData={stepperData} />
            ) : (
              isShowTimeline && (
                <div className="flex w-full flex-col gap-y-5 rounded-xl border border-neutral-400 px-4 py-5">
                  <Stepper
                    steps={stepperData.timeline}
                    currentStep={stepperData.activeIndex}
                  />
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default StatusPesanan;

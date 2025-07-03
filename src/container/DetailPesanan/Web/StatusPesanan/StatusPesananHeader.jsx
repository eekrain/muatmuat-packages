import { useState } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import {
  OrderStatusEnum,
  OrderStatusTitle,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { formatDate } from "@/lib/utils/dateFormat";

const warningVariantStatus = [
  OrderStatusEnum.PREPARE_FLEET,
  OrderStatusEnum.WAITING_PAYMENT_1,
  OrderStatusEnum.WAITING_PAYMENT_2,
  OrderStatusEnum.WAITING_REPAYMENT_1,
  OrderStatusEnum.WAITING_REPAYMENT_2,
];

export const StatusPesananHeader = ({
  orderCode,
  orderStatus,
  cancellationHistory,
}) => {
  const [
    isDocumentDeliveryEvidenceModalOpen,
    setIsDocumentDeliveryEvidenceModalOpen,
  ] = useState(false);
  const orderStatusLabel = OrderStatusTitle[orderStatus];

  const dummyPhoto = [
    "/img/muatan1.png",
    "/img/muatan2.png",
    "/img/muatan3.png",
    "/img/muatan4.png",
  ];

  const statusVariant = warningVariantStatus.includes(orderStatus)
    ? "warning"
    : orderStatus.startsWith("CANCELED")
      ? "error"
      : orderStatus === OrderStatusEnum.COMPLETED
        ? "success"
        : "primary";

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
            <div className="flex items-center gap-5">
              <BadgeStatusPesanan variant={statusVariant} className="w-fit">
                {orderStatusLabel}
              </BadgeStatusPesanan>
              {orderStatus.startsWith("CANCELED") && cancellationHistory && (
                <Modal>
                  <ModalTrigger>
                    <button className="text-xs font-medium leading-[1.2] text-primary-700">
                      Lihat Alasan Pembatalan
                    </button>
                  </ModalTrigger>
                  <ModalContent>
                    <div className="relative flex w-[472px] flex-col items-start gap-[10px] rounded-xl bg-white px-6 py-8">
                      {/* Content Container */}
                      <div className="flex flex-row items-start gap-2">
                        <div className="flex flex-col items-center gap-6">
                          {/* Title */}
                          <h2 className="w-[424px] text-center text-[16px] font-bold leading-[19.2px] text-black">
                            Alasan Pembatalan
                          </h2>

                          {/* Details Section */}
                          <div className="flex flex-col items-start gap-4">
                            {/* Cancellation Time */}
                            <div className="flex w-[133px] flex-col items-start gap-3">
                              <div className="flex w-[105px] flex-row items-center gap-2">
                                <span className="text-[12px] font-semibold leading-[14.4px] text-black">
                                  Waktu Pembatalan
                                </span>
                              </div>
                              <span className="w-[133px] text-[12px] font-medium leading-[14.4px] text-neutral-600">
                                {formatDate(cancellationHistory.cancelledAt)}
                              </span>
                            </div>

                            {/* Cancelled By */}
                            <div className="flex w-[91px] flex-col items-start gap-3">
                              <div className="flex w-[91px] flex-row items-center gap-2">
                                <span className="text-[12px] font-semibold leading-[14.4px] text-black">
                                  Dibatalkan Oleh
                                </span>
                              </div>
                              <span className="w-11 text-[12px] font-medium leading-[14.4px] text-neutral-600">
                                {cancellationHistory.cancelledBy}
                              </span>
                            </div>

                            {/* Cancellation Reason */}
                            <div className="flex w-[424px] flex-col items-start gap-3">
                              <div className="flex w-[106px] flex-row items-center gap-2">
                                <span className="text-[12px] font-semibold leading-[14.4px] text-black">
                                  Alasan Pembatalan
                                </span>
                              </div>
                              <p className="w-[424px] text-[12px] font-medium leading-[14.4px] text-neutral-600">
                                {cancellationHistory.reason?.additionalInfo ||
                                  cancellationHistory.reason?.reasonName}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ModalContent>
                </Modal>
              )}
            </div>
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
                    image={dummyPhoto.length === 1 ? dummyPhoto[0] : undefined}
                    images={dummyPhoto.length > 1 ? dummyPhoto : undefined}
                    title="Foto Bukti Pengiriman"
                  >
                    {dummyPhoto.map((image, index) => (
                      <LightboxPreview
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

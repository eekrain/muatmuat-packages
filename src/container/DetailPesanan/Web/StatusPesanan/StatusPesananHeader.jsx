import { useMemo, useState } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import {
  OrderStatusEnum,
  OrderStatusTitle,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";

export const StatusPesananHeader = ({ orderCode, orderStatus }) => {
  const [
    isDocumentDeliveryEvidenceModalOpen,
    setIsDocumentDeliveryEvidenceModalOpen,
  ] = useState(false);
  const orderStatusLabel = useMemo(() => {
    return OrderStatusTitle[orderStatus];
  }, [orderStatus]);

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
            <BadgeStatusPesanan
              variant={
                orderStatus === OrderStatusEnum.WAITING_PAYMENT_1 ||
                orderStatus === OrderStatusEnum.WAITING_PAYMENT_2
                  ? "warning"
                  : "primary"
              }
              className="w-fit"
            >
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

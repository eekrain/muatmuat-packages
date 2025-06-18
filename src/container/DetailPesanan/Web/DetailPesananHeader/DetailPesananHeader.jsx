import { useState } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from "@/components/Modal/Modal";
import Slider from "@/components/Slider/Slider";
import DocumentReceivedModal from "@/container/DetailPesanan/Web/DetailPesananHeader/DocumentReceivedModal";
import DriverRatingModal from "@/container/DetailPesanan/Web/DetailPesananHeader/DriverRatingModal";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

const DetailPesananHeader = ({ dataStatusPesanan }) => {
  const slides = [
    {
      title: "Status Pesanan",
      imgSrc: "/img/detail-pesanan-first-time/1-status-pesanan.webp",
      content:
        "Label informasi mengenai status terkini dari pesanan yang anda lakukan.",
    },
    {
      title: "Ringkasan Status Pesanan",
      imgSrc: "/img/detail-pesanan-first-time/2-ringkasan-status-pesanan.webp",
      content:
        "Pantau perkembangan pesanan yang Anda lakukan, mulai dari proses muat, proses bongkar hingga pesanan selesai.",
    },
    {
      title: "Status Driver",
      imgSrc: "/img/detail-pesanan-first-time/3-status-driver.webp",
      content:
        "Pada bagian informasi driver, terdapat label Informasi mengenai status terkini yang sedang dijalankan oleh driver.",
    },
    {
      title: "Detail Status",
      imgSrc: "/img/detail-pesanan-first-time/4-detail-status.webp",
      content:
        // eslint-disable-next-line quotes
        'Pantau perkembangan status driver secara menyeluruh dengan mengakses menu \"Detail Status\" pada bagian informasi driver.',
    },
    {
      title: "QR Code Lokasi Muat / Bongkar",
      imgSrc: "/img/detail-pesanan-first-time/5-qr-code-lokasi.webp",
      content:
        "Saat driver akan melakukan proses muat atau bongkar, tunjukkan QR Code lokasi muat atau bongkar agar mereka bisa memindainya dan melanjutkan proses.",
    },
  ];

  const [isDocumentReceivedModalOpen, setIsDocumentReceivedModalOpen] =
    useState(false);
  const [isDriverRatingModalOpen, setIsDriverRatingModalOpen] = useState(false);

  const handleReceiveDocument = () => {
    // Hit API /base_url/v1/orders/{orderId}/document-received
    alert("Hit API /base_url/v1/orders/{orderId}/document-received");
    setIsDocumentReceivedModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <IconComponent src="/icons/arrow-left24.svg" size="medium" />
          <div className="ml-3 text-[20px] font-bold leading-[24px] text-neutral-900">
            Detail Pesanan
          </div>

          <Modal closeOnOutsideClick={false}>
            <ModalTrigger>
              <div className="ml-1">
                <IconComponent src="/icons/info16.svg" width={16} height={16} />
              </div>
            </ModalTrigger>
            <ModalContent className="w-modal-small">
              <ModalHeader size="small" />
              <div className="w-full px-6 py-9">
                <Slider
                  slides={slides}
                  onComplete={() => console.log("Slider completed!")}
                  onSlideChange={(index) =>
                    console.log("Current slide:", index)
                  }
                />
              </div>
            </ModalContent>
          </Modal>
        </div>
        <div className="flex items-center gap-x-3">
          <Button
            iconLeft="/icons/download16.svg"
            variant="muatparts-primary-secondary"
            className="h-8"
            onClick={() => {}}
            type="button"
          >
            Unduh
          </Button>
          <Button
            variant="muatparts-primary-secondary"
            className="h-8"
            onClick={() => {}}
            type="button"
          >
            Pesan Ulang
          </Button>
          {dataStatusPesanan?.orderStatus ===
          OrderStatusEnum.DOCUMENT_SHIPPING ? (
            <Button
              variant="muatparts-primary"
              className="h-8"
              onClick={() => setIsDocumentReceivedModalOpen(true)}
              type="button"
            >
              Dokumen Diterima
            </Button>
          ) : null}
          {dataStatusPesanan?.orderStatus !== OrderStatusEnum.COMPLETED ? (
            <Button
              variant="muatparts-primary"
              className="h-8"
              onClick={() => setIsDriverRatingModalOpen(true)}
              type="button"
            >
              Beri Ulasan
            </Button>
          ) : null}
        </div>
      </div>

      {/* Modal Konfirmasi Dokumen Diterima */}
      <DocumentReceivedModal
        isOpen={isDriverRatingModalOpen}
        setIsOpen={setIsDriverRatingModalOpen}
        onReceiveDocument={handleReceiveDocument}
      />

      <DriverRatingModal
        isOpen={isDriverRatingModalOpen}
        setIsOpen={setIsDriverRatingModalOpen}
      />
    </>
  );
};

export default DetailPesananHeader;

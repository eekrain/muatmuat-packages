import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from "@/components/Modal/Modal";
import Slider from "@/components/Slider/Slider";
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
  // Sample driver data
  const drivers = [
    {
      driverId: "uuid-driver-1",
      name: "Ahmad Rahman",
      phoneNumber: "081234567891",
      profileImage: "/img/avatar2.png",
      licensePlate: "B 1234 CD",
      hasReview: false,
      canReview: true,
      driverPerformance: {
        onTimePickup: true,
        onTimeDelivery: true,
        cargoCondition: "GOOD",
        communicationRating: "EXCELLENT",
      },
    },
    {
      driverId: "uuid-driver-2",
      name: "Budi Santoso",
      phoneNumber: "081234567892",
      profileImage: "/img/avatar2.png",
      licensePlate: "B 5678 EF",
      hasReview: true,
      canReview: false,
      reviewedAt: "2025-02-11T16:00:00Z",
      givenRating: 2,
      givenReview: "Driver lambat dalam mengirim barang",
    },
    {
      driverId: "uuid-driver-1",
      name: "Ahmad Rahman",
      phoneNumber: "081234567891",
      profileImage: "/img/avatar2.png",
      licensePlate: "B 1234 CD",
      hasReview: false,
      canReview: true,
      driverPerformance: {
        onTimePickup: true,
        onTimeDelivery: true,
        cargoCondition: "GOOD",
        communicationRating: "EXCELLENT",
      },
    },
    {
      driverId: "uuid-driver-2",
      name: "Budi Santoso",
      phoneNumber: "081234567892",
      profileImage: "/img/avatar2.png",
      licensePlate: "B 5678 EF",
      hasReview: true,
      canReview: false,
      reviewedAt: "2025-02-11T16:00:00Z",
      givenRating: 5,
      givenReview: "",
    },
  ];

  const router = useRouter();
  const [isDocumentReceivedModalOpen, setIsDocumentReceivedModalOpen] =
    useState(false);
  const [isReorderFleetModalOpen, setIsReorderFleetModalOpen] = useState(false);
  const [isDriverRatingModalOpen, setIsDriverRatingModalOpen] = useState(false);

  const handleReceiveDocument = () => {
    // Hit API /base_url/v1/orders/{orderId}/document-received
    alert("Hit API /base_url/v1/orders/{orderId}/document-received");
    setIsDocumentReceivedModalOpen(false);
  };

  const handleReorderFleet = (id) => {
    if (id) {
      alert("Pesan ulang");
    } else {
      router.push("/sewaarmada");
    }
    setIsReorderFleetModalOpen(false);
  };

  // Check if all drivers have been reviewed
  const areAllDriversReviewed = drivers.every(
    (driver) => driver.hasReview === true
  );

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
            onClick={() => setIsReorderFleetModalOpen(true)}
            type="button"
          >
            Pesan Ulang
          </Button>
          {dataStatusPesanan?.orderStatus !==
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
              {areAllDriversReviewed ? "Lihat Ulasan" : "Beri Ulasan"}
            </Button>
          ) : null}
        </div>
      </div>

      {/* Modal Konfirmasi Dokumen Diterima */}
      <ConfirmationModal
        isOpen={isDocumentReceivedModalOpen}
        setIsOpen={setIsDocumentReceivedModalOpen}
        title={{
          text: "Informasi",
        }}
        description={{
          text: 'Klik "Sudah", jika kamu sudah menerima bukti dokumen untuk menyelesaikan pesanan.',
        }}
        cancel={{
          text: "Belum",
        }}
        confirm={{
          text: "Sudah",
          onClick: handleReceiveDocument,
        }}
      />

      {/* Modal Pesan Ulang */}
      <ConfirmationModal
        isOpen={isReorderFleetModalOpen}
        setIsOpen={setIsReorderFleetModalOpen}
        description={{
          text: "Apakah kamu ingin menyalin pesanan ini untuk digunakan kembali atau membuat pesanan baru dengan detail yang berbeda?",
          className: "leading-[16.8px]",
        }}
        cancel={{
          text: "Pesan Baru",
          onClick: () => handleReorderFleet(),
        }}
        confirm={{
          text: "Pesan Ulang",
          onClick: () => handleReorderFleet(1),
        }}
      />

      <DriverRatingModal
        isOpen={isDriverRatingModalOpen}
        setIsOpen={setIsDriverRatingModalOpen}
        drivers={drivers}
      />
    </>
  );
};

export default DetailPesananHeader;

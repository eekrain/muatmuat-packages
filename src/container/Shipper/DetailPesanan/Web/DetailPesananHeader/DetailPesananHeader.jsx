import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import Button from "@/components/Button/Button";
import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from "@/components/Modal/Modal";
import PageTitle from "@/components/PageTitle/PageTitle";
import Slider from "@/components/Slider/Slider";
import DriverRatingModal from "@/container/Shipper/DetailPesanan/Web/DetailPesananHeader/DriverRatingModal";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { cn } from "@/lib/utils";

const ALLOW_LIST = {
  DetailRefund: [
    OrderStatusEnum.CANCELED_BY_SHIPPER,
    OrderStatusEnum.CANCELED_BY_SYSTEM,
    OrderStatusEnum.CANCELED_BY_TRANSPORTER,
  ],
  DetailPembayaran: [
    OrderStatusEnum.WAITING_PAYMENT_1,
    OrderStatusEnum.WAITING_PAYMENT_2,
  ],
  Unduh: "ALL",
  PesanUlang: "ALL",
  DokumenDiterima: [OrderStatusEnum.DOCUMENT_DELIVERY],
  BeriUlasan: [OrderStatusEnum.COMPLETED],
};

const DetailPesananHeader = ({ dataStatusPesanan }) => {
  const params = useParams();
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
      profileImage: "https://example.com/driver1.jpg",
      licensePlate: "B 1234 CD",
      canReview: true,
      reviewedAt: "",
      rating: 0,
      review: "",
    },
    {
      driverId: "uuid-driver-2",
      name: "Budi Santoso",
      phoneNumber: "081234567892",
      profileImage: "https://example.com/driver2.jpg",
      licensePlate: "B 5678 EF",
      canReview: false,
      reviewedAt: "2025-02-11T16:00:00Z",
      rating: 5,
      review: "Driver sangat baik dan profesional",
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

  const handleReorderFleet = (orderId) => {
    if (orderId) {
      router.push(`/sewaarmada?orderId=${orderId}`);
    } else {
      router.push("/sewaarmada");
    }
    setIsReorderFleetModalOpen(false);
  };

  // Check if all drivers have been reviewed
  const areAllDriversReviewed = drivers.every(
    (driver) => driver.canReview === true
  );

  const unduhMenu = [
    {
      label: "Unduh Bukti Pembayaran",
      onClick: () => {
        alert("Handle unduh bukti pembayaran");
      },
    },
    {
      label: "Unduh Dokumen Delivery Order",
      onClick: () => {
        alert("Handle unduh dokumen delivery order");
      },
    },
  ];

  const showButtonConfig = useMemo(() => {
    const config = {};

    if (
      ALLOW_LIST.DetailRefund.includes(dataStatusPesanan?.orderStatus) &&
      dataStatusPesanan?.hasFoundFleet
    ) {
      config.DetailRefund = true;
    }

    if (
      ALLOW_LIST.DetailPembayaran.includes(dataStatusPesanan?.orderStatus) &&
      dataStatusPesanan?.hasFoundFleet
    ) {
      config.DetailPembayaran = true;
    }

    if (
      ALLOW_LIST.Unduh === "ALL" &&
      dataStatusPesanan?.hasFoundFleet &&
      dataStatusPesanan?.orderStatus !== OrderStatusEnum.WAITING_PAYMENT_1 &&
      dataStatusPesanan?.orderStatus !== OrderStatusEnum.WAITING_PAYMENT_2
    ) {
      config.Unduh = true;
    }
    if (dataStatusPesanan?.orderStatus === OrderStatusEnum.SCHEDULED_FLEET) {
      config.Unduh = true;
    }

    if (
      ALLOW_LIST.PesanUlang === "ALL" &&
      dataStatusPesanan?.orderStatus !== OrderStatusEnum.WAITING_PAYMENT_1 &&
      dataStatusPesanan?.orderStatus !== OrderStatusEnum.WAITING_PAYMENT_2 &&
      !dataStatusPesanan?.orderStatus.includes("WAITING_REPAYMENT")
    ) {
      config.PesanUlang = true;
    }

    if (ALLOW_LIST.DokumenDiterima.includes(dataStatusPesanan?.orderStatus)) {
      config.DokumenDiterima = true;
    }

    if (ALLOW_LIST.BeriUlasan.includes(dataStatusPesanan?.orderStatus)) {
      config.BeriUlasan = true;
    }

    return config;
  }, [dataStatusPesanan?.hasFoundFleet, dataStatusPesanan?.orderStatus]);

  return (
    <>
      <div className="my-6 flex items-center justify-between">
        <PageTitle>
          <div className="inline-flex items-center gap-1">
            <span>Detail Pesanan</span>

            <Modal closeOnOutsideClick={false}>
              <ModalTrigger>
                <IconComponent src="/icons/info16.svg" width={16} height={16} />
              </ModalTrigger>
              <ModalContent className="w-modal-small">
                <ModalHeader size="small" />
                <div className="w-full px-6 py-9">
                  <Slider slides={slides} />
                </div>
              </ModalContent>
            </Modal>
          </div>
        </PageTitle>
        <div className="flex items-center gap-x-3">
          {showButtonConfig?.DetailRefund && (
            <Link
              href={`/daftarpesanan/detailpesanan/${params.orderId}/detail-refund`}
            >
              <Button
                variant="muatparts-primary-secondary"
                className="h-8"
                type="button"
              >
                Detail Refund
              </Button>
            </Link>
          )}
          {showButtonConfig?.DetailPembayaran && (
            <Button
              variant="muatparts-primary-secondary"
              className="h-8"
              type="button"
            >
              Detail Pembayaran
            </Button>
          )}
          {showButtonConfig?.Unduh && (
            <SimpleDropdown>
              <SimpleDropdownTrigger asChild>
                <Button
                  iconLeft="/icons/download16.svg"
                  variant="muatparts-primary-secondary"
                  className="h-8"
                  type="button"
                >
                  Unduh
                </Button>
              </SimpleDropdownTrigger>

              <SimpleDropdownContent className="w-[200px]">
                {unduhMenu.map((menu, key) => (
                  <SimpleDropdownItem key={key} onClick={menu.onClick}>
                    {menu.label}
                  </SimpleDropdownItem>
                ))}
              </SimpleDropdownContent>
            </SimpleDropdown>
          )}
          {showButtonConfig?.PesanUlang && (
            <Button
              variant={
                dataStatusPesanan?.orderStatus.startsWith("CANCELED") &&
                dataStatusPesanan?.hasFoundFleet
                  ? "muatparts-primary"
                  : "muatparts-primary-secondary"
              }
              className={cn(
                "h-8",
                !Boolean(dataStatusPesanan?.hasFoundFleet) &&
                  dataStatusPesanan?.orderStatus !==
                    OrderStatusEnum.SCHEDULED_FLEET
                  ? "w-[162px]"
                  : ""
              )}
              onClick={() => setIsReorderFleetModalOpen(true)}
              type="button"
            >
              Pesan Ulang
            </Button>
          )}
          {showButtonConfig?.DokumenDiterima && (
            <Button
              variant="muatparts-primary"
              className="h-8"
              onClick={() => setIsDocumentReceivedModalOpen(true)}
              type="button"
            >
              Dokumen Diterima
            </Button>
          )}
          {showButtonConfig?.BeriUlasan && (
            <Button
              variant="muatparts-primary"
              className="h-8"
              onClick={() => setIsDriverRatingModalOpen(true)}
              type="button"
            >
              {areAllDriversReviewed ? "Lihat Ulasan" : "Beri Ulasan"}
            </Button>
          )}
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
          // eslint-disable-next-line quotes
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
          onClick: () => handleReorderFleet(params.orderId),
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

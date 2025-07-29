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
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import DriverRatingModal from "@/container/Shipper/DetailPesanan/Web/DetailPesananHeader/DriverRatingModal";
import { useSWRMutateHook } from "@/hooks/use-swr";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useGetOrderDriverReviews } from "@/services/Shipper/detailpesanan/getOrderDriverReviews";

import { ModalDetailPembayaran } from "./ModalDetailPembayaran";
import { ModalInformasiSlider } from "./ModalInformasiSlider";

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

const DetailPesananHeader = ({
  dataStatusPesanan,
  dataRingkasanPembayaran,
  isShowWaitFleetAlert,
}) => {
  const params = useParams();
  // Sample driver data
  // const drivers = [
  //   {
  //     driverId: "uuid-driver-1",
  //     name: "Ahmad Rahman",
  //     phoneNumber: "081234567891",
  //     profileImage: "https://example.com/driver1.jpg",
  //     licensePlate: "B 1234 CD",
  //     canReview: true,
  //     reviewedAt: "",
  //     rating: 0,
  //     review: "",
  //   },
  //   {
  //     driverId: "uuid-driver-2",
  //     name: "Budi Santoso",
  //     phoneNumber: "081234567892",
  //     profileImage: "https://example.com/driver2.jpg",
  //     licensePlate: "B 5678 EF",
  //     canReview: false,
  //     reviewedAt: "2025-02-11T16:00:00Z",
  //     rating: 5,
  //     review: "Driver sangat baik dan profesional",
  //   },
  // ];
  const { data: driverReviewsData } = useGetOrderDriverReviews(params.orderId);
  const drivers = driverReviewsData?.drivers || [];
  const router = useRouter();
  const [isDocumentReceivedModalOpen, setIsDocumentReceivedModalOpen] =
    useState(false);
  const [isReorderFleetModalOpen, setIsReorderFleetModalOpen] = useState(false);
  const [isDriverRatingModalOpen, setIsDriverRatingModalOpen] = useState(false);

  const { trigger: autoComplete, isMutating: isAutoCompleteMutating } =
    useSWRMutateHook(
      params.orderId ? "/v1/orders/auto-complete" : null,
      "POST"
    );

  const { trigger: confirmDocumentReceived, isMutating: isConfirmingDocument } =
    useSWRMutateHook(
      params.orderId ? `v1/orders/${params.orderId}/document-received` : null,
      "POST"
    );

  const handleReceiveDocument = async () => {
    try {
      const result = await confirmDocumentReceived();

      if (
        result?.data?.Message?.Code == 200 ||
        result?.Message?.Code == 200 ||
        result?.data?.Message?.Code == 201 ||
        result?.Message?.Code == 201
      ) {
        toast.success("Dokumen berhasil dikonfirmasi diterima");
        setIsDocumentReceivedModalOpen(false);
        await autoComplete({});

        // Optionally refresh the page or update the order status
        // router.refresh();
      } else {
        // toast.error(result?.Message?.Text || "Gagal mengkonfirmasi dokumen");
      }
    } catch (error) {
      console.error("Error confirming document received:", error);
      toast.error("Terjadi kesalahan saat mengkonfirmasi dokumen");
    }
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
  const areAllDriversReviewed =
    drivers.length > 0 && drivers.every((driver) => driver.canReview === false);

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
      // ALLOW_LIST.DetailPembayaran.includes(dataStatusPesanan?.orderStatus) &&
      // dataStatusPesanan?.hasFoundFleet
      dataStatusPesanan?.hasPriceCharge
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataStatusPesanan?.hasFoundFleet, dataStatusPesanan?.orderStatus]);

  return (
    <>
      <div className="my-6 flex items-center justify-between">
        <PageTitle className="mb-0">
          <div className="inline-flex items-center gap-1">
            <span>Detail Pesanan</span>

            <ModalInformasiSlider />
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
            <ModalDetailPembayaran
              dataRingkasanPembayaran={dataRingkasanPembayaran}
              isShowWaitFleetAlert={isShowWaitFleetAlert}
            />
          )}
          {showButtonConfig?.Unduh && (
            <SimpleDropdown>
              <SimpleDropdownTrigger asChild>
                <Button
                  iconLeft="/icons/download16.svg"
                  variant="muatparts-primary-secondary"
                  className="h-8"
                  type="button"
                  appearance={{
                    iconClassName: "-mt-[4px] text-primary-700",
                  }}
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
          disabled: isConfirmingDocument,
        }}
        confirm={{
          text: "Sudah",
          onClick: handleReceiveDocument,
          disabled: isConfirmingDocument,
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

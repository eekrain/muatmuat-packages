import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Alert } from "@/components/Alert/Alert";
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
import { useTranslation } from "@/hooks/use-translation";
import { OrderStatusEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
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
  mutateDetailPesanan,
  refundInfo,
}) => {
  const { t } = useTranslation();
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

  const { trigger: confirmDocumentReceived, isMutating: isConfirmingDocument } =
    useSWRMutateHook(
      params.orderId ? `v1/orders/${params.orderId}/document-received` : null,
      "POST"
    );

  const handleReceiveDocument = async () => {
    try {
      const result = await confirmDocumentReceived();

      if (
        result?.data?.Message?.Code === 200 ||
        result?.Message?.Code === 200 ||
        result?.data?.Message?.Code === 201 ||
        result?.Message?.Code === 201
      ) {
        toast.success(
          t(
            "DetailPesananHeader.toastDokumenBerhasil",
            {},
            "Dokumen berhasil dikonfirmasi diterima"
          )
        );
        setIsDocumentReceivedModalOpen(false);
        // await autoComplete({});

        // Refresh order detail data using SWR mutate
        if (mutateDetailPesanan) {
          mutateDetailPesanan();
        }
      } else {
        // toast.error(result?.Message?.Text || "Gagal mengkonfirmasi dokumen");
      }
    } catch (error) {
      toast.error(
        t(
          "DetailPesananHeader.toastErrorKonfirmasi",
          {},
          "Terjadi kesalahan saat mengkonfirmasi dokumen"
        )
      );
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

  const isCancelled =
    dataStatusPesanan?.orderStatus === OrderStatusEnum.CANCELED_BY_SYSTEM ||
    dataStatusPesanan?.orderStatus === OrderStatusEnum.CANCELED_BY_SHIPPER ||
    dataStatusPesanan?.orderStatus === OrderStatusEnum.CANCELED_BY_TRANSPORTER;

  // Check if all drivers have been reviewed
  const areAllDriversReviewed =
    drivers.length > 0 && drivers.every((driver) => driver.canReview === false);

  const unduhMenu = [
    {
      label: t(
        "DetailPesananHeader.menuUnduhBuktiPembayaran",
        {},
        "Unduh Bukti Pembayaran"
      ),
      onClick: () => {
        alert("Handle unduh bukti pembayaran");
      },
    },
    {
      label: t(
        "DetailPesananHeader.menuUnduhDokumenDeliveryOrder",
        {},
        "Unduh Dokumen Delivery Order"
      ),
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
            <span>
              {t(
                "DetailPesananHeader.titleDetailPesanan",
                {},
                "Detail Pesanan"
              )}
            </span>

            <ModalInformasiSlider />
          </div>
        </PageTitle>
        <div className="flex items-center gap-x-3">
          {isCancelled &&
            refundInfo &&
            !showButtonConfig.DetailRefund && ( // Ensure button doesn't duplicate
              <Button
                variant="muatparts-primary"
                onClick={() =>
                  router.push(
                    `/shipper/detail-pesanan/${dataStatusPesanan?.orderId}/refund`
                  )
                }
              >
                Detail Refund
              </Button>
            )}
          {showButtonConfig?.DetailRefund && (
            <Link
              href={`/daftarpesanan/detailpesanan/${params.orderId}/detail-refund`}
            >
              <Button
                variant="muatparts-primary-secondary"
                className="h-8"
                type="button"
              >
                {t(
                  "DetailPesananHeader.buttonDetailRefund",
                  {},
                  "Detail Refund"
                )}
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
                  {t("DetailPesananHeader.buttonUnduh", {}, "Unduh")}
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
                !dataStatusPesanan?.hasFoundFleet &&
                  dataStatusPesanan?.orderStatus !==
                    OrderStatusEnum.SCHEDULED_FLEET
                  ? "w-[162px]"
                  : ""
              )}
              onClick={() => setIsReorderFleetModalOpen(true)}
              type="button"
            >
              {t("DetailPesananHeader.buttonPesanUlang", {}, "Pesan Ulang")}
            </Button>
          )}
          {showButtonConfig?.DokumenDiterima && (
            <Button
              variant="muatparts-primary"
              className="h-8"
              onClick={() => setIsDocumentReceivedModalOpen(true)}
              type="button"
            >
              {t(
                "DetailPesananHeader.buttonDokumenDiterima",
                {},
                "Dokumen Diterima"
              )}
            </Button>
          )}
          {showButtonConfig?.BeriUlasan && (
            <Button
              variant="muatparts-primary"
              className="h-8"
              onClick={() => setIsDriverRatingModalOpen(true)}
              type="button"
            >
              {areAllDriversReviewed
                ? t("DetailPesananHeader.buttonLihatUlasan", {}, "Lihat Ulasan")
                : t("DetailPesananHeader.buttonBeriUlasan", {}, "Beri Ulasan")}
            </Button>
          )}
        </div>
      </div>

      {refundInfo?.refundStatus === "REFUND_PROCESSING" && (
        <Alert
          variant="warning"
          className="mb-4"
          message="Pengembalian dana sedang dalam proses"
        />
      )}
      {refundInfo?.refundStatus === "REFUND_SUCCESS" && (
        <Alert
          variant="success"
          className="mb-4"
          message="Pengembalian dana berhasil"
        />
      )}

      {isShowWaitFleetAlert && (
        <Alert
          variant="warning"
          className="mb-4"
          message="Pesanan sedang menunggu armada."
        />
      )}

      {/* Modal Konfirmasi Dokumen Diterima */}
      <ConfirmationModal
        variant="muatparts"
        isOpen={isDocumentReceivedModalOpen}
        setIsOpen={setIsDocumentReceivedModalOpen}
        title={{
          text: t("DetailPesananHeader.modalTitleInformasi", {}, "Informasi"),
        }}
        description={{
          text: t(
            "DetailPesananHeader.modalDescriptionDokumenDiterima",
            {},
            'Klik "Sudah", jika kamu sudah menerima bukti dokumen untuk menyelesaikan pesanan.'
          ),
        }}
        cancel={{
          text: t("DetailPesananHeader.modalButtonBelum", {}, "Belum"),
          loading: isConfirmingDocument,
          disabled: isConfirmingDocument,
          classname: "bg-white text-primary-700 border-primary-700",
        }}
        confirm={{
          text: t(
            "DetailPesananHeader.modalButtonSudahMenerima",
            {},
            "Sudah Menerima"
          ),
          onClick: handleReceiveDocument,
          loading: isConfirmingDocument,
          disabled: isConfirmingDocument,
          classname: "bg-primary-700 text-white hover:bg-primary-700",
        }}
      />

      {/* Modal Pesan Ulang */}
      <ConfirmationModal
        variant="muatparts"
        isOpen={isReorderFleetModalOpen}
        setIsOpen={setIsReorderFleetModalOpen}
        description={{
          text: t(
            "DetailPesananHeader.modalDescriptionPesanUlang",
            {},
            "Apakah kamu ingin menyalin pesanan ini untuk digunakan kembali atau membuat pesanan baru dengan detail yang berbeda?"
          ),
          className: "leading-[16.8px]",
        }}
        cancel={{
          text: t("DetailPesananHeader.modalButtonPesanBaru", {}, "Pesan Baru"),
          onClick: () => handleReorderFleet(params.orderId),
        }}
        confirm={{
          text: t(
            "DetailPesananHeader.modalButtonPesanUlang",
            {},
            "Pesan Ulang"
          ),
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

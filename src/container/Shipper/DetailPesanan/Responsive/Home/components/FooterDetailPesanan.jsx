import { useParams, useRouter } from "next/navigation";
import { Fragment, useState } from "react";

import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import ConfirmationModalResponsive from "@/components/Modal/ConfirmationModalResponsive";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useSWRMutateHook } from "@/hooks/use-swr";
import { useTranslation } from "@/hooks/use-translation";
import { OrderStatusEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { toast } from "@/lib/toast";
import { idrFormat } from "@/lib/utils/formatters";
import { useGetDetailPesananData } from "@/services/Shipper/detailpesanan/getDetailPesananData";
import { useGetOrderDriverReviews } from "@/services/Shipper/detailpesanan/getOrderDriverReviews";
import { useSewaArmadaStore } from "@/store/Shipper/forms/sewaArmadaStore";

import { BottomsheetAlasanPembatalan } from "./Popup/BottomsheetAlasanPembatalan";
import CancelUpdateOrderModal from "./Popup/CancelUpdateOrderModal";
import { ModalBatalkanPesananResponsive } from "./Popup/ModalBatalkanPesananResponsive";
import { ModalKonfimasiBuktiDokumenDiterima } from "./Popup/ModalKonfimasiBuktiDokumenDiterima";

const LIST_SHOW_TOTAL_PRICE = [
  OrderStatusEnum.WAITING_PAYMENT_1,
  OrderStatusEnum.PREPARE_FLEET,
];

export const FooterDetailPesanan = ({
  dataStatusPesanan,
  dataRingkasanPembayaran,
  dataRingkasanPesanan,
  isConfirmWaiting,
  onConfirmWaitingChange,
  paymentMethods,
}) => {
  const { t } = useTranslation();
  const params = useParams();
  const navigation = useResponsiveNavigation();
  const router = useRouter();
  const paymentMethodId = useSewaArmadaStore(
    (state) => state.formValues.paymentMethodId
  );
  const { mutate } = useGetDetailPesananData(params.orderId);

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
        setReceiveDocumentEvidenceOpen(false);
        mutate();
      } else {
        // toast.error(result?.Message?.Text || "Gagal mengkonfirmasi dokumen");
      }
    } catch (error) {
      console.error("Error confirming document received:", error);
      toast.error(
        t(
          "DetailPesananHeader.toastErrorKonfirmasi",
          {},
          "Terjadi kesalahan saat mengkonfirmasi dokumen"
        )
      );
    }
  };

  // Find the selected payment method from the paymentMethods data
  const selectedPaymentMethod = paymentMethods
    ?.flatMap((category) => category.methods)
    .find((method) => method.id === paymentMethodId);

  const { trigger: confirmWaiting } = useSWRMutateHook(
    `v1/orders/${params.orderId}/waiting-confirmation`
  );

  // API hooks untuk payment dan repayment
  const { trigger: paymentProcess, isMutating: isPaymentLoading } =
    useSWRMutateHook(
      params.orderId ? `v1/orders/${params.orderId}/payment-process` : null,
      "POST"
    );

  const { trigger: repaymentProcess, isMutating: isRepaymentLoading } =
    useSWRMutateHook(
      params.orderId ? `v1/orders/${params.orderId}/repayment-process` : null,
      "POST"
    );

  const [isOpenModalBatalkanPesanan, setIsOpenModalBatalkanPesanan] =
    useState(false);
  const [
    isOpenBottomsheetAlasanPembatalan,
    setIsOpenBottomsheetAlasanPembatalan,
  ] = useState(false);
  const [isReceiveDocumentEvidenceOpen, setReceiveDocumentEvidenceOpen] =
    useState(false);

  const [isCancelUpdateOrderModal, setCancelUpdateOrderModal] = useState(false);

  // ================================================================================================
  // Pesan ulang
  // ================================================================================================
  const [isReorderFleetModalOpen, setIsReorderFleetModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const handleReorderFleet = (id) => {
    if (id) {
      router.push(`/sewaarmada?orderId=${id}`);
    } else {
      router.push("/sewaarmada");
    }
    setIsReorderFleetModalOpen(false);
    setSelectedOrderId(null);
  };

  const { data: driverReviewsData } = useGetOrderDriverReviews(params.orderId);
  const drivers = driverReviewsData?.drivers || [];

  const areAllDriversReviewed =
    drivers.length > 0 && drivers.every((driver) => driver.canReview === false);

  // Handler untuk pembayaran berdasarkan status
  const handleLanjutPembayaran = async () => {
    try {
      if (
        dataStatusPesanan?.orderStatus === OrderStatusEnum.WAITING_PAYMENT_1
      ) {
        // Gunakan payment-process untuk waiting payment 1
        const result = await paymentProcess({
          paymentMethodId: dataRingkasanPembayaran.paymentMethodId,
        });
        console.log("Payment process berhasil:", result);
      } else if (
        dataStatusPesanan?.orderStatus === OrderStatusEnum.WAITING_PAYMENT_3
      ) {
        // Gunakan repayment-process untuk waiting payment 3
        const result = await repaymentProcess({
          paymentMethodId: selectedPaymentMethod.id,
          repaymentType: "CHANGE",
        });
        console.log("Repayment process berhasil:", result);
      }
    } catch (err) {
      console.error("Gagal memproses pembayaran:", err);
      // Tambahkan error handling sesuai kebutuhan
    }
  };

  const renderButtons = useShallowMemo(() => {
    let components = [
      {
        id: "pesan-ulang",
        variant: "muatparts-primary",
        el: (variant) => (
          <Button
            variant={variant}
            className="h-10 w-full p-0"
            onClick={() => {
              setSelectedOrderId(params.orderId);
              setIsReorderFleetModalOpen(true);
            }}
            type="button"
          >
            {t("buttonPesanUlang")}
          </Button>
        ),
      },
    ];

    if (dataStatusPesanan?.orderStatus === OrderStatusEnum.COMPLETED) {
      components.push({
        id: "beri-ulasan",
        variant: "muatparts-primary",
        el: (variant) => (
          <Button
            variant={variant}
            className="h-10 w-full p-0"
            onClick={() => navigation.push("/ulasan")}
            type="button"
          >
            {areAllDriversReviewed
              ? t("FooterDetailPesanan.lihatUlasan", {}, "Lihat Ulasan")
              : t("FooterDetailPesanan.beriUlasan", {}, "Beri Ulasan")}
          </Button>
        ),
      });
    } else if (
      dataStatusPesanan?.orderStatus === OrderStatusEnum.DOCUMENT_DELIVERY
    ) {
      components.push({
        id: "dokumen-diterima",
        variant: "muatparts-primary",
        el: (variant) => (
          <Button
            variant={variant}
            className="h-10 w-full p-0"
            onClick={() => setReceiveDocumentEvidenceOpen(true)}
            type="button"
          >
            {t("FooterDetailPesanan.dokumenDiterima", {}, "Dokumen Diterima")}
          </Button>
        ),
      });
    } else if (
      dataStatusPesanan?.orderStatus === OrderStatusEnum.WAITING_PAYMENT_1
    ) {
      components = [
        {
          id: "batalkan-pesanan",
          variant: "muatparts-error-secondary",
          el: (variant) => (
            <Button
              variant={variant}
              className="h-10 w-full p-0"
              onClick={() => setIsOpenModalBatalkanPesanan(true)}
              type="button"
            >
              {t("FooterDetailPesanan.batalkanPesanan", {}, "Batalkan Pesanan")}
            </Button>
          ),
        },
        {
          id: "lanjut-pembayaran",
          variant: "muatparts-primary",
          el: (variant) => (
            <Button
              variant={variant}
              className="h-10 w-full p-0"
              onClick={handleLanjutPembayaran}
              disabled={isPaymentLoading || isRepaymentLoading}
              type="button"
            >
              {t(
                "FooterDetailPesanan.lanjutPembayaran",
                {},
                "Lanjut Pembayaran"
              )}
            </Button>
          ),
        },
      ];
    } else if (
      dataStatusPesanan?.orderStatus === OrderStatusEnum.WAITING_PAYMENT_2
    ) {
      components = [];
    } else if (
      dataStatusPesanan?.orderStatus === OrderStatusEnum.WAITING_PAYMENT_3
    ) {
      components = [
        {
          id: "batalkan-perubahan",
          variant: "muatparts-error-secondary",
          el: (variant) => (
            <Button
              variant={variant}
              className="h-10 w-full p-0"
              onClick={() => setCancelUpdateOrderModal(true)}
              type="button"
            >
              {t(
                "FooterDetailPesanan.batalkanPerubahan",
                {},
                "Batalkan Perubahan"
              )}
            </Button>
          ),
        },
        {
          id: "lanjut-pembayaran",
          variant: "muatparts-primary",
          el: (variant) => (
            <Button
              variant={variant}
              className="h-10 w-full p-0"
              onClick={handleLanjutPembayaran}
              type="button"
            >
              {t(
                "FooterDetailPesanan.lanjutPembayaran",
                {},
                "Lanjut Pembayaran"
              )}
            </Button>
          ),
        },
      ];
    } else if (
      dataStatusPesanan?.orderStatus === OrderStatusEnum.WAITING_PAYMENT_4
    ) {
      components.unshift({
        id: "batalkan-perubahan",
        variant: "muatparts-error-secondary",
        el: (variant) => (
          <Button
            variant={variant}
            className="h-10 w-full p-0"
            onClick={() => setCancelUpdateOrderModal(true)}
            type="button"
          >
            {t(
              "FooterDetailPesanan.batalkanPerubahan",
              {},
              "Batalkan Perubahan"
            )}
          </Button>
        ),
      });
    } else if (
      dataStatusPesanan?.orderStatus === OrderStatusEnum.WAITING_REPAYMENT_1
    ) {
      components = [
        {
          id: "lanjut-pembayaran",
          variant: "muatparts-primary",
          el: (variant) => (
            <Button
              variant={variant}
              className="h-10 w-full p-0"
              onClick={() => alert("Simpan")}
              type="button"
            >
              {t(
                "FooterDetailPesanan.lanjutPembayaran",
                {},
                "Lanjut Pembayaran"
              )}
            </Button>
          ),
        },
      ];
    }
    // Handle PREPARE_FLEET status with isConfirmWaiting condition
    else if (dataStatusPesanan?.orderStatus === OrderStatusEnum.PREPARE_FLEET) {
      if (isConfirmWaiting) {
        components = [
          {
            id: "batalkan-pesanan",
            variant: "muatparts-primary-secondary",
            el: (variant) => (
              <Button
                variant={variant}
                className="h-10 w-full p-0"
                onClick={() => setIsOpenModalBatalkanPesanan(true)}
                type="button"
              >
                {t("FooterDetailPesanan.batalkan", {}, "Batalkan")}
              </Button>
            ),
          },
          {
            id: "ya-menunggu",
            variant: "muatparts-primary",
            el: (variant) => (
              <Button
                variant={variant}
                className="h-10 w-full p-0"
                onClick={async () => {
                  try {
                    await confirmWaiting({
                      continueWaiting: true,
                    });
                    // Optional: Reset the waiting state after confirmation
                    // onConfirmWaitingChange(false);
                  } catch (error) {
                    console.error("Failed to confirm waiting:", error);
                  }
                }}
                type="button"
              >
                {t("FooterDetailPesanan.yaMenunggu", {}, "Ya, Menunggu")}
              </Button>
            ),
          },
        ];
      } else {
        components = [
          {
            id: "batalkan-pesanan",
            variant: "muatparts-error-secondary",
            el: (variant) => (
              <Button
                variant={variant}
                className="h-10 w-full p-0"
                onClick={() => setIsOpenModalBatalkanPesanan(true)}
                type="button"
              >
                Batalkan Pesanan
              </Button>
            ),
          },
        ];
      }
    }

    if (components.length > 1 && components[0].id === "pesan-ulang") {
      components[0].variant = "muatparts-primary-secondary";
    }

    return components;
  }, [
    dataStatusPesanan?.orderStatus,
    dataStatusPesanan?.reviewData,
    isConfirmWaiting, // Add this dependency!
    areAllDriversReviewed,
    navigation,
  ]); // Make sure all dependencies are included

  return (
    <>
      {renderButtons.length > 0 ? (
        <ResponsiveFooter className="flex flex-col gap-4">
          {LIST_SHOW_TOTAL_PRICE.includes(dataStatusPesanan?.orderStatus) &&
            dataRingkasanPembayaran?.totalPrice && (
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">
                  {t("FooterDetailPesanan.totalBiaya", {}, "Total Biaya")}
                </div>
                <div className="text-sm font-bold">
                  {idrFormat(dataRingkasanPembayaran?.totalPrice)}
                </div>
              </div>
            )}

          {dataRingkasanPembayaran?.priceCharge &&
            dataStatusPesanan?.orderStatus !==
              OrderStatusEnum.WAITING_PAYMENT_3 && (
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">
                  {t(
                    "FooterDetailPesanan.totalTambahanBiaya",
                    {},
                    "Total Tambahan Biaya"
                  )}
                </div>
                <div className="text-sm font-bold">
                  {idrFormat(dataRingkasanPembayaran?.priceCharge?.totalCharge)}
                </div>
              </div>
            )}

          {dataRingkasanPembayaran?.priceChange &&
          dataStatusPesanan?.orderStatus ===
            OrderStatusEnum.WAITING_PAYMENT_3 ? (
            <div className="flex items-center justify-between text-sm leading-[1.1] text-neutral-900">
              <div className="font-semibold">
                {t(
                  "FooterDetailPesanan.totalTambahanBiaya",
                  {},
                  "Total Tambahan Biaya"
                )}
              </div>
              <div className="font-bold">
                {idrFormat(
                  dataRingkasanPembayaran?.priceChange?.totalAdjustment
                )}
              </div>
            </div>
          ) : null}

          {/* Saya tidak tahu logic nya apa buat ngeshow, sementara toggle aja */}
          {false ? (
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold leading-[1.1]">
                {t("FooterDetailPesanan.rute", {}, "Rute")}
              </div>
              <div className="text-xs font-medium leading-[1.1]">
                {t(
                  "FooterDetailPesanan.estimasiJarak",
                  {
                    distance: dataRingkasanPesanan?.estimatedDistance || "178",
                  },
                  "Estimasi {distance} km"
                )}
              </div>
            </div>
          ) : null}

          <div className="flex gap-2">
            {renderButtons.map((button) => (
              <Fragment key={button.id}>
                {button.el(
                  button.id === "pesan-ulang" && renderButtons.length > 2
                    ? "muatparts-primary-secondary"
                    : button.variant
                )}
              </Fragment>
            ))}
          </div>
        </ResponsiveFooter>
      ) : null}

      <ModalKonfimasiBuktiDokumenDiterima
        open={isReceiveDocumentEvidenceOpen}
        onOpenChange={setReceiveDocumentEvidenceOpen}
        onConfirm={handleReceiveDocument}
      />

      <ModalBatalkanPesananResponsive
        open={isOpenModalBatalkanPesanan}
        onOpenChange={setIsOpenModalBatalkanPesanan}
        onConfirm={() => {
          setIsOpenBottomsheetAlasanPembatalan(true);
          setIsOpenModalBatalkanPesanan(false);
        }}
        hasPriceCharge={dataRingkasanPembayaran?.priceCharge}
      />
      <BottomsheetAlasanPembatalan
        open={isOpenBottomsheetAlasanPembatalan}
        onOpenChange={setIsOpenBottomsheetAlasanPembatalan}
        orderId={params.orderId}
        onConfirm={() => {
          setIsOpenBottomsheetAlasanPembatalan(false);
        }}
      />

      {/* Modal Pesan Ulang */}
      <ConfirmationModalResponsive
        isOpen={isReorderFleetModalOpen}
        setIsOpen={setIsReorderFleetModalOpen}
        description={{
          text: t(
            "FooterDetailPesanan.modalReorderDescription",
            {},
            "Apakah kamu ingin menyalin pesanan ini untuk digunakan kembali atau membuat pesanan baru dengan detail yang berbeda?"
          ),
        }}
        cancel={{
          text: t("buttonPesanBaru"),
          onClick: () => handleReorderFleet(),
        }}
        confirm={{
          text: t("buttonPesanUlangModal"),
          onClick: () => handleReorderFleet(selectedOrderId),
        }}
      />

      {/* Modal Batalkan Perubahan */}
      <CancelUpdateOrderModal
        isOpen={isCancelUpdateOrderModal}
        setOpen={setCancelUpdateOrderModal}
      />
    </>
  );
};

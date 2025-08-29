import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useGetDetailPesananData } from "@/services/Shipper/detailpesanan/getDetailPesananData";
import useGetFleetSearchStatus from "@/services/Shipper/detailpesanan/getFleetSearchStatus";
import { useGetOldDriver } from "@/services/Shipper/detailpesanan/getOldDriver";
import { useGetOrderChangeHistory } from "@/services/Shipper/detailpesanan/getOrderChangeHistory";
import { useGetRefundInfo } from "@/services/Shipper/detailpesanan/getRefundInfo";
import { useStatusDriver } from "@/services/Shipper/detailpesanan/getStatusDriver";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";

// import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";

import { OrderStatusEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import { isDev } from "@/lib/constants/is-dev";
import { toast } from "@/lib/toast";

import { useLoadingAction } from "@/store/Shared/loadingStore";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

import DetailPesananHeader from "./DetailPesananHeader/DetailPesananHeader";
import DetailPIC from "./DetailPic/DetailPic";
import { RingkasanPembayaran } from "./RingkasanPembayaran/RingkasanPembayaran";
import RingkasanPesanan from "./RingkasanPesanan/RingkasanPesanan";
import { ModalPesananGagal } from "./StatusPesanan/ModalPesananGagal";
import StatusPesanan from "./StatusPesanan/StatusPesanan";
import { WaitFleetSearchModal } from "./StatusPesanan/WaitFleetSearch";

const DetailPesananWeb = () => {
  const navigation = useRouter();
  const params = useParams();
  const { t } = useTranslation();
  const isUpdateOrderSuccess = useSewaArmadaStore(
    (state) => state.isUpdateOrderSuccess
  );
  const { setUpdateOrderSuccess } = useSewaArmadaActions();

  const breadCrumbData = [
    {
      name: t("DetailPesananWeb.orderList", {}, "Daftar Pesanan"),
      href: "/daftarpesanan",
    },
    { name: t("DetailPesananWeb.orderDetail", {}, "Detail Pesanan") },
  ];

  const {
    data: dataDetailPesanan,
    isLoading: isLoadingDetailPesanan,
    error,
    mutate,
  } = useGetDetailPesananData(params.orderId);

  const {
    isOpen: isFleetSearchPopupOpen,
    isShow: isShowWaitFleetAlert,
    setIsOpen: setIsFleetSearchPopupOpen,
    setIsShow: setIsShowWaitFleetAlert,
    searchStatus,
  } = useGetFleetSearchStatus(
    params.orderId,
    dataDetailPesanan?.dataStatusPesanan?.orderStatus ===
      OrderStatusEnum.PREPARE_FLEET
  );

  const [isWaitFleetModalOpen, setIsWaitFleetModalOpen] = useState(false);
  const [isPesananGagalModalOpen, setIsPesananGagalModalOpen] = useState(false);

  useEffect(() => {
    if (isFleetSearchPopupOpen) {
      if (searchStatus === "waiting") {
        setIsWaitFleetModalOpen(true);
      } else if (searchStatus === "failed") {
        setIsPesananGagalModalOpen(true);
      }
      setIsFleetSearchPopupOpen(false); // Reset the trigger
    }
  }, [isFleetSearchPopupOpen, searchStatus, setIsFleetSearchPopupOpen]);

  useEffect(() => {
    if (isUpdateOrderSuccess) {
      toast.success(
        t("DetailPesananWeb.updateOrderSuccess", {}, "Berhasil Ubah Pesanan")
      );
      setUpdateOrderSuccess(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateOrderSuccess]);

  const { setIsGlobalLoading } = useLoadingAction();
  useEffect(() => {
    setIsGlobalLoading(isLoadingDetailPesanan);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingDetailPesanan]);

  useEffect(() => {
    if (error) {
      toast.error(
        error.response.status === 404
          ? t("DetailPesananWeb.orderNotFound", {}, "Pesanan tidak ditemukan")
          : t(
              "DetailPesananWeb.failedFetchOrder",
              {},
              "Gagal mengambil data pesanan"
            )
      );
      navigation.replace("/daftarpesanan");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);
  // Only call useGetOldDriver if order status is loading or unloading
  const shouldFetchOldDriver =
    dataDetailPesanan?.dataStatusPesanan?.orderStatus &&
    (dataDetailPesanan.dataStatusPesanan.orderStatus ===
      OrderStatusEnum.LOADING ||
      dataDetailPesanan.dataStatusPesanan.orderStatus ===
        OrderStatusEnum.UNLOADING);

  const { data: oldDriverData } = useGetOldDriver(
    shouldFetchOldDriver ? params.orderId : null,
    shouldFetchOldDriver
      ? dataDetailPesanan?.dataStatusPesanan?.driverStatus[0]?.driverId
      : null
  );
  const { data: orderChangeHistory } = useGetOrderChangeHistory(params.orderId);

  const { data: statusDriver } = useStatusDriver(
    params?.orderId,
    dataDetailPesanan?.dataStatusPesanan?.driverStatus[0]?.driverId
  );

  const isCancelled =
    dataDetailPesanan?.dataStatusPesanan?.orderStatus ===
      OrderStatusEnum.CANCELED_BY_SYSTEM ||
    dataDetailPesanan?.dataStatusPesanan?.orderStatus ===
      OrderStatusEnum.CANCELED_BY_SHIPPER ||
    dataDetailPesanan?.dataStatusPesanan?.orderStatus ===
      OrderStatusEnum.CANCELED_BY_TRANSPORTER;

  const { data: refundInfo } = useGetRefundInfo(
    isCancelled ? params.orderId : null
  );

  if (isLoadingDetailPesanan) {
    return null;
  }

  return (
    <>
      <div className="mx-auto max-w-[1200px] py-8">
        <BreadCrumb className="mb-0" data={breadCrumbData} />

        <DetailPesananHeader
          dataStatusPesanan={dataDetailPesanan?.dataStatusPesanan}
          dataRingkasanPembayaran={dataDetailPesanan?.dataRingkasanPembayaran}
          isShowWaitFleetAlert={isShowWaitFleetAlert}
          mutateDetailPesanan={mutate}
          refundInfo={refundInfo}
        />
        <div className="grid grid-cols-[846px_1fr] gap-4">
          <div className="flex flex-col gap-4">
            {/* {true ? (
              <div className="flex h-14 items-center gap-x-2 rounded-md bg-secondary-100 px-6 py-4">
                <IconComponent
                  className="icon-stroke-warning-900"
                  src="/icons/warning24.svg"
                  size="medium"
                />
                <span className="text-xs font-semibold leading-[14.4px] text-neutral-900">
                  {`Pesanan kamu memiliki tambahan biaya. Mohon selesaikan
                  pembayaran sebelum tanggal `}
                  <b>20 Mei 2024</b>
                </span>
              </div>
            ) : null} */}
            {dataDetailPesanan?.dataStatusPesanan && (
              <StatusPesanan
                dataStatusPesanan={dataDetailPesanan.dataStatusPesanan}
                isShowWaitFleetAlert={isShowWaitFleetAlert}
                oldDriverData={oldDriverData}
                orderChangeHistory={orderChangeHistory}
                statusDriver={statusDriver}
              />
            )}

            {dataDetailPesanan?.dataRingkasanPesanan && (
              <RingkasanPesanan
                dataRingkasanPesanan={dataDetailPesanan.dataRingkasanPesanan}
                useHalalLogistik={true}
                vehicleInfo={{
                  type: dataDetailPesanan?.dataRingkasanPesanan.vehicle.name,
                  quantity:
                    dataDetailPesanan?.dataRingkasanPesanan.vehicle.truckCount,
                }}
              />
            )}

            {dataDetailPesanan?.dataDetailPIC && (
              <DetailPIC dataDetailPIC={dataDetailPesanan?.dataDetailPIC} />
            )}
          </div>

          {dataDetailPesanan?.dataRingkasanPembayaran && (
            <RingkasanPembayaran
              dataRingkasanPembayaran={
                dataDetailPesanan.dataRingkasanPembayaran
              }
              dataStatusPesanan={dataDetailPesanan.dataStatusPesanan}
              isShowWaitFleetAlert={isShowWaitFleetAlert}
              mutateDetailPesanan={mutate}
            />
          )}
        </div>
      </div>

      <WaitFleetSearchModal
        dataRingkasanPembayaran={dataDetailPesanan?.dataRingkasanPembayaran}
        isOpen={isWaitFleetModalOpen}
        setIsOpen={setIsWaitFleetModalOpen}
        setIsShowWaitFleetAlert={setIsShowWaitFleetAlert}
      />

      <ModalPesananGagal
        open={isPesananGagalModalOpen}
        onOpenChange={setIsPesananGagalModalOpen}
      />

      {isDev && (
        <>
          <button
            onClick={() => {
              // toast.error(
              //   t("DetailPesananWeb.minimalCancelReason", {}, "Minimal pilih 1 alasan pembatalan untuk membatalkan pesanan")
              // );
              // toast.error(
              //   t("DetailPesananWeb.fleetPrepareAgain", {}, "Armada akan disiapkan ulang sesuai dengan perubahan yang dilakukan.")
              // );
              toast.success(
                t(
                  "DetailPesananWeb.cancelOrderSuccess",
                  {},
                  "Berhasil membatalkan pesanan"
                )
              );
            }}
          >
            {t("DetailPesananWeb.testToast", {}, "tes toast")}
          </button>
          <pre className="overflow-x-hidden">
            {JSON.stringify(dataDetailPesanan, null, 2)}
          </pre>
        </>
      )}
    </>
  );
};

export default DetailPesananWeb;

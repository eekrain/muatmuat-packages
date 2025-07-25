import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
// import IconComponent from "@/components/IconComponent/IconComponent";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { isDev } from "@/lib/constants/is-dev";
import { toast } from "@/lib/toast";
import { useGetDetailPesananData } from "@/services/Shipper/detailpesanan/getDetailPesananData";
import { useGetFeatureAccess } from "@/services/Shipper/detailpesanan/getFeatureAccess";
import useGetFleetSearchStatus from "@/services/Shipper/detailpesanan/getFleetSearchStatus";
import { useGetPaymentTimer } from "@/services/Shipper/detailpesanan/getPaymentTimer";
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
  const params = useParams();
  const isUpdateOrderSuccess = useSewaArmadaStore(
    (state) => state.isUpdateOrderSuccess
  );
  const { setUpdateOrderSuccess } = useSewaArmadaActions();

  const breadCrumbData = [
    { name: "Daftar Pesanan", href: "/daftarpesanan" },
    { name: "Detail Pesanan" },
  ];

  const { data: dataDetailPesanan, isLoading: isLoadingDetailPesanan } =
    useGetDetailPesananData(params.orderId);
  const {
    isOpen: isWaitFleetModalOpen,
    isShow: isShowWaitFleetAlert,
    setIsOpen: setIsWaitFleetModalOpen,
    setIsShow: setIsShowWaitFleetAlert,
  } = useGetFleetSearchStatus(
    params.orderId,
    dataDetailPesanan?.dataStatusPesanan?.orderStatus ===
      OrderStatusEnum.PREPARE_FLEET
  );

  const [isPesananGagalModalOpen, setIsPesananGagalModalOpen] = useState(false);

  const { data: featureAccess, isLoading: isLoadingFeatureAccess } =
    useGetFeatureAccess(params.orderId);

  const { data: paymentTimer, isLoading: isLoadingPaymentTimer } =
    useGetPaymentTimer(params.orderId);

  const { setIsGlobalLoading } = useLoadingAction();
  useEffect(() => {
    if (isUpdateOrderSuccess) {
      toast.success("Berhasil Ubah Pesanan");
      setUpdateOrderSuccess(false);
    }
  }, [isUpdateOrderSuccess]);

  useEffect(() => {
    setIsGlobalLoading(isLoadingDetailPesanan);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingDetailPesanan, isLoadingFeatureAccess, isLoadingPaymentTimer]);
  return (
    <>
      <div className="mx-auto max-w-[1200px] py-8">
        <BreadCrumb className="mb-0" data={breadCrumbData} />

        <DetailPesananHeader
          dataStatusPesanan={dataDetailPesanan?.dataStatusPesanan}
          dataRingkasanPembayaran={dataDetailPesanan?.dataRingkasanPembayaran}
          isShowWaitFleetAlert={isShowWaitFleetAlert}
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
              />
            )}

            {dataDetailPesanan?.dataRingkasanPesanan && (
              <RingkasanPesanan
                dataRingkasanPesanan={dataDetailPesanan.dataRingkasanPesanan}
                useHalalLogistik={true}
                vehicleInfo={{
                  type: "Box - Colt Diesel Engkel",
                  quantity: "1 Unit",
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
              isShowWaitFleetAlert={isShowWaitFleetAlert}
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
              //   "Minimal pilih 1 alasan pembatalan untuk membatalkan pesanan"
              // );
              // toast.error(
              //   "Armada akan disiapkan ulang sesuai dengan perubahan yang dilakukan."
              // );
              toast.success("Berhasil membatalkan pesanan");
            }}
          >
            tes toast
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

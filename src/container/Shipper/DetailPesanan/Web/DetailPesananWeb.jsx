import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
// import IconComponent from "@/components/IconComponent/IconComponent";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { isDev } from "@/lib/constants/is-dev";
import { toast } from "@/lib/toast";
import { useGetDetailPesananData } from "@/services/Shipper/detailpesanan/getDetailPesananData";
import useGetFleetSearchStatus from "@/services/Shipper/detailpesanan/getFleetSearchStatus";
import { useGetOldDriver } from "@/services/Shipper/detailpesanan/getOldDriver";
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
  const isUpdateOrderSuccess = useSewaArmadaStore(
    (state) => state.isUpdateOrderSuccess
  );
  const { setUpdateOrderSuccess } = useSewaArmadaActions();

  const breadCrumbData = [
    { name: "Daftar Pesanan", href: "/daftarpesanan" },
    { name: "Detail Pesanan" },
  ];

  const {
    data: dataDetailPesanan,
    isLoading: isLoadingDetailPesanan,
    error,
    mutate,
  } = useGetDetailPesananData(params.orderId);

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

  useEffect(() => {
    if (isUpdateOrderSuccess) {
      toast.success("Berhasil Ubah Pesanan");
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
          ? "Pesanan tidak ditemukan"
          : "Gagal mengambil data pesanan"
      );
      navigation.replace("/daftarpesanan");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const { data: oldDriverData } = useGetOldDriver(
    params.orderId,
    params.driverId
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

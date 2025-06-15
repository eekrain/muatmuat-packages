import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useGetDetailPesananData } from "@/services/detailpesanan/getDetailPesananData";
import { useLoadingAction } from "@/store/loadingStore";

import DetailPIC from "./DetailPic/DetailPic";
import RingkasanPembayaran from "./RingkasanPembayaran/RingkasanPembayaran";
import RingkasanPesanan from "./RingkasanPesanan/RingkasanPesanan";
import StatusPesanan from "./StatusPesanan/StatusPesanan";

const breadCrumbData = [{ name: "Daftar Pesanan" }, { name: "Detail Pesanan" }];

const DetailPesananWeb = () => {
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const { data: dataDetailPesanan, isLoading: isLoadingDetailPesanan } =
    useGetDetailPesananData(params.orderId);

  const { setIsGlobalLoading } = useLoadingAction();

  useEffect(() => {
    setIsGlobalLoading(isLoadingDetailPesanan);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingDetailPesanan]);

  return (
    <>
      <div className="flex justify-center">
        <div className="mx-auto w-[1280px] px-10">
          <div className="flex flex-col gap-y-6">
            <BreadCrumb className="!mb-0" data={breadCrumbData} />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <IconComponent src="/icons/arrow-left24.svg" size="medium" />
                <div className="ml-3 text-[20px] font-bold leading-[24px] text-neutral-900">
                  Detail Pesanan
                </div>
                <div className="ml-1">
                  <IconComponent
                    src="/icons/info16.svg"
                    onClick={() => setIsOpen(true)}
                  />
                </div>
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
              </div>
            </div>
            <div className="flex gap-x-4">
              <div className="flex flex-1 flex-col gap-y-4">
                {dataDetailPesanan?.dataStatusPesanan && (
                  <StatusPesanan
                    dataStatusPesanan={dataDetailPesanan.dataStatusPesanan}
                  />
                )}
                {dataDetailPesanan?.dataRingkasanPesanan && (
                  <RingkasanPesanan
                    dataRingkasanPesanan={
                      dataDetailPesanan.dataRingkasanPesanan
                    }
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
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <pre>{JSON.stringify(dataDetailPesanan, null, 2)}</pre> */}
    </>
  );
};

export default DetailPesananWeb;

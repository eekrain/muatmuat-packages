import { useParams } from "next/navigation";
import { useEffect } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import DetailPesananHeader from "@/container/DetailPesanan/Web/DetailPesananHeader/DetailPesananHeader";
import DetailPIC from "@/container/DetailPesanan/Web/DetailPic/DetailPic";
import { PaymentInstruction } from "@/container/DetailPesanan/Web/PaymentInstruction/PaymentInstruction";
import { RingkasanPembayaran } from "@/container/DetailPesanan/Web/RingkasanPembayaran/RingkasanPembayaran";
import RingkasanPesanan from "@/container/DetailPesanan/Web/RingkasanPesanan/RingkasanPesanan";
import StatusPesanan from "@/container/DetailPesanan/Web/StatusPesanan/StatusPesanan";
import { useGetDetailPesananData } from "@/services/detailpesanan/getDetailPesananData";
import { useLoadingAction } from "@/store/loadingStore";

const DetailPesananWeb = () => {
  const params = useParams();

  const breadCrumbData = [
    { name: "Daftar Pesanan" },
    { name: "Detail Pesanan" },
  ];

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
            <DetailPesananHeader
              dataStatusPesanan={dataDetailPesanan?.dataStatusPesanan}
            />
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

              <div className="flex flex-col gap-y-4">
                {dataDetailPesanan?.dataRingkasanPembayaran && (
                  <RingkasanPembayaran
                    dataRingkasanPembayaran={
                      dataDetailPesanan.dataRingkasanPembayaran
                    }
                  />
                )}
                {dataDetailPesanan?.dataPaymentInstruction && (
                  <PaymentInstruction
                    dataPaymentInstruction={
                      dataDetailPesanan.dataPaymentInstruction
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <pre>{JSON.stringify(dataDetailPesanan, null, 2)}</pre>
    </>
  );
};

export default DetailPesananWeb;

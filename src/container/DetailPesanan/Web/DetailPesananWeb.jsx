import { useParams } from "next/navigation";
import { useEffect } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import DetailPesananHeader from "@/container/DetailPesanan/Web/DetailPesananHeader/DetailPesananHeader";
import DetailPIC from "@/container/DetailPesanan/Web/DetailPic/DetailPic";
import { PaymentInstruction } from "@/container/DetailPesanan/Web/PaymentInstruction/PaymentInstruction";
import { RingkasanPembayaran } from "@/container/DetailPesanan/Web/RingkasanPembayaran/RingkasanPembayaran";
import RingkasanPesanan from "@/container/DetailPesanan/Web/RingkasanPesanan/RingkasanPesanan";
import StatusPesanan from "@/container/DetailPesanan/Web/StatusPesanan/StatusPesanan";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { toast } from "@/lib/toast";
import { useGetDetailPesananData } from "@/services/detailpesanan/getDetailPesananData";
import { useLoadingAction } from "@/store/loadingStore";

const LIST_SHOW_INSTRUCTION = [
  OrderStatusEnum.WAITING_PAYMENT_2,
  OrderStatusEnum.WAITING_REPAYMENT_2,
];

const DetailPesananWeb = () => {
  const params = useParams();

  const breadCrumbData = [
    { name: "Daftar Pesanan", path: "/daftar-pesanan" },
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
      <div className="flex justify-center py-8">
        <div className="mx-auto w-[1280px] px-10">
          <div className="flex flex-col gap-y-6">
            <div className="flex items-center justify-between">
              <BreadCrumb className="!mb-0" data={breadCrumbData} />
            </div>

            <DetailPesananHeader
              dataStatusPesanan={dataDetailPesanan?.dataStatusPesanan}
              orderCode={dataDetailPesanan?.orderCode || "INV/MT25AA001"}
              driverInfo={{
                name: "Noel Gallagher",
                id: "AE 666 LBA",
              }}
              statusLabel="Dokumen Sedang Disiapkan"
            />

            <div className="flex gap-x-4">
              <div className="flex flex-1 flex-col gap-y-4">
                {dataDetailPesanan?.dataStatusPesanan && (
                  <StatusPesanan
                    dataStatusPesanan={dataDetailPesanan.dataStatusPesanan}
                    currentStatus="Dokumen Sedang Disiapkan"
                    statusList={[
                      { label: "Pesanan Terkonfirmasi", isCompleted: true },
                      { label: "Proses Muat", isCompleted: true },
                      { label: "Proses Bongkar", isCompleted: true },
                      {
                        label: "Dokumen Sedang Disiapkan",
                        isCompleted: true,
                        isCurrent: true,
                      },
                      { label: "Selesai", isCompleted: false },
                    ]}
                  />
                )}

                {dataDetailPesanan?.dataRingkasanPesanan && (
                  <RingkasanPesanan
                    dataRingkasanPesanan={
                      dataDetailPesanan.dataRingkasanPesanan
                    }
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

              <div className="flex w-[360px] flex-col gap-y-4">
                {dataDetailPesanan?.dataRingkasanPembayaran && (
                  <RingkasanPembayaran
                    dataRingkasanPembayaran={
                      dataDetailPesanan.dataRingkasanPembayaran
                    }
                  />
                )}

                {LIST_SHOW_INSTRUCTION.includes(
                  dataDetailPesanan?.dataStatusPesanan?.orderStatus
                ) && (
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

      <button onClick={() => toast.success("Pesanan kamu berhasil dibatalkan")}>
        tes toast
      </button>
      <pre>{JSON.stringify(dataDetailPesanan, null, 2)}</pre>
    </>
  );
};

export default DetailPesananWeb;

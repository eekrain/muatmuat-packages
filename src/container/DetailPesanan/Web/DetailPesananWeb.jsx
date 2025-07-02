import { useParams } from "next/navigation";
import { useEffect } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import DetailPesananHeader from "@/container/DetailPesanan/Web/DetailPesananHeader/DetailPesananHeader";
import DetailPIC from "@/container/DetailPesanan/Web/DetailPic/DetailPic";
import { PaymentInstruction } from "@/container/DetailPesanan/Web/PaymentInstruction/PaymentInstruction";
import { RingkasanPembayaran } from "@/container/DetailPesanan/Web/RingkasanPembayaran/RingkasanPembayaran";
import RingkasanPesanan from "@/container/DetailPesanan/Web/RingkasanPesanan/RingkasanPesanan";
import StatusPesanan from "@/container/DetailPesanan/Web/StatusPesanan/StatusPesanan";
import { toast } from "@/lib/toast";
import { useGetDetailPesananData } from "@/services/detailpesanan/getDetailPesananData";
import { useLoadingAction } from "@/store/loadingStore";

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

      <button onClick={() => toast.success("Pesanan kamu berhasil dibatalkan")}>
        tes toast
      </button>
      <pre>{JSON.stringify(dataDetailPesanan, null, 2)}</pre>
    </>
  );
};

// Download icon component
const DownloadIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.83301 8.33301L9.99967 12.4997L14.1663 8.33301"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 12.5V2.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default DetailPesananWeb;

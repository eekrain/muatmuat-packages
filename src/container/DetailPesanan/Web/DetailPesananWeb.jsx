import { useParams } from "next/navigation";
import { useEffect } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { useGetDetailPesananData } from "@/services/detailpesanan/getDetailPesananData";
import { useLoadingAction } from "@/store/loadingStore";

import DetailPesananHeader from "./DetailPesananHeader/DetailPesananHeader";
import DetailPIC from "./DetailPic/DetailPic";
import { PaymentInstruction } from "./PaymentInstruction/PaymentInstruction";
import { RingkasanPembayaran } from "./RingkasanPembayaran/RingkasanPembayaran";
import RingkasanPesanan from "./RingkasanPesanan/RingkasanPesanan";
import StatusPesanan from "./StatusPesanan/StatusPesanan";

const LIST_SHOW_INSTRUCTION = [
  OrderStatusEnum.WAITING_PAYMENT_2,
  OrderStatusEnum.WAITING_REPAYMENT_2,
];

const DetailPesananWeb = () => {
  const params = useParams();

  const breadCrumbData = [
    { name: "Daftar Pesanan", href: "/daftarpesanan" },
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
      <div className="mx-auto max-w-[1200px] py-8">
        <BreadCrumb className="!mb-0" data={breadCrumbData} />

        <DetailPesananHeader
          dataStatusPesanan={dataDetailPesanan?.dataStatusPesanan}
          orderCode={dataDetailPesanan?.orderCode || "INV/MT25AA001"}
          driverInfo={{
            name: "Noel Gallagher",
            id: "AE 666 LBA",
          }}
          statusLabel="Dokumen Sedang Disiapkan"
        />
        <div className="grid grid-cols-[846px_1fr] gap-4">
          <div className="flex flex-col gap-4">
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

          <div className="flex flex-col gap-4">
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

      {/* <button onClick={() => toast.success("Pesanan kamu berhasil dibatalkan")}>
        tes toast
      </button>
      <pre>{JSON.stringify(dataDetailPesanan, null, 2)}</pre> */}
    </>
  );
};

export default DetailPesananWeb;

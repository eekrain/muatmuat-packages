import { useEffect } from "react";

import RingkasanPendapatan from "@/container/Transporter/DetailPesanan/RingkasanPesanan/RingkasanPendapatan";
import RingkasanPesananBody from "@/container/Transporter/DetailPesanan/RingkasanPesanan/RingkasanPesananBody";
import RingkasanPesananHeader from "@/container/Transporter/DetailPesanan/RingkasanPesanan/RingkasanPesananHeader";

import { toast } from "@/lib/toast";

import { ORDER_STATUS } from "@/utils/Transporter/orderStatus";

import RingkasanPendapatanAktif from "./RingkasanPendapatanAktif";

const RingkasanPesanan = ({ dataOrderDetail }) => {
  const ringkasanPendapatanAktif = [
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.CANCELLED_BY_SHIPPER,
    ORDER_STATUS.CANCELLED_BY_TRANSPORTER,
    ORDER_STATUS.CANCELLED_BY_SYSTEM,
  ].includes(dataOrderDetail?.orderStatus);

  useEffect(() => {
    if (dataOrderDetail?.orderStatus === "LOADING") {
      toast.success(
        `Berhasil kirim respon perubahan untuk pesanan ${dataOrderDetail?.invoiceNumber || dataOrderDetail?.orderCode}`
      );
    }
  }, [
    dataOrderDetail?.orderStatus,
    dataOrderDetail?.invoiceNumber,
    dataOrderDetail?.orderCode,
    dataOrderDetail?.orderStatusUnit,
  ]);

  return (
    <>
      <RingkasanPesananHeader dataOrderDetail={dataOrderDetail} />
      <div className="flex gap-x-4">
        <RingkasanPesananBody dataOrderDetail={dataOrderDetail} />
        {ringkasanPendapatanAktif ? (
          <RingkasanPendapatanAktif dataOrderDetail={dataOrderDetail} />
        ) : (
          <RingkasanPendapatan dataOrderDetail={dataOrderDetail} />
        )}
      </div>
    </>
  );
};

export default RingkasanPesanan;

import RingkasanPendapatan from "@/container/Transporter/DetailPesanan/RingkasanPesanan/RingkasanPendapatan";
import RingkasanPesananBody from "@/container/Transporter/DetailPesanan/RingkasanPesanan/RingkasanPesananBody";
import RingkasanPesananHeader from "@/container/Transporter/DetailPesanan/RingkasanPesanan/RingkasanPesananHeader";

import RingkasanPendapatanAktif from "./RingkasanPendapatanAktif";

const RingkasanPesanan = ({ dataOrderDetail }) => {
  const ringkasanPendapatanAktif = false;
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

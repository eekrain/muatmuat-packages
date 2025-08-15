import RingkasanPendapatan from "@/container/Transporter/DetailPesanan/RingkasanPesanan/RingkasanPendapatan";
import RingkasanPesananBody from "@/container/Transporter/DetailPesanan/RingkasanPesanan/RingkasanPesananBody";
import RingkasanPesananHeader from "@/container/Transporter/DetailPesanan/RingkasanPesanan/RingkasanPesananHeader";

const RingkasanPesanan = ({ dataOrderDetail }) => {
  return (
    <>
      <RingkasanPesananHeader dataOrderDetail={dataOrderDetail} />
      <div className="flex gap-x-4">
        <RingkasanPesananBody dataOrderDetail={dataOrderDetail} />
        <RingkasanPendapatan dataOrderDetail={dataOrderDetail} />
      </div>
    </>
  );
};

export default RingkasanPesanan;

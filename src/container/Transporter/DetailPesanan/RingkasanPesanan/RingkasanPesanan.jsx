import RingkasanPendapatan from "@/container/Transporter/DetailPesanan/RingkasanPesanan/RingkasanPendapatan";
import RingkasanPesananBody from "@/container/Transporter/DetailPesanan/RingkasanPesanan/RingkasanPesananBody";
import RingkasanPesananHeader from "@/container/Transporter/DetailPesanan/RingkasanPesanan/RingkasanPesananHeader";

const RingkasanPesanan = ({ dataOrderDetail }) => {
  return (
    <>
      <RingkasanPesananHeader />
      <div className="flex gap-x-4">
        <RingkasanPesananBody dataRingkasanPesanan={dataOrderDetail} />
        <RingkasanPendapatan dataRingkasanPesanan={dataOrderDetail} />
      </div>
    </>
  );
};

export default RingkasanPesanan;

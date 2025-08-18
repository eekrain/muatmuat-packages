import RingkasanPesananBody from "@/container/CS/DetailPesanan/RingkasanPesanan/RingkasanPesananBody";
import RingkasanPesananHeader from "@/container/CS/DetailPesanan/RingkasanPesanan/RingkasanPesananHeader";

const RingkasanPesanan = ({ dataOrderDetail }) => {
  return (
    <>
      <RingkasanPesananHeader dataOrderDetail={dataOrderDetail} />
      <RingkasanPesananBody dataOrderDetail={dataOrderDetail} />
    </>
  );
};

export default RingkasanPesanan;

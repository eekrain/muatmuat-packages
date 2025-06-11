import RingkasanPembayaran from "@/container/Detailpesanan/Web/RingkasanPembayaran/RingkasanPembayaran";
import RingkasanPesanan from "@/container/Detailpesanan/Web/RingkasanPesanan/RingkasanPesanan";
import StatusPesanan from "@/container/Detailpesanan/Web/StatusPesanan/StatusPesanan";

const DetailPesananWeb = () => {
  return (
    <div className="flex justify-center">
      <div className="mx-auto w-[1280px] px-10">
        <div className="flex gap-x-4">
          <div className="flex flex-col gap-y-4">
            <StatusPesanan />
            <RingkasanPesanan />
          </div>
          <RingkasanPembayaran />
        </div>
      </div>
    </div>
  );
};

export default DetailPesananWeb;

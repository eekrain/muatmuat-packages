import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import DetailPIC from "@/container/Detailpesanan/Web/DetailPic/DetailPic";
import RingkasanPembayaran from "@/container/Detailpesanan/Web/RingkasanPembayaran/RingkasanPembayaran";
import RingkasanPesanan from "@/container/Detailpesanan/Web/RingkasanPesanan/RingkasanPesanan";
import StatusPesanan from "@/container/Detailpesanan/Web/StatusPesanan/StatusPesanan";

const DetailPesananWeb = () => {
  const breadCrumbData = [
    { name: "Daftar Pesanan" },
    { name: "Detail Pesanan" },
  ];

  const handleBreadCrumbClick = (val) => {};
  return (
    <div className="flex justify-center">
      <div className="mx-auto w-[1280px] px-10">
        <div className="flex flex-col gap-y-6">
          <BreadCrumb
            className="!mb-0"
            data={breadCrumbData}
            onclick={handleBreadCrumbClick}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <IconComponent src="/icons/arrow-left24.svg" size="medium" />
              <div className="ml-3 text-[20px] font-bold leading-[24px] text-neutral-900">
                Detail Pesanan
              </div>
              <div className="ml-1">
                <IconComponent src="/icons/info16.svg" />
              </div>
            </div>
            <div className="flex items-center gap-x-3">
              <Button
                iconLeft="/icons/download16.svg"
                variant="muatparts-primary-secondary"
                className="h-8"
                onClick={() => {}}
                type="button"
              >
                Unduh
              </Button>
              <Button
                variant="muatparts-primary-secondary"
                className="h-8"
                onClick={() => {}}
                type="button"
              >
                Pesan Ulang
              </Button>
            </div>
          </div>
          <div className="flex gap-x-4">
            <div className="flex flex-col gap-y-4">
              <StatusPesanan />
              <RingkasanPesanan />
              <DetailPIC />
            </div>
            <RingkasanPembayaran />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPesananWeb;

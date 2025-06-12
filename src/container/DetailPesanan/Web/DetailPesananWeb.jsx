import { useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import DetailPIC from "@/container/Detailpesanan/Web/DetailPic/DetailPic";
import RingkasanPembayaran from "@/container/Detailpesanan/Web/RingkasanPembayaran/RingkasanPembayaran";
import RingkasanPesanan from "@/container/Detailpesanan/Web/RingkasanPesanan/RingkasanPesanan";
import StatusPesanan from "@/container/Detailpesanan/Web/StatusPesanan/StatusPesanan";

const DetailPesananWeb = () => {
  const breadCrumbData = [
    { name: "Daftar Pesanan" },
    { name: "Detail Pesanan" },
  ];
  const data = {
    namaPenerima: "Sani",
    nomorHandphone: "0888-1212-13",
    alamatTujuan:
      "Kedungsari no. 50, Kec Tegalsari, Kota Surabaya, Jawa Timur 60261",
    detailAlamat: "Rumah pagar coklat",
    kecamatan: "Tegalsari",
    kabupaten: "Surabaya",
    provinsi: "Jawa Timur",
    kodePos: "60261",
    ekspedisi: {
      service: "JNE",
      harga: "Rp25.000",
      asuransi: "Rp10.000",
    },
  };
  const informationFields = [
    {
      id: "nama-penerima",
      label: "Nama Penerima",
      value: data.namaPenerima,
      width: "w-[89px]",
    },
    {
      id: "nomor-handphone",
      label: "Nomor Handphone Penerima",
      value: data.nomorHandphone,
      width: "w-[164px]",
    },
    {
      id: "alamat-tujuan",
      label: "Alamat Tujuan",
      value: data.alamatTujuan,
      width: "w-full",
    },
    {
      id: "detail-alamat",
      label: "Detail Alamat Tujuan",
      value: data.detailAlamat,
      width: "w-full",
    },
    {
      id: "kecamatan",
      label: "Kecamatan",
      value: data.kecamatan,
      width: "w-full",
    },
    {
      id: "kabupaten",
      label: "Kabupaten/Kota",
      value: data.kabupaten,
      width: "w-full",
    },
    {
      id: "provinsi",
      label: "Provinsi",
      value: data.provinsi,
      width: "w-full",
    },
    {
      id: "kode-pos",
      label: "Kode Pos",
      value: data.kodePos,
      width: "w-full",
    },
  ];

  const [isOpen, setIsOpen] = useState(false);

  const handleBreadCrumbClick = (val) => {};
  return (
    <>
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
                  <IconComponent
                    src="/icons/info16.svg"
                    onClick={() => setIsOpen(true)}
                  />
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

      <Modal open={isOpen} onOpenChange={setIsOpen} closeOnOutsideClick={false}>
        <ModalContent>
          <div className="flex flex-col gap-y-4 px-6 py-9">
            {/* Header */}
            <h2 className="text-center text-[16px] font-bold leading-[19.2px] text-neutral-900">
              Detail Pengiriman Dokumen
            </h2>

            {/* Content */}
            <div className="flex flex-col items-start gap-4 p-0">
              {/* Information Fields */}
              {informationFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex w-[424px] flex-col items-start gap-3 p-0"
                >
                  <span className="text-[12px] font-semibold leading-[14.4px] text-neutral-900">
                    {field.label}
                  </span>
                  <span
                    className={`text-[12px] font-medium leading-[14.4px] text-neutral-600 ${field.width}`}
                  >
                    {field.value}
                  </span>
                </div>
              ))}

              {/* Ekspedisi Section */}
              <div className="flex h-12 w-[424px] flex-col items-start gap-3 p-0">
                <span className="text-[12px] font-semibold leading-[14.4px] text-neutral-900">
                  Ekspedisi Pengiriman
                </span>

                {/* Ekspedisi Details */}
                <div className="flex w-full flex-col gap-2">
                  {/* JNE Service */}
                  <div className="flex h-2 w-[424px] flex-row items-center justify-between">
                    <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                      {data.ekspedisi.service}
                    </span>
                    <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                      {data.ekspedisi.harga}
                    </span>
                  </div>

                  {/* Insurance */}
                  <div className="flex h-2 w-[424px] flex-row items-center justify-between">
                    <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                      Asuransi Pengiriman
                    </span>
                    <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                      {data.ekspedisi.asuransi}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DetailPesananWeb;

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from "@/components/Modal/Modal";
import Slider from "@/components/Slider/Slider";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { useGetDetailPesananData } from "@/services/detailpesanan/getDetailPesananData";
import { useLoadingAction } from "@/store/loadingStore";

import DetailPIC from "./DetailPic/DetailPic";
import { PaymentInstruction } from "./PaymentInstruction/PaymentInstruction";
import { RingkasanPembayaran } from "./RingkasanPembayaran/RingkasanPembayaran";
import RingkasanPesanan from "./RingkasanPesanan/RingkasanPesanan";
import StatusPesanan from "./StatusPesanan/StatusPesanan";

const DetailPesananWeb = () => {
  const params = useParams();

  const breadCrumbData = [
    { name: "Daftar Pesanan" },
    { name: "Detail Pesanan" },
  ];
  const slides = [
    {
      title: "Status Pesanan",
      imgSrc: "/img/detail-pesanan-first-time/1-status-pesanan.webp",
      content:
        "Label informasi mengenai status terkini dari pesanan yang anda lakukan.",
    },
    {
      title: "Ringkasan Status Pesanan",
      imgSrc: "/img/detail-pesanan-first-time/2-ringkasan-status-pesanan.webp",
      content:
        "Pantau perkembangan pesanan yang Anda lakukan, mulai dari proses muat, proses bongkar hingga pesanan selesai.",
    },
    {
      title: "Status Driver",
      imgSrc: "/img/detail-pesanan-first-time/3-status-driver.webp",
      content:
        "Pada bagian informasi driver, terdapat label Informasi mengenai status terkini yang sedang dijalankan oleh driver.",
    },
    {
      title: "Detail Status",
      imgSrc: "/img/detail-pesanan-first-time/4-detail-status.webp",
      content:
        // eslint-disable-next-line quotes
        'Pantau perkembangan status driver secara menyeluruh dengan mengakses menu \"Detail Status\" pada bagian informasi driver.',
    },
    {
      title: "QR Code Lokasi Muat / Bongkar",
      imgSrc: "/img/detail-pesanan-first-time/5-qr-code-lokasi.webp",
      content:
        "Saat driver akan melakukan proses muat atau bongkar, tunjukkan QR Code lokasi muat atau bongkar agar mereka bisa memindainya dan melanjutkan proses.",
    },
  ];

  const [isDocumentReceivedModalOpen, setIsDocumentReceivedModalOpen] =
    useState(false);

  const { data: dataDetailPesanan, isLoading: isLoadingDetailPesanan } =
    useGetDetailPesananData(params.orderId);

  const { setIsGlobalLoading } = useLoadingAction();

  useEffect(() => {
    setIsGlobalLoading(isLoadingDetailPesanan);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingDetailPesanan]);

  const handleReceiveDocument = () => {
    // Hit API /base_url/v1/orders/{orderId}/document-received
    alert("Hit API /base_url/v1/orders/{orderId}/document-received");
    setIsDocumentReceivedModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-center pt-8">
        <div className="mx-auto w-[1280px] px-10">
          <div className="flex flex-col gap-y-6">
            <BreadCrumb className="!mb-0" data={breadCrumbData} />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <IconComponent src="/icons/arrow-left24.svg" size="medium" />
                <div className="ml-3 text-[20px] font-bold leading-[24px] text-neutral-900">
                  Detail Pesanan
                </div>

                <Modal closeOnOutsideClick={false}>
                  <ModalTrigger>
                    <div className="ml-1">
                      <IconComponent
                        src="/icons/info16.svg"
                        width={16}
                        height={16}
                      />
                    </div>
                  </ModalTrigger>
                  <ModalContent className="w-modal-small">
                    <ModalHeader size="small" />
                    <div className="w-full px-6 py-9">
                      <Slider
                        slides={slides}
                        onComplete={() => console.log("Slider completed!")}
                        onSlideChange={(index) =>
                          console.log("Current slide:", index)
                        }
                      />
                    </div>
                  </ModalContent>
                </Modal>
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
                {dataDetailPesanan?.dataStatusPesanan.orderStatus ===
                OrderStatusEnum.DOCUMENT_SHIPPING ? (
                  <Button
                    variant="muatparts-primary"
                    className="h-8"
                    onClick={() => setIsDocumentReceivedModalOpen(true)}
                    type="button"
                  >
                    Dokumen Diterima
                  </Button>
                ) : null}
              </div>
            </div>
            <div className="flex gap-x-4">
              <div className="flex flex-1 flex-col gap-y-4">
                {dataDetailPesanan?.dataStatusPesanan && (
                  <StatusPesanan
                    dataStatusPesanan={dataDetailPesanan.dataStatusPesanan}
                  />
                )}
                {dataDetailPesanan?.dataRingkasanPesanan && (
                  <RingkasanPesanan
                    dataRingkasanPesanan={
                      dataDetailPesanan.dataRingkasanPesanan
                    }
                  />
                )}
                {dataDetailPesanan?.dataDetailPIC && (
                  <DetailPIC dataDetailPIC={dataDetailPesanan?.dataDetailPIC} />
                )}
              </div>

              <div className="flex flex-col gap-y-4">
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

      {/* Modal Konfirmasi Dokumen Diterima */}
      <Modal
        closeOnOutsideClick={false}
        open={isDocumentReceivedModalOpen}
        onOpenChange={setIsDocumentReceivedModalOpen}
      >
        <ModalContent className="w-modal-small">
          <ModalHeader size="small" />
          <div className="flex flex-col items-center gap-y-6 px-6 py-9">
            <h1 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
              Informasi
            </h1>
            <p className="text-center text-[14px] font-medium leading-[15.4px] text-neutral-900">
              {
                'Klik "Sudah", jika kamu sudah menerima bukti dokumen untuk menyelesaikan pesanan.'
              }
            </p>
            <div className="flex items-center gap-x-2">
              <Button
                variant="muatparts-primary-secondary"
                className="h-8"
                onClick={() => setIsDocumentReceivedModalOpen(false)}
                type="button"
              >
                Batal
              </Button>
              <Button
                variant="muatparts-primary"
                className="h-8"
                onClick={handleReceiveDocument}
                type="button"
              >
                Sudah
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>

      <pre>{JSON.stringify(dataDetailPesanan, null, 2)}</pre>
    </>
  );
};

export default DetailPesananWeb;

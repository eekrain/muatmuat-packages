import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from "@/components/Modal/Modal";
import Slider from "@/components/Slider/Slider";

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

export const ModalInformasiSlider = () => {
  return (
    <Modal closeOnOutsideClick={false}>
      <ModalTrigger>
        <IconComponent src="/icons/info16.svg" width={16} height={16} />
      </ModalTrigger>
      <ModalContent className="w-modal-small">
        <ModalHeader size="small" />
        <div className="w-full px-6 py-9">
          <Slider slides={slides} />
        </div>
      </ModalContent>
    </Modal>
  );
};

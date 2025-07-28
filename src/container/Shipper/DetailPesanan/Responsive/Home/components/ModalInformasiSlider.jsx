"use client";

// Assuming Slider is in this path
import { Modal, ModalContent } from "@/components/Modal/Modal";
import Slider from "@/components/Slider/Slider";

/**
 * @file StatusPesananInfoModal.jsx
 * @description A modal component that displays a slider with information about order status.
 */

// Data for the slider slides
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

/**
 * Renders a modal with an informational slider about order status.
 * The modal is triggered by a button and can be closed automatically on slider completion.
 */
export const ModalInformasiSlider = ({ open, onOpenChange }) => {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="w-[296px] px-5 pb-[26px] pt-[44px]">
        <Slider className="h-[380px]" slides={slides} />
      </ModalContent>
    </Modal>
  );
};

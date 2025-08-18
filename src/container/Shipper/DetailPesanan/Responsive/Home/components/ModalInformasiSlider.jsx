"use client";

// Assuming Slider is in this path
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { Slider } from "@/components/Slider/Slider";
import { useTranslation } from "@/hooks/use-translation";

/**
 * @file StatusPesananInfoModal.jsx
 * @description A modal component that displays a slider with information about order status.
 */

// Data for the slider slides
const onboardingSlides = [
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
      'Pantau perkembangan status driver secara menyeluruh dengan mengakses menu "Detail Status" pada bagian informasi driver.',
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
  const { t } = useTranslation();

  // Data for the slider slides with translations
  const slides = [
    {
      title: t("titleOrderStatus"),
      imgSrc: "/img/detail-pesanan-first-time/1-status-pesanan.webp",
      content: t("descOrderStatus"),
    },
    {
      title: t("titleOrderStatusSummary"),
      imgSrc: "/img/detail-pesanan-first-time/2-ringkasan-status-pesanan.webp",
      content: t("descOrderStatusSummary"),
    },
    {
      title: t("titleDriverStatus"),
      imgSrc: "/img/detail-pesanan-first-time/3-status-driver.webp",
      content: t("descDriverStatus"),
    },
    {
      title: t("titleDetailStatus"),
      imgSrc: "/img/detail-pesanan-first-time/4-detail-status.webp",
      content: t("descDetailStatus"),
    },
    {
      title: t("titleQRCodeLocation"),
      imgSrc: "/img/detail-pesanan-first-time/5-qr-code-lokasi.webp",
      content: t("descQRCodeLocation"),
    },
  ];

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="w-[296px] px-5 pb-[26px] pt-[44px]">
        <Slider.Root items={onboardingSlides}>
          <div className="flex h-[325px] flex-col items-center gap-5">
            <Slider.Title />

            {/* A relative container is needed for the absolutely positioned navigation */}
            <div className="relative flex w-full items-center justify-center">
              <Slider.Content className="h-[150px] w-[150px]">
                {(item) => (
                  <div className="flex h-full items-center justify-center">
                    <img
                      src={item.imgSrc}
                      alt={item.title}
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
              </Slider.Content>
            </div>

            <Slider.Description className="text-sm font-medium text-neutral-900" />
          </div>
          <Slider.Indicator className="mt-auto" />
          <Slider.MobileNavigation className="mt-6" />
        </Slider.Root>
      </ModalContent>
    </Modal>
  );
};

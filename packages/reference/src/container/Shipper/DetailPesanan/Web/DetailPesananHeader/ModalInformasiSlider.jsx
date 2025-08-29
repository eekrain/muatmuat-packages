import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from "@/components/Modal/Modal";
import { Slider } from "@/components/Slider/Slider";

import { useTranslation } from "@/hooks/use-translation";

export const ModalInformasiSlider = () => {
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

  // Translated onboarding slides
  const onboardingSlides = [
    {
      imgSrc: "https://picsum.photos/120/120?random=1",
      title: t(
        "ModalInformasiSlider.onboardingTitleOrderStatus",
        {},
        "Status Pesanan"
      ),
      description: t(
        "ModalInformasiSlider.onboardingDescOrderStatus",
        {},
        "Label informasi mengenai status terkini dari pesanan yang anda lakukan."
      ),
    },
    {
      imgSrc: "https://picsum.photos/120/120?random=2",
      title: t(
        "ModalInformasiSlider.onboardingTitleTrackDelivery",
        {},
        "Lacak Pengiriman"
      ),
      description: t(
        "ModalInformasiSlider.onboardingDescTrackDelivery",
        {},
        "Monitor posisi driver dan estimasi waktu tiba secara real-time."
      ),
    },
    {
      imgSrc: "https://picsum.photos/120/120?random=3",
      title: t(
        "ModalInformasiSlider.onboardingTitleEasyPayment",
        {},
        "Pembayaran Mudah"
      ),
      description: t(
        "ModalInformasiSlider.onboardingDescEasyPayment",
        {},
        "Berbagai metode pembayaran yang aman dan praktis untuk Anda."
      ),
    },
    {
      imgSrc: "https://picsum.photos/120/120?random=4",
      title: t(
        "ModalInformasiSlider.onboardingTitleCustomerSupport",
        {},
        "Dukungan Pelanggan"
      ),
      description: t(
        "ModalInformasiSlider.onboardingDescCustomerSupport",
        {},
        "Tim kami siap membantu Anda 24/7 untuk setiap kendala."
      ),
    },
    {
      imgSrc: "https://picsum.photos/120/120?random=5",
      title: t("ModalInformasiSlider.onboardingTitleComplete", {}, "Selesai!"),
      description: t(
        "ModalInformasiSlider.onboardingDescComplete",
        {},
        "Nikmati layanan pengiriman terbaik dari kami."
      ),
    },
  ];

  return (
    <Modal closeOnOutsideClick={false}>
      <ModalTrigger>
        <IconComponent src="/icons/info16.svg" width={16} height={16} />
      </ModalTrigger>
      <ModalContent className="w-modal-small">
        <ModalHeader size="small" />
        <div className="w-full px-6 py-9">
          <Slider.Root
            items={onboardingSlides}
            className="flex h-[322px] flex-col items-center justify-center gap-6 p-6"
          >
            {/* A relative container is needed for the absolutely positioned navigation */}
            <div className="relative flex w-full items-center justify-center">
              <Slider.DesktopNavigation />

              <Slider.Content className="h-[120px] w-[120px]">
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

            <div className="text-center">
              <Slider.Title className="mb-3 text-lg font-bold text-neutral-900" />
              <Slider.Description className="text-sm font-medium text-neutral-900" />
            </div>

            <Slider.Indicator className="mt-auto" />
          </Slider.Root>
        </div>
      </ModalContent>
    </Modal>
  );
};

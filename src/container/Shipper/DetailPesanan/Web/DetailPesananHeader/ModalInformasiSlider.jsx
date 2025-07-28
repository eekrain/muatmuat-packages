import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from "@/components/Modal/Modal";
import { Slider } from "@/components/Slider/Slider";

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
// Sample data for the slider slides
const onboardingSlides = [
  {
    imgSrc: "https://picsum.photos/120/120?random=1",
    title: "Status Pesanan",
    description:
      "Label informasi mengenai status terkini dari pesanan yang anda lakukan.",
  },
  {
    imgSrc: "https://picsum.photos/120/120?random=2",
    title: "Lacak Pengiriman",
    description:
      "Monitor posisi driver dan estimasi waktu tiba secara real-time.",
  },
  {
    imgSrc: "https://picsum.photos/120/120?random=3",
    title: "Pembayaran Mudah",
    description: "Berbagai metode pembayaran yang aman dan praktis untuk Anda.",
  },
  {
    imgSrc: "https://picsum.photos/120/120?random=4",
    title: "Dukungan Pelanggan",
    description: "Tim kami siap membantu Anda 24/7 untuk setiap kendala.",
  },
  {
    imgSrc: "https://picsum.photos/120/120?random=5",
    title: "Selesai!",
    description: "Nikmati layanan pengiriman terbaik dari kami.",
  },
];

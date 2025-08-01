"use client";

import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from "@/components/Modal/Modal";
import { Slider } from "@/components/Slider/Slider";

const onboardingSlides = [
  {
    title: "Unggah Armada Massal",
    imgSrc: "/img/tambah-armada-massal/popupinformasi-slider-1.png",
    content: "Kamu bisa mengunggah armada secara massal menggunakan fitur ini.",
  },
  {
    title: "Unggah Armada Massal",
    imgSrc: "/img/tambah-armada-massal/popupinformasi-slider-2.png",
    content:
      "Ada dua pilihan untuk mengunggah armada secara massal : <ol><li>Menggunakan file excel</li><li>Mengisi kolom yang sudah tersedia</li></ol>",
  },
  {
    title: "Unggah Dengan Excel",
    imgSrc: "/img/tambah-armada-massal/popupinformasi-slider-3.png",
    content:
      "Kamu bisa mengunggah dengan langkah :<ol><li>Unduh template</li><li>Isi kolom yang tersedia (kamu bisa melihat contoh sheet prosedur)</li><li>Unggah file excel di kolom yang tersedia</li></ol>",
  },
  {
    title: "Isi Kolom Massal",
    imgSrc: "/img/tambah-armada-massal/popupinformasi-slider-4.png",
    content:
      "Kamu bisa mengunggah dengan langkah :<ol><li>Isi kolom yang tersedia</li><li>Klik Simpan (jika ingin menambah armada klik button Tambah padahalaman tersebut)</li></ol>",
  },
];
export default function PopUpInformasi() {
  return (
    <Modal>
      <ModalTrigger>
        <IconComponent
          src="/icons/info16.svg"
          width={24}
          height={24}
          className="stroke-[1.5] text-neutral-600"
        />
      </ModalTrigger>
      <ModalContent className="w-modal-small">
        <ModalHeader size="small" />
        <div>
          <Slider.Root
            items={onboardingSlides}
            className="flex h-[420px] flex-col p-6"
          >
            <div className="flex flex-col items-center">
              {/* A relative container is needed for the absolutely positioned navigation */}
              <div className="relative flex w-full items-center justify-center">
                <Slider.DesktopNavigation />
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
              <Slider.Title className="mt-6 text-lg font-bold text-neutral-900" />
              <Slider.Description className="text-sm font-medium text-neutral-900" />
            </div>
            <Slider.Indicator className="" />
          </Slider.Root>
        </div>
      </ModalContent>
    </Modal>
  );
}

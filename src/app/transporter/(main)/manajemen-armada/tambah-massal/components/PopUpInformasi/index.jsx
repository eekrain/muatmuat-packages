"use client";

import { useEffect, useRef, useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from "@/components/Modal/Modal";
import { Slider } from "@/components/Slider/Slider";
import { useTranslation } from "@/hooks/use-translation";
import { updateUserPopupPreference } from "@/services/Transporter/manajemen-armada/updateUserPopupPreference";

export default function PopUpInformasi({
  popupPreference,
  isLoading,
  error,
  mutatePopupPreference: mutate,
}) {
  const { t } = useTranslation();

  const onboardingSlides = [
    {
      title: t(
        "PopUpInformasi.titleUnggahArmadaMassal",
        {},
        "Unggah Armada Massal"
      ),
      imgSrc: "/img/tambah-armada-massal/popupinformasi-slider-1.png",
      content: t(
        "PopUpInformasi.contentUnggahArmadaMassal",
        {},
        "Kamu bisa mengunggah armada secara massal menggunakan fitur ini."
      ),
    },
    {
      title: t(
        "PopUpInformasi.titleUnggahArmadaMassalSecond",
        {},
        "Unggah Armada Massal"
      ),
      imgSrc: "/img/tambah-armada-massal/popupinformasi-slider-2.png",
      content: t(
        "PopUpInformasi.contentDuaPilihanUnggah",
        {},
        "Ada dua pilihan untuk mengunggah armada secara massal : <ol><li>Menggunakan file excel</li><li>Mengisi kolom yang sudah tersedia</li></ol>"
      ),
    },
    {
      title: t(
        "PopUpInformasi.titleUnggahDenganExcel",
        {},
        "Unggah Dengan Excel"
      ),
      imgSrc: "/img/tambah-armada-massal/popupinformasi-slider-3.png",
      content: t(
        "PopUpInformasi.contentUnggahDenganExcel",
        {},
        "Kamu bisa mengunggah dengan langkah :<ol><li>Unduh template</li><li>Isi kolom yang tersedia (kamu bisa melihat contoh sheet prosedur)</li><li>Unggah file excel di kolom yang tersedia</li></ol>"
      ),
    },
    {
      title: t("PopUpInformasi.titleIsiKolomMassal", {}, "Isi Kolom Massal"),
      imgSrc: "/img/tambah-armada-massal/popupinformasi-slider-4.png",
      content: t(
        "PopUpInformasi.contentIsiKolomMassal",
        {},
        "Kamu bisa mengunggah dengan langkah :<ol><li>Isi kolom yang tersedia</li><li>Klik Simpan (jika ingin menambah armada klik button Tambah padahalaman tersebut)</li></ol>"
      ),
    },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const hasShownInSession = useRef(false);

  // useEffect hanya untuk membuka modal secara otomatis
  useEffect(() => {
    if (
      popupPreference &&
      popupPreference.showPopup &&
      !hasShownInSession.current
    ) {
      setIsModalOpen(true);
      hasShownInSession.current = true;
    }
  }, [popupPreference]);

  // useEffect untuk menyinkronkan checkbox saat modal dibuka secara manual
  useEffect(() => {
    if (isModalOpen && popupPreference) {
      setDontShowAgain(!popupPreference.showPopup);
    }
  }, [isModalOpen, popupPreference]);

  const handleOpenChange = async (openState) => {
    setIsModalOpen(openState);

    // Logic untuk menyimpan preferensi hanya dijalankan saat modal ditutup
    if (!openState) {
      const preferenceFromApi = !popupPreference?.showPopup;
      if (dontShowAgain !== preferenceFromApi) {
        setIsUpdating(true);
        const newShowPopupStatus = !dontShowAgain;
        try {
          const response = await updateUserPopupPreference(newShowPopupStatus);
          if (response?.Message?.Code === 200) {
            mutate({
              ...popupPreference,
              showPopup: response.Data?.showPopup,
              lastUpdated: response.Data?.updatedAt,
            });
          } else {
            throw new Error(
              response?.Message?.Text ||
                t(
                  "PopUpInformasi.errorGagalMemperbarui",
                  {},
                  "Gagal memperbarui preferensi"
                )
            );
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("Gagal memperbarui preferensi popup:", err);
        } finally {
          setIsUpdating(false);
        }
      }
    }
  };

  return (
    // Gunakan `open` dan `onOpenChange` untuk mengelola state modal
    <Modal open={isModalOpen} onOpenChange={handleOpenChange}>
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
          {isLoading ? (
            <div className="flex h-[420px] items-center justify-center p-6">
              <div className="text-center text-neutral-600">
                {t("PopUpInformasi.statusLoading", {}, "Loading...")}
              </div>
            </div>
          ) : error ? (
            <div className="flex h-[420px] items-center justify-center p-6">
              <div className="text-center text-red-600">
                <div className="mb-2">
                  {t(
                    "PopUpInformasi.errorGagalMemuatPreferensi",
                    {},
                    "Gagal memuat preferensi popup"
                  )}
                </div>
                <div className="text-sm text-neutral-500">
                  {error.message ||
                    t(
                      "PopUpInformasi.errorTerjadiKesalahan",
                      {},
                      "Terjadi kesalahan saat memuat data"
                    )}
                </div>
              </div>
            </div>
          ) : (
            <Slider.Root
              items={onboardingSlides}
              className="flex flex-col p-9"
              loop={false}
            >
              <div className="flex flex-col items-center">
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
              <div className="mt-6 flex items-center justify-center">
                <label className="flex items-center space-x-2 text-xs font-medium text-neutral-900">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    disabled={isUpdating}
                    className="h-4 w-4 rounded border-neutral-300 text-primary-700 focus:ring-primary-700 disabled:opacity-50"
                  />
                  <span className={isUpdating ? "opacity-50" : ""}>
                    {isUpdating
                      ? t("PopUpInformasi.statusMenyimpan", {}, "Menyimpan...")
                      : t(
                          "PopUpInformasi.labelJanganTampilkanLagi",
                          {},
                          "Jangan tampilkan lagi"
                        )}
                  </span>
                </label>
              </div>
            </Slider.Root>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
}

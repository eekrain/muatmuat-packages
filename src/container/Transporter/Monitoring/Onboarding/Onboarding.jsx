"use client";

import { useEffect, useRef, useState } from "react";

import Checkbox from "@/components/Form/Checkbox";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/Modal/Modal";
import { Slider } from "@/components/Slider/Slider";
import { useGetUserPopupPreference } from "@/services/Transporter/manajemen-armada/getUserPopupPreference";
import { updateUserPopupPreference } from "@/services/Transporter/manajemen-armada/updateUserPopupPreference";

const onboardingSlides = [
  {
    title: "Daftar Pesanan Aktif",
    imgSrc: "/img/monitoring/onboarding/slide-1.png",
    content:
      "Kumpulan permintaan jasa angkut dari shipper yang telah kamu terima, baik yang belum berjalan maupun sedang berjalan dan akan otomatis hilang setelah pesanan selesai.",
  },
  {
    title: "Respon Perubahan",
    imgSrc: "/img/monitoring/onboarding/slide-2.png",
    content:
      "Status yang menandakan bahwa shipper telah mengubah informasi pada pesanan sehingga kamu perlu memeriksa dan merespon perubahan tersebut.",
  },
  {
    title: "Perlu Konfirmasi Siap",
    imgSrc: "/img/monitoring/onboarding/slide-3.png",
    content:
      "Status yang menandakan bahwa pesanan memerlukan konfirmasi kesiapan kamu untuk menangani pesanan tersebut.",
  },
  {
    title: "Assign Armada",
    imgSrc: "/img/monitoring/onboarding/slide-4.png",
    content:
      "Status yang menandakan bahwa pesanan telah mendekati hari muat dan memerlukan penugasan suatu armada.",
  },
  {
    title: "Armada Dijadwalkan",
    imgSrc: "/img/monitoring/onboarding/slide-5.png",
    content:
      "Status yang menandakan bahwa armada sudah ditugaskan untuk suatu pesanan terjadwal dan sedang menunggu waktu muat yang telah ditentukan.",
  },
  {
    title: "Pesanan Terkonfirmasi",
    imgSrc: "/img/monitoring/onboarding/slide-6.png",
    content:
      "Status yang menandakan bahwa armada telah ditugaskan untuk suatu pesanan instan dan sedang menunggu waktu muat yang telah ditentukan.",
  },
  {
    title: "Menunggu Konfirmasi",
    imgSrc: "/img/monitoring/onboarding/slide-7.png",
    content:
      "Status yang menandakan bahwa kamu telah menerima suatu pesanan instan namun masih menunggu pembayaran dari shipper sebelum proses dapat dilanjutkan.",
  },
  {
    title: "Proses Muat",
    imgSrc: "/img/monitoring/onboarding/slide-8.png",
    content:
      "Status yang mencakup rangkaian aktivitas pengambilan barang (muat), mulai dari perjalanan ke lokasi, kedatangan, antrian, hingga proses sedang memuat barang.",
  },
  {
    title: "Proses Bongkar",
    imgSrc: "/img/monitoring/onboarding/slide-9.png",
    content:
      "Status yang mencakup rangkaian aktivitas pengiriman barang (bongkar), mulai dari perjalanan ke lokasi, kedatangan, antrian, hingga proses sedang membongkar barang.",
  },
];

const Onboarding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const hasShownInSession = useRef(false);

  const {
    data: popupPreference,
    isLoading,
    error,
    mutate,
  } = useGetUserPopupPreference();

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
              response?.Message?.Text || "Gagal memperbarui preferensi"
            );
          }
        } catch (err) {
          console.error("Gagal memperbarui preferensi popup:", err);
        } finally {
          setIsUpdating(false);
        }
      }
    }
  };

  return (
    <>
      <InfoTooltip
        side="right"
        trigger={
          <div onClick={() => setIsModalOpen(true)}>
            <IconComponent
              src="/icons/info16.svg"
              width={14}
              height={14}
              className="cursor-pointer text-neutral-700"
            />
          </div>
        }
      >
        <p>Daftar pesanan aktif yang sedang berlangsung.</p>
      </InfoTooltip>

      {/* Modal is separate from tooltip */}
      <Modal open={isModalOpen} onOpenChange={handleOpenChange}>
        <ModalContent className="w-modal-small" type="muattrans">
          <ModalHeader size="small" />
          {/* Hidden title for accessibility */}
          <ModalTitle className="sr-only">
            Panduan Daftar Pesanan Aktif
          </ModalTitle>
          <div>
            {isLoading ? (
              <div className="flex h-[420px] items-center justify-center p-6">
                <div className="text-center text-neutral-600">Loading...</div>
              </div>
            ) : error ? (
              <div className="flex h-[420px] items-center justify-center p-6">
                <div className="text-center text-red-600">
                  <div className="mb-2">Gagal memuat preferensi popup</div>
                  <div className="text-sm text-neutral-500">
                    {error.message || "Terjadi kesalahan saat memuat data"}
                  </div>
                </div>
              </div>
            ) : (
              <Slider.Root
                items={onboardingSlides}
                className="flex h-[420px] flex-col p-6"
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
                <Slider.Indicator className="flex-1" />
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={dontShowAgain}
                    onChange={({ checked }) => setDontShowAgain(checked)}
                    disabled={isUpdating}
                    appearance={{
                      labelClassName:
                        "text-xs font-medium text-neutral-900 leading-[120%]",
                    }}
                    className="gap-2"
                  >
                    <span
                      className="text-xs font-medium leading-[120%] text-neutral-900"
                      style={{
                        fontFamily: "'Avenir Next LT Pro'",
                        fontWeight: 500,
                        fontSize: "12px",
                        lineHeight: "120%",
                        color: "#000000",
                      }}
                    >
                      {isUpdating ? "Menyimpan..." : "Jangan Tampilkan Lagi"}
                    </span>
                  </Checkbox>
                </div>
              </Slider.Root>
            )}
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Onboarding;

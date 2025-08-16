import Image from "next/image";
import { useState } from "react";

import { ChevronDown } from "lucide-react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  StepperContainer,
  StepperItem,
  StepperItemResponsive,
} from "@/components/Stepper/Stepper";
import AlasanPembatalanModal from "@/container/Shared/OrderModal/AlasanPembatalanModal";
import useDevice from "@/hooks/use-device";
// Tambahan: Import toast untuk notifikasi (opsional, tapi baik untuk feedback)
import { toast } from "@/lib/toast";

import ModalUbahDriver from "./ModalUbahDriver";
import PopUpBatalkanArmada from "./PopUpBatalkanArmada";

// --- Main Card Component ---

function CardLacakArmada({
  plateNumber,
  driverName,
  vehicleImageUrl,
  onViewSosClick,
  vehicleId, // Prop yang dibutuhkan modal
  driverId, // Prop yang dibutuhkan modal
  // Tambahan: Prop order untuk dilempar ke modal pembatalan
  order,
}) {
  const { isMobile } = useDevice();

  // --- State untuk semua modal ---
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isBatalkanArmadaPopupOpen, setIsBatalkanArmadaPopupOpen] =
    useState(false);
  // Tambahan: State untuk modal "Ubah Armada" (menggunakan AlasanPembatalanModal)
  const [isUbahArmadaModalOpen, setIsUbahArmadaModalOpen] = useState(false);
  const [isSubmittingUbahArmada, setIsSubmittingUbahArmada] = useState(false);

  const steps = [
    { label: "Armada Dijadwalkan", icon: "/icons/info-pra-tender.svg" },
    { label: "Proses Bongkar", icon: "/icons/muatan16.svg" },
    { label: "Proses Muat", icon: "/icons/stepper/stepper-box-opened.svg" },
    {
      label: "Dokumen Sedang Disiapkan",
      icon: "/icons/document-disiapkan.svg",
    },
    { label: "Proses Pengiriman Dokumen", icon: "/icons/document-dikirim.svg" },
    { label: "Selesai", icon: "/icons/check16.svg" },
  ];

  const historySteps = [
    { label: "Armada Dijadwalkan", icon: "/icons/info-pra-tender.svg" },
    {
      label: "Dibatalkan",
      status: "CANCELED",
      icon: "/icons/silang-white.svg",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  // --- Handlers untuk Modal Ubah Driver ---
  const handleOpenDriverModal = () => {
    setIsDriverModalOpen(true);
  };

  const handleCloseDriverModal = () => {
    setIsDriverModalOpen(false);
  };

  const handleDriverUpdateSuccess = (updatedVehicleId, newDriverId) => {
    console.log(
      `Driver untuk vehicle ${updatedVehicleId} berhasil diubah menjadi ${newDriverId}`
    );
    toast.success("Driver berhasil diubah!");
    handleCloseDriverModal();
  };

  // --- Handlers untuk Popup Batalkan Armada ---
  const handleCancelFleet = () => {
    setIsBatalkanArmadaPopupOpen(true);
  };

  const handleConfirmCancelFleet = () => {
    alert("Armada dibatalkan!");
    setIsBatalkanArmadaPopupOpen(false);
  };

  // Tambahan: Handlers untuk Modal Ubah Armada (Alasan Pembatalan) ---
  const handleOpenUbahArmadaModal = () => {
    setIsUbahArmadaModalOpen(true);
  };

  const handleCloseUbahArmadaModal = () => {
    setIsUbahArmadaModalOpen(false);
  };

  const handleConfirmUbahArmada = async (data) => {
    // Fungsi ini akan menerima data dari form AlasanPembatalanModal
    setIsSubmittingUbahArmada(true);
    console.log("Data pembatalan untuk Ubah Armada:", data);
    try {
      // Di sini Anda akan memanggil API untuk membatalkan/mengubah armada
      // Contoh simulasi API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(
        "Permintaan perubahan armada berhasil dikirim. Silakan tambahkan armada baru."
      );
      // Setelah berhasil, tutup modal
      handleCloseUbahArmadaModal();
      // Anda mungkin perlu memuat ulang data atau mengubah state di sini
    } catch (error) {
      console.error("Gagal mengubah armada:", error);
      toast.error("Gagal mengubah armada. Silakan coba lagi.");
    } finally {
      setIsSubmittingUbahArmada(false);
    }
  };

  // Variabel untuk simulasi state
  const isSOS = false;
  const isHistory = false;
  const emptyFleetData = false;
  const emptyHistory = false;

  // --- Render Kondisional untuk Tampilan Kosong (Tidak diubah) ---
  if (emptyFleetData) {
    // ... (kode tetap sama)
  }
  if (emptyHistory) {
    // ... (kode tetap sama)
  }
  // --- Render untuk Tampilan Riwayat (Tidak diubah) ---
  if (isHistory) {
    // ... (kode tetap sama)
  }

  // --- Render Utama untuk Tampilan Aktif ---
  return (
    <>
      <div className="border-netral-400 w-full rounded-xl border px-4 py-5">
        {/* Header dengan Aksi */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BadgeStatus variant="primary">Armada Dijadwalkan</BadgeStatus>
            {isSOS && (
              <>
                <div className="inline-flex items-center justify-center rounded-md bg-red-500 px-3 py-1 text-xs font-bold text-white">
                  SOS
                </div>
                <button
                  onClick={onViewSosClick}
                  className="text-xs font-medium text-blue-600"
                >
                  Lihat SOS
                </button>
              </>
            )}
          </div>

          <SimpleDropdown>
            <SimpleDropdownTrigger asChild>
              <button className="flex items-center rounded-lg border border-gray-600 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                Aksi Lainnya
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </SimpleDropdownTrigger>
            <SimpleDropdownContent align="end">
              {/* Perubahan: Hubungkan onClick ke handler yang benar */}
              <SimpleDropdownItem onClick={handleOpenUbahArmadaModal}>
                Ubah Armada
              </SimpleDropdownItem>
              <SimpleDropdownItem onClick={handleOpenDriverModal}>
                Ubah Driver
              </SimpleDropdownItem>
              <SimpleDropdownItem onClick={handleCancelFleet}>
                Batalkan Armada
              </SimpleDropdownItem>
            </SimpleDropdownContent>
          </SimpleDropdown>
        </div>

        {/* Konten Utama (Tidak diubah) */}
        <div className="mt-4 flex items-start justify-between">
          {/* Info Kendaraan & Driver */}
          <div className="flex items-center gap-4">
            <img
              src={vehicleImageUrl || "/img/depan.png"}
              alt="Truck"
              className="h-14 w-14 rounded-md bg-gray-100 object-cover"
            />
            <div>
              <div className="flex flex-col gap-3">
                <p className="text-sm font-bold text-neutral-900">
                  {plateNumber || "B 2222 XYZ"}
                </p>
                <div className="flex items-center gap-1">
                  <IconComponent
                    src={"/icons/user16.svg"}
                    width={16}
                    height={16}
                  />
                  <p className="text-xs font-medium text-neutral-900">
                    {driverName || "Muklason"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Aktif */}
          <div className="w-full max-w-lg">
            <StepperContainer
              totalStep={steps.length}
              activeIndex={activeIndex}
            >
              {steps.map((step, index) =>
                isMobile ? (
                  <StepperItemResponsive
                    key={index}
                    step={step}
                    index={index}
                  />
                ) : (
                  <StepperItem key={index} step={step} index={index} />
                )
              )}
            </StepperContainer>
          </div>
        </div>
      </div>

      {/* Render Modal Pemilihan Driver (hanya jika isDriverModalOpen true) */}
      {isDriverModalOpen && (
        <ModalUbahDriver
          onClose={handleCloseDriverModal}
          onSuccess={handleDriverUpdateSuccess}
          vehicleId={vehicleId}
          vehiclePlate={plateNumber}
          currentDriverId={driverId}
          title="Ubah Driver"
        />
      )}

      {/* Render Popup Batalkan Armada */}
      <PopUpBatalkanArmada
        isOpen={isBatalkanArmadaPopupOpen}
        onClose={() => setIsBatalkanArmadaPopupOpen(false)}
        onConfirm={handleConfirmCancelFleet}
      />

      {/* Tambahan: Render Modal Alasan Pembatalan untuk "Ubah Armada" sementara */}
      <AlasanPembatalanModal
        isOpen={isUbahArmadaModalOpen}
        onClose={handleCloseUbahArmadaModal}
        onConfirm={handleConfirmUbahArmada}
        isLoading={isSubmittingUbahArmada}
        order={order || { id: vehicleId }} // Menggunakan prop 'order' atau fallback
      />
    </>
  );
}

export default CardLacakArmada;

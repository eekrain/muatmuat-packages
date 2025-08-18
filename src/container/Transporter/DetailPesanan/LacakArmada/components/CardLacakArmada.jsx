import { usePathname } from "next/navigation";
import { useState } from "react";

import { ChevronDown } from "lucide-react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import IconComponent from "@/components/IconComponent/IconComponent";
import { StepperContainer, StepperItem } from "@/components/Stepper/Stepper";
import AlasanPembatalanModal from "@/container/Shared/OrderModal/AlasanPembatalanModal";
import useDevice from "@/hooks/use-device";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { toast } from "@/lib/toast";

import ModalUbahDriver from "./ModalUbahDriver";
import PopUpBatalkanArmada from "./PopUpBatalkanArmada";

// --- Main Card Component ---

function CardLacakArmada({
  plateNumber,
  driverName,
  vehicleImageUrl,
  status,
  stepperData,
  onViewSosClick,
  vehicleId, // Prop yang dibutuhkan modal
  driverId, // Prop yang dibutuhkan modal
  // Tambahan: Prop order untuk dilempar ke modal pembatalan
  order,
}) {
  const { isMobile } = useDevice();
  // Nanti disesuaikan lagi
  const pathname = usePathname();

  const segments = pathname.replace(/\/+$/, "").split("/");
  const root = `/${segments[1] || ""}`;
  const isDaftarPesanan = root === "/daftar-pesanan";
  const isMonitoring = root === "/monitoring";

  // --- State untuk semua modal ---
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isBatalkanArmadaPopupOpen, setIsBatalkanArmadaPopupOpen] =
    useState(false);
  // Tambahan: State untuk modal "Ubah Armada" (menggunakan AlasanPembatalanModal)
  const [isUbahArmadaModalOpen, setIsUbahArmadaModalOpen] = useState(false);
  const [isSubmittingUbahArmada, setIsSubmittingUbahArmada] = useState(false);

  // Gunakan stepperData dari props atau fallback ke default
  const steps = stepperData || [
    { label: "Armada Dijadwalkan", icon: "/icons/info-pra-tender.svg" },
    { label: "Proses Bongkar", icon: "/icons/muatan16.svg" },
    { label: "Proses Muat", icon: "/icons/stepper/stepper-box-opened.svg" },
    {
      label: "Dokumen Sedang Disiapkan",
      icon: "/icons/stepper/stepper-document-preparing.svg",
    },
    {
      label: "Proses Pengiriman Dokumen",
      icon: "/icons/stepper/stepper-document-delivery.svg",
    },
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
  console.log(status, "status");
  // Function untuk mendapatkan activeIndex berdasarkan status
  const getActiveIndex = (status) => {
    switch (status) {
      case "COMPLETED":
        return 5; // Selesai
      case "DOCUMENT_DELIVERY":
        return 4; // Proses Pengiriman Dokumen
      case "DOCUMENT_PREPARATION":
        return 3; // Dokumen Sedang Disiapkan
      case "LOADING":
        return 2; // Proses Muat
      case "UNLOADING":
        return 1; // Proses Bongkar
      default:
        return 0; // Armada Dijadwalkan
    }
  };

  // Set activeIndex berdasarkan status
  const activeIndex = getActiveIndex(status);

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

  // Set isSOS state
  const [isSOS, setIsSOS] = useState(false);
  const isHistory = false;
  const emptyFleetData = false;
  const emptyHistory = false;

  // Function untuk mendapatkan status label
  const getStatusLabel = (status) => {
    switch (status) {
      case "COMPLETED":
        return "Selesai";
      case "LOADING":
        return "Proses Muat";
      case "UNLOADING":
        return "Proses Bongkar";
      case "DOCUMENT_PREPARATION":
        return "Dokumen Sedang Disiapkan";
      case "DOCUMENT_DELIVERY":
        return "Proses Pengiriman Dokumen";
      default:
        return "Armada Dijadwalkan";
    }
  };

  // Function untuk mendapatkan variant badge
  const getBadgeVariant = (status) => {
    if (
      status === OrderStatusEnum.WAITING_PAYMENT_1 ||
      status === OrderStatusEnum.WAITING_PAYMENT_2 ||
      status === OrderStatusEnum.WAITING_PAYMENT_3 ||
      status === OrderStatusEnum.WAITING_PAYMENT_4 ||
      status === OrderStatusEnum.WAITING_REPAYMENT_1 ||
      status === OrderStatusEnum.WAITING_REPAYMENT_2
    ) {
      return "warning";
    }
    if (
      status === OrderStatusEnum.CANCELED_BY_SHIPPER ||
      status === OrderStatusEnum.CANCELED_BY_SYSTEM ||
      status === OrderStatusEnum.CANCELED_BY_TRANSPORTER
    ) {
      return "error";
    }
    if (status === OrderStatusEnum.COMPLETED) {
      return "success";
    }
    return "primary";
  };

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
      <div className="flex w-full flex-col gap-4 rounded-xl border border-neutral-300 bg-white p-4">
        {/* Header dengan Aksi */}
        <div className="flex items-center justify-between">
          <div className="mb-2 flex items-center gap-2">
            <BadgeStatusPesanan
              variant={getBadgeVariant(status)}
              className="w-fit"
            >
              {getStatusLabel(status)}
            </BadgeStatusPesanan>
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
          {isMonitoring && (
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
          )}
        </div>

        <div className="flex w-full items-center justify-between">
          {/* Driver Info */}
          <div className="flex w-[360px] items-center gap-3">
            {/* Icon Truck */}
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border-neutral-400 bg-neutral-100">
              <img
                src={vehicleImageUrl || "/img/truck.png"}
                alt="Truck"
                className="h-14 w-14 rounded-md bg-gray-100 object-cover"
              />
            </div>
            {/* Plate Number dan Driver */}
            <div className="flex flex-col">
              <h3 className="mb-1 text-sm font-bold text-neutral-900">
                {plateNumber || "B 2222 XYZ"}
              </h3>
              <div className="flex items-center gap-2">
                {" "}
                {/* <-- Perubahan di sini */}
                <IconComponent
                  src="/icons/user16.svg"
                  width={16}
                  height={16}
                  className="flex-shrink-0 text-neutral-500"
                />
                <span
                  className="line-clamp-2 max-w-[280px] text-[12px] font-medium leading-4 text-neutral-900"
                  title={driverName || "Muklason"}
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    wordBreak: "break-word",
                  }}
                >
                  {driverName || "Muklason"}
                </span>
              </div>
            </div>
          </div>
          {/* Right Section - Stepper Progress */}
          <div className="flex flex-1 items-center justify-end">
            <div className="w-full max-w-2xl">
              <StepperContainer
                activeIndex={activeIndex}
                totalStep={steps.length}
              >
                {steps.map((step, stepIndex) => (
                  <StepperItem
                    key={step.status || stepIndex}
                    step={step}
                    index={stepIndex}
                  />
                ))}
              </StepperContainer>
            </div>
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

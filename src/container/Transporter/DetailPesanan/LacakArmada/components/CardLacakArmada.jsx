import { usePathname } from "next/navigation";
import { useState } from "react";

import { ChevronDown } from "lucide-react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import IconComponent from "@/components/IconComponent/IconComponent";
import { StepperContainer, StepperItem } from "@/components/Stepper/Stepper";
// --- (1) UNCOMMENT baris ini ---
import AlasanPembatalanModal from "@/container/Shared/OrderModal/AlasanPembatalanModal";
import useDevice from "@/hooks/use-device";
import { toast } from "@/lib/toast";
import {
  TRACKING_STATUS,
  getTrackingStatusBadge,
} from "@/utils/Transporter/trackingStatus";

import ModalUbahArmada from "./ModalUbahArmada";
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
  vehicleId, // Prop untuk modal
  driverId, // Prop untuk modal
  order,
  hasSOSAlert = false,
}) {
  const { isMobile } = useDevice();
  const pathname = usePathname();

  const segments = pathname.replace(/\/+$/, "").split("/");
  const root = `/${segments[1] || ""}`;
  const isDaftarPesanan = root === "/daftar-pesanan";
  const isMonitoring = root === "/monitoring";

  // --- State untuk semua modal ---
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isBatalkanArmadaPopupOpen, setIsBatalkanArmadaPopupOpen] =
    useState(false);
  const [isUbahArmadaModalOpen, setIsUbahArmadaModalOpen] = useState(false);
  const [isSubmittingUbahArmada, setIsSubmittingUbahArmada] = useState(false);

  // --- (2) TAMBAHKAN state untuk AlasanPembatalanModal ---
  const [isAlasanPembatalanModalOpen, setIsAlasanPembatalanModalOpen] =
    useState(false);

  // Data stepper - always show 6 steps for loading status
  const steps = [
    {
      label: "Armada Dijadwalkan",
      icon: "/icons/stepper/stepper-scheduled.svg",
    },
    { label: "Proses Muat", icon: "/icons/stepper/stepper-box.svg" },
    { label: "Proses Bongkar", icon: "/icons/stepper/stepper-box-opened.svg" },
    {
      label: "Dokumen Sedang Disiapkan",
      icon: "/icons/stepper/stepper-document-preparing.svg",
    },
    {
      label: "Proses Pengiriman Dokumen",
      icon: "/icons/stepper/stepper-document-delivery.svg",
    },
    { label: "Selesai", icon: "/icons/stepper/stepper-completed.svg" },
  ];

  const cancelledSteps = [
    {
      label: "Armada Dijadwalkan",
      icon: "/icons/stepper/stepper-scheduled.svg",
    },
    {
      label: "Dibatalkan",
      status: "CANCELED",
      icon: "/icons/silang-white.svg",
    },
  ];

  // Fungsi untuk menentukan apakah status adalah pembatalan
  const isCancelledStatus = (s) => {
    return [
      "CANCELLED_BY_TRANSPORTER",
      "CANCELLED_BY_SHIPPER",
      "CANCELLED_BY_SYSTEM",
    ].includes(s);
  };

  const getActiveIndex = (s) => {
    // Jika status pembatalan, gunakan index 1 (step "Dibatalkan")
    if (isCancelledStatus(s)) {
      return 1;
    }

    switch (s) {
      case TRACKING_STATUS.COMPLETED:
        return 5; // Selesai (6 step: index 5)
      case "DOCUMENT_DELIVERY":
        return 4; // Proses Pengiriman Dokumen (6 step: index 4)
      case "DOCUMENT_PREPARATION":
        return 3; // Dokumen Sedang Disiapkan (6 step: index 3)
      case TRACKING_STATUS.LOADING:
        return 1; // Proses Muat (6 step: index 1)
      case "HEADING_TO_LOADING":
        return 1; // Proses Muat
      case "HEADING_TO_UNLOADING":
        return 2; // Proses Bongkar (6 step: index 2)
      case TRACKING_STATUS.UNLOADING:
        return 2; // Proses Bongkar (6 step: index 2)
      case "WAITING_CONFIRMATION_SHIPPER":
        return -1; // Tidak ada step yang aktif (semua abu-abu)
      case "SCHEDULED_FLEET":
        return 0; // Armada Dijadwalkan (step 1, index 0)
      default:
        return 0;
    }
  };

  const activeIndex = getActiveIndex(status);

  // Pilih steps berdasarkan status
  const currentSteps = isCancelledStatus(status) ? cancelledSteps : steps;

  // --- Handlers Ubah Driver ---
  const handleOpenDriverModal = () => setIsDriverModalOpen(true);
  const handleCloseDriverModal = () => setIsDriverModalOpen(false);
  const handleDriverUpdateSuccess = (updatedVehicleId, newDriverId) => {
    toast.success("Driver berhasil diubah!");
    handleCloseDriverModal();
  };

  // --- (3) UBAH handler Batalkan Armada ---
  const handleCancelFleet = () => setIsBatalkanArmadaPopupOpen(true);
  const handleConfirmCancelFleet = () => {
    // Tutup popup pertama
    setIsBatalkanArmadaPopupOpen(false);
    // Buka modal alasan pembatalan
    setIsAlasanPembatalanModalOpen(true);
  };

  // --- (4) TAMBAHKAN handler untuk AlasanPembatalanModal ---
  const handleCloseAlasanPembatalanModal = () => {
    setIsAlasanPembatalanModalOpen(false);
  };
  const handleConfirmAlasanPembatalan = async (data) => {
    // Logika untuk mengirim data pembatalan ke API ada di sini
    console.log("Submitting fleet cancellation with reason:", data);
    toast.success("Permintaan pembatalan armada berhasil dikirim.");
    // Tutup modal setelah konfirmasi
    handleCloseAlasanPembatalanModal();
    // Anda bisa menambahkan logic refresh data di sini jika perlu
  };

  // --- Handlers Ubah Armada ---
  const handleOpenUbahArmadaModal = () => setIsUbahArmadaModalOpen(true);
  const handleCloseUbahArmadaModal = () => setIsUbahArmadaModalOpen(false);

  const handleUbahArmadaSuccess = (updatedVehicleId, _optional) => {
    // callback ketika ModalUbahArmada sukses submit
    toast.success("Permintaan ubah armada tersimpan (dummy).");
    handleCloseUbahArmadaModal();
    // kalau perlu refresh data parent, panggil di sini
  };

  // Use hasSOSAlert prop directly
  const isSOS = hasSOSAlert;

  // Get status badge using tracking status
  const statusBadge = getTrackingStatusBadge(status);

  // --- Render Utama ---
  return (
    <>
      <div className="flex w-full flex-col gap-4 rounded-xl border border-neutral-400 bg-neutral-50 p-4">
        {/* ... (kode JSX header dan info driver tidak berubah) ... */}
        {/* Header + Aksi */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {status !== "DOCUMENT_PREPARATION" &&
              status !== "DOCUMENT_DELIVERY" && (
                <BadgeStatusPesanan
                  variant={statusBadge.variant}
                  className="w-fit"
                >
                  {statusBadge.label}
                </BadgeStatusPesanan>
              )}

            {/* Link Lihat Detail Pembatalan untuk status pembatalan */}
            {isCancelledStatus(status) && (
              <button
                onClick={() => {
                  // TODO: Implementasi untuk melihat detail pembatalan
                  console.log("Lihat Detail Pembatalan clicked");
                }}
                className="text-xs font-medium text-blue-600"
              >
                Lihat Detail Pembatalan
              </button>
            )}

            {isSOS && (
              <>
                <div className="mb-2 flex h-[24px] items-center rounded-md bg-error-400 px-3 text-xs font-semibold text-error-50">
                  SOS
                </div>
                <Button
                  className="text-xs"
                  onClick={onViewSosClick}
                  variant="link"
                >
                  Lihat SOS
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Aksi Lainnya - muncul untuk LOADING status */}
            {isMonitoring &&
              status !== "HEADING_TO_UNLOADING" &&
              status !== "DOCUMENT_PREPARATION" &&
              status !== "DOCUMENT_DELIVERY" &&
              status !== "HEADING_TO_LOADING" &&
              status !== TRACKING_STATUS.COMPLETED &&
              status !== "CANCELLED_BY_TRANSPORTER" &&
              status !== "CANCELLED_BY_SHIPPER" &&
              status !== "CANCELLED_BY_SYSTEM" &&
              status !== "WAITING_CONFIRMATION_SHIPPER" && (
                <SimpleDropdown>
                  <SimpleDropdownTrigger asChild>
                    <button className="flex items-center rounded-lg border border-gray-600 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                      Aksi Lainnya
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  </SimpleDropdownTrigger>
                  <SimpleDropdownContent align="end">
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
        </div>

        <div className="flex w-full items-center justify-between">
          {/* Driver Info */}
          <div className="flex w-[360px] items-center gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border-neutral-400 bg-neutral-100">
              <img
                src={vehicleImageUrl || "/img/truck.png"}
                alt="Truck"
                className="h-14 w-14 rounded-md bg-gray-100 object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="mb-1 text-sm font-bold text-neutral-900">
                {plateNumber || "B 2222 XYZ"}
              </h3>
              <div className="flex items-center gap-2">
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

          {/* Stepper */}
          <div className="flex flex-1 items-center justify-end">
            <div className="w-[742px]">
              <StepperContainer
                activeIndex={activeIndex}
                totalStep={currentSteps.length}
              >
                {currentSteps.map((step, stepIndex) => (
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

      {/* Modal Ubah Driver */}
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

      {/* Popup Batalkan Armada */}
      <PopUpBatalkanArmada
        isOpen={isBatalkanArmadaPopupOpen}
        onClose={() => setIsBatalkanArmadaPopupOpen(false)}
        onConfirm={handleConfirmCancelFleet}
      />

      {/* --- (5) RENDER AlasanPembatalanModal --- */}
      <AlasanPembatalanModal
        isOpen={isAlasanPembatalanModalOpen}
        onClose={handleCloseAlasanPembatalanModal}
        onConfirm={handleConfirmAlasanPembatalan}
        order={order} // Pastikan prop 'order' diteruskan
      />

      {/* Modal Ubah Armada */}
      {isUbahArmadaModalOpen && (
        <ModalUbahArmada
          onClose={handleCloseUbahArmadaModal}
          onSuccess={handleUbahArmadaSuccess}
          vehicleId={vehicleId}
          vehiclePlate={plateNumber}
          currentDriverId={driverId}
          title="Ubah Armada"
        />
      )}
    </>
  );
}

export default CardLacakArmada;

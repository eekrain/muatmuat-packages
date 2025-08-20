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
// --- (1) UNCOMMENT baris ini ---
import AlasanPembatalanModal from "@/container/Shared/OrderModal/AlasanPembatalanModal";
import useDevice from "@/hooks/use-device";
import { OrderStatusEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import { toast } from "@/lib/toast";

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

  // Data stepper
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

  const getActiveIndex = (s) => {
    switch (s) {
      case "COMPLETED":
        return 5;
      case "DOCUMENT_DELIVERY":
        return 4;
      case "DOCUMENT_PREPARATION":
        return 3;
      case "LOADING":
        return 2;
      case "UNLOADING":
        return 1;
      default:
        return 0;
    }
  };
  const activeIndex = getActiveIndex(status);

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

  const [isSOS] = useState(false);
  const isHistory = false;
  const emptyFleetData = false;
  const emptyHistory = false;

  const getStatusLabel = (s) => {
    // ... (kode tidak berubah)
    switch (s) {
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

  const getBadgeVariant = (s) => {
    // ... (kode tidak berubah)
    if (
      s === OrderStatusEnum.WAITING_PAYMENT_1 ||
      s === OrderStatusEnum.WAITING_PAYMENT_2 ||
      s === OrderStatusEnum.WAITING_PAYMENT_3 ||
      s === OrderStatusEnum.WAITING_PAYMENT_4 ||
      s === OrderStatusEnum.WAITING_REPAYMENT_1 ||
      s === OrderStatusEnum.WAITING_REPAYMENT_2
    )
      return "warning";

    if (
      s === OrderStatusEnum.CANCELED_BY_SHIPPER ||
      s === OrderStatusEnum.CANCELED_BY_SYSTEM ||
      s === OrderStatusEnum.CANCELED_BY_TRANSPORTER
    )
      return "error";

    if (s === OrderStatusEnum.COMPLETED) return "success";
    return "primary";
  };

  // --- Render Utama ---
  return (
    <>
      <div className="flex w-full flex-col gap-4 rounded-xl border border-neutral-300 bg-white p-4">
        {/* ... (kode JSX header dan info driver tidak berubah) ... */}
        {/* Header + Aksi */}
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

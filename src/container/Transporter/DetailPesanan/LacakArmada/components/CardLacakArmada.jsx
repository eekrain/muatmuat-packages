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
import useDevice from "@/hooks/use-device";

import ModalUbahDriver from "./ModalUbahDriver";

// --- Main Card Component ---

function CardLacakArmada({
  plateNumber,
  driverName,
  vehicleImageUrl,
  sosActive,
  onActionClick,
  onViewSosClick,
  vehicleId, // Prop yang dibutuhkan modal
  driverId, // Prop yang dibutuhkan modal
}) {
  const { isMobile } = useDevice();

  // State untuk mengontrol visibilitas modal pemilihan driver
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);

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

  // --- Handlers untuk Modal ---
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
    // Anda bisa menambahkan logika untuk memuat ulang data di sini
    handleCloseDriverModal();
  };

  // --- Handler untuk Aksi Lainnya ---
  const handleViewDetails = () => alert("Ubah Armada diklik...");
  const handleCancelFleet = () => alert("Batalkan Armada diklik...");

  // Variabel untuk simulasi state
  const isSOS = false;
  const isHistory = false; // Ganti ke `true` untuk melihat tampilan riwayat
  const emptyFleetData = false;
  const emptyHistory = false;

  // --- Render Kondisional untuk Tampilan Kosong ---

  if (emptyFleetData) {
    return (
      <div
        className={
          "flex w-full flex-col items-center justify-center bg-white px-4"
        }
      >
        <Image
          src="/img/daftarprodukicon.png"
          width={95}
          height={95}
          alt="Empty cart"
        />
        <div className="mt-2 font-semibold text-neutral-600">
          Tidak ada armada yang aktif
        </div>
        <div className="mb-3 max-w-full text-center text-xs font-medium text-neutral-600">
          Pesanan telah dibatalkan, semua armada telah dipindahkan ke riwayat
        </div>
      </div>
    );
  }

  if (emptyHistory) {
    return (
      <div
        className={
          "flex w-full flex-col items-center justify-center bg-white px-4"
        }
      >
        <Image
          src="/img/daftarprodukicon.png"
          width={95}
          height={95}
          alt="Empty cart"
        />
        <div className="mt-2 font-semibold text-neutral-600">
          Belum Ada Perubahan Armada
        </div>
        <div className="mb-3 max-w-full text-center text-xs font-medium text-neutral-600">
          Perubahan armada maupun armada dibatalkan dan armada selesai akan
          ditampilkan disini
        </div>
      </div>
    );
  }

  // --- Render untuk Tampilan Riwayat ---

  if (isHistory) {
    return (
      <div className="border-netral-400 w-full rounded-xl border px-4 py-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BadgeStatus variant="error" className={"w-max"}>
              Dibatalkan Transporter
            </BadgeStatus>
            <p className="text-xs font-medium text-neutral-600">
              Armada dibatalkan karena kamu menolak perubahan pesanan dari
              shipper
            </p>
          </div>
        </div>

        {/* Konten Utama */}
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

          {/* Stepper Riwayat */}
          <div className="w-full max-w-lg">
            <StepperContainer
              totalStep={historySteps.length}
              activeIndex={historySteps.length - 1}
              reject={true}
            >
              {historySteps.map((step, index) =>
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
    );
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
              <SimpleDropdownItem onClick={handleViewDetails}>
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

        {/* Konten Utama */}
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
    </>
  );
}

export default CardLacakArmada;

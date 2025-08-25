import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

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
import useDevice from "@/hooks/use-device";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";
import { useCancelFleet } from "@/services/Transporter/daftar-pesanan/detail-pesanan/cancelFleet";
import {
  TRACKING_STATUS,
  getTrackingStatusBadge,
} from "@/utils/Transporter/trackingStatus";

import AlasanPembatalanModal from "./AlasanPembatalanModal";
import ModalUbahArmada from "./ModalUbahArmada";
import ModalUbahDriver from "./ModalUbahDriver";
import PopUpBatalkanArmada from "./PopUpBatalkanArmada";

// --- Main Card Component ---
function CardLacakArmada({
  plateNumber,
  driverName,
  vehicleImageUrl,
  status,
  onViewSosClick,
  vehicleId, // Prop untuk modal
  driverId, // Prop untuk modal
  order,
  hasSOSAlert = false,
  milestones = [], // Add milestones prop
  replacementFleet = null, // Add replacement fleet prop
  replacementDriver = null, // Add replacement driver prop
  fleetChangeStatus = null, // Add fleet change status prop
  onNavigateToRiwayat,
  totalSosCount = 0, // Add total SOS count prop
}) {
  const { t } = useTranslation();
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

  const [isAlasanPembatalanModalOpen, setIsAlasanPembatalanModalOpen] =
    useState(false);
  const [isAksiLainnyaOpen, setIsAksiLainnyaOpen] = useState(false);

  // State untuk cancelFleet API
  const [cancelRequest, setCancelRequest] = useState(null);

  // Hook untuk cancelFleet API
  const { data: cancelResult, error: cancelError } = useCancelFleet(
    order?.orderId,
    cancelRequest
  );

  // Handle cancelFleet API response
  useEffect(() => {
    if (cancelResult) {
      toast.success(
        t(
          "CardLacakArmada.fleetCancelSuccess",
          { plateNumber: plateNumber || "Plat Nomor" },
          `Berhasil membatalkan armada ${plateNumber || "Plat Nomor"}`
        )
      );
      handleCloseAlasanPembatalanModal();
      onNavigateToRiwayat?.();
      setCancelRequest(null);
    }
  }, [cancelResult, plateNumber, t, onNavigateToRiwayat]);

  useEffect(() => {
    if (cancelError) {
      toast.error(
        t("CardLacakArmada.fleetCancelError", {}, "Gagal membatalkan armada")
      );
      setCancelRequest(null);
    }
  }, [cancelError, t]);

  // Fungsi untuk menentukan apakah status adalah pembatalan
  const isCancelledStatus = (s) => {
    // Check if status contains a number (e.g., "CANCELLED_BY_TRANSPORTER_1")
    const statusWithNumber = s?.match(/^(.+)_(\d+)$/);
    const baseStatus = statusWithNumber ? statusWithNumber[1] : s;

    return [
      TRACKING_STATUS.CANCELLED_BY_TRANSPORTER,
      TRACKING_STATUS.CANCELLED_BY_SHIPPER,
      TRACKING_STATUS.CANCELLED_BY_SYSTEM,
    ].includes(baseStatus);
  };

  // Process milestones data to add icons
  const processedMilestones = milestones.map((milestone) => {
    // Check if status contains a number (e.g., "MENUJU_KE_LOKASI_BONGKAR_1")
    const statusWithNumber = milestone.status?.match(/^(.+)_(\d+)$/);
    let baseStatus = milestone.status;
    let statusNumber = null;

    if (statusWithNumber) {
      const [, base, number] = statusWithNumber;
      baseStatus = base;
      statusNumber = number;
    }

    // Map status to appropriate icons
    let icon = "/icons/stepper/stepper-scheduled.svg"; // default icon

    switch (baseStatus) {
      case "SCHEDULED":
      case "SCHEDULED_FLEET":
        icon = "/icons/stepper/stepper-scheduled.svg";
        break;
      case "LOADING":
        icon = "/icons/stepper/stepper-box.svg";
        break;
      case "UNLOADING":
        icon = "/icons/stepper/stepper-box-opened.svg";
        break;
      case "DOCUMENT_PREPARATION":
        icon = "/icons/stepper/stepper-document-preparing.svg";
        break;
      case "DOCUMENT_DELIVERY":
        icon = "/icons/stepper/stepper-document-delivery.svg";
        break;
      case "COMPLETED":
        icon = "/icons/stepper/stepper-completed.svg";
        break;
      case "FLEET_REPLACEMENT_PROCESS":
        icon = "/icons/stepper/stepper-fleet-change.svg";
        break;
      case "MENUJU_KE_LOKASI_BONGKAR":
        icon = "/icons/stepper/stepper-box-opened.svg";
        break;
      case "MENUJU_KE_LOKASI_MUAT":
        icon = "/icons/stepper/stepper-box.svg";
        break;
      default:
        icon = "/icons/stepper/stepper-scheduled.svg";
    }

    // Create label with number if status has number
    let label = milestone.statusName;
    if (statusNumber) {
      label = `${milestone.statusName} ${statusNumber}`;
    }

    return {
      ...milestone,
      label,
      icon,
    };
  });

  // Calculate active index based on completed milestones
  const getActiveIndex = () => {
    if (isCancelledStatus(status)) {
      return 1; // Show cancelled step
    }

    // Find the last completed milestone
    const lastCompletedIndex = processedMilestones
      .map((milestone, index) => ({ ...milestone, index }))
      .filter((milestone) => milestone.completed)
      .pop();

    if (lastCompletedIndex) {
      return lastCompletedIndex.index;
    }

    return 0; // Default to first step
  };

  const activeIndex = getActiveIndex();

  // Pilih steps berdasarkan status
  const currentSteps = isCancelledStatus(status)
    ? [
        {
          label: t("CardLacakArmada.scheduledFleet", {}, "Armada Dijadwalkan"),
          icon: "/icons/stepper/stepper-scheduled.svg",
        },
        {
          label: t("CardLacakArmada.cancelled", {}, "Dibatalkan"),
          status: "CANCELED",
          icon: "/icons/silang-white.svg",
        },
      ]
    : processedMilestones;

  // --- Handlers Ubah Driver ---
  const handleOpenDriverModal = () => setIsDriverModalOpen(true);
  const handleCloseDriverModal = () => setIsDriverModalOpen(false);
  const handleDriverUpdateSuccess = (updatedVehicleId, newDriverId) => {
    toast.success(
      t(
        "CardLacakArmada.driverChangeSuccess",
        {},
        "Perubahan driver berhasil disimpan"
      )
    );
    handleCloseDriverModal();
    onNavigateToRiwayat?.();
  };

  const handleCancelFleet = () => {
    console.log("CardLacakArmada - plateNumber being passed:", plateNumber);
    setIsBatalkanArmadaPopupOpen(true);
  };
  const handleConfirmCancelFleet = () => {
    // Tutup popup pertama
    setIsBatalkanArmadaPopupOpen(false);
    // Buka modal alasan pembatalan
    setIsAlasanPembatalanModalOpen(true);
  };

  const handleCloseAlasanPembatalanModal = () => {
    setIsAlasanPembatalanModalOpen(false);
  };
  const handleConfirmAlasanPembatalan = async (data) => {
    // Logika untuk mengirim data pembatalan ke API ada di sini
    console.log("Submitting fleet cancellation with reason:", data);

    // Data yang diterima dari AlasanPembatalanModal:
    // {
    //   order: orderObject,
    //   reasonId: "150e8400-e29b-41d4-a716-446655440015", // reasonId dari API
    //   reasonName: "Kendaraan Bermasalah",
    //   reason: "Kendaraan Bermasalah" atau "Alasan custom dari user",
    //   reasonType: "TECHNICAL" atau "OTHER",
    //   supportingFiles: ["url1", "url2", ...], // URLs dari upload API
    //   notes: "Alasan custom" atau null
    // }

    try {
      // Prepare request body for cancelFleet API
      const requestBody = {
        fleetId: vehicleId,
        cancellationReasonId: data.reasonId, // Use dynamic reasonId from API
        evidencePhotos: data.supportingFiles, // Use uploaded URLs directly
        notes: data.notes, // Use notes from modal (null if not "Lainnya")
        termsAndConditionsAccepted: true,
      };

      console.log("Cancel fleet request body:", requestBody);
      setCancelRequest(requestBody);
    } catch (error) {
      console.error("Error preparing cancellation request:", error);
      toast.error(
        t(
          "CardLacakArmada.fleetCancelError",
          {},
          "Gagal menyiapkan permintaan pembatalan"
        )
      );
    }
  };

  // --- Handlers Ubah Armada ---
  const handleOpenUbahArmadaModal = () => setIsUbahArmadaModalOpen(true);
  const handleCloseUbahArmadaModal = () => setIsUbahArmadaModalOpen(false);

  const handleUbahArmadaSuccess = (updatedVehicleId, _optional) => {
    // callback ketika ModalUbahArmada sukses submit
    toast.success(
      t(
        "CardLacakArmada.fleetChangeRequestSuccess",
        {},
        "Perubahan armada berhasil disimpan"
      )
    );
    handleCloseUbahArmadaModal();
    onNavigateToRiwayat?.();
    // kalau perlu refresh data parent, panggil di sini
  };

  // Show SOS badge when fleet has SOS alert
  const isSOS = hasSOSAlert;

  // Show "Lihat SOS" button only when there's exactly 1 fleet with SOS alert
  const showViewSOSButton = hasSOSAlert && totalSosCount === 1;

  // Get status badge using tracking status
  const statusBadge = getTrackingStatusBadge(status);

  // --- Render Utama ---
  return (
    <>
      <div className="flex w-full flex-col gap-4 rounded-xl border border-neutral-400 bg-neutral-50 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {status !== TRACKING_STATUS.DOCUMENT_PREPARATION &&
              status !== TRACKING_STATUS.DOCUMENT_DELIVERY &&
              !status?.startsWith("DOCUMENT_PREPARATION_") &&
              !status?.startsWith("DOCUMENT_DELIVERY_") && (
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
                {t(
                  "CardLacakArmada.viewCancellationDetail",
                  {},
                  "Lihat Detail Pembatalan"
                )}
              </button>
            )}

            {isSOS && (
              <>
                <div className="mb-2 flex h-[24px] items-center rounded-md bg-error-400 px-3 text-xs font-semibold text-error-50">
                  {t("CardLacakArmada.sosLabel", {}, "SOS")}
                </div>
                {showViewSOSButton && (
                  <Button
                    className="text-xs"
                    onClick={onViewSosClick}
                    variant="link"
                  >
                    {t("CardLacakArmada.viewSOS", {}, "Lihat SOS")}
                  </Button>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Aksi Lainnya - muncul untuk LOADING status */}
            {isMonitoring &&
              !status?.startsWith("HEADING_TO_UNLOADING") &&
              !status?.startsWith("DOCUMENT_PREPARATION") &&
              !status?.startsWith("DOCUMENT_DELIVERY") &&
              !status?.startsWith("HEADING_TO_LOADING") &&
              status !== TRACKING_STATUS.COMPLETED &&
              !status?.startsWith("CANCELLED_BY_TRANSPORTER") &&
              !status?.startsWith("CANCELLED_BY_SHIPPER") &&
              !status?.startsWith("CANCELLED_BY_SYSTEM") &&
              !status?.startsWith("WAITING_CONFIRMATION_SHIPPER") && (
                <SimpleDropdown
                  open={isAksiLainnyaOpen}
                  onOpenChange={setIsAksiLainnyaOpen}
                >
                  <SimpleDropdownTrigger asChild>
                    <button
                      className={`flex items-center rounded-lg border px-3 py-1.5 text-xs font-semibold text-gray-700 ${
                        isAksiLainnyaOpen
                          ? "border-[#176CF7]"
                          : "border-gray-600 hover:border-[#176CF7]"
                      }`}
                    >
                      Aksi Lainnya
                      {isAksiLainnyaOpen ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </button>
                  </SimpleDropdownTrigger>
                  <SimpleDropdownContent align="end">
                    <SimpleDropdownItem onClick={handleOpenUbahArmadaModal}>
                      {t("CardLacakArmada.changeFleet", {}, "Ubah Armada")}
                    </SimpleDropdownItem>
                    <SimpleDropdownItem onClick={handleOpenDriverModal}>
                      {t("CardLacakArmada.changeDriver", {}, "Ubah Driver")}
                    </SimpleDropdownItem>
                    <SimpleDropdownItem onClick={handleCancelFleet}>
                      {t("CardLacakArmada.cancelFleet", {}, "Batalkan Armada")}
                    </SimpleDropdownItem>
                  </SimpleDropdownContent>
                </SimpleDropdown>
              )}
          </div>
        </div>

        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Driver Info */}
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center">
                <img
                  src={vehicleImageUrl || "/img/truck.png"}
                  alt="Truck"
                  className="rounded-lg border-neutral-400 object-cover"
                />
              </div>
              <div className="flex w-32 flex-col gap-3">
                <h3 className="text-xs font-bold text-neutral-900">
                  {plateNumber || "B 2222 XYZ"}
                </h3>
                <div className="flex items-center gap-1">
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

            {replacementFleet && replacementDriver && (
              <IconComponent
                src="/icons/arrow-right.svg"
                className="text-neutral-700"
                width={24}
                height={24}
              />
            )}
            {/* Armada Pengganti */}
            <div className="flex items-center gap-3">
              {fleetChangeStatus === "PENDING" && (
                <p className="text-xs text-neutral-600">
                  {t(
                    "CardLacakArmada.replacementFleetSearching",
                    {},
                    "Armada pengganti"
                  )}{" "}
                  <br />{" "}
                  {t(
                    "CardLacakArmada.replacementFleetSearchingProcess",
                    {},
                    "sedang dalam proses"
                  )}{" "}
                  <br />{" "}
                  {t(
                    "CardLacakArmada.replacementFleetSearchingText",
                    {},
                    "pencarian"
                  )}
                </p>
              )}

              {replacementFleet && replacementDriver && (
                <div className="flex items-center gap-3">
                  <div className="flex w-32 flex-col gap-3">
                    <h3 className="text-xs font-bold text-neutral-900">
                      {replacementFleet.licensePlate || "Plat Nomor"}
                    </h3>
                    <div className="flex items-center gap-1">
                      <IconComponent
                        src="/icons/user16.svg"
                        width={16}
                        height={16}
                        className="flex-shrink-0 text-neutral-500"
                      />
                      <span
                        className="line-clamp-2 max-w-[280px] text-[12px] font-medium leading-4 text-neutral-900"
                        title={replacementDriver.name || "Nama Driver"}
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          wordBreak: "break-word",
                        }}
                      >
                        {replacementDriver.name || "Nama Driver"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
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
          title={t("CardLacakArmada.selectDriverTitle", {}, "Pilih Driver")}
          orderId={order?.orderId}
        />
      )}

      {/* Popup Batalkan Armada */}
      <PopUpBatalkanArmada
        isOpen={isBatalkanArmadaPopupOpen}
        onClose={() => setIsBatalkanArmadaPopupOpen(false)}
        onConfirm={handleConfirmCancelFleet}
        plateNumber={plateNumber}
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
          title={t("CardLacakArmada.selectFleetTitle", {}, "Pilih Armada")}
          orderId={order?.orderId}
        />
      )}
    </>
  );
}

export default CardLacakArmada;

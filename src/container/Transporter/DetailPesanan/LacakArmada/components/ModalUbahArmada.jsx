"use client";

import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import RadioButton from "@/components/Radio/RadioButton";
import Search from "@/components/Search/Search";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";
import { useAssignFleet } from "@/services/Transporter/daftar-pesanan/detail-pesanan/assignFleet";
import { useGetAvailableFleetVehicles } from "@/services/Transporter/daftar-pesanan/detail-pesanan/getFleetsList";

// --- Item Layout ---
function ArmadaOptionItem({
  selected,
  onSelect,
  plateNumber,
  driverName,
  vehicleDesc,
  photoUrl,
  isRecommended,
  recommendationHint,
  isPotentialOverload,
  distanceFromPickup,
  estimatedArrival,
  compatibilityScore,
}) {
  const { t } = useTranslation();
  // tampilkan kanan hanya jika ada badge
  const showRightInfo = isRecommended || isPotentialOverload;

  return (
    <div
      className="flex cursor-pointer items-center justify-between gap-3 border-b border-neutral-300 bg-white pb-4 hover:bg-neutral-50"
      onClick={onSelect}
    >
      {/* LEFT */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-neutral-300">
          <img
            src={photoUrl || "/img/truck.png"}
            alt="Armada"
            className="h-14 w-14 object-cover"
          />
        </div>

        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-neutral-900">
            {plateNumber}
          </div>

          <div className="mt-3 min-w-0">
            {/* dua baris sejajar pakai grid */}
            <div className="mt-0.5 grid grid-cols-[14px_auto] gap-x-1 gap-y-1 text-[10px] font-medium text-neutral-900">
              {/* row 1: driver */}
              <IconComponent
                src="/icons/user16.svg"
                alt=""
                className="h-3.5 w-3.5 flex-shrink-0"
              />
              <span className="truncate leading-[14px]">{driverName}</span>

              {/* row 2: vehicle */}
              <IconComponent
                src={"/icons/monitoring/daftar-pesanan-aktif/truck.svg"}
                className="h-3.5 w-3.5 flex-shrink-0"
              />
              <span className="truncate leading-[14px]">{vehicleDesc}</span>
            </div>

            {/* Additional info: distance and compatibility */}
            <div className="mt-2 text-[10px] text-neutral-600">
              <span>
                {distanceFromPickup} km • {estimatedArrival} •{" "}
                {compatibilityScore}% kompatibel
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT (default kosong; hanya badge jika ada) */}
      <div className="flex items-center gap-3">
        {showRightInfo && (
          <div className="text-right">
            {/* Badge Rekomendasi */}
            {isRecommended && (
              <>
                <div className="inline-flex items-center rounded-md bg-success-400 px-3 py-1 text-[12px] font-semibold text-white">
                  {t("ModalUbahArmada.recommendationBadge", {}, "Rekomendasi")}
                </div>
                {/* hint hanya untuk rekomendasi */}
                {recommendationHint && (
                  <div className="mt-2 text-[10px] font-medium text-neutral-900">
                    {recommendationHint}
                  </div>
                )}
              </>
            )}

            {/* Badge Potensi Overload (tanpa hint) */}
            {isPotentialOverload && (
              <div className="inline-flex items-center rounded-md bg-error-50 px-3 py-1 text-[12px] font-semibold text-error-400">
                {t(
                  "ModalUbahArmada.potentialOverloadBadge",
                  {},
                  "Potensi Overload"
                )}
              </div>
            )}
          </div>
        )}

        {/* Radio */}
        <RadioButton
          name="selectedArmada"
          value={plateNumber}
          checked={!!selected}
          onChange={onSelect}
          className="!gap-0"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}

// --- Modal Utama ---
const ModalUbahArmada = ({
  onClose,
  onSuccess,
  vehicleId,
  vehiclePlate = "L 8312 L",
  currentDriverId,
  title = "Ubah Armada",
  orderId, // Add orderId prop to fetch available fleets
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [selectedFleetId, setSelectedFleetId] = useState(null);
  const [assignRequest, setAssignRequest] = useState(null);

  // Fetch available fleet vehicles
  const {
    data: fleetData,
    error,
    isLoading,
  } = useGetAvailableFleetVehicles(orderId);

  // Assign fleet mutation
  const {
    data: assignResult,
    error: assignError,
    isLoading: isAssigning,
  } = useAssignFleet(orderId, vehicleId, assignRequest);

  // Debug logging
  console.log("ModalUbahArmada - orderId:", orderId);
  console.log("ModalUbahArmada - vehicleId (oldVehicleId):", vehicleId);
  console.log("ModalUbahArmada - fleetData:", fleetData);

  // Transform fleet data to match component expectations
  const availableFleets =
    fleetData?.vehicles?.map((fleet) => ({
      id: fleet.id,
      plateNumber: fleet.licensePlate,
      driverName: fleet.driver?.name || "Driver tidak tersedia",
      vehicleDesc: `${fleet.truckTypeName} - ${fleet.carrierName}`,
      photoUrl: fleet.driver?.profileImage || "/img/truck.png",
      isRecommended: fleet.isRecommended,
      recommendationHint: fleet.isRecommended
        ? "jenis armada sesuai, jarak terdekat"
        : "",
      isPotentialOverload: fleet.compatibilityScore < 80, // Consider low compatibility as potential overload
      distanceFromPickup: fleet.distanceFromPickup,
      estimatedArrival: fleet.estimatedArrival,
      compatibilityScore: fleet.compatibilityScore,
      driver: fleet.driver, // Keep the full driver object
    })) || [];

  // Handle assign fleet result
  useEffect(() => {
    if (assignResult) {
      console.log("Assign fleet result:", assignResult);

      // Show success toast
      toast.success(
        t("ModalUbahArmada.assignSuccess", {}, "Berhasil mengubah armada")
      );

      onClose?.();
      onSuccess?.(
        selectedFleetId,
        availableFleets.find((f) => f.id === selectedFleetId)?.driver?.id
      );
      setAssignRequest(null); // Reset request
    }
  }, [assignResult, onClose, onSuccess, selectedFleetId, availableFleets, t]);

  // Handle assign fleet error
  useEffect(() => {
    if (assignError) {
      console.error("Assign fleet error:", assignError);

      // Show error toast
      toast.error(
        t("ModalUbahArmada.assignError", {}, "Gagal mengubah armada")
      );

      setAssignRequest(null); // Reset request
    }
  }, [assignError, t]);

  // Filter fleets based on search
  const filteredFleets = availableFleets.filter((fleet) => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return true;
    return (
      fleet.driverName.toLowerCase().includes(q) ||
      (fleet.plateNumber || "").toLowerCase().includes(q) ||
      (fleet.vehicleDesc || "").toLowerCase().includes(q)
    );
  });

  const handleSave = async () => {
    if (selectedFleetId) {
      const selectedFleet = availableFleets.find(
        (fleet) => fleet.id === selectedFleetId
      );
      if (selectedFleet) {
        // Prepare request body - only newVehicleId and newDriverId
        const requestBody = {
          newVehicleId: selectedFleet.id,
          newDriverId: selectedFleet.driver?.id,
        };

        console.log("Assign fleet request body:", requestBody);

        // Set assign request to trigger the mutation
        setAssignRequest(requestBody);
      }
    }
  };

  return (
    <Modal
      open={true}
      onOpenChange={(o) => !o && onClose?.()}
      closeOnOutsideClick
    >
      <ModalContent size="small" type="muattrans" className="w-[640px]">
        <div className="p-6">
          <h2 className="mb-4 text-center text-base font-bold">{title}</h2>

          {/* Search */}
          <Search
            placeholder={t(
              "ModalUbahArmada.searchPlaceholder",
              {},
              "Cari Plat / Nama Driver / Tipe Armada"
            )}
            onSearch={setSearchValue}
            autoSearch
            debounceTime={300}
            defaultValue=""
          />

          {/* List dengan fixed height */}
          <div className="mt-3 h-[291px] space-y-2 overflow-y-auto rounded-lg border border-neutral-400 p-3 pr-2">
            {isLoading ? (
              <div className="flex h-[291px] items-center justify-center">
                <div className="text-center">
                  <div className="text-sm text-neutral-600">
                    Memuat data armada...
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="flex h-[291px] items-center justify-center">
                <div className="text-center">
                  <div className="text-sm text-error-600">
                    Gagal memuat data armada
                  </div>
                </div>
              </div>
            ) : filteredFleets.length === 0 ? (
              <DataNotFound
                className="h-[291px] gap-y-5"
                title="Keyword Tidak Ditemukan"
              />
            ) : (
              filteredFleets.map((fleet) => (
                <ArmadaOptionItem
                  key={fleet.id}
                  selected={selectedFleetId === fleet.id}
                  onSelect={() => setSelectedFleetId(fleet.id)}
                  plateNumber={fleet.plateNumber}
                  driverName={fleet.driverName}
                  vehicleDesc={fleet.vehicleDesc}
                  photoUrl={fleet.photoUrl}
                  isRecommended={fleet.isRecommended}
                  recommendationHint={fleet.recommendationHint}
                  isPotentialOverload={fleet.isPotentialOverload}
                  distanceFromPickup={fleet.distanceFromPickup}
                  estimatedArrival={fleet.estimatedArrival}
                  compatibilityScore={fleet.compatibilityScore}
                />
              ))
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="muattrans-primary-secondary" onClick={onClose}>
              {t("ModalUbahArmada.cancelButton", {}, "Batal")}
            </Button>
            <Button
              variant="muattrans-primary"
              onClick={handleSave}
              disabled={!selectedFleetId || isAssigning}
            >
              {isAssigning
                ? t("ModalUbahArmada.savingButton", {}, "Menyimpan...")
                : t("ModalUbahArmada.saveButton", {}, "Simpan")}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ModalUbahArmada;

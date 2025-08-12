"use client";

import { useState } from "react";

import { format } from "date-fns";
import { id } from "date-fns/locale";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTitle } from "@/components/Modal/Modal";
import Search from "@/components/Search/Search";
import { toast } from "@/lib/toast";
import { getArmadaStatusBadge } from "@/lib/utils/armadaStatus";
import { useGetAvailableVehiclesList } from "@/services/Transporter/monitoring/daftar-pesanan-active/getAvailableVehiclesList";

const AssignArmadaModal = ({ isOpen, onClose, orderData }) => {
  const [selectedArmada, setSelectedArmada] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  // Fetch available vehicles
  const { data, isLoading } = useGetAvailableVehiclesList(orderData?.id);

  const totalUnitsNeeded =
    data?.orderInfo?.requiredTruckCount || orderData?.truckCount || 3;
  const availableVehicles = data?.availableVehicles || [];

  const handleSelectArmada = (armadaId) => {
    if (selectedArmada.includes(armadaId)) {
      setSelectedArmada(selectedArmada.filter((id) => id !== armadaId));
    } else if (selectedArmada.length < totalUnitsNeeded) {
      setSelectedArmada([...selectedArmada, armadaId]);
    }
  };

  const handleSave = () => {
    console.log("Selected armada:", selectedArmada);
    const orderCode = orderData?.orderCode || "MT25A002A";
    toast.success(`Berhasil assign armada untuk pesanan ${orderCode}`);
    onClose();
  };

  const formatScheduleDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy", { locale: id });
  };

  // Filter vehicles based on search
  const filteredVehicles = availableVehicles.filter((vehicle) => {
    if (!searchValue) return true;
    const searchLower = searchValue.toLowerCase();
    return (
      vehicle.licensePlate.toLowerCase().includes(searchLower) ||
      vehicle.driver?.name?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent
        type="muatmuat"
        className="w-[90vw] max-w-[800px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-center px-6 pt-4">
            <ModalTitle className="font-bold">Assign Armada</ModalTitle>
          </div>

          {/* Content */}
          <div className="flex-1 px-6 py-4">
            {/* Info Header */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-bold">
                Pilih {totalUnitsNeeded} unit armada untuk ditugaskan
              </p>
              <Search
                placeholder="Cari No. Polisi / Nama Driver"
                onSearch={setSearchValue}
                containerClassName="h-8 w-[300px]"
                inputClassName="text-sm"
                autoFocus={false}
              />
            </div>

            {/* Armada List */}
            <div className="max-h-[271px] overflow-y-auto rounded-lg border border-neutral-400">
              {isLoading ? (
                <div className="flex h-32 items-center justify-center">
                  <span className="text-sm text-neutral-600">
                    Memuat data armada...
                  </span>
                </div>
              ) : filteredVehicles.length === 0 ? (
                <div className="flex h-32 items-center justify-center">
                  <span className="text-sm text-neutral-600">
                    {searchValue
                      ? "Tidak ada armada yang sesuai pencarian"
                      : "Tidak ada armada tersedia"}
                  </span>
                </div>
              ) : (
                filteredVehicles.map((vehicle, index) => (
                  <div key={vehicle.id} className="hover:bg-neutral-50">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        {/* Truck Image */}
                        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-neutral-100">
                          {vehicle.truckImage ? (
                            <img
                              src={vehicle.truckImage}
                              alt={vehicle.licensePlate}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <IconComponent
                              src="/icons/monitoring/daftar-pesanan-aktif/truck.svg"
                              className="h-10 w-10 text-primary-700"
                            />
                          )}
                        </div>

                        {/* Armada Info */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-black">
                              {vehicle.licensePlate}
                            </span>
                            <span className="text-xs font-semibold text-neutral-800">
                              - {vehicle.driver?.name || "No Driver"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <IconComponent
                              src="/icons/calendar16.svg"
                              className="h-3.5 w-3.5 text-muat-trans-secondary-900"
                            />
                            <span className="text-neutral-600">
                              Jadwal Terdekat :{" "}
                              {vehicle.nearestSchedule
                                ? formatScheduleDate(
                                    vehicle.nearestSchedule.date
                                  )
                                : "-"}
                            </span>
                            {vehicle.nearestSchedule && (
                              <>
                                <span className="text-[8px] text-neutral-600">
                                  •
                                </span>
                                <Button
                                  variant="link"
                                  className="text-xs"
                                  onClick={() =>
                                    console.log(
                                      "Check driver schedule",
                                      vehicle.id
                                    )
                                  }
                                >
                                  Cek Jadwal Driver
                                </Button>
                              </>
                            )}
                          </div>
                          {vehicle.isPotentialOverload && (
                            <span className="text-xs font-medium text-error-500">
                              Potensi Overload
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status and Action */}
                      <div className="flex items-center gap-4">
                        <BadgeStatus
                          variant={
                            getArmadaStatusBadge(vehicle.operationalStatus)
                              .variant
                          }
                          className="w-[146px] text-xs"
                        >
                          {
                            getArmadaStatusBadge(vehicle.operationalStatus)
                              .label
                          }
                        </BadgeStatus>
                        <Button
                          variant={
                            selectedArmada.includes(vehicle.id)
                              ? "muattrans-primary"
                              : "muattrans-primary-secondary"
                          }
                          onClick={() => handleSelectArmada(vehicle.id)}
                          className="h-8 w-[112px] px-6 text-sm"
                        >
                          {selectedArmada.includes(vehicle.id)
                            ? "Dipilih"
                            : "Pilih"}
                        </Button>
                      </div>
                    </div>
                    {index !== filteredVehicles.length - 1 && (
                      <div className="mx-4 border-b border-neutral-400" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 pb-4">
            <p className="text-xs font-bold">
              Total Unit Dipilih : {selectedArmada.length}/{totalUnitsNeeded}{" "}
              Unit
            </p>
            <div className="flex gap-3">
              <Button
                variant="muattrans-primary-secondary"
                onClick={onClose}
                className="px-6"
              >
                Kembali
              </Button>
              <Button
                variant="muattrans-primary"
                onClick={handleSave}
                disabled={selectedArmada.length !== totalUnitsNeeded}
                className="px-6"
              >
                Simpan
              </Button>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default AssignArmadaModal;

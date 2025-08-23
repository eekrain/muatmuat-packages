"use client";

import { useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTitle } from "@/components/Modal/Modal";
import Search from "@/components/Search/Search";
import SearchNotFound from "@/components/SearchNotFound/SearchNotFound";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";
import { getArmadaStatusBadge } from "@/lib/utils/armadaStatus";
import { useGetAvailableVehiclesList } from "@/services/Transporter/monitoring/daftar-pesanan-active/getAvailableVehiclesList";

import ImageArmada from "./components/ImageArmada";

const AssignArmadaModal = ({ isOpen, onClose, orderData }) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available vehicles
  const { data, isLoading } = useGetAvailableVehiclesList(orderData?.id);

  const totalUnitsNeeded =
    data?.orderInfo?.requiredTruckCount || orderData?.truckCount || 3;
  const availableVehicles = data?.availableVehicles || [];

  // Create dynamic validation schema based on required units
  const createValidationSchema = (requiredCount) => {
    return v.pipe(
      v.object({
        selectedArmada: v.array(v.any()),
      }),
      v.forward(
        v.partialCheck(
          [["selectedArmada"]],
          (input) => {
            if (input.selectedArmada.length < requiredCount) {
              return false;
            }
            return true;
          },
          t(
            "AssignArmadaModal.notEnoughSelected",
            {},
            "Armada terpilih kurang dari kebutuhan"
          )
        ),
        ["selectedArmada"]
      ),
      v.forward(
        v.partialCheck(
          [["selectedArmada"]],
          (input) => {
            if (input.selectedArmada.length > requiredCount) {
              return false;
            }
            return true;
          },
          t(
            "AssignArmadaModal.tooManySelected",
            {},
            "Jumlah Armada Yang Kamu Pilih Melebihi Kebutuhan"
          )
        ),
        ["selectedArmada"]
      )
    );
  };

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    trigger,
  } = useForm({
    resolver: valibotResolver(createValidationSchema(totalUnitsNeeded)),
    defaultValues: {
      selectedArmada: [],
    },
  });

  const selectedArmada = watch("selectedArmada") || [];

  const handleSelectArmada = (armadaId) => {
    const currentArmada = selectedArmada;
    if (currentArmada.includes(armadaId)) {
      setValue(
        "selectedArmada",
        currentArmada.filter((id) => id !== armadaId)
      );
    } else {
      setValue("selectedArmada", [...currentArmada, armadaId]);
    }
    trigger("selectedArmada");
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      console.log("Selected armada:", data.selectedArmada);
      const orderCode = orderData?.orderCode || "MT25A002A";
      toast.success(
        t(
          "AssignArmadaModal.assignSuccess",
          { orderCode },
          `Berhasil assign armada untuk pesanan ${orderCode}`
        )
      );
      handleClose();
    } catch (error) {
      console.error("Error assigning armada:", error);
      toast.error(
        t(
          "AssignArmadaModal.assignError",
          {},
          "Gagal assign armada. Silakan coba lagi."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = handleSubmit(onSubmit);

  const handleClose = () => {
    reset();
    setSearchValue("");
    setIsSubmitting(false);
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

  const handleOpenChange = (open) => {
    if (!open) {
      handleClose();
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={handleOpenChange}>
      <ModalContent
        type="muatmuat"
        className="w-[90vw] max-w-[800px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-center px-6 pt-4">
            <ModalTitle className="font-bold">
              {t("AssignArmadaModal.title", {}, "Assign Armada")}
            </ModalTitle>
          </div>

          {/* Content */}
          <div className="flex-1 px-6 py-4">
            {/* Info Header */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-bold">
                {t(
                  "AssignArmadaModal.selectUnits",
                  { count: totalUnitsNeeded },
                  `Pilih ${totalUnitsNeeded} unit armada untuk ditugaskan`
                )}
              </p>
              <Search
                placeholder={t(
                  "AssignArmadaModal.searchPlaceholder",
                  {},
                  "Cari No. Polisi / Nama Driver"
                )}
                onSearch={setSearchValue}
                containerClassName="h-8 w-[300px]"
                inputClassName="text-sm"
                autoFocus={false}
              />
            </div>

            {/* Armada List */}
            <div className="h-[287px] overflow-y-auto rounded-lg border border-neutral-400">
              {isLoading ? (
                <div className="flex h-32 items-center justify-center">
                  <span className="text-sm text-neutral-600">
                    {t(
                      "AssignArmadaModal.loading",
                      {},
                      "Memuat data armada..."
                    )}
                  </span>
                </div>
              ) : filteredVehicles.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <SearchNotFound className="py-0" />
                </div>
              ) : (
                filteredVehicles.map((vehicle, index) => (
                  <div key={vehicle.id} className="hover:bg-neutral-50">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        {/* Truck Image */}
                        <ImageArmada
                          src={vehicle.truckImage}
                          plateNumber={vehicle.licensePlate}
                          size="sm"
                        />

                        {/* Armada Info */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-black">
                              {vehicle.licensePlate}
                            </span>
                            <span className="text-xs font-semibold text-neutral-800">
                              -{" "}
                              {vehicle.driver?.name ||
                                t(
                                  "AssignArmadaModal.noDriver",
                                  {},
                                  "No Driver"
                                )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <IconComponent
                              src="/icons/calendar16.svg"
                              className="h-3.5 w-3.5 text-muat-trans-secondary-900"
                            />
                            <span className="text-neutral-600">
                              {t(
                                "AssignArmadaModal.nearestSchedule",
                                {},
                                "Jadwal Terdekat"
                              )}{" "}
                              :{" "}
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
                                  {t(
                                    "AssignArmadaModal.checkDriverSchedule",
                                    {},
                                    "Cek Jadwal Driver"
                                  )}
                                </Button>
                              </>
                            )}
                          </div>
                          {vehicle.isPotentialOverload && (
                            <span className="text-xs font-medium text-error-500">
                              {t(
                                "AssignArmadaModal.potentialOverload",
                                {},
                                "Potensi Overload"
                              )}
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
                            ? t("AssignArmadaModal.selected", {}, "Dipilih")
                            : t("AssignArmadaModal.select", {}, "Pilih")}
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

          {/* Error Alert */}
          {errors.selectedArmada && (
            <div className="px-6">
              <p
                className="text-left text-xs font-medium leading-tight"
                style={{ color: "#EE4343" }}
              >
                {errors.selectedArmada.message}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-6 pb-4">
            <p className="text-xs font-bold">
              {t(
                "AssignArmadaModal.totalSelectedUnits",
                { selected: selectedArmada.length, total: totalUnitsNeeded },
                `Total Unit Dipilih : ${selectedArmada.length}/${totalUnitsNeeded} Unit`
              )}
            </p>
            <div className="flex gap-3">
              <Button
                variant="muattrans-primary-secondary"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-6"
              >
                {t("AssignArmadaModal.back", {}, "Kembali")}
              </Button>
              <Button
                variant="muattrans-primary"
                onClick={handleSave}
                disabled={isSubmitting || isLoading}
                {...((isSubmitting || isLoading) && { loading: true })}
                className="px-6"
              >
                {t("AssignArmadaModal.save", {}, "Simpan")}
              </Button>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default AssignArmadaModal;

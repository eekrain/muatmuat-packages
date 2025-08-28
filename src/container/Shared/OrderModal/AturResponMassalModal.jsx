"use client";

import { useEffect, useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import Checkbox from "@/components/Form/Checkbox";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTitle } from "@/components/Modal/Modal";
import Search from "@/components/Search/Search";
import SearchNotFound from "@/components/SearchNotFound/SearchNotFound";

import { useTranslation } from "@/hooks/use-translation";

import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

import { getTrackingStatusBadgeWithTranslation } from "@/utils/Transporter/trackingStatus";

import TerimaDanUbahArmadaModal from "./TerimaDanUbahArmadaModal";
import ImageArmada from "./components/ImageArmada";

// Validation schema
const createValidationSchema = (t) =>
  v.object({
    selectedArmada: v.pipe(
      v.array(v.string()),
      v.minLength(
        1,
        t(
          "AturResponMassalModal.selectMinimumOne",
          {},
          "Pilih minimal 1 armada"
        )
      )
    ),
  });

const AturResponMassalModal = ({
  isOpen,
  onClose,
  title = "Terima Perubahan",
  responseType = "accept", // accept, change, reject
  armadaList = [],
  totalRequired = 4,
  onSave,
  existingReplacements = {}, // Pass existing replacement selections from parent
  existingSelections = [], // Pass existing selected armada from parent
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [isArmadaModalOpen, setIsArmadaModalOpen] = useState(false);
  const [currentArmadaForReplacement, setCurrentArmadaForReplacement] =
    useState(null);
  const [replacementArmada, setReplacementArmada] =
    useState(existingReplacements);

  const validationSchema = createValidationSchema(t);

  const { setValue, watch, handleSubmit, reset } = useForm({
    resolver: valibotResolver(validationSchema),
    defaultValues: {
      selectedArmada: existingSelections,
    },
  });

  const selectedArmada = watch("selectedArmada") || [];

  // Update state when modal opens with new props
  useEffect(() => {
    if (isOpen) {
      // Update replacement armada with existing replacements
      setReplacementArmada(existingReplacements);
      // Update selected armada with existing selections
      setValue("selectedArmada", existingSelections);
      // Check if all are selected for select all checkbox
      if (
        existingSelections.length === armadaList.length &&
        armadaList.length > 0
      ) {
        setSelectAll(true);
      }
    }
  }, [
    isOpen,
    existingReplacements,
    existingSelections,
    setValue,
    armadaList.length,
  ]);

  // Filter armada based on search
  const filteredArmada = armadaList.filter(
    (armada) =>
      armada.plateNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
      armada.driverName.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleArmadaSelect = (armadaId, checked) => {
    const currentSelected = selectedArmada;
    if (checked) {
      setValue("selectedArmada", [...currentSelected, armadaId]);
    } else {
      setValue(
        "selectedArmada",
        currentSelected.filter((id) => id !== armadaId)
      );
      setSelectAll(false);
    }
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setValue(
        "selectedArmada",
        filteredArmada.map((armada) => armada.id.toString())
      );
    } else {
      setValue("selectedArmada", []);
    }
  };

  const handleCancel = () => {
    reset();
    setSearchValue("");
    setSelectAll(false);
    setReplacementArmada(existingReplacements); // Reset to existing replacements
    onClose();
  };

  const handleOpenArmadaModal = (armadaId) => {
    setCurrentArmadaForReplacement(armadaId);
    setIsArmadaModalOpen(true);
  };

  const handleArmadaSave = (selectedArmada) => {
    setReplacementArmada((prev) => ({
      ...prev,
      [currentArmadaForReplacement]: selectedArmada,
    }));
    setIsArmadaModalOpen(false);
    setCurrentArmadaForReplacement(null);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const selectedArmadaData = armadaList.filter((armada) =>
        data.selectedArmada.includes(armada.id.toString())
      );

      // Call parent callback with selected armada, response type, and replacement armada
      onSave?.(selectedArmadaData, responseType, replacementArmada);

      // Don't show success toast here - let the parent handle feedback
      handleCancel();
    } catch {
      toast.error(
        t(
          "AturResponMassalModal.setResponseError",
          {},
          "Gagal mengatur respon. Silakan coba lagi."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = handleSubmit(onSubmit, (validationErrors) => {
    if (validationErrors.selectedArmada) {
      toast.error(validationErrors.selectedArmada.message);
    }
  });

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent
        type="muatmuat"
        className="w-[900px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="relative flex flex-col">
          {/* Close button */}
          <button
            onClick={handleCancel}
            className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white"
          >
            <IconComponent
              src="/icons/close.svg"
              className="h-3 w-3 text-neutral-600"
            />
          </button>

          {/* Header */}
          <div className="flex items-center justify-center px-6 pb-4 pt-6">
            <ModalTitle className="text-lg font-bold text-black">
              {title}
            </ModalTitle>
          </div>

          {/* Armada List Container */}
          <div className="mx-6 mb-4 rounded-lg border border-neutral-400">
            {/* Select All and Search */}
            <div className="flex items-center justify-between p-4">
              <Checkbox
                checked={selectAll}
                onChange={({ checked }) => handleSelectAll(checked)}
                label={t(
                  "AturResponMassalModal.selectAllFleet",
                  {},
                  "Pilih Semua Armada"
                )}
                className="text-sm font-medium"
              />
              <Search
                placeholder={t(
                  "AturResponMassalModal.searchPlaceholder",
                  {},
                  "Cari No. Polisi / Nama Driver"
                )}
                onSearch={(value) => setSearchValue(value)}
                containerClassName="w-[300px]"
                inputClassName="text-sm"
                autoSearch={true}
                debounceTime={300}
              />
            </div>

            {/* Armada List */}
            <div className="h-[262px] overflow-y-auto">
              {filteredArmada.length === 0 ? (
                <div className="flex h-[262px] items-center justify-center">
                  <SearchNotFound />
                </div>
              ) : (
                <div className="flex flex-col gap-4 p-4 pt-0">
                  {filteredArmada.map((armada, index) => (
                    <div
                      key={armada.id}
                      className={cn(
                        "flex h-20 items-center gap-4 rounded-lg border border-neutral-400 px-4"
                      )}
                    >
                      <Checkbox
                        checked={
                          selectedArmada &&
                          selectedArmada.includes(armada.id.toString())
                        }
                        onChange={({ checked }) =>
                          handleArmadaSelect(armada.id.toString(), checked)
                        }
                        disabled={isSubmitting}
                        label={null}
                        className="gap-0"
                      />

                      <div className="flex flex-1 items-center gap-2">
                        <ImageArmada
                          src={
                            armada.truckImage ||
                            `/img/mock-armada/${index % 3 === 0 ? "one" : index % 3 === 1 ? "two" : "three"}.png`
                          }
                          plateNumber={armada.plateNumber}
                          size="md"
                        />
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-black">
                              {armada.plateNumber}
                            </span>
                            <span className="text-xs font-semibold text-neutral-800">
                              - {armada.driverName}
                            </span>
                          </div>
                          <BadgeStatus
                            variant={
                              getTrackingStatusBadgeWithTranslation(
                                armada.status,
                                t
                              ).variant
                            }
                            className="w-fit text-xs"
                          >
                            {
                              getTrackingStatusBadgeWithTranslation(
                                armada.status,
                                t
                              ).label
                            }
                          </BadgeStatus>
                        </div>
                      </div>

                      {/* Show Pilih Armada button or selected replacement for "change" type */}
                      {responseType === "change" &&
                        selectedArmada &&
                        selectedArmada.includes(armada.id.toString()) && (
                          <>
                            {replacementArmada[armada.id] && (
                              <IconComponent
                                src="/icons/arrow-right.svg"
                                className="h-6 w-6 text-neutral-600"
                              />
                            )}
                            <div className="ml-auto">
                              {replacementArmada[armada.id] ? (
                                <div className="flex w-full items-center gap-2">
                                  <ImageArmada
                                    src={
                                      replacementArmada[armada.id].truckImage
                                    }
                                    plateNumber={
                                      replacementArmada[armada.id].plateNumber
                                    }
                                    size="md"
                                  />
                                  <div className="flex w-[195px] flex-col">
                                    <div className="line-clamp-2 break-all text-xs">
                                      <span className="font-bold">
                                        {
                                          replacementArmada[armada.id]
                                            .plateNumber
                                        }
                                      </span>
                                      <span className="font-semibold text-neutral-800">
                                        {" - "}
                                        {
                                          replacementArmada[armada.id]
                                            .driverName
                                        }
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleOpenArmadaModal(armada.id)
                                    }
                                    className="ml-auto text-xs font-medium text-primary-700"
                                  >
                                    {t(
                                      "AturResponMassalModal.changeFleet",
                                      {},
                                      "Ubah Armada"
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <Button
                                  variant="muattrans-primary-secondary"
                                  onClick={() =>
                                    handleOpenArmadaModal(armada.id)
                                  }
                                  className="h-8 px-3 text-xs"
                                >
                                  {t(
                                    "AturResponMassalModal.selectFleet",
                                    {},
                                    "Pilih Armada"
                                  )}
                                </Button>
                              )}
                            </div>
                          </>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 pb-6">
            <span className="text-sm font-bold text-black">
              {t(
                "AturResponMassalModal.totalSelected",
                {},
                "Total Unit Dipilih"
              )}{" "}
              : {selectedArmada.length}/{totalRequired}{" "}
              {t("AturResponMassalModal.unit", {}, "Unit")}
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="muattrans-primary-secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="h-10 w-24 text-sm"
              >
                {t("AturResponMassalModal.cancel", {}, "Batal")}
              </Button>
              <Button
                variant="muattrans-primary"
                onClick={handleFormSubmit}
                disabled={isSubmitting || selectedArmada.length === 0}
                className="h-10 w-24 text-sm"
              >
                {isSubmitting
                  ? t("AturResponMassalModal.saving", {}, "Menyimpan...")
                  : t("AturResponMassalModal.save", {}, "Simpan")}
              </Button>
            </div>
          </div>
        </div>
      </ModalContent>

      {/* TerimaDanUbahArmadaModal for selecting replacement armada */}
      <TerimaDanUbahArmadaModal
        isOpen={isArmadaModalOpen}
        onClose={() => {
          setIsArmadaModalOpen(false);
          setCurrentArmadaForReplacement(null);
        }}
        orderData={{ id: currentArmadaForReplacement }}
        armadaId={currentArmadaForReplacement}
        onSave={handleArmadaSave}
      />
    </Modal>
  );
};

export default AturResponMassalModal;

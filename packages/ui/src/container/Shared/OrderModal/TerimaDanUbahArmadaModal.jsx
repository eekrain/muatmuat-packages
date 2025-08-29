"use client";

import { useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTitle } from "@/components/Modal/Modal";
import RadioButton from "@/components/Radio/RadioButton";
import Search from "@/components/Search/Search";
import SearchNotFound from "@/components/SearchNotFound/SearchNotFound";

import { useTranslation } from "@/hooks/use-translation";

import { toast } from "@/lib/toast";

import ImageArmada from "./components/ImageArmada";

// Mock data for available armada
const mockAvailableArmada = [
  {
    id: "armada-1",
    plateNumber: "AE 6666 LBA",
    driverName: "Ahmad Maulana Raja Segala Raja Siap Sedia Membela Bangsa",
    vehicleType: "Colt Diesel Double - Bak Terbuka",
    status: "available",
    isRecommended: true,
    recommendationReason: "jenis armada sesuai, jarak terdekat",
    truckImage: "/img/mock-armada/one.png",
  },
  {
    id: "armada-2",
    plateNumber: "AE 7777 LBA",
    driverName: "Ahmad Maulana",
    vehicleType: "Colt Diesel Double - Bak Terbuka",
    status: "potential_overload",
    isRecommended: false,
    recommendationReason: null,
    truckImage: "/img/mock-armada/two.png",
  },
  {
    id: "armada-3",
    plateNumber: "AE 6666 LBA",
    driverName: "Ahmad Maulana",
    vehicleType: "Colt Diesel Double - Bak Terbuka",
    status: "available",
    isRecommended: false,
    recommendationReason: null,
    truckImage: "/img/mock-armada/three.png",
  },
  {
    id: "armada-4",
    plateNumber: "AE 6666 LBA",
    driverName: "Ahmad Maulana",
    vehicleType: "Colt Diesel Double - Bak Terbuka",
    status: "available",
    isRecommended: false,
    recommendationReason: null,
    truckImage: "/img/mock-armada/one.png",
  },
];

const createValidationSchema = (t) =>
  v.object({
    selectedArmada: v.pipe(
      v.string(),
      v.minLength(
        1,
        t(
          "TerimaDanUbahArmadaModal.replacementFleetRequired",
          {},
          "Armada pengganti wajib dipilih"
        )
      )
    ),
  });

const TerimaDanUbahArmadaModal = ({
  isOpen,
  onClose,
  orderData,
  armadaId,
  onSave,
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = createValidationSchema(t);

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: valibotResolver(validationSchema),
    defaultValues: {
      selectedArmada: "",
    },
  });

  const selectedArmada = watch("selectedArmada");

  // Filter armada based on search
  const filteredArmada = mockAvailableArmada.filter(
    (armada) =>
      armada.plateNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
      armada.driverName.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleArmadaSelect = (armadaId) => {
    setValue("selectedArmada", armadaId);
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const selectedArmadaData = mockAvailableArmada.find(
        (armada) => armada.id === data.selectedArmada
      );

      console.log("Selected replacement armada:", selectedArmadaData);

      // TODO: Implement API call to save armada replacement

      toast.success(
        t(
          "TerimaDanUbahArmadaModal.replacementFleetSelectedSuccess",
          {},
          "Armada pengganti berhasil dipilih"
        )
      );

      // Call parent callback with selected armada data
      onSave?.(selectedArmadaData);

      reset();
      onClose();
    } catch (error) {
      console.error("Error selecting armada:", error);
      toast.error(
        t(
          "TerimaDanUbahArmadaModal.replacementFleetSelectError",
          {},
          "Gagal memilih armada pengganti. Silakan coba lagi."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = handleSubmit(onSubmit, (errors) => {
    console.log("Validation errors:", errors);
    if (errors.selectedArmada) {
      toast.error(errors.selectedArmada.message);
    }
  });

  const getRecommendationBadge = (armada) => {
    if (armada.isRecommended) {
      return (
        <span className="flex h-6 items-center justify-center rounded bg-success-400 px-2 text-xs font-semibold text-success-50">
          {t("TerimaDanUbahArmadaModal.recommended", {}, "Rekomendasi")}
        </span>
      );
    }

    if (armada.status === "potential_overload") {
      return (
        <span className="flex h-6 items-center justify-center rounded bg-error-50 px-2 text-xs font-semibold text-error-400">
          {t(
            "TerimaDanUbahArmadaModal.potentialOverload",
            {},
            "Potensi Overload"
          )}
        </span>
      );
    }

    return null;
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent
        type="muatmuat"
        className="w-[600px]"
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
              {t("TerimaDanUbahArmadaModal.selectFleet", {}, "Pilih Armada")}
            </ModalTitle>
          </div>

          {/* Search */}
          <div className="px-6 pb-4">
            <Search
              placeholder={t(
                "TerimaDanUbahArmadaModal.searchPlaceholder",
                {},
                "Cari No. Polisi / Driver"
              )}
              onSearch={(value) => setSearchValue(value)}
              containerClassName="w-full"
              inputClassName="text-sm"
              autoSearch={true}
              debounceTime={300}
            />
          </div>

          {/* Armada List */}
          <div className="mx-6 mb-4 h-[291px] overflow-y-auto rounded-lg border border-neutral-400">
            {filteredArmada.length === 0 ? (
              <div className="flex h-[291px] items-center justify-center py-8">
                <SearchNotFound />
              </div>
            ) : (
              filteredArmada.map((armada, index) => (
                <div key={armada.id}>
                  <div
                    className="flex cursor-pointer items-center justify-between gap-3 p-4 transition-colors hover:bg-neutral-50"
                    onClick={() => handleArmadaSelect(armada.id)}
                  >
                    <div className="flex items-center gap-3">
                      {/* Truck Image */}
                      <ImageArmada
                        src={armada.truckImage}
                        plateNumber={armada.plateNumber}
                        size="md"
                      />

                      {/* Armada Info */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-black">
                            {armada.plateNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <IconComponent
                            src="/icons/user16.svg"
                            className="h-3 w-3 text-neutral-600"
                          />
                          <span className="line-clamp-1 break-before-all text-xxs font-medium">
                            {armada.driverName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <IconComponent
                            src="/icons/monitoring/daftar-pesanan-aktif/truck.svg"
                            className="h-3 w-3 text-neutral-600"
                          />
                          <span className="text-xxs font-medium">
                            {armada.vehicleType}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Radio Button and Badge */}
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end gap-2">
                        {getRecommendationBadge(armada)}
                        {armada.isRecommended &&
                          armada.recommendationReason && (
                            <span className="whitespace-nowrap text-right text-xxs">
                              {armada.recommendationReason}
                            </span>
                          )}
                      </div>
                      <RadioButton
                        name="selectedArmada"
                        value={armada.id}
                        checked={selectedArmada === armada.id}
                        onChange={() => handleArmadaSelect(armada.id)}
                        onClick={() => handleArmadaSelect(armada.id)}
                        className="!gap-0"
                      />
                    </div>
                  </div>
                  {index < filteredArmada.length - 1 && (
                    <div className="mx-4 border-b border-neutral-300" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-center gap-3 px-6 pb-6">
            <Button
              variant="muattrans-primary-secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="h-10 w-24 text-sm"
            >
              {t("TerimaDanUbahArmadaModal.cancel", {}, "Batal")}
            </Button>
            <Button
              variant="muattrans-primary"
              onClick={handleFormSubmit}
              disabled={isSubmitting}
              className="h-10 w-24 text-sm"
            >
              {isSubmitting
                ? t("TerimaDanUbahArmadaModal.saving", {}, "Menyimpan...")
                : t("TerimaDanUbahArmadaModal.save", {}, "Simpan")}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default TerimaDanUbahArmadaModal;

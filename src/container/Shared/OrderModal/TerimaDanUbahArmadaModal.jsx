"use client";

import { useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTitle } from "@/components/Modal/Modal";
import Search from "@/components/Search/Search";
import SearchNotFound from "@/components/SearchNotFound/SearchNotFound";
import { toast } from "@/lib/toast";

// Mock data for available armada
const mockAvailableArmada = [
  {
    id: "armada-1",
    plateNumber: "AE 6666 LBA",
    driverName: "Ahmad Maulana",
    vehicleType: "Colt Diesel Double - Bak Terbuka",
    status: "available",
    isRecommended: true,
    recommendationReason: "jenis armada sesuai, jarak terdekat",
  },
  {
    id: "armada-2",
    plateNumber: "AE 7777 LBA",
    driverName: "Ahmad Maulana",
    vehicleType: "Colt Diesel Double - Bak Terbuka",
    status: "potential_overload",
    isRecommended: false,
    recommendationReason: null,
  },
  {
    id: "armada-3",
    plateNumber: "AE 6666 LBA",
    driverName: "Ahmad Maulana",
    vehicleType: "Colt Diesel Double - Bak Terbuka",
    status: "available",
    isRecommended: false,
    recommendationReason: null,
  },
  {
    id: "armada-4",
    plateNumber: "AE 6666 LBA",
    driverName: "Ahmad Maulana",
    vehicleType: "Colt Diesel Double - Bak Terbuka",
    status: "available",
    isRecommended: false,
    recommendationReason: null,
  },
];

const validationSchema = v.object({
  selectedArmada: v.pipe(
    v.string(),
    v.minLength(1, "Armada pengganti wajib dipilih")
  ),
});

const TerimaDanUbahArmadaModal = ({
  isOpen,
  onClose,
  orderData,
  armadaId,
  onSave,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      toast.success("Armada pengganti berhasil dipilih");

      // Call parent callback with selected armada data
      onSave?.(selectedArmadaData);

      reset();
      onClose();
    } catch (error) {
      console.error("Error selecting armada:", error);
      toast.error("Gagal memilih armada pengganti. Silakan coba lagi.");
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
        <span className="flex h-6 items-center justify-center rounded bg-success-600 px-2 text-xs font-semibold text-white">
          Rekomendasi
        </span>
      );
    }

    if (armada.status === "potential_overload") {
      return (
        <span className="flex h-6 items-center justify-center rounded bg-error-400 px-2 text-xs font-semibold text-white">
          Potensi Overload
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
              Pilih Armada
            </ModalTitle>
          </div>

          {/* Search */}
          <div className="px-6 pb-4">
            <Search
              placeholder="Cari No. Polisi / Driver"
              onSearch={(value) => setSearchValue(value)}
              containerClassName="w-full"
              inputClassName="text-sm"
              autoSearch={true}
              debounceTime={300}
            />
          </div>

          {/* Armada List */}
          <div className="flex max-h-[400px] flex-col gap-3 overflow-y-auto px-6 pb-4">
            {filteredArmada.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <SearchNotFound label="Armada Tidak Ditemukan" />
              </div>
            ) : (
              filteredArmada.map((armada) => (
                <div
                  key={armada.id}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
                    selectedArmada === armada.id
                      ? "border-primary-700 bg-primary-50"
                      : "border-neutral-300 hover:border-neutral-400"
                  }`}
                  onClick={() => handleArmadaSelect(armada.id)}
                >
                  <div className="flex items-center gap-3">
                    {/* Truck Image */}
                    <div className="flex h-12 w-12 items-center justify-center rounded border border-neutral-300 bg-white">
                      <IconComponent
                        src="/icons/monitoring/daftar-pesanan-aktif/truck.svg"
                        className="h-8 w-8 text-gray-600"
                      />
                    </div>

                    {/* Armada Info */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-black">
                          {armada.plateNumber}
                        </span>
                        {getRecommendationBadge(armada)}
                      </div>
                      <div className="flex items-center gap-1">
                        <IconComponent
                          src="/icons/user.svg"
                          className="h-3 w-3 text-neutral-600"
                        />
                        <span className="text-xs font-medium text-black">
                          {armada.driverName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <IconComponent
                          src="/icons/truck.svg"
                          className="h-3 w-3 text-neutral-600"
                        />
                        <span className="text-xs text-neutral-600">
                          {armada.vehicleType}
                        </span>
                      </div>
                      {armada.isRecommended && armada.recommendationReason && (
                        <span className="text-xs text-neutral-500">
                          {armada.recommendationReason}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Radio Button */}
                  <div className="flex items-center">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        selectedArmada === armada.id
                          ? "border-primary-700 bg-primary-700"
                          : "border-neutral-400"
                      }`}
                    >
                      {selectedArmada === armada.id && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
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
              Batal
            </Button>
            <Button
              variant="muattrans-primary"
              onClick={handleFormSubmit}
              disabled={isSubmitting || !selectedArmada}
              className="h-10 w-24 text-sm"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default TerimaDanUbahArmadaModal;

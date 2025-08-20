"use client";

import { useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTitle } from "@/components/Modal/Modal";
import RadioButton from "@/components/Radio/RadioButton";
import { toast } from "@/lib/toast";

import FleetSelector from "./components/FleetSelector";
import ImageArmada from "./components/ImageArmada";

// Valibot validation schema
const FormSchema = v.pipe(
  v.object({
    selectedResponse: v.pipe(
      v.string(),
      v.minLength(1, "Respon perubahan wajib diisi")
    ),
    selectedFleet: v.string(),
  }),
  v.forward(
    v.partialCheck(
      [["selectedResponse"], ["selectedFleet"]],
      (input) => {
        if (input.selectedResponse === "accept_change_fleet") {
          return input.selectedFleet && input.selectedFleet.trim().length > 0;
        }
        return true;
      },
      "Armada wajib dipilih"
    ),
    ["selectedFleet"]
  )
);

const RespondChangeFormModal = ({
  isOpen,
  onClose,
  orderData,
  onBackClick,
  formDaftarPesanan,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm({
    resolver: valibotResolver(FormSchema),
    defaultValues: {
      selectedResponse: "",
      selectedFleet: "",
    },
  });

  const selectedResponse = watch("selectedResponse");
  const selectedFleet = watch("selectedFleet");

  // Mock fleet options based on the image
  const fleetOptions = [
    {
      id: "fleet1",
      licensePlate: "L 2222 LBA",
      driverName: "Muklason",
      vehicleType: "Colt Diesel Engkel - Box",
      isRecommended: true,
      recommendationText: "jenis armada sesuai, jarak terdekat",
    },
    {
      id: "fleet2",
      licensePlate: "L 3333 LBA",
      driverName:
        "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra Perdana Kusuma Wiayanto",
      vehicleType: "Colt Diesel Engkel - Box",
      hasOverload: true,
    },
    {
      id: "fleet3",
      licensePlate: "L 4444 LBA",
      driverName: "Putra Perdana Kusuma Wiayanto",
      vehicleType: "Colt Diesel Engkel - Box",
    },
    {
      id: "fleet4",
      licensePlate: "L 5555 LBA",
      driverName: "Nugroho Putra Perdana Kusuma Wiayanto",
      vehicleType: "Colt Diesel Engkel - Box",
    },
    {
      id: "fleet5",
      licensePlate: "L 6666 LBA",
      driverName: "Putra Perdana Kusuma Wiayanto",
      vehicleType:
        "Tractor head 6 x 4 dan Semi Trailer - Skeletal Container Jumbo 45 ft (3 As)",
    },
  ];

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const responseLabels = {
        accept: "Terima Perubahan",
        accept_change_fleet: "Terima Perubahan & Ubah Armada",
        reject_cancel: "Tolak Perubahan & Batalkan Armada",
      };

      toast.success(
        `Berhasil ${responseLabels[data.selectedResponse]} untuk pesanan ${orderData?.orderCode || "MT001234"}`
      );
      handleClose();
    } catch (error) {
      toast.error("Gagal mengirim respon. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = handleSubmit(onSubmit);

  const handleClose = () => {
    reset();
    setIsLoading(false);
    onClose?.();
  };

  const handleOpenChange = (open) => {
    if (!open) {
      handleClose();
    }
  };

  const responseOptions = [
    {
      id: "accept",
      label: "Terima Perubahan",
    },
    {
      id: "accept_change_fleet",
      label: "Terima Perubahan & Ubah Armada",
    },
    {
      id: "reject_cancel",
      label: "Tolak Perubahan & Batalkan Armada",
    },
  ];

  if (!orderData) return null;

  return (
    <Modal open={isOpen} onOpenChange={handleOpenChange}>
      <ModalContent
        type="muatmuat"
        className="w-[600px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="relative flex flex-col">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white"
          >
            <IconComponent
              src="/icons/close.svg"
              className="h-[9px] w-[9px] text-primary-700"
            />
          </button>

          {/* Header */}
          <div className="flex items-center justify-center px-6 pt-6">
            <ModalTitle className="text-base font-bold leading-[120%] text-black">
              Respon Perubahan
            </ModalTitle>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6 px-6 py-4">
            {/* Vehicle Info Section */}
            <div className="rounded-lg border border-neutral-400 bg-neutral-50 p-4">
              <h3 className="mb-3 text-xs font-medium leading-[120%] text-neutral-600">
                Informasi Armada
              </h3>

              <div className="flex items-center gap-3">
                <ImageArmada
                  src="/img/mock-armada/one.png"
                  plateNumber="AE 1111 LBA"
                  size="md"
                />

                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-1">
                    <span className="h-2 flex-none text-xs font-bold text-black">
                      AE 1111 LBA
                    </span>
                    <span className="h-2 flex-1 text-xs font-semibold text-neutral-800">
                      - Noel Gallagher
                    </span>
                  </div>
                  <BadgeStatus variant="primary" className="w-auto">
                    Armada Dijadwalkan
                  </BadgeStatus>
                </div>
              </div>
            </div>

            {/* Response Options */}
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-black">
                Pilih Respon Perubahan<span className="">*</span>
              </h3>

              <div className="space-y-4">
                {responseOptions.map((option) => (
                  <div key={option.id} className="space-y-3">
                    <RadioButton
                      name="responseOption"
                      value={option.id}
                      checked={selectedResponse === option.id}
                      onClick={() => {
                        setValue("selectedResponse", option.id);
                        trigger("selectedResponse");
                      }}
                      onChange={() => {
                        setValue("selectedResponse", option.id);
                        trigger("selectedResponse");
                      }}
                      label={option.label}
                      classNameLabel="text-sm font-medium leading-[120%] text-black"
                      disabled={isLoading}
                    />
                    {option.id === "accept" &&
                      selectedResponse === "accept" && (
                        <div className="pl-5">
                          <div className="flex h-6 flex-none items-center self-stretch rounded-md bg-success-50 px-2 py-1 text-xs font-semibold text-success-400">
                            Tidak ada perubahan armada dan akan ada penyesuaian
                            pendapatan
                          </div>
                        </div>
                      )}
                    {option.id === "accept_change_fleet" &&
                      selectedResponse === "accept_change_fleet" && (
                        <div className="space-y-3 pl-5">
                          <FleetSelector
                            value={selectedFleet}
                            onValueChange={(value) => {
                              setValue("selectedFleet", value);
                              trigger("selectedFleet");
                            }}
                            disabled={isLoading}
                            isError={
                              !!errors.selectedFleet &&
                              selectedResponse === "accept_change_fleet"
                            }
                            fleetOptions={fleetOptions}
                            placeholder="Pilih Armada"
                          />
                          {errors.selectedFleet &&
                            selectedResponse === "accept_change_fleet" && (
                              <p
                                className="text-left text-xs font-medium leading-tight"
                                style={{ color: "#EE4343" }}
                              >
                                {errors.selectedFleet.message}
                              </p>
                            )}
                        </div>
                      )}
                    {option.id === "reject_cancel" &&
                      selectedResponse === "reject_cancel" && (
                        <div className="pl-5">
                          <div className="flex h-6 flex-none items-center self-stretch rounded-md bg-error-50 px-2 py-1 text-xs font-semibold text-error-400">
                            Armada akan dibatalkan, akan ada penyesuaian
                            pendapatan, dan tidak ada kompensasi
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>

              {/* Error Alert */}
              {errors.selectedResponse && (
                <p
                  className="text-left text-xs font-medium leading-tight"
                  style={{ color: "#EE4343" }}
                >
                  {errors.selectedResponse.message}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-3 px-6 pb-6">
            <Button
              variant="muattrans-primary-secondary"
              onClick={() => {
                handleClose(), onBackClick();
              }}
              disabled={isLoading}
              className="w-[112px]"
            >
              Kembali
            </Button>
            <Button
              variant="muattrans-primary"
              onClick={handleFormSubmit}
              disabled={isLoading}
              className="w-[112px]"
            >
              {isLoading ? "Memproses..." : "Simpan"}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default RespondChangeFormModal;

"use client";

import { useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import Button from "@/components/Button/Button";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageUploaderWeb from "@/components/ImageUploader/ImageUploaderWeb";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/Modal/Modal";
import RadioButton from "@/components/Radio/RadioButton";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

import InputAlasanLainnya from "./InputAlasanLainnya";

// Valibot validation schema
const FormSchema = v.pipe(
  v.object({
    unitCount: v.pipe(
      v.string(),
      v.minLength(1, "Jumlah unit wajib diisi"),
      v.regex(/^\d+$/, "Jumlah unit harus berupa angka"),
      v.transform((val) => parseInt(val, 10)),
      v.minValue(1, "Jumlah unit minimal 1")
    ),
    selectedReason: v.pipe(
      v.string(),
      v.minLength(1, "Alasan perubahan wajib diisi")
    ),
    otherReason: v.string(),
    supportingFiles: v.pipe(
      v.array(v.any()),
      v.minLength(1, "Foto Pendukung harus memiliki minimal 1 foto")
    ),
  }),
  v.forward(
    v.partialCheck(
      [["selectedReason"], ["otherReason"]],
      (input) => {
        if (input.selectedReason === "Lainnya") {
          return input.otherReason && input.otherReason.trim().length > 0;
        }
        return true;
      },
      "Alasan lainnya wajib diisi"
    ),
    ["otherReason"]
  )
);

const PerubahanJumlahUnitModal = ({
  isOpen,
  onClose,
  orderData,
  onConfirm,
  isLoading = false,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState([null, null, null, null]); // 4 slots for images
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUnitCount = orderData?.truckCount || 3;

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
      unitCount: "",
      selectedReason: "",
      otherReason: "",
      supportingFiles: [],
    },
  });

  const selectedReason = watch("selectedReason");
  const otherReason = watch("otherReason");
  const unitCount = watch("unitCount");

  const changeReasons = [
    "Kendaraan Bermasalah",
    "Driver Berhalangan",
    "Bencana Alam",
    "Lainnya",
  ];

  const handleFileUpload = (file, index) => {
    const newFiles = [...uploadedFiles];

    if (file === null) {
      // If removing a file, shift all files after it to fill the gap
      newFiles[index] = null;
      // Shift remaining files to the left
      for (let i = index; i < newFiles.length - 1; i++) {
        newFiles[i] = newFiles[i + 1];
      }
      newFiles[newFiles.length - 1] = null;
    } else {
      // Check file size (10MB = 10 * 1024 * 1024 bytes)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Ukuran file melebihi 10MB");
        return;
      }

      // When adding a file, find the first empty slot
      const firstEmptyIndex = newFiles.findIndex((f) => f === null);
      if (firstEmptyIndex !== -1) {
        newFiles[firstEmptyIndex] = file;
      }
    }

    setUploadedFiles(newFiles);
    // Update form with filtered files (remove null values)
    const actualFiles = newFiles.filter((f) => f !== null);
    setValue("supportingFiles", actualFiles);
    // Trigger validation for supportingFiles
    trigger("supportingFiles");
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onConfirm?.({
        orderData,
        newUnitCount: data.unitCount,
        reason:
          data.selectedReason === "Lainnya"
            ? data.otherReason
            : data.selectedReason,
        reasonType: data.selectedReason,
        supportingFiles: data.supportingFiles,
      });
      handleClose();
    } catch (error) {
      console.error("Error submitting unit change:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = handleSubmit(onSubmit);

  const handleClose = () => {
    reset(); // This clears all form state and errors
    setUploadedFiles([null, null, null, null]);
    setIsSubmitting(false);
    onClose?.();
  };

  const handleOpenChange = (open) => {
    if (!open) {
      handleClose();
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={handleOpenChange}>
      <ModalContent
        className={cn("w-[500px] min-w-[500px] max-w-[500px] bg-white p-0")}
        type="muattrans"
      >
        <ModalHeader size="small" />
        <ModalTitle className="sr-only">Perubahan Jumlah Unit</ModalTitle>

        {/* Modal Content */}
        <div className="pl-6 pr-2 pt-9">
          <div className={cn("max-h-[262px] w-full overflow-auto pr-[10px]")}>
            <div className="flex flex-col gap-4 pr-[14px]">
              {/* Masukkan Perubahan Jumlah Unit */}
              <div className="flex flex-col">
                <h3 className="mb-3.5 font-bold text-black">
                  Masukkan Perubahan Jumlah Unit<span className="">*</span>
                </h3>

                <p className="mb-3 text-xs font-medium text-[#7B7B7B]">
                  Jumlah Kebutuhan Armada Yang Kamu Terima :{" "}
                  <span className="font-semibold text-neutral-900">
                    {currentUnitCount} Unit
                  </span>
                </p>

                <div className="mb-2 flex items-center gap-3">
                  <span className="text-sm font-medium text-black">
                    Ubah menjadi
                  </span>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Jumlah"
                    value={unitCount}
                    onChange={(e) => {
                      setValue("unitCount", e.target.value);
                      trigger("unitCount");
                    }}
                    disabled={isSubmitting || isLoading}
                    className="!w-[65px]"
                    appearance={{
                      containerClassName: "h-8",
                      inputClassName: "text-sm",
                    }}
                  />
                  <span className="text-sm font-medium text-black">
                    unit armada
                  </span>
                </div>

                {/* Error Alert for Unit Count */}
                {errors.unitCount && (
                  <p
                    className="mt-2 text-left text-xs font-medium leading-tight"
                    style={{ color: "#EE4343" }}
                  >
                    {errors.unitCount.message}
                  </p>
                )}
              </div>

              {/* Pilih Alasan Perubahan */}
              <div className="flex flex-col">
                <h3 className="mb-3.5 font-bold text-black">
                  Pilih Alasan Perubahan<span className="">*</span>
                </h3>

                <div className="mb-2 flex flex-col gap-3">
                  {changeReasons.map((reason) => (
                    <RadioButton
                      key={reason}
                      name="changeReason"
                      value={reason}
                      label={reason}
                      checked={selectedReason === reason}
                      onChange={() => {
                        setValue("selectedReason", reason);
                        if (reason !== "Lainnya") {
                          setValue("otherReason", "");
                        }
                        trigger("selectedReason");
                      }}
                      onClick={({ value }) => {
                        setValue("selectedReason", value);
                        if (value !== "Lainnya") {
                          setValue("otherReason", "");
                        }
                        trigger("selectedReason");
                      }}
                      disabled={isSubmitting || isLoading}
                      classNameLabel="text-sm font-medium text-black"
                    />
                  ))}
                </div>

                {/* Show input when Lainnya is selected */}
                {selectedReason === "Lainnya" && (
                  <InputAlasanLainnya
                    value={otherReason}
                    onChange={(value) => {
                      setValue("otherReason", value);
                      trigger("otherReason");
                    }}
                    disabled={isSubmitting || isLoading}
                    isError={
                      errors.otherReason &&
                      selectedReason === "Lainnya" &&
                      !otherReason.trim()
                    }
                  />
                )}

                {/* Error Alert for Other Reason */}
                {errors.otherReason && selectedReason === "Lainnya" && (
                  <p
                    className="text-left text-xs font-medium leading-tight"
                    style={{ color: "#EE4343" }}
                  >
                    {errors.otherReason.message}
                  </p>
                )}

                {/* Error Alert for Reason */}
                {errors.selectedReason && (
                  <p
                    className="mt-2 text-left text-xs font-medium leading-tight"
                    style={{ color: "#EE4343" }}
                  >
                    {errors.selectedReason.message}
                  </p>
                )}
              </div>

              {/* Masukkan Lampiran Foto Pendukung */}
              <div className="flex flex-col gap-3.5">
                <h3 className="font-bold text-black">
                  Masukkan Lampiran Foto Pendukung
                  <span className="">*</span>
                </h3>

                {/* File Upload Area using ImageUploaderWeb */}
                <div className="flex flex-wrap gap-3">
                  {uploadedFiles.map((file, index) => (
                    <ImageUploaderWeb
                      key={index}
                      value={file}
                      onUpload={(newFile) => handleFileUpload(newFile, index)}
                      isError={false}
                      isNull={false}
                      maxSize={10}
                      acceptedFormats={[".jpg", ".jpeg", ".png"]}
                      uploadText=""
                      errorText=""
                      isBig={false}
                      className="!h-10 !w-10 !rounded"
                      cropperTitle="Upload Foto Pendukung"
                    />
                  ))}
                </div>

                <p
                  className="text-xs font-medium leading-tight"
                  style={{ color: "#7B7B7B" }}
                >
                  Min. 1 foto dengan format file jpg/jpeg/png, besar file maks.
                  10MB
                </p>

                {/* Error Alert for Photo Upload */}
                {errors.supportingFiles && (
                  <p
                    className="text-left text-xs font-medium leading-tight"
                    style={{ color: "#EE4343" }}
                  >
                    {errors.supportingFiles.message}
                  </p>
                )}
              </div>

              {/* Penalty Alert */}
              <div
                className="flex h-12 items-center gap-2.5 rounded-md p-3"
                style={{ background: "#FFECB4" }}
              >
                <IconComponent
                  src="/icons/warning24.svg"
                  className="h-6 w-6 text-warning-800"
                />
                <div className="flex flex-col">
                  <p className="text-xs font-medium leading-tight text-black">
                    Perubahan jumlah unit kemungkinan akan dikenakan penalti.
                  </p>
                  <p className="text-xs font-semibold leading-tight text-black">
                    Penalti kamu saat ini : 0
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons in ModalFooter */}
        <ModalFooter>
          <Button
            variant="muattrans-primary-secondary"
            onClick={handleClose}
            disabled={isSubmitting || isLoading}
            className="px-8"
          >
            Batal
          </Button>
          <Button
            variant="muattrans-warning"
            onClick={handleConfirm}
            disabled={isSubmitting || isLoading}
            {...((isSubmitting || isLoading) && { loading: true })}
            className="bg-[#F5C451] px-8 text-black hover:bg-[#F5C451]/90"
          >
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PerubahanJumlahUnitModal;

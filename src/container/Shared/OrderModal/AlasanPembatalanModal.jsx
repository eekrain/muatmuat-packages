"use client";

import { useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import Button from "@/components/Button/Button";
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
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

import InputAlasanLainnya from "./components/InputAlasanLainnya";

const AlasanPembatalanModal = ({
  isOpen,
  onClose,
  order,
  onConfirm,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  // Valibot validation schema with translations
  const FormSchema = v.pipe(
    v.object({
      selectedReason: v.pipe(
        v.string(),
        v.minLength(
          1,
          t(
            "AlasanPembatalanModal.reasonRequired",
            {},
            "Alasan pembatalan wajib diisi"
          )
        )
      ),
      otherReason: v.string(),
      supportingFiles: v.pipe(
        v.array(v.any()),
        v.minLength(
          1,
          t(
            "AlasanPembatalanModal.photoRequired",
            {},
            "Foto Pendukung harus memiliki minimal 1 foto"
          )
        )
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
        t(
          "AlasanPembatalanModal.otherReasonRequired",
          {},
          "Alasan lainnya wajib diisi"
        )
      ),
      ["otherReason"]
    )
  );
  const [uploadedFiles, setUploadedFiles] = useState([null, null, null, null]); // 4 slots for images
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      selectedReason: "",
      otherReason: "",
      supportingFiles: [],
    },
  });

  const selectedReason = watch("selectedReason");
  const otherReason = watch("otherReason");

  const cancellationReasons = [
    {
      value: "Kendaraan Bermasalah",
      label: t(
        "AlasanPembatalanModal.vehicleProblem",
        {},
        "Kendaraan Bermasalah"
      ),
    },
    {
      value: "Driver Berhalangan",
      label: t(
        "AlasanPembatalanModal.driverUnavailable",
        {},
        "Driver Berhalangan"
      ),
    },
    {
      value: "Bencana Alam",
      label: t("AlasanPembatalanModal.naturalDisaster", {}, "Bencana Alam"),
    },
    {
      value: "Lainnya",
      label: t("AlasanPembatalanModal.others", {}, "Lainnya"),
    },
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
        toast.error(
          t(
            "AlasanPembatalanModal.fileSizeExceeded",
            {},
            "Ukuran file melebihi 10MB"
          )
        );
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

  const hasAtLeastOneFile = () => {
    return uploadedFiles.some((file) => file !== null);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onConfirm?.({
        order,
        reason:
          data.selectedReason === "Lainnya"
            ? data.otherReason
            : data.selectedReason,
        reasonType: data.selectedReason,
        supportingFiles: data.supportingFiles,
      });
      handleClose();
    } catch (error) {
      console.error("Error submitting cancellation:", error);
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
        <ModalTitle className="sr-only">
          {t("AlasanPembatalanModal.title", {}, "Alasan Pembatalan")}
        </ModalTitle>

        {/* Modal Content */}
        <div className="pl-6 pr-2 pt-9">
          <div className={cn("max-h-[262px] w-full overflow-auto pr-[10px]")}>
            <div className="flex flex-col gap-4 pr-[14px]">
              {/* Pilih Alasan Pembatalan */}
              <div className="flex flex-col">
                <h3 className="mb-3.5 font-bold text-black">
                  {t(
                    "AlasanPembatalanModal.selectCancellationReason",
                    {},
                    "Pilih Alasan Pembatalan"
                  )}
                  <span className="">*</span>
                </h3>

                <div className="mb-2 flex flex-col gap-3">
                  {cancellationReasons.map((reason) => (
                    <RadioButton
                      key={reason.value}
                      name="cancellationReason"
                      value={reason.value}
                      label={reason.label}
                      checked={selectedReason === reason.value}
                      onChange={() => {
                        setValue("selectedReason", reason.value);
                        if (reason.value !== "Lainnya") {
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
                  {t(
                    "AlasanPembatalanModal.uploadSupportingPhotos",
                    {},
                    "Masukkan Lampiran Foto Pendukung"
                  )}
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
                      cropperTitle={t(
                        "AlasanPembatalanModal.uploadSupportingPhotosCropper",
                        {},
                        "Upload Foto Pendukung"
                      )}
                    />
                  ))}
                </div>

                <p
                  className="text-xs font-medium leading-tight"
                  style={{ color: "#7B7B7B" }}
                >
                  {t(
                    "AlasanPembatalanModal.photoRequirements",
                    {},
                    "Min. 1 foto dengan format file jpg/jpeg/png, besar file maks. 10MB"
                  )}
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
                    {t(
                      "AlasanPembatalanModal.penaltyWarning",
                      {},
                      "Pembatalan pesanan kemungkinan akan dikenakan penalti."
                    )}
                  </p>
                  <p className="text-xs font-semibold leading-tight text-black">
                    {t(
                      "AlasanPembatalanModal.currentPenalty",
                      {},
                      "Penalti kamu saat ini : 0"
                    )}
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
            {t("AlasanPembatalanModal.cancel", {}, "Batal")}
          </Button>
          <Button
            variant="muattrans-primary"
            onClick={handleConfirm}
            disabled={isSubmitting || isLoading}
            className="px-8"
          >
            {t("AlasanPembatalanModal.save", {}, "Simpan")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AlasanPembatalanModal;

import { useState } from "react";

import { useCompleteTransportRequest } from "@/services/CS/monitoring/permintaan-angkut/completeTransportRequest";
import { useUploadVehiclePhoto } from "@/services/CS/monitoring/permintaan-angkut/uploadVehiclePhoto";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Form/Checkbox";
import Input from "@/components/Form/Input";
import ImageUploaderWeb from "@/components/ImageUploader/ImageUploaderWeb";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/Modal/Modal";

import { useTranslation } from "@/hooks/use-translation";

import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const ModalCatatanPenyelesaian = ({
  isOpen,
  onClose,
  isLoading = false,
  fleetNoteData,
}) => {
  const { t } = useTranslation();
  const [catatan, setCatatan] = useState("");
  const [catatanError, setCatatanError] = useState("");
  const [tidakMenanggapi, setTidakMenanggapi] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([null, null, null, null]);
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState([
    null,
    null,
    null,
    null,
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract data from fleetNoteData
  const requestId = fleetNoteData?.latestNote?.relatedEntities?.reportId;
  const csUserId = fleetNoteData?.latestNote?.relatedEntities?.reportedBy;
  const assignedTransporterId =
    fleetNoteData?.latestNote?.relatedEntities?.transporterId;
  const finalPrice = 0;
  const completionDuration = 0;

  // SWR mutation hooks
  const { trigger: uploadVehiclePhoto } = useUploadVehiclePhoto();
  const { trigger: completeRequest } = useCompleteTransportRequest(requestId);

  const handleFileUpload = async (file, index) => {
    const newFiles = [...uploadedFiles];
    const newPhotoUrls = [...uploadedPhotoUrls];

    if (file === null) {
      // Remove file and photo URL
      newFiles[index] = null;
      newPhotoUrls[index] = null;

      // Shift remaining items left
      for (let i = index; i < newFiles.length - 1; i++) {
        newFiles[i] = newFiles[i + 1];
        newPhotoUrls[i] = newPhotoUrls[i + 1];
      }
      newFiles[newFiles.length - 1] = null;
      newPhotoUrls[newPhotoUrls.length - 1] = null;
    } else {
      // Validate file size
      if (file.size > 10 * 1024 * 1024) {
        toast.error(
          t(
            "ModalCatatanPenyelesaian.alertFileSizeExceeds10MB",
            {},
            "Ukuran file melebihi 10MB"
          )
        );
        return;
      }

      // Find first empty slot
      const firstEmptyIndex = newFiles.findIndex((f) => f === null);
      if (firstEmptyIndex !== -1) {
        newFiles[firstEmptyIndex] = file;

        // Upload immediately
        try {
          const formData = new FormData();
          formData.append("photo", file);

          const uploadResult = await uploadVehiclePhoto(formData);
          const photoUrl = uploadResult?.data?.Data?.photoUrl;

          if (photoUrl) {
            newPhotoUrls[firstEmptyIndex] = photoUrl;
            toast.success(
              t(
                "ModalCatatanPenyelesaian.successUploadPhoto",
                {},
                "Foto berhasil diupload"
              )
            );
          } else {
            // Upload failed, remove file
            newFiles[firstEmptyIndex] = null;
            toast.error(
              t(
                "ModalCatatanPenyelesaian.errorUploadPhoto",
                {},
                "Gagal upload foto"
              )
            );
            return;
          }
        } catch {
          // Upload failed, remove file
          newFiles[firstEmptyIndex] = null;
          toast.error(
            t(
              "ModalCatatanPenyelesaian.errorUploadPhoto",
              {},
              "Gagal upload foto"
            )
          );
          return;
        }
      }
    }

    setUploadedFiles(newFiles);
    setUploadedPhotoUrls(newPhotoUrls);
  };

  const handleClose = () => {
    setCatatan("");
    setTidakMenanggapi(false);
    setUploadedFiles([null, null, null, null]);
    setUploadedPhotoUrls([null, null, null, null]);
    setIsSubmitting(false);
    onClose?.();
  };

  const handleConfirm = async () => {
    // Validate requestId
    if (!requestId) {
      toast.error(
        t(
          "ModalCatatanPenyelesaian.errorMissingRequestId",
          {},
          "Request ID tidak ditemukan"
        )
      );
      return;
    }

    // Validate catatan if not disabled
    if (!tidakMenanggapi && !catatan.trim()) {
      setCatatanError(
        t(
          "ModalCatatanPenyelesaian.messageErrorCompletionNotesRequired",
          {},
          "Catatan penyelesaian wajib diisi"
        )
      );
      return;
    }
    setCatatanError("");
    setIsSubmitting(true);

    try {
      // Get uploaded photo URLs (skip file upload since photos are already uploaded)
      const attachmentIds = uploadedPhotoUrls.filter((url) => url !== null);

      // Submit completion with photo URLs
      const completionPayload = {
        resolutionType: tidakMenanggapi ? "no_response" : "manual_completion",
        resolutionNote: !tidakMenanggapi ? catatan : undefined,
        noResponse: !!tidakMenanggapi,
        completionMetadata: {
          completedBy: csUserId,
          completionReason: tidakMenanggapi
            ? "no_response_from_transporter"
            : "successful_assignment",
          assignedTransporter: assignedTransporterId,
          finalPrice: finalPrice || 0,
          completionDuration: completionDuration || 0,
        },
        attachmentIds, // Now contains photo URLs instead of attachment IDs
        followUpRequired: false,
        followUpDate: null,
        qualityScore: 5,
      };

      console.log(completionPayload);

      try {
        await completeRequest(completionPayload);
        toast.success(
          t(
            "ModalCatatanPenyelesaian.successComplete",
            {},
            "Berhasil menyelesaikan permintaan"
          )
        );
        handleClose();
      } catch {
        toast.error(
          t(
            "ModalCatatanPenyelesaian.errorComplete",
            {},
            "Gagal menyelesaikan permintaan"
          )
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <ModalContent className={cn("w-[486px] bg-white")} type="muattrans">
        <ModalHeader size="small" />
        <ModalTitle className="sr-only">
          {t(
            "ModalCatatanPenyelesaian.titleCompletionNotes",
            {},
            "Catatan Penyelesaian"
          )}
        </ModalTitle>
        <div className="px-6 pt-9">
          <div className="flex flex-col gap-5">
            {/* Masukkan Catatan Penyelesaian */}
            <div className="flex flex-col">
              <h3 className="mb-4 text-[16px] font-bold text-black">
                {t(
                  "ModalCatatanPenyelesaian.headingEnterCompletionNotes",
                  {},
                  "Masukkan Catatan Penyelesaian"
                )}
                <span className="">*</span>
              </h3>
              <div className="mb-4">
                <Checkbox
                  checked={tidakMenanggapi}
                  onChange={({ checked }) => setTidakMenanggapi(checked)}
                  disabled={isSubmitting || isLoading}
                  label={t(
                    "ModalCatatanPenyelesaian.labelTransporterNotResponding",
                    {},
                    "Transporter Tidak Menanggapi"
                  )}
                  appearance={{
                    labelClassName: "text-xs font-medium text-neutral-900",
                  }}
                />
              </div>
              <Input
                placeholder={t(
                  "ModalCatatanPenyelesaian.placeholderEnterCompletionNotes",
                  {},
                  "Masukkan catatan penyelesaian"
                )}
                maxLength={80}
                value={catatan}
                onChange={(e) => {
                  setCatatan(e.target.value);
                  if (catatanError) setCatatanError("");
                }}
                disabled={isSubmitting || isLoading || tidakMenanggapi}
                errorMessage={catatanError}
                appearance={
                  catatanError
                    ? {
                        inputClassName: "border-error-400 text-error-400",
                      }
                    : {}
                }
              />
              <div
                className={`relative flex w-full items-center justify-end text-xs ${
                  catatanError ? "-top-3.5 pt-0" : "pt-2"
                }`}
              >
                <span
                  className={
                    catatanError
                      ? "font-medium text-error-400"
                      : "text-neutral-500"
                  }
                >
                  {catatan.length}/80
                </span>
              </div>
            </div>
            {/* Masukkan Lampiran Foto Pendukung */}
            <div className="flex flex-col">
              <h3 className="mb-4 text-[16px] font-bold text-neutral-900">
                {t(
                  "ModalCatatanPenyelesaian.headingAttachSupportingPhotos",
                  {},
                  "Masukkan Lampiran Foto Pendukung"
                )}{" "}
                <span className="font font-normal italic text-neutral-900">
                  {t("ModalCatatanPenyelesaian.textOptional", {}, "(Optional)")}
                </span>
              </h3>
              <div className="mb-3 flex flex-wrap gap-3">
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
                      "ModalCatatanPenyelesaian.cropperTitleUploadSupportingPhoto",
                      {},
                      "Upload Foto Pendukung"
                    )}
                  />
                ))}
              </div>
              <p className="text-xs font-medium leading-tight text-neutral-500">
                {t(
                  "ModalCatatanPenyelesaian.helperTextFileFormat",
                  {},
                  "Dengan format file jpg/jpeg/png, besar file maks. 10MB"
                )}
              </p>
            </div>
          </div>
        </div>
        <ModalFooter>
          <Button
            variant="muattrans-primary-secondary"
            onClick={handleClose}
            disabled={isSubmitting || isLoading}
            className="px-8"
          >
            {t("ModalCatatanPenyelesaian.buttonCancel", {}, "Batal")}
          </Button>
          <Button
            variant="muattrans-primary"
            onClick={handleConfirm}
            disabled={isSubmitting || isLoading}
            className="px-8"
          >
            {t("ModalCatatanPenyelesaian.buttonSave", {}, "Simpan")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalCatatanPenyelesaian;

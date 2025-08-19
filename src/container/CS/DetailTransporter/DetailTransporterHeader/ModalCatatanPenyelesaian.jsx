import { useState } from "react";

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
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const ModalCatatanPenyelesaian = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [catatan, setCatatan] = useState("");
  const [catatanError, setCatatanError] = useState("");
  const [tidakMenanggapi, setTidakMenanggapi] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([null, null, null, null]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (file, index) => {
    const newFiles = [...uploadedFiles];
    if (file === null) {
      newFiles[index] = null;
      for (let i = index; i < newFiles.length - 1; i++) {
        newFiles[i] = newFiles[i + 1];
      }
      newFiles[newFiles.length - 1] = null;
    } else {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        alert("Ukuran file melebihi 10MB");
        return;
      }
      const firstEmptyIndex = newFiles.findIndex((f) => f === null);
      if (firstEmptyIndex !== -1) {
        newFiles[firstEmptyIndex] = file;
      }
    }
    setUploadedFiles(newFiles);
  };

  const handleClose = () => {
    setCatatan("");
    setTidakMenanggapi(false);
    setUploadedFiles([null, null, null, null]);
    setIsSubmitting(false);
    onClose?.();
  };

  const handleConfirm = async () => {
    // Validate catatan if not disabled
    if (!tidakMenanggapi && !catatan.trim()) {
      setCatatanError("Catatan penyelesaian wajib diisi");
      return;
    }
    setCatatanError("");
    setIsSubmitting(true);
    try {
      await onConfirm?.({
        catatan,
        tidakMenanggapi,
        supportingFiles: uploadedFiles.filter((f) => f !== null),
      });
      toast.success(
        `Berhasil menyelesaikan masalah transporter${tidakMenanggapi ? " tidak menanggapi" : ""}${catatan ? `: ${catatan}` : ""}`
      );
      handleClose();
    } catch (error) {
      // handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <ModalContent className={cn("w-[486px] bg-white")} type="muattrans">
        <ModalHeader size="small" />
        <ModalTitle className="sr-only">Catatan Penyelesaian</ModalTitle>
        <div className="px-6 pt-9">
          <div className="flex flex-col gap-5">
            {/* Masukkan Catatan Penyelesaian */}
            <div className="flex flex-col">
              <h3 className="mb-4 text-[16px] font-bold text-black">
                Masukkan Catatan Penyelesaian<span className="">*</span>
              </h3>
              <div className="mb-4">
                <Checkbox
                  checked={tidakMenanggapi}
                  onChange={({ checked }) => setTidakMenanggapi(checked)}
                  disabled={isSubmitting || isLoading}
                  label="Transporter Tidak Menanggapi"
                  appearance={{
                    labelClassName: "text-xs font-medium text-neutral-900",
                  }}
                />
              </div>
              <Input
                placeholder="Masukkan catatan penyelesaian"
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
                className={`relative flex w-full items-center justify-end text-xs ${catatanError ? "-top-3.5 pt-0" : "pt-2"}`}
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
                Masukkan Lampiran Foto Pendukung{" "}
                <span className="font font-normal italic text-neutral-900">
                  (Optional)
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
                    cropperTitle="Upload Foto Pendukung"
                  />
                ))}
              </div>
              <p className="text-xs font-medium leading-tight text-neutral-500">
                Dengan format file jpg/jpeg/png, besar file maks. 10MB
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
            Batal
          </Button>
          <Button
            variant="muattrans-primary"
            onClick={handleConfirm}
            disabled={isSubmitting || isLoading}
            {...((isSubmitting || isLoading) && { loading: true })}
            className="px-8"
          >
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalCatatanPenyelesaian;

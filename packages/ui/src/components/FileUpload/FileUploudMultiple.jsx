"use client";

import { useRef, useState } from "react";

import { useSWRMutateHook } from "@/hooks/use-swr";

import { fetcherMuatrans } from "@/lib/axios";
import { toast } from "@/lib/toast";

import Button from "../Button/Button";
import IconComponent from "../IconComponent/IconComponent";

const ProgressBar = ({ progress }) => {
  return (
    <div className="relative h-[14px] w-[168px] self-center overflow-hidden rounded-[20px] bg-neutral-200">
      <div
        className="absolute left-0 top-0 h-full bg-muat-trans-primary-500 transition-all duration-200"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

const FileUploadMultiple = ({
  className,
  label = "Unggah",
  maxSize = 5,
  onError = () => {},
  onSuccess = () => {},
  value = [],
  acceptedFormats = [".jpg", ".jpeg", ".png", ".pdf"],
  errorMessage = "",
  single = false,
}) => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef(null);
  const [replacingIndex, setReplacingIndex] = useState(null);

  const { trigger: triggerUploadDocument } = useSWRMutateHook(
    "v1/upload/vehicle-documents",
    "POST",
    fetcherMuatrans,
    {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      },
    }
  );

  const handleFileChange = async (e) => {
    const filesToUpload = Number.isInteger(replacingIndex)
      ? [e.target.files[0]]
      : Array.from(e.target.files);

    if (filesToUpload.length === 0 || !filesToUpload[0]) {
      setReplacingIndex(null);
      return;
    }

    setIsUploading(true);
    const newUploadedFiles = [];

    for (const file of filesToUpload) {
      if (!file) continue;

      if (file.size > maxSize * 1024 * 1024) {
        onError(`Ukuran file maksimal ${maxSize}MB`);
        toast.error(`Ukuran file maksimal ${maxSize}MB`);

        continue;
      }

      const fileExtension = `.${file.name.split(".").pop().toLowerCase()}`;
      if (!acceptedFormats.includes(fileExtension)) {
        onError("Format file tidak sesuai ketentuan");
        toast.error("Format file tidak sesuai ketentuan");
        continue;
      }

      const formData = new FormData();
      formData.append("document", file);

      if (single) {
        if (newUploadedFiles.length > 0) {
          onSuccess([newUploadedFiles[0]]); // ganti file jika sudah ada
        }
      } else if (Number.isInteger(replacingIndex)) {
        const updatedFiles = [...(value || [])];
        if (newUploadedFiles.length > 0) {
          updatedFiles[replacingIndex] = newUploadedFiles[0];
          onSuccess(updatedFiles);
        }
      } else {
        onSuccess([...(value || []), ...newUploadedFiles]);
      }

      try {
        // Reset progress for new upload
        setProgress(0);

        // Simulate initial progress
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        // Actual upload
        const response = await triggerUploadDocument(formData);

        // Clear interval and set final progress
        clearInterval(progressInterval);
        setProgress(100);

        if (response?.Message?.Code >= 200 && response?.Message?.Code < 300) {
          const fileData = {
            url: response.Data.documentUrl,
            name: response.Data.originalFileName,
            size: response.Data.fileSize,
          };
          newUploadedFiles.push(fileData);
        } else {
          onError(response?.Message?.Text || `Gagal mengunggah ${file.name}`);
          toast.error(
            response?.Message?.Text || `Gagal mengunggah ${file.name}`
          );
        }
      } catch (error) {
        onError(error.message || `Gagal mengunggah ${file.name}`);
        toast.error(error.message || `Gagal mengunggah ${file.name}`);
      }
    }

    if (Number.isInteger(replacingIndex)) {
      const updatedFiles = [...(value || [])];
      if (newUploadedFiles.length > 0) {
        updatedFiles[replacingIndex] = newUploadedFiles[0];
        onSuccess(updatedFiles);
      }
    } else {
      onSuccess([...(value || []), ...newUploadedFiles]);
    }

    setProgress(0);
    setIsUploading(false);
    setReplacingIndex(null);
    if (fileRef.current) {
      fileRef.current.value = null;
    }
  };

  const handleDelete = (indexToDelete) => {
    if (isUploading) return;
    const updatedFiles = (value || []).filter(
      (_, index) => index !== indexToDelete
    );
    onSuccess(updatedFiles);
  };

  const handleReplace = (indexToReplace) => {
    if (isUploading) return;
    setReplacingIndex(indexToReplace);
    fileRef.current.click();
  };

  const handleTriggerUpload = () => {
    if (isUploading) return;
    setReplacingIndex(null);
    fileRef.current.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept={acceptedFormats.join(",")}
        onChange={handleFileChange}
        disabled={isUploading}
        multiple={!Number.isInteger(replacingIndex) && !single}
      />

      <div className="flex flex-col items-start gap-y-2">
        <div className="flex items-center">
          {!(single && value.length > 0) && (
            <Button
              type="button"
              className="mr-4 self-start"
              name="upload"
              color="primary"
              onClick={handleTriggerUpload}
            >
              {label}
            </Button>
          )}
          <div className="flex w-full flex-col items-start gap-y-1">
            {Array.isArray(value) && value.length > 0 && (
              <div className="flex flex-col gap-y-3">
                {value.map((file, index) => (
                  <div
                    key={index}
                    className={`flex ${single ? "w-[414px]" : "w-[300px]"} items-center justify-between`}
                  >
                    <div className="mr-2 flex min-w-0 items-center gap-3">
                      <div className="truncate text-xs font-medium leading-[14.4px] text-success-400">
                        {file.name}
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-4">
                      <button type="button" onClick={() => handleDelete(index)}>
                        <IconComponent
                          src="/icons/silang.svg"
                          className={`cursor-pointer hover:text-neutral-700 ${isUploading ? "cursor-not-allowed opacity-50" : ""}`}
                        />
                      </button>

                      <span
                        className={`cursor-pointer text-xs font-medium leading-[14.4px] text-primary-700 hover:text-primary-800 ${isUploading ? "cursor-not-allowed opacity-50" : ""}`}
                        onClick={() => handleReplace(index)}
                      >
                        Ubah File
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(!Array.isArray(value) || value.length === 0) && !isUploading && (
              <div className="ml-4">
                <div className="text-xs leading-[16.8px] text-neutral-600">
                  Format file{" "}
                  {acceptedFormats.map((ext) => ext.replace(".", "")).join("/")}{" "}
                  maks {maxSize}MB
                </div>
              </div>
            )}

            {isUploading && (
              <div className="ml-4 mt-3">
                <div className="flex items-center gap-3">
                  <ProgressBar progress={progress} />
                </div>
              </div>
            )}
          </div>
        </div>
        {errorMessage && (
          <div className="text-xs font-medium text-error-400">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadMultiple;

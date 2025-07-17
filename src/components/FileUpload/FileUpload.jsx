"use client";

import { useRef, useState } from "react";

import { useSWRMutateHook } from "@/hooks/use-swr";
import { fetcherMuatparts } from "@/lib/axios";

import Button from "../Button/Button";
import IconComponent from "../IconComponent/IconComponent";

const ProgressBar = ({ progress }) => {
  return (
    <div className="relative h-[14px] w-[168px] self-center overflow-hidden rounded-[20px] bg-neutral-200">
      <div
        className="absolute left-0 top-0 h-full bg-primary-700 transition-all duration-200"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

const FileUpload = ({
  className,
  label = "Unggah",
  maxSize = 5,
  onError = () => {},
  onSuccess = () => {},
  value = null,
  acceptedFormats = [".jpg", ".jpeg", ".png"],
}) => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef(null);

  const { trigger: triggerUploadPhoto } = useSWRMutateHook(
    "v1/muatparts/product/photo",
    "POST",
    (url, arg) => {
      return fetcherMuatparts({
        url,
        method: "POST",
        data: arg,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });
    }
  );

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File size validation
    if (file.size > maxSize * 1024 * 1024) {
      onError("File size exceeds maximum limit");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setProgress(0);
      setIsUploading(true);
      const response = await triggerUploadPhoto(formData);

      if (response.data?.Message?.Code === 200) {
        onSuccess({
          url: response.data?.Data?.url,
          name: response.data?.Data?.name || file.name,
        });
      }
    } catch (error) {
      onError(error);
    } finally {
      setProgress(0);
      setIsUploading(false);
      fileRef.current.value = null;
    }
  };

  const handleDelete = () => {
    onSuccess(null);
  };

  return (
    <div className={className}>
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept={acceptedFormats.join(",")}
        onChange={handleFileChange}
      />
      {value ? (
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <span className="text-[12px] font-medium leading-[14.4px] text-success-400">
              {value.name}
            </span>
            {isUploading ? <ProgressBar progress={progress} /> : null}
          </div>
          <div className="flex items-center gap-4">
            <IconComponent
              src="/icons/silang.svg"
              onclick={handleDelete}
              className="cursor-pointer"
            />
            <span
              className="cursor-pointer text-[12px] font-medium leading-[14.4px] text-primary-700"
              onClick={() => fileRef.current.click()}
            >
              Ubah File
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center">
          <Button
            className="self-center"
            name="upload"
            color="primary"
            onClick={() => fileRef.current.click()}
          >
            {label}
          </Button>

          {isUploading ? (
            <div className="ml-4">
              <ProgressBar progress={progress} />
            </div>
          ) : (
            <div className="ml-2">
              <div className="text-[14px] leading-[16.8px] text-neutral-600">
                Format file {acceptedFormats.join("/")}
              </div>
              <div className="text-[14px] leading-[16.8px] text-neutral-600">
                maks {maxSize}MB
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;

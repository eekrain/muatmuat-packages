"use client";

import { useEffect, useRef, useState } from "react";

import { useSWRMutateHook } from "@/hooks/use-swr";
import { fetcherMuatrans } from "@/lib/axios";

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

const FileUploadDocument = ({
  className,
  label = "Unggah",
  maxSize = 10,
  onError = () => {},
  onSuccess = () => {},
  value = null,
  acceptedFormats = [".jpg", ".jpeg", ".png", ".pdf"],
}) => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const fileRef = useRef(null);

  // Check if file is an image
  const isImageFile = (fileName) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    return imageExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
  };

  // Update preview when value changes
  useEffect(() => {
    if (value?.url && isImageFile(value.name)) {
      setPreview(value.url);
    } else {
      setPreview("");
    }
  }, [value]);

  const { trigger: triggerUploadDocument } = useSWRMutateHook(
    "v1/upload/vehicle-documents",
    "POST",
    fetcherMuatrans,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      },
    }
  );

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File size validation
    if (file.size > maxSize * 1024 * 1024) {
      onError(`File size exceeds maximum limit of ${maxSize}MB`);
      return;
    }

    // File format validation
    const fileExtension = `.${file.name.split(".").pop().toLowerCase()}`;
    if (!acceptedFormats.includes(fileExtension)) {
      onError(
        `File format not supported. Accepted formats: ${acceptedFormats.join(", ")}`
      );
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    try {
      setProgress(0);
      setIsUploading(true);
      const response = await triggerUploadDocument(formData);

      console.log("Upload response:", response);

      if (response?.Message?.Code === 200) {
        const fileData = {
          url: response.Data.documentUrl,
          name: response.Data.originalFileName,
          size: response.Data.fileSize,
        };
        console.log("Document uploaded successfully:", fileData);
        onSuccess(fileData);

        // Set preview immediately for images
        if (isImageFile(fileData.name)) {
          setPreview(fileData.url);
        }
      } else {
        console.error("Upload failed - Invalid response:", response);
        onError(response?.Message?.Text || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      onError(error.message || "Upload failed");
    } finally {
      setProgress(0);
      setIsUploading(false);
      if (fileRef.current) {
        fileRef.current.value = null;
      }
    }
  };

  const handleDelete = () => {
    onSuccess(null);
    setPreview("");
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
      />
      {value ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {preview && (
              <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-neutral-200">
                <img
                  src={preview}
                  alt={value.name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-col gap-y-2">
              <span className="text-xs font-medium leading-[14.4px] text-success-400">
                {value.name}
              </span>
              {isUploading ? <ProgressBar progress={progress} /> : null}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <IconComponent
              src="/icons/silang.svg"
              onclick={handleDelete}
              className={`cursor-pointer ${isUploading ? "cursor-not-allowed opacity-50" : ""}`}
            />
            <span
              className={`cursor-pointer text-xs font-medium leading-[14.4px] text-primary-700 ${isUploading ? "cursor-not-allowed opacity-50" : ""}`}
              onClick={!isUploading ? () => fileRef.current.click() : undefined}
            >
              {isUploading ? "Mengunggah..." : "Ubah File"}
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
            disabled={isUploading}
          >
            {isUploading ? "Mengunggah..." : label}
          </Button>

          {isUploading ? (
            <div className="ml-4">
              <ProgressBar progress={progress} />
            </div>
          ) : (
            <div className="ml-2">
              <div className="text-sm leading-[16.8px] text-neutral-600">
                Format file {acceptedFormats.join("/")}
              </div>
              <div className="text-sm leading-[16.8px] text-neutral-600">
                maks {maxSize}MB
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadDocument;

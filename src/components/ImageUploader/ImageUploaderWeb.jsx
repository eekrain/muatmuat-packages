"use client";

import { useEffect, useRef, useState } from "react";

import CropperWeb from "@/components/Cropper/CropperWeb";
import IconComponent from "@/components/IconComponent/IconComponent";
import { toast } from "@/lib/toast";

import styles from "./ImageUploader.module.scss";

export default function ImageUploaderWeb({
  className,
  isNull = false,
  isMain = false,
  uploadText = "Unggah Gambar",
  errorText = "Unggah Ulang",
  maxSize = 10,
  isCircle = false,
  onUpload = () => {},
  onError = () => {},
  value = null,
  isBig = true,
  cropperTitle,
  acceptedFormats = [".jpg", ".jpeg", ".png"],
}) {
  const imageRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null); // Image source for the cropper modal
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [preview, setPreview] = useState(null); // Image preview URL
  const [error, setError] = useState(false); // Internal state for file selection errors ONLY

  // Effect to create a preview URL from the File object passed in `value`
  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      setError(false); // Clear internal error when a valid file is received
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof value === "string") {
      setPreview(value);
      setError(false);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // --- Client-side validation ---
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!acceptedFormats.includes(fileExtension)) {
      toast.error("Format file tidak sesuai ketentuan");
      setError(true); // Set internal error for wrong format
      onError("Format file tidak sesuai.");
      imageRef.current.value = null;
      return;
    }

    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`Ukuran file melebihi ${maxSize}MB`);
      setError(true); // Set internal error for size
      onError(`Ukuran file melebihi ${maxSize}MB`);
      imageRef.current.value = null;
      return;
    }

    // If validation passes, read the file and open the cropper
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result);
      setIsCropperOpen(true);
      setError(false); // Clear any previous errors
    };
    reader.readAsDataURL(file);
  };

  const handleFinishCrop = (croppedFile) => {
    if (croppedFile) {
      onUpload(croppedFile);
    }
    imageRef.current.value = null;
    setIsCropperOpen(false);
  };

  const removeImage = (e) => {
    e.stopPropagation();
    onUpload(null); // Clear the value in the parent form
    if (imageRef.current) {
      imageRef.current.value = null;
    }
    setImageSrc(null);
    setPreview(null);
    setError(false); // Explicitly reset internal error state on removal
  };

  return (
    <>
      <div
        className={`${
          error || isNull ? styles.ImageUploaderError : styles.ImageUploader
        } ${preview && !error ? styles.borderImage : styles.borderDashed} group relative flex size-[72px] items-end gap-y-3 hover:!border-primary-700 ${className}`}
        style={
          preview && !error
            ? {
                backgroundImage: `url(${preview})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : { backgroundImage: "none" }
        }
        onClick={() => imageRef.current.click()}
      >
        <input
          accept={acceptedFormats.join(",")}
          type="file"
          onChange={handleFileSelect}
          ref={imageRef}
          className="hidden"
        />
        <>
          {/* State 3: Preview is visible */}
          {preview && !error && (
            <>
              <button
                className={`absolute right-[4px] top-[4px] flex items-center justify-center rounded-[24px] bg-[#FFFFFF] ${
                  isBig ? "size-5" : "size-4"
                }`}
                onClick={removeImage}
                type="button"
              >
                <IconComponent
                  height={12}
                  width={12}
                  src="/icons/silang12.svg"
                />
              </button>
              {isBig && isMain && (
                <div className="absolute bottom-[8px] left-[8px] flex h-[24px] items-center justify-center rounded-md bg-success-50 p-[7px] px-2 text-xs font-semibold text-success-400">
                  Gambar Utama
                </div>
              )}
            </>
          )}

          {/* State 2: Show "Unggah Ulang" ONLY on internal file error */}
          {error && !preview && (
            <>
              <IconComponent
                className={"icon-error-400"}
                size="medium"
                src="/icons/restart24.svg"
              />
              {isBig && (
                <span className="text-xs font-semibold leading-[14.4px] text-error-400 group-hover:text-primary-700">
                  {errorText}
                </span>
              )}
            </>
          )}

          {/* State 1: Initial state (no preview, no internal error) */}
          {!preview && !error && (
            <>
              <IconComponent size="small" src="/icons/add_image.svg" />
              {isBig && (
                <span className="text-xs font-semibold leading-[14.4px] text-neutral-900 group-hover:text-primary-700">
                  {uploadText}
                </span>
              )}
            </>
          )}
        </>
      </div>
      {isCropperOpen && (
        <CropperWeb
          imageSource={imageSrc}
          isOpen={isCropperOpen}
          setIsOpen={setIsCropperOpen}
          onClose={() => (imageRef.current.value = null)}
          result={handleFinishCrop}
          isCircle={isCircle}
          title={cropperTitle}
        />
      )}
    </>
  );
}

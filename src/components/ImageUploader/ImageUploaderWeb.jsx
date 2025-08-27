"use client";

import { useEffect, useRef, useState } from "react";

import { Loader2 } from "lucide-react";

import IconComponent from "@/components/IconComponent/IconComponent";

import { useTranslation } from "@/hooks/use-translation";

import { toast } from "@/lib/toast";

import CropperWebNew from "../Cropper/CropperWebNew";
import styles from "./ImageUploader.module.scss";

export default function ImageUploaderWeb({
  className,
  isNull = false,
  isMain = false,
  uploadText,
  errorText,
  maxSize = 10,
  isCircle = false,
  onUpload = () => {},
  onError = () => {},
  value = null, // This prop can be a File, string (URL), or null
  isBig = true,
  cropperTitle,
  acceptedFormats = [".jpg", ".jpeg", ".png"],
  isLoading,
  isError,
  variant = "muatrans",
}) {
  const { t } = useTranslation();
  const imageRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(false);
  const [image, setImage] = useState(null);

  // --- THIS IS THE KEY LOGIC ---
  // This effect correctly handles the 'value' prop from the parent.
  useEffect(() => {
    // 1. If 'value' is a File object (from a new upload), create a temporary local URL for preview.
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      setError(false);
      // Clean up the temporary URL when the component unmounts or the value changes.
      return () => URL.revokeObjectURL(objectUrl);
    }
    // 2. If 'value' is a string (an asset link), use it directly as the preview URL.
    //    This is perfect for edit pages.
    else if (typeof value === "string" && value) {
      setPreview(value);
      setError(false);
    }
    // 3. If 'value' is null or anything else, clear the preview.
    else {
      setPreview(null);
    }
  }, [value]); // This hook re-runs whenever the `value` prop changes.

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!acceptedFormats.includes(fileExtension)) {
      toast.error(
        t(
          "ImageUploaderWeb.invalidFormat",
          {},
          "Format file tidak sesuai ketentuan"
        )
      );
      setError(true);
      onError(
        t(
          "ImageUploaderWeb.invalidFormatShort",
          {},
          "Format file tidak sesuai."
        )
      );
      imageRef.current.value = null;
      return;
    }

    if (file.size > maxSize * 1024 * 1024) {
      toast.error(
        t(
          "ImageUploaderWeb.fileSizeExceeded",
          { maxSize },
          `Ukuran file melebihi ${maxSize}MB`
        )
      );
      setError(true);
      onError(
        t(
          "ImageUploaderWeb.fileSizeExceeded",
          { maxSize },
          `Ukuran file melebihi ${maxSize}MB`
        )
      );
      imageRef.current.value = null;
      return;
    }

    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result);
      setIsCropperOpen(true);
      setError(false);
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
    onUpload(null);
    if (imageRef.current) {
      imageRef.current.value = null;
    }
    setImageSrc(null);
    setImage(null);
    setPreview(null);
    setError(false);
  };

  useEffect(() => {
    if (isError) {
      setError(true);
    } else {
      setError(false);
    }
  }, [isError]);

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
                  {t("ImageUploaderWeb.mainImage", {}, "Gambar Utama")}
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
                  {errorText ||
                    t("ImageUploaderWeb.reupload", {}, "Unggah Ulang")}
                </span>
              )}
            </>
          )}

          {/* State 1: Initial state (no preview, no internal error) */}
          {!preview &&
            !error &&
            (!isLoading ? (
              <>
                <IconComponent size="small" src="/icons/add_image.svg" />
                {isBig && (
                  <span className="text-xs font-semibold leading-[14.4px] text-neutral-900 group-hover:text-primary-700">
                    {uploadText ||
                      t("ImageUploaderWeb.uploadImage", {}, "Unggah Gambar")}
                  </span>
                )}
              </>
            ) : (
              <>
                <Loader2 className="animate-spin text-primary-700" />
                {isBig && (
                  <span className="text-xs font-semibold leading-[14.4px] text-neutral-900 group-hover:text-primary-700">
                    {t("ImageUploaderWeb.uploading", {}, "Mengunggah...")}
                  </span>
                )}
              </>
            ))}
        </>
      </div>
      {isCropperOpen && (
        <CropperWebNew
          imageFile={image}
          imageSource={imageSrc}
          isOpen={isCropperOpen}
          setIsOpen={setIsCropperOpen}
          onClose={() => (imageRef.current.value = null)}
          result={handleFinishCrop}
          isCircle={isCircle}
          title={cropperTitle}
          variant={variant}
        />
      )}
    </>
  );
}

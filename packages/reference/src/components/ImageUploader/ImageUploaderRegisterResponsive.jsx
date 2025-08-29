"use client";

import { useEffect, useRef, useState } from "react";

import { Camera, PencilLine, Upload } from "lucide-react";
import { useSWRConfig } from "swr";

import SWRHandler from "@/services/useSWRHook";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/BottomSheet/BottomSheetUp";

import { toast } from "@/lib/toast";

import { useHeader } from "@/common/ResponsiveContext";
import { useTranslation } from "@/context/TranslationProvider";
import { modal } from "@/store/zustand/modal";

import Button from "../Button/Button";
import CropperImage from "../Cropper/Cropper";

const api = process.env.NEXT_PUBLIC_GLOBAL_API;

const ImageUploaderRegisterResponsive = ({
  value,
  defaultValue,
  isProfil = false,
  previewTitle,
  previewDescription,
}) => {
  const { t } = useTranslation();
  const { setModalOpen, setModalConfig, setModalContent } = modal();
  const { setAppBar } = useHeader();
  const { mutate } = useSWRConfig();
  const { useSWRMutateHook } = SWRHandler;
  const { trigger: setPhoto } = useSWRMutateHook(
    `${api}v1/register/seller/logo`,
    "POST"
  );

  const hasInitValue = useRef(false);
  const [resultCrops, setResultCrops] = useState(
    defaultValue !== null ? defaultValue : ""
  );
  const [image, setImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isShowPreview, setIsShowPreview] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (defaultValue && hasInitValue.current === false) {
      setResultCrops(defaultValue);
      hasInitValue.current = true;
    }
  }, [defaultValue]);

  const validateFile = (file) => {
    // Normalize MIME type
    const normalizedType = file.type.toLowerCase();

    // List of valid MIME types
    const validTypes = {
      "image/jpeg": true,
      "image/jpg": true,
      "image/png": true,
    };

    // Check if type is valid
    if (!validTypes[normalizedType]) {
      return {
        isValid: false,
        error: t("labelFormatMusts"),
      };
    }

    // Check file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: t("labelMaximum10"),
      };
    }

    // Additional checks for camera-captured images
    if (
      file.name.startsWith("image") ||
      file.name.startsWith("camera") ||
      file.name.includes("IMG")
    ) {
      if (file.size < 1024) {
        // If less than 1KB
        return {
          isValid: false,
          error: t("labelFotoTidakValid"),
        };
      }
    }

    return { isValid: true, error: "" };
  };

  const validateImageIntegrity = (fileDataUrl) => {
    return new Promise((resolve) => {
      const img = new window.Image();

      img.onload = () => {
        if (img.width > 0 && img.height > 0) {
          resolve({ isValid: true, error: "" });
        } else {
          resolve({
            isValid: false,
            error: t("labelFailedProcessPhoto"),
          });
        }
      };

      img.onerror = () => {
        resolve({
          isValid: false,
          error: t("labelFailedProcessPhoto"),
        });
      };

      img.src = fileDataUrl;
    });
  };

  const handleFileInput = async (e, isCamera = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      if (isCamera) {
        cameraRef.current.value = null;
      } else {
        fileRef.current.value = null;
      }
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const imageIntegrityCheck = await validateImageIntegrity(reader.result);

        if (!imageIntegrityCheck.isValid) {
          toast.error(imageIntegrityCheck.error);

          if (isCamera) {
            cameraRef.current.value = null;
          } else {
            fileRef.current.value = null;
          }
          return;
        }

        setImage(reader.result);
        setIsOpen(true);
        setIsShowPreview(false);
        setIsBottomSheetOpen(false);
      } catch (error) {
        console.error("Error validating image:", error);
        toast.error(t("labelFailedProcessPhoto"));

        if (isCamera) {
          cameraRef.current.value = null;
        } else {
          fileRef.current.value = null;
        }
      }
    };

    reader.onerror = () => {
      toast.error(t("labelFailedReadImage"));

      if (isCamera) {
        cameraRef.current.value = null;
      } else {
        fileRef.current.value = null;
      }
    };

    reader.readAsDataURL(file);

    e.target.value = null;
  };

  const handleFileUpload = (e) => handleFileInput(e, false);
  const handleCameraCapture = (e) => handleFileInput(e, true);

  const handleCropComplete = async (croppedDataUrl) => {
    if (!croppedDataUrl) {
      toast.error(t("labelFailedProcessPhoto"));
      return;
    }

    try {
      // Deteksi MIME type dari data URL
      const mimeType = croppedDataUrl.split(";")[0].split(":")[1];

      // Convert base64 to blob dengan proper MIME type
      const base64Data = croppedDataUrl.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: mimeType });

      // Compress image if needed
      let compressedBlob = blob;
      if (blob.size > 1024 * 1024) {
        // If larger than 1MB
        const canvas = document.createElement("canvas");
        const img = new window.Image();

        await new Promise((resolve) => {
          img.onload = () => {
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions while maintaining aspect ratio
            const maxDimension = 1200;
            if (width > height && width > maxDimension) {
              height = (height * maxDimension) / width;
              width = maxDimension;
            } else if (height > maxDimension) {
              width = (width * maxDimension) / height;
              height = maxDimension;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (result) => {
                compressedBlob = result;
                resolve();
              },
              "image/jpeg",
              0.8
            );
          };
          img.src = croppedDataUrl;
        });
      }

      // Create File object with proper extension
      const file = new File([compressedBlob], `photo_${Date.now()}.jpg`, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });

      // Create and send FormData
      const formData = new FormData();
      formData.append("file", file);

      const response = await setPhoto(formData);
      mutate(`${api}v1/register/seller/logo`);
      setResultCrops(response.data.Data.url);
      value(response.data.Data.url);
      setModalOpen(false);

      // Clear inputs
      setImage(null);
      fileRef.current.value = null;
      if (cameraRef.current) cameraRef.current.value = null;
    } catch (error) {
      console.error("Error processing upload:", error);
      toast.error(
        error.response?.data?.message || t("labelFailedProcessPhoto")
      );
    }
  };

  const handleClose = () => {
    setImage(null);
    fileRef.current.value = null;
    if (cameraRef.current) cameraRef.current.value = null;
    setIsBottomSheetOpen(false);
  };

  const handleResetAndShowOptions = () => {
    setIsShowPreview(false);
    setImage(null);
    handleUbah();
  };

  const uploadOptions = [
    {
      src: "/icons/camera.svg",
      title: t("labelAmbilFoto"),
      onClick: () => {
        setIsBottomSheetOpen(false);
        cameraRef.current.click();
      },
    },
    {
      src: "/icons/Upload.svg",
      title: t("labelUnggahFile"),
      onClick: () => {
        setIsBottomSheetOpen(false);
        fileRef.current.click();
      },
    },
  ];

  const handleUbah = () => {
    setIsBottomSheetOpen(true);
  };

  const handleDelete = () => {
    setModalContent(
      <div className="px-6 py-9">
        <span className="mb-6 block text-center text-sm font-medium text-neutral-900">
          {t("titleDeleteImage")}
        </span>
        <div className="flex justify-center gap-2">
          <Button
            className="!h-7 !text-xs !font-semibold"
            variant="muatparts-primary-secondary"
            onClick={() => setModalOpen(false)}
          >
            {t("buttonNo")}
          </Button>
          <Button
            className="!h-7 !font-semibold"
            variant="muatparts-primary"
            onClick={() => {
              setResultCrops("");
              setModalOpen(false);
              value("");
            }}
          >
            {t("buttonYes")}
          </Button>
        </div>
      </div>
    );
    setModalConfig({
      className: "!w-[386px]",
      withHeader: false,
      withClose: true,
    });
    setModalOpen(true);
  };

  return (
    <>
      <BottomSheet open={isBottomSheetOpen} onOpenChange={setIsBottomSheetOpen}>
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetClose />
            <BottomSheetTitle>
              {t("labelPilihSumberFoto") || "Pilih Sumber Foto"}
            </BottomSheetTitle>
          </BottomSheetHeader>
          <div className="flex items-center justify-evenly py-4">
            {uploadOptions.map((option, index) => (
              <div
                key={index}
                className="flex cursor-pointer flex-col items-center gap-3"
                onClick={option.onClick}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-700">
                  {index === 0 ? (
                    <Camera size={24} color="white" />
                  ) : (
                    <Upload size={24} color="white" />
                  )}
                </div>
                <span className="text-sm font-semibold text-neutral-900">
                  {option.title}
                </span>
              </div>
            ))}
          </div>
        </BottomSheetContent>
      </BottomSheet>
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileUpload}
        className="hidden"
        ref={fileRef}
      />
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleCameraCapture}
        className="hidden"
        ref={cameraRef}
        capture="environment"
        multiple={false}
        playsInline
        autoPlay
        muted
      />
      {isProfil ? (
        <div className="relative h-[94px] w-[94px] rounded-full border-8 border-white bg-white">
          <img
            src={`${
              resultCrops
                ? resultCrops
                : "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736414569172.webp"
            }`}
            alt="Profile"
            className="h-full w-full rounded-full bg-white object-cover"
          />
          <div
            onClick={handleUbah}
            className="absolute -right-4 top-12 flex h-[35px] w-[35px] items-center justify-center rounded-full border border-primary-700 bg-white"
          >
            <PencilLine size={12} className="text-primary-700" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <img
            src={`${
              resultCrops
                ? resultCrops
                : "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736414569172.webp"
            }`}
            loading="lazy"
            className="size-[72px] rounded-full bg-white"
          />

          <div className="flex gap-3">
            {resultCrops && (
              <Button
                onClick={handleDelete}
                variant="muatparts-primary-secondary"
                className="!h-7 !text-xs !font-semibold"
              >
                {t("labelHapus")}
              </Button>
            )}

            <Button
              onClick={handleUbah}
              variant="muatparts-primary"
              className="!h-7 !text-xs !font-semibold"
            >
              {resultCrops ? t("labelUbahBtn") : t("labelUnggahResp")}
            </Button>
          </div>
          <span className="w-full text-center text-xs font-medium leading-[14.4px] text-neutral-600">
            {t("labelMaximum10")}
          </span>
        </div>
      )}

      <CropperImage
        imageSource={image}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        result={handleCropComplete}
        onClose={handleClose}
        required={true}
        isCircle={true}
        isShowPreview={isShowPreview}
        setIsShowPreview={setIsShowPreview}
        uploadOptions={uploadOptions}
        previewTitle={previewTitle}
        previewDescription={previewDescription}
        onChangeImage={handleResetAndShowOptions}
      />
    </>
  );
};

export default ImageUploaderRegisterResponsive;

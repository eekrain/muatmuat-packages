"use client";

import { useState, useEffect, useRef } from "react";
import { modal } from "@/store/zustand/modal";
import Button from "../Button/Button";
import CropperImage from "../Cropper/Cropper";
import { useSWRConfig } from "swr";
import SWRHandler from "@/services/useSWRHook";
import toast from "@/store/zustand/toast";
import Bottomsheet from "../Bottomsheet/Bottomsheet";
import { Camera, PencilLine, Upload } from "lucide-react";
import { useHeader } from "@/common/ResponsiveContext";
import { useTranslation } from "@/context/TranslationProvider";

const api = process.env.NEXT_PUBLIC_GLOBAL_API;

const ImageUploaderRegisterResponsive = ({
  value,
  defaultValue,
  isProfil = false,
  previewTitle,
  // 24. THP 2 - MOD001 - MP - 015 - QC Plan - Web - MuatParts - Seller - Paket 039 A - Profil Seller - LB - 0066
  previewDescription,
}) => {
  const {
    setShowBottomsheet,
    setDataBottomsheet,
    setTitleBottomsheet,
    setShowToast,
    setDataToast,
  } = toast();
  const { t } = useTranslation();
  const { setModalOpen, setModalConfig, setModalContent } = modal();
  const { setAppBar } = useHeader();
  const { mutate } = useSWRConfig();
  const { useSWRMutateHook } = SWRHandler;
  const { trigger: setPhoto } = useSWRMutateHook(
    api + "v1/register/seller/logo",
    "POST"
  );

  const hasInitValue = useRef(false);
  const [resultCrops, setResultCrops] = useState(
    defaultValue !== null ? defaultValue : ""
  );
  const [image, setImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isShowPreview, setIsShowPreview] = useState(false);
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    setShowBottomsheet(false);
  }, []);

  useEffect(() => {
    // LB - 0623 - 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2
    if (defaultValue && hasInitValue.current === false) {
      setResultCrops(defaultValue);
      hasInitValue.current = true;
    }
  }, [defaultValue]);

  const validateFile = (file) => {
    // Normalize MIME type
    let normalizedType = file.type.toLowerCase();

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

  // LB - 0445, 25.03
  const validateImageIntegrity = (fileDataUrl) => {
    return new Promise((resolve) => {
      const img = new Image();

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

  // LB - 0445, 25.03
  const handleFileInput = async (e, isCamera = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      setShowToast(true);
      setDataToast({ type: "error", message: validation.error });
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
          setShowToast(true);
          setDataToast({ type: "error", message: imageIntegrityCheck.error });

          if (isCamera) {
            cameraRef.current.value = null;
          } else {
            fileRef.current.value = null;
          }
          return;
        }

        setImage(reader.result);
        setIsOpen(true);
        setShowBottomsheet(false);
        setIsShowPreview(false);
      } catch (error) {
        console.error("Error validating image:", error);
        setShowToast(true);
        setDataToast({
          type: "error",
          message: t("labelFailedProcessPhoto"),
        });

        if (isCamera) {
          cameraRef.current.value = null;
        } else {
          fileRef.current.value = null;
        }
      }
    };

    reader.onerror = () => {
      setShowToast(true);
      setDataToast({
        type: "error",
        message: t("labelFailedReadImage"),
      });

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
      setShowToast(true);
      setDataToast({ type: "error", message: t("labelFailedProcessPhoto") });
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
        const img = new Image();

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
      mutate(api + "v1/register/seller/logo");
      setResultCrops(response.data.Data.url);
      value(response.data.Data.url);
      setModalOpen(false);

      // Clear inputs
      setImage(null);
      fileRef.current.value = null;
      if (cameraRef.current) cameraRef.current.value = null;
    } catch (error) {
      console.error("Error processing upload:", error);
      setShowToast(true);
      setDataToast({
        type: "error",
        message: error.response?.data?.message || t("labelFailedProcessPhoto"),
      });
    }
  };

  // const handleCropComplete = async (croppedDataUrl) => {
  //   if (!croppedDataUrl) {
  //     setShowToast(true);
  //     setDataToast({ type: "error", message: "Gagal memproses gambar" });
  //     return;
  //   }

  //   try {
  //     const base64Response = await fetch(croppedDataUrl);
  //     const blob = await base64Response.blob();
  //     const file = new File([blob], "photo.jpg", { type: "image/jpeg" });

  //     const formData = new FormData();
  //     formData.append("file", file);

  //     await setPhoto(formData)
  //       .then((response) => {
  //         mutate(api + "v1/register/seller/logo");
  //         setResultCrops(response.data.Data.url);
  //         setModalOpen(false);
  //       })
  //       .catch((err) => {
  //         console.error("Upload error:", err);
  //         setShowToast(true);
  //         setDataToast({ type: "error", message: "Gagal memproses foto" });
  //       });

  //     setImage(null);
  //     fileRef.current.value = null;
  //     if (cameraRef.current) cameraRef.current.value = null;
  //   } catch (error) {
  //     console.error("Error processing upload:", error);
  //     setShowToast(true);
  //     setDataToast({ type: "error", message: "Gagal memproses foto" });
  //   }
  // };

  const handleClose = () => {
    setImage(null);
    fileRef.current.value = null;
    if (cameraRef.current) cameraRef.current.value = null;
    setShowBottomsheet(false);
  };

  // LB - 0456 dan LB - 0457, 25.03
  const handleResetAndShowOptions = () => {
    setIsShowPreview(false);
    // setIsOpen(false);
    setImage(null);
    handleUbah();
  };

  // LB - 0456 dan LB - 0457, 25.03
  const uploadOptions = [
    {
      src: "/icons/camera.svg",
      title: t("labelAmbilFoto"),
      onClick: () => {
        setShowBottomsheet(false);
        // setIsShowPreview(false);
        cameraRef.current.click();
      },
    },
    {
      src: "/icons/Upload.svg",
      title: t("labelUnggahFile"),
      onClick: (e) => {
        // e.stopPropagation();
        setShowBottomsheet(false);
        fileRef.current.click();
        // setAppBar({
        //   title: "",
        //   appBarType: "",
        // });
        // setIsShowPreview(false);
      },
    },
  ];

  const handleUbah = () => {
    setTitleBottomsheet(" -");
    setShowBottomsheet(true);
    setDataBottomsheet(
      <div className="flex justify-evenly items-center">
        {uploadOptions.map((option, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 items-center cursor-pointer"
            onClick={option.onClick}
          >
            <div className="w-16 h-16 rounded-full bg-primary-700 flex items-center justify-center">
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
    );
  };

  const handleDelete = () => {
    setModalContent(
      <div className="py-9 px-6">
        <span className="font-medium text-sm block text-center mb-6 text-neutral-900">
          {t("titleDeleteImage")}
        </span>
        <div className="flex justify-center gap-2">
          <Button
            Class="!h-7 !text-xs !font-semibold"
            color="primary_secondary"
            onClick={() => setModalOpen(false)}
          >
            {t("buttonNo")}
          </Button>
          <Button
            Class="!h-7 !font-semibold"
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
      classname: "!w-[386px]",
      withHeader: false,
      withClose: true,
    });
    setModalOpen(true);
  };

  return (
    <>
      <Bottomsheet />
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
        <div className="w-[94px] h-[94px] border-8 border-white rounded-full relative bg-white">
          {/* LB - 0130, 25.03 */}
          <img
            src={`${
              resultCrops
                ? resultCrops
                : "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736414569172.webp"
            }`}
            alt="Profile"
            className="w-full h-full object-cover rounded-full bg-white"
          />
          <div
            onClick={handleUbah}
            className="absolute top-12 -right-4 rounded-full bg-white border border-primary-700 w-[35px] h-[35px] flex justify-center items-center"
          >
            <PencilLine size={12} className="text-primary-700" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {/* LB - 0130, 25.03 */}
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
                Class="!h-7 !text-xs !font-semibold"
                color="primary_secondary"
              >
                {t("labelHapus")}
              </Button>
            )}

            <Button onClick={handleUbah} Class="!h-7 !text-xs !font-semibold">
              {resultCrops ? t("labelUbahBtn") : t("labelUnggahResp")}
            </Button>
          </div>
          <span className="w-full text-center font-medium text-xs text-neutral-600 leading-[14.4px]">
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
        // 24. THP 2 - MOD001 - MP - 015 - QC Plan - Web - MuatParts - Seller - Paket 039 A - Profil Seller - LB - 0066
        previewDescription={previewDescription}
        onChangeImage={handleResetAndShowOptions}
      />
    </>
  );
};

export default ImageUploaderRegisterResponsive;

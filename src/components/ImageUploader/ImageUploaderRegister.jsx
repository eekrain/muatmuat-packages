"use client";

import { useState, useEffect, useRef } from "react";
import { modal } from "@/store/zustand/modal";
import Button from "../Button/Button";
import CropperImage from "../Cropper/Cropper";
import { useSWRConfig } from "swr";
import SWRHandler from "@/services/useSWRHook";
import toast from "@/store/zustand/toast";
import { useTranslation } from "@/context/TranslationProvider";

const api = process.env.NEXT_PUBLIC_GLOBAL_API;

// value berupa return an value img dari komponen ini
// defaultValue yakni default value yang akan terpasang pada komponen ini (terpasang pada img bulat sebelah tombol ubah)

const ImageUploaderRegister = ({
  value,
  defaultValue,
  type = 1,
  disableDelete = false,
}) => {
  const { setModalOpen, setModalConfig, setModalContent } = modal();
  const [resultCrops, setResultCrops] = useState(
    defaultValue !== null ? defaultValue : ""
  );

  const { t } = useTranslation();

  useEffect(() => {
    resultCrops !== "" && value(resultCrops);
  }, [resultCrops]);

  useEffect(() => {
    defaultValue !== null && setResultCrops(defaultValue);
  }, [defaultValue]);

  const handleUbah = () => {
    setModalContent(<UnggahFoto resultCrop={setResultCrops} />);
    setModalConfig({
      classname: "!w-[550px] !rounded-[12px]",
      withHeader: true,
      withClose: true,
      headerBg: "/img/headermodal386.svg",
    });
    setModalOpen(true);
  };

  const handleDelete = () => {
    setModalContent(
      <div className="py-9 px-6">
        <span className="font-medium text-sm block text-center mb-6 text-neutral-900">
          {t("labelConfirmationDeletePhoto")}
        </span>
        <div className="flex justify-center gap-2">
          <Button
            Class="!h-7 !text-xs !font-semibold"
            color="primary_secondary"
            onClick={() => setModalOpen(false)}
          >
            {t("labelNo")}
          </Button>
          <Button
            Class="!h-7 !text-xs !font-semibold"
            onClick={() => {
              setResultCrops("");
              value("");
              setModalOpen(false);
            }}
          >
            {t("labelYes")}
          </Button>
        </div>
      </div>
    );
    setModalConfig({
      classname: "!w-[386px]",
      withHeader: true,
      withClose: true,
      headerBg: "/img/headermodal386.svg",
    });
    setModalOpen(true);
    // setResultCrops("");
  };

  if (type !== 1)
    return (
      <div className="flex flex-col items-center gap-2">
        {/* LB - 0130, 25.03 */}
        <img
          src={
            resultCrops
              ? resultCrops
              : "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736414569172.webp"
          }
          loading="lazy"
          className="size-[72px] rounded-full bg-white"
        />
        {/* LB - 0340, 25.03 */}
        <span
          className="text-primary-700 text-[10px] font-semibold cursor-pointer"
          onClick={handleUbah}
        >
          {/* {t("buttonChangeFile")} */}
          {t("labelUbahFotoBtnChange")}
        </span>
      </div>
    );

  return (
    <div className="flex items-center gap-4">
      {resultCrops &&
      resultCrops !==
        "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736414569172.webp" ? (
        <div className="relative group">
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
          <div
            className={`absolute inset-0 rounded-full bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center justify-center ${
              disableDelete ? "hidden" : "flex"
            }`}
          >
            <button
              onClick={handleDelete}
              className="text-white p-2 rounded-full flex items-center justify-center flex-col gap-1"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 4H14M5.33333 4V2.66667C5.33333 1.74619 6.07952 1 7 1H9C9.92048 1 10.6667 1.74619 10.6667 2.66667V4M6.33333 6.33333V11.6667M9.66667 6.33333V11.6667M3 4V13.3333C3 14.2538 3.74619 15 4.66667 15H11.3333C12.2538 15 13 14.2538 13 13.3333V4"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xs font-semibold">{t("labelDelete")}</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* LB - 0130, 25.03 */}
          <img
            src={
              "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736414569172.webp"
            }
            loading="lazy"
            className="size-[72px] rounded-full bg-white"
          />
        </>
      )}

      <Button onClick={handleUbah} Class="!h-[32px] !pt-3">
        {resultCrops &&
        resultCrops !==
          "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736414569172.webp"
          ? t("buttonChange")
          : t("buttonUpload")}
      </Button>
      <span className="w-[107px] font-medium text-xs text-neutral-600 leading-[14.4px]">
        {t("labelUploadPhotoRegister")}
      </span>
    </div>
  );
};

export default ImageUploaderRegister;

const UnggahFoto = ({ resultCrop }) => {
  const { setModalOpen } = modal();
  const { setShowToast, setDataToast } = toast();
  const { mutate } = useSWRConfig();
  const { useSWRMutateHook } = SWRHandler;
  const { trigger: setPhoto } = useSWRMutateHook(
    api + "v1/register/seller/logo",
    "POST"
  );

  const { t } = useTranslation();

  const handleImageResult = async ({ result, error }) => {
    if (error) {
      setShowToast(true);
      setDataToast({ type: "error", message: error });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", result);

      await setPhoto(formData)
        .then((response) => {
          mutate(api + "v1/register/seller/logo");
          resultCrop(response.data.Data.url);
          setModalOpen(false);
        })
        .catch((err) => {
          console.error("Upload error:", err);
          setShowToast(true);
          setDataToast({
            type: "error",
            message: t("labelFailedProcessPhoto"),
          });
        });
    } catch (err) {
      console.error("Error processing upload:", err);
      setShowToast(true);
      setDataToast({ type: "error", message: t("labelFailedProcessPhoto") });
    }
  };

  return (
    <div className="py-9 px-16">
      <span className="text-neutral-900 font-bold text-sm mx-auto text-center block mb-6">
        {t("buttonUploadLogo")}
      </span>
      <ImageUploadHandler onResult={handleImageResult} />
      <span className="text-xs font-medium text-[#868686] block mt-2">
        {t("labelUploadPhotoRegister")}
      </span>
    </div>
  );
};

const validateImage = (dataUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = dataUrl;
  });
};

export const ImageUploadHandler = ({ onResult }) => {
  const [image, setImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const fileRef = useRef(null);

  const { t } = useTranslation();

  const validateFile = (file) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      return {
        result: null,
        error: t("labelFileNotRequirements"),
      };
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        result: null,
        error: t("labelMaximum10"),
      };
    }

    return { result: true, error: "" };
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateFile(file);
    if (validation.error) {
      onResult(validation);
      fileRef.current.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      // Validasi gambar corrupt
      const isValidImage = await validateImage(reader.result);
      if (!isValidImage) {
        onResult({
          result: null,
          error: t("labelFailedProcessPhoto"),
        });
        fileRef.current.value = null;
        return;
      }

      setImageFile(file);
      setImage(reader.result);
      setIsOpen(true);
    };

    reader.onerror = () => {
      onResult({
        result: null,
        error: t("labelFailedReadImage"),
      });
      fileRef.current.value = null;
    };

    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedDataUrl) => {
    if (!croppedDataUrl) {
      onResult({ result: null, error: t("labelFailedProcessPhoto") });
      return;
    }

    try {
      // Convert base64 to FormData
      const formData = new FormData();
      const base64Response = await fetch(croppedDataUrl);
      const blob = await base64Response.blob();

      // Buat file dari blob dengan ekstensi yang sesuai
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });

      onResult({
        result: file, // Kirim file object
        error: "",
      });

      // Reset states
      setImage(null);
      setImageFile(null);
      fileRef.current.value = null;
    } catch (error) {
      onResult({
        result: null,
        error: t("labelFailedProcessPhoto"),
      });
    }
  };

  const handleClose = () => {
    setImage(null);
    setImageFile(null);
    fileRef.current.value = null;
  };

  return (
    <>
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileUpload}
        className="hidden"
        ref={fileRef}
      />

      <div
        className="w-[416px] h-[128px] rounded-md border-dashed flex justify-center items-center border border-primary-700 cursor-pointer"
        onClick={() => fileRef.current.click()}
      >
        <span className="text-xs font-medium text-neutral-900">
          Browse File
        </span>
      </div>

      <CropperImage
        isCircle
        imageSource={image}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        result={handleCropComplete}
        onClose={handleClose}
        required={true}
        title={t("buttonUploadLogo")}
      />
    </>
  );
};

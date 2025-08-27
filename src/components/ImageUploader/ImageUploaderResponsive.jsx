"use client";

import { useRef, useState } from "react";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/BottomSheet/BottomSheetUp";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";

import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useSWRMutateHook } from "@/hooks/use-swr";
import { useTranslation } from "@/hooks/use-translation";

import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { toast } from "@/lib/toast";
import { base64ToFile } from "@/lib/utils/file";

import {
  useImageUploaderActions,
  useImageUploaderStore,
} from "@/store/Shipper/forms/imageUploaderStore";

import styles from "./ImageUploader.module.scss";

export default function ImageUploaderResponsive({
  className,
  onChange, //get image
  isNull = false, //image status
  isMain = false, //main image status
  uploadText = "Unggah", //upload image text
  errorText = "Ulangi", //error upload image text
  maxSize = 0,
  onUpload = () => {}, //function that return image of uploaded image
  onError = () => {}, //function that return error when uploading image,
  value = null,
  isBig = true, // boolean to show text/title below the icon in the middle
  acceptedFormats = [".jpg", ".jpeg", ".png"], // format of image that can be uploaded
  index = 0,
}) {
  const cameraRef = useRef(null);
  const fileRef = useRef(null);
  const base64Image = value;
  const [error, setError] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  // LB - 0652 - 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2
  const { t } = useTranslation();
  const navigation = useResponsiveNavigation();
  const { activeIndex, image, imageFile, isReadyUploadPhoto, previewImage } =
    useImageUploaderStore();
  const {
    reset,
    setActiveIndex,
    setImage,
    setImageFile,
    setIsReadyUploadPhoto,
  } = useImageUploaderActions();

  const { trigger: uploadPhoto, isMutating: isMutatingUploadPhoto } =
    useSWRMutateHook("v1/orders/upload", "POST");

  useShallowCompareEffect(() => {
    const handleUploadPhoto = async () => {
      const file = base64ToFile(previewImage, imageFile.name, imageFile.type);
      const formData = new FormData();
      formData.append("file", file);
      await uploadPhoto(formData)
        .then((data) => {
          onChange(data.Data.photoUrl);
          reset();
          setIsReadyUploadPhoto(false);
        })
        .catch((error) => console.log("Error Upload Photo: ", error));
    };
    if (isReadyUploadPhoto && index === activeIndex) {
      handleUploadPhoto();
    }
  }, [isReadyUploadPhoto, imageFile, previewImage, index, activeIndex]);

  const getFile = (e) => {
    let files;
    let file = e.target.files[0];

    if (e.dataTransfer) {
      files = e.dataTransfer.files;
      setImageFile(files[0]);
    } else if (e.target) {
      files = e.target.files;
      setImageFile(files[0]);
    }
    file = files[0];

    if (!file) {
      return;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`${t("messageFileExceed")} ${maxSize}MB`);
      setError(true);
      cameraRef.current.value = null;
      fileRef.current.value = null;
      setIsBottomSheetOpen(false);
      return;
    }

    const acceptedMimeTypes = acceptedFormats.map((format) => {
      switch (format.toLowerCase()) {
        case ".jpg":
        case ".jpeg":
          return "image/jpeg";
        case ".png":
          return "image/png";
        default:
          return format;
      }
    });

    // Check if file type is accepted
    if (!acceptedMimeTypes.includes(file.type)) {
      toast.error("Format file tidak sesuai ketentuan");
      setError(true);
      cameraRef.current.value = null;
      fileRef.current.value = null;
      setIsBottomSheetOpen(false);
      return;
    }

    const magicNumbers = {
      "image/jpeg": [0xff, 0xd8, 0xff],
      "image/png": [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
      "image/gif": [0x47, 0x49, 0x46, 0x38],
      "image/webp": [0x52, 0x49, 0x46, 0x46],
    };

    // Create a FileReader for checking magic numbers
    const headerReader = new FileReader();
    headerReader.onloadend = () => {
      if (headerReader.result) {
        const headerArray = new Uint8Array(headerReader.result);
        const expectedMagicNumbers = magicNumbers[file.type];
        if (!expectedMagicNumbers) {
          toast.error("Gagal mengunggah gambar");
          setError(true);
          cameraRef.current.value = null;
          fileRef.current.value = null;
          setIsBottomSheetOpen(false);
          return;
        }

        let matches = true;
        for (let i = 0; i < expectedMagicNumbers.length; i++) {
          if (headerArray[i] !== expectedMagicNumbers[i]) {
            matches = false;
            break;
          }
        }

        if (!matches) {
          toast.error("Gagal mengunggah gambar");
          setError(true);
          cameraRef.current.value = null;
          fileRef.current.value = null;
          setIsBottomSheetOpen(false);
          return;
        }

        // If magic numbers match, proceed with reading the full file
        const fullReader = new FileReader();
        fullReader.onloadend = () => {
          setImage(fullReader.result);
          setActiveIndex(index);
          setError(false);
          setIsBottomSheetOpen(false);
          navigation.push("/Cropper");
        };
        fullReader.readAsDataURL(file);
      }
    };

    // Read the first few bytes for magic number checking
    const blob = file.slice(0, 8); // Read first 8 bytes which covers all our magic numbers
    headerReader.readAsArrayBuffer(blob);
  };

  const removeImage = (e) => {
    cameraRef.current.value = null;
    fileRef.current.value = null;
    setImage(null);
    e.stopPropagation();
  };

  const handleOpenFileUploadBottomsheet = () => {
    setIsBottomSheetOpen(true);
  };

  const uploadOptions = [
    {
      src: "/icons/camera24.svg",
      title: "Ambil Foto",
      onClick: () => {
        setIsBottomSheetOpen(false);
        cameraRef.current.click();
      },
    },
    {
      src: "/icons/upload24.svg",
      title: "Unggah File",
      onClick: () => {
        setIsBottomSheetOpen(false);
        fileRef.current.click();
      },
    },
  ];

  return (
    <>
      <BottomSheet open={isBottomSheetOpen} onOpenChange={setIsBottomSheetOpen}>
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetClose />
            <BottomSheetTitle>Pilih Metode Upload</BottomSheetTitle>
          </BottomSheetHeader>
          <div className="flex justify-around px-4 pb-6">
            {uploadOptions.map((option, key) => (
              <div className="flex flex-col items-center gap-y-4" key={key}>
                <div
                  className="flex size-16 cursor-pointer items-center justify-center rounded-[50px] bg-primary-700"
                  onClick={option.onClick}
                >
                  <IconComponent
                    className="icon-fill-neutral-50"
                    src={option.src}
                    size="medium"
                  />
                </div>
                <span className="text-base font-semibold leading-[19.2px]">
                  {option.title}
                </span>
              </div>
            ))}
          </div>
        </BottomSheetContent>
      </BottomSheet>
      <div
        className={`${
          error || isNull ? styles.ImageUploaderError : styles.ImageUploader
        } ${!error && image ? styles.borderImage : styles.borderDashed} ${
          error && styles.ImageUploaderNull
        } group relative flex size-[72px] items-end gap-y-3 hover:!border-primary-700 ${className}`}
        style={
          !error && base64Image && !isMutatingUploadPhoto
            ? { backgroundImage: `url(${base64Image})` }
            : { backgroundImage: "none" }
        }
        onClick={handleOpenFileUploadBottomsheet}
      >
        <input
          accept={[".jpg", ".jpeg", ".png"].join(",")}
          ref={cameraRef}
          type="file"
          className="hidden"
          onChange={getFile}
          capture
        />
        <input
          accept={[".jpg", ".jpeg", ".png"].join(",")}
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={getFile}
        />
        {isMutatingUploadPhoto ? (
          <div>
            <ImageComponent
              className={styles.rotate_image}
              src="/img/loader.png"
              alt="loader"
              width={20}
              height={20}
            />
          </div>
        ) : (
          <>
            {!error && !base64Image && (
              <>
                <IconComponent
                  width={20}
                  height={20}
                  src="/icons/add-image20.svg"
                />
                <span className="text-xs font-medium leading-[13.2px] text-black group-hover:text-primary-700">
                  {uploadText}
                </span>
              </>
            )}
            {error && (
              <>
                <IconComponent
                  className={"icon-error-400"}
                  size="small"
                  src="/icons/restart.svg"
                />
                <span className="text-xs font-medium leading-[13.2px] text-[#EE4343] group-hover:text-primary-700">
                  {errorText}
                </span>
              </>
            )}
            {base64Image && !error && (
              <button
                className={`absolute right-[4px] top-[4px] flex items-center justify-center rounded-[24px] bg-[#FFFFFF] ${
                  isBig ? "size-5" : "size-4"
                }`}
                onClick={removeImage}
              >
                <IconComponent height={12} width={12} src="/icons/silang.svg" />
              </button>
            )}
            {isMain && base64Image && !error && (
              <div className="absolute bottom-[4px] left-[6px] flex h-6 items-center justify-center rounded-md bg-success-50 px-[8.5px] text-sm font-semibold leading-[15.4px] text-success-400">
                Utama
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

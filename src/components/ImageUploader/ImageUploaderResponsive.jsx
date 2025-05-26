"use client";

import { useRef, useState } from "react";
import styles from "./ImageUploader.module.scss";
import CropperImage from "../Cropper/Cropper";
import IconComponent from "../IconComponent/IconComponent";
import toast from "@/store/zustand/toast";
import ImageComponent from "../ImageComponent/ImageComponent";
import { useTranslation } from "@/context/TranslationProvider";

function base64ToFile(base64String, filename, mimeType) {
  // Decode base64 string to binary data
  const byteCharacters = atob(base64String.split(",")[1]); // Remove data URL prefix if present

  // Create a byte array from the binary data
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset++) {
    byteArrays.push(byteCharacters.charCodeAt(offset));
  }

  // Create a Blob from the byte array
  const blob = new Blob([new Uint8Array(byteArrays)], { type: mimeType });

  // Create a File from the Blob
  const file = new File([blob], filename, { type: mimeType });

  return file;
}

export default function ImageUploaderResponsive({
  className,
  getImage, //get image
  isNull = false, //image status
  isMain = false, //main image status
  uploadText = "Unggah", //upload image text
  errorText = "Ulangi", //error upload image text
  maxSize = 0,
  isCircle = false,
  onUpload = () => {}, //function that return image of uploaded image
  onError = () => {}, //function that return error when uploading image,
  value = null,
  isBig = true, // boolean to show text/title below the icon in the middle
  previewTitle,
  onFinishCrop,
  isLoading,
  acceptedFormats = [".jpg", ".jpeg", ".png"], // format of image that can be uploaded
}) {
  const {
    setShowBottomsheet,
    setTitleBottomsheet,
    setDataBottomsheet,
    setShowToast,
    setDataToast,
  } = toast();
  const cameraRef = useRef(null);
  const fileRef = useRef(null);
  const [image, setImage] = useState(null); //set image source for cropper
  const [isOpen, setIsOpen] = useState(false); //open cropper modal
  const [isShowPreview, setIsShowPreview] = useState(false); // open preview setelah crop
  const [cropData, setCropData] = useState(null); //get crop result
  const [imageFiles, setImageFiles] = useState(null);
  const base64Image = value;
  const [error, setError] = useState(false);
  // LB - 0652 - 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2
  const { t } = useTranslation();

  // const getFile = (e) => {
  //   let files;
  //   if (e.dataTransfer) {
  //     files = e.dataTransfer.files;
  //     setImageFiles(files);
  //   } else if (e.target) {
  //     files = e.target.files;
  //     setImageFiles(files[0]);
  //   }
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     //(reader.result, "39");
  //     setImage(reader.result);
  //     setShowBottomsheet(false)
  //     setIsOpen(true);
  //     setIsShowPreview(false)
  //   };
  //   if (reader && e) {
  //     if (files.length > 0) {
  //       //(files[0]);
  //       if (maxSize * 1000 > 0 && files[0].size > maxSize * 1000) {
  //         onError(true);
  //         return;
  //       }
  //       reader.readAsDataURL(files[0]);
  //       onError(false);
  //     }
  //   }
  // };

  const getFile = (e) => {
    let files;
    let file;

    if (e.dataTransfer) {
      files = e.dataTransfer.files;
      setImageFiles(files[0]);
    } else if (e.target) {
      files = e.target.files;
      setImageFiles(files[0]);
    }
    file = files[0];

    if (!file) {
      return;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      // setError({
      //   status: true,
      //   message: `Ukuran file melebihi ${maxSize}MB`,
      // });
      setShowToast(true);
      setDataToast({
        type: "error",
        message: `${t("messageFileExceed")} ${maxSize}MB`,
      });
      setError(true);
      cameraRef.current.value = null;
      fileRef.current.value = null;
      setShowBottomsheet(false);
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
      // setError({
      //   status: true,
      //   message: `Format file tidak sesuai ketentuan`,
      // });
      setShowToast(true);
      setDataToast({
        type: "error",
        message: `Format file tidak sesuai ketentuan`,
      });
      setError(true);
      cameraRef.current.value = null;
      fileRef.current.value = null;
      setShowBottomsheet(false);
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
          // setError({
          //   status: true,
          //   message: `Gagal mengunggah gambar`,
          // });
          setShowToast(true);
          setDataToast({
            type: "error",
            message: `Gagal mengunggah gambar`,
          });
          setError(true);
          cameraRef.current.value = null;
          fileRef.current.value = null;
          setShowBottomsheet(false);
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
          // setError({
          //   status: true,
          //   message: `Gagal mengunggah gambar`,
          // });
          setShowToast(true);
          setDataToast({
            type: "error",
            message: `Gagal mengunggah gambar`,
          });
          setError(true);
          cameraRef.current.value = null;
          fileRef.current.value = null;
          setShowBottomsheet(false);
          return;
        }

        // If magic numbers match, proceed with reading the full file
        const fullReader = new FileReader();
        fullReader.onloadend = () => {
          setImage(fullReader.result);
          setIsOpen(true);
          setError(false);
          setShowBottomsheet(false);
        };
        fullReader.readAsDataURL(file);
      }
    };

    // Read the first few bytes for magic number checking
    const blob = file.slice(0, 8); // Read first 8 bytes which covers all our magic numbers
    headerReader.readAsArrayBuffer(blob);
  };

  const getCroppedData = (value) => {
    const file = base64ToFile(value, imageFiles.name, imageFiles.type);
    onFinishCrop(file);
    if (value) {
      setCropData(value);
      // getImage(value);
      onUpload(value);
      onError(false);
      cameraRef.current.value = null;
      fileRef.current.value = null;
    }
  };

  const clearInput = (value) => {
    if (value) {
      cameraRef.current.value = null;
      fileRef.current.value = null;
      setImage(null);
    }
  };

  const removeImage = (e) => {
    cameraRef.current.value = null;
    fileRef.current.value = null;
    setImage(null);
    setCropData(null);
    getImage(null);
    e.stopPropagation();
  };

  const handleOpenFileUploadBottomsheet = () => {
    setShowBottomsheet(true);
    setTitleBottomsheet(" -");
    setDataBottomsheet(
      <div className="flex justify-around">
        {uploadOptions.map((option, key) => (
          <div className="flex flex-col gap-y-4 items-center" key={key}>
            <div
              className="p-5 bg-primary-700 cursor-pointer rounded-[50px] size-16"
              onClick={option.onClick}
            >
              <IconComponent src={option.src} size="medium" />
            </div>
            <span className="font-semibold text-[16px] leading-[19.2px]">
              {option.title}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const uploadOptions = [
    {
      src: "/icons/camera.svg",
      title: "Ambil Foto",
      onClick: () => cameraRef.current.click(),
    },
    {
      src: "/icons/Upload.svg",
      title: "Unggah File",
      onClick: () => fileRef.current.click(),
    },
  ];

  return (
    <>
      <div
        className={`${
          error || isNull ? styles.ImageUploaderError : styles.ImageUploader
        } ${!error && image ? styles.borderImage : styles.borderDashed} ${
          error && styles.ImageUploaderNull
        } relative flex gap-y-3 items-end group hover:!border-primary-700 size-[72px] ${className}`}
        style={
          !error && base64Image && !isLoading
            ? { backgroundImage: `url(${base64Image})` }
            : { backgroundImage: `none` }
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
        {isLoading ? (
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
                <IconComponent size="small" src="/icons/add_image.svg" />
                <span className="text-black font-medium text-[12px] leading-[13.2px] group-hover:text-primary-700">
                  {uploadText}
                </span>
              </>
            )}
            {error && (
              <>
                <IconComponent
                  classname={`icon-error-400`}
                  size="small"
                  src="/icons/restart.svg"
                />
                <span className="text-[#EE4343] font-medium text-[12px] leading-[13.2px] group-hover:text-primary-700">
                  {errorText}
                </span>
              </>
            )}
            {base64Image && !error && (
              <button
                className={`absolute bg-[#FFFFFF] flex justify-center items-center rounded-[24px] top-[4px] right-[4px] ${
                  isBig ? "size-5" : "size-4"
                }`}
                onClick={removeImage}
              >
                <IconComponent height={12} width={12} src="/icons/silang.svg" />
              </button>
            )}
            {isMain && base64Image && !error && (
              <div className="bg-success-50 text-success-400 text-[14px] font-semibold leading-[15.4px] flex items-center justify-center px-[8.5px] rounded-md h-6 absolute bottom-[4px] left-[6px]">
                Utama
              </div>
            )}
          </>
        )}
      </div>
      {isOpen ? (
        <CropperImage
          imageSource={image}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          result={getCroppedData}
          onClose={clearInput}
          required={true}
          isCircle={isCircle}
          previewTitle={previewTitle}
          uploadOptions={uploadOptions}
          isShowPreview={isShowPreview}
          setIsShowPreview={setIsShowPreview}
          fileType={imageFiles?.type}
        />
      ) : null}
    </>
  );
}

"use client";

import { useRef, useState, useEffect } from "react";
import styles from "./ImageUploader.module.scss";
import CropperImage from "../Cropper/Cropper";
import IconComponent from "../IconComponent/IconComponent";
import ImageComponent from "../ImageComponent/ImageComponent";
import toast from "@/store/zustand/toast";
// import { useTranslation } from "@/context/TranslationProvider";

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

export default function ImageUploaderWeb({
  className, // CLASSNAME KOMPONEN IMAGE UPLOADER, GANTI UKURAN KOTAKNYA PAKEK INI SAJA
  getImage, //get image
  isNull = false, // image status
  isMain = false, //main image status
  uploadText, //upload image text
  errorText, //error upload image text
  maxSize = 10, // UKURAN MAKSIMAL FILE DALAM MB
  isCircle = true, // BOOLEAN UNTUK MEMUNCULKAN LINGKARAN DI CROPPER
  onUpload = () => {}, //function that return image of uploaded image
  onError = () => {}, //function that return error when uploading image,
  value = null,
  isBig = true, // boolean to show text/title below the icon in the middle
  cropperTitle, // TITLE DI CROPPER
  onFinishCrop,
  isLoading, //loading status
  acceptedFormats = [".jpg", ".jpeg", ".png"], // format of image that can be uploaded
}) {
  console.log("value",value)
  const imageRef = useRef(null);
  const [image, setImage] = useState(null); //set image source for cropper
  const [isOpen, setIsOpen] = useState(false); //open cropper modal
  const base64Image = value;
  const [imageFiles, setImageFiles] = useState(null);
  const [error, setError] = useState(false);
  const { setShowToast, setDataToast } = toast();
  // LB - 0652 - 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2
  // const { t } = useTranslation();

  const [renderUploadText, setRenderUploadText] = useState(uploadText);
  const [renderErrorText, setRenderErrorText] = useState(errorText);

  useEffect(() => {
    if (!uploadText) setRenderUploadText("Unggah Gambar");
    else setRenderUploadText(uploadText);

    if (!errorText) setRenderErrorText("Unggah Ulang");
    else setRenderErrorText(errorText);
  }, [uploadText, errorText]);

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

    if (file.size > maxSize * 1024 * 1024) {
      // setError({
      //   status: true,
      //   message: `Ukuran file melebihi ${maxSize}MB`,
      // })
      setShowToast(true);
      setDataToast({
        type: "error",
        message: `asdf ${maxSize}MB`,
      });
      setError(true);
      imageRef.current.value = null;
      return;
    }

    const acceptedMimeTypes = acceptedFormats.map((format) => {
      switch (format.toLowerCase()) {
        case ".jpg":
        case ".jpeg":
          return "image/jpeg";
        case ".png":
          return "image/png";
        // Add more cases as needed
        default:
          return format;
      }
    });

    // Check if file type is accepted
    if (!acceptedMimeTypes.includes(file.type)) {
      // setError({
      //   status: true,
      //   message: `Format file tidak sesuai ketentuan`,
      // })
      setShowToast(true);
      setDataToast({
        type: "error",
        message: `Format file tidak sesuai ketentuan`,
      });
      setError(true);
      imageRef.current.value = null;
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
          imageRef.current.value = null;
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
          imageRef.current.value = null;
          return;
        }

        // If magic numbers match, proceed with reading the full file
        const fullReader = new FileReader();
        fullReader.onloadend = () => {
          setImage(fullReader.result);
          setIsOpen(true);
          setError(false);
        };
        fullReader.readAsDataURL(file);
      }
    };

    // Read the first few bytes for magic number checking
    const blob = file.slice(0, 8); // Read first 8 bytes which covers all our magic numbers
    headerReader.readAsArrayBuffer(blob);

    // const reader = new FileReader();
    // reader.onloadend = () => {
    //   setImage(reader.result);
    // };
    // if (reader && e) {
    //   if (files.length > 0) {
    //     reader.readAsDataURL(file);
    //     setIsOpen(true);
    //     setError(defaultError)
    //   }
    // }
  };

  const getCroppedData = (value) => {
    const file = base64ToFile(value, imageFiles.name, imageFiles.type);
    onFinishCrop(file);
    if (value) {
      getImage(value);
      onUpload(value);
      imageRef.current.value = null;
    }
  };

  const clearInput = (value) => {
    if (value) {
      imageRef.current.value = null;
      setImage(null);
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    imageRef.current.value = null;
    setImage(null);
    getImage(null);
  };

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
        onClick={() => {
          if (!isLoading) {
            imageRef.current.click();
          }
        }}
      >
        <input
          accept={[".jpg", ".jpeg", ".png"].join(",")}
          type="file"
          onChange={getFile}
          ref={imageRef}
          className="hidden"
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
                {isBig ? (
                  <span className="text-neutral-900 font-semibold text-[12px] leading-[14.4px] group-hover:text-primary-700">
                    {renderUploadText}
                  </span>
                ) : null}
              </>
            )}
            {error && (
              <>
                <IconComponent
                  classname={`icon-error-400`}
                  size="small"
                  src="/icons/restart.svg"
                />
                {isBig ? (
                  <span className="text-error-400 font-semibold text-[12px] leading-[14.4px] group-hover:text-primary-700">
                    {renderErrorText}
                  </span>
                ) : null}
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
            {isBig && isMain && base64Image && !error && (
              <div className="bg-success-50 text-success-400 text-[12px] px-2 font-semibold flex items-center justify-center p-[7px] rounded-md h-[24px] absolute bottom-[8px] left-[8px]">
                {/* {t("labelGambarUtama")} */}
                Gambar Utama
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
          fileType={imageFiles?.type}
          title={cropperTitle}
        />
      ) : null}
    </>
  );
}

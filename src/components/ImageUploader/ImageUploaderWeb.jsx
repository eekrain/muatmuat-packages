"use client";

import { useEffect, useRef, useState } from "react";

import CropperWeb from "@/components/Cropper/CropperWeb";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { useSWRMutateHook } from "@/hooks/use-swr";
import { toast } from "@/lib/toast";

import styles from "./ImageUploader.module.scss";

// import { useTranslation } from "@/context/TranslationProvider";

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
  // console.log("value", value);
  const imageRef = useRef(null);
  const [image, setImage] = useState(null); //set image source for cropper
  const [isOpen, setIsOpen] = useState(false); //open cropper modal
  const base64Image = value;
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(false);
  // const { t } = useTranslation();

  const [renderUploadText, setRenderUploadText] = useState(uploadText);
  const [renderErrorText, setRenderErrorText] = useState(errorText);

  const { trigger: uploadPhoto, isMutating: isMutatingUploadPhoto } =
    useSWRMutateHook("v1/orders/upload", "POST");

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
      setImageFile(files[0]);
    } else if (e.target) {
      files = e.target.files;
      setImageFile(files[0]);
    }
    file = files[0];

    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`Ukuran file melebihi ${maxSize}MB`);
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
      toast.error("Format file tidak sesuai ketentuan");
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
          toast.error("Gagal mengunggah gambar");
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
          toast.error("Gagal mengunggah gambar");
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

  const handleFinishCrop = async (value) => {
    console.log("value", value);
    const formData = new FormData();
    formData.append("file", value);
    await uploadPhoto(formData)
      .then((data) => getImage(data.Data.photoUrl))
      .catch((error) => console.log("Error Upload Photo: ", error));
  };

  const getCroppedData = (file) => {
    // Log file information
    console.log(`File size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`File name: ${file.name}`);
    console.log(`File type: ${file.type}`);

    handleFinishCrop(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result; // dataURL for preview/upload

      // You can also log the base64 string length as an approximate size indicator
      console.log(`Base64 data length: ${base64.length} characters`);

      // getImage(base64);
      onUpload(base64);
      imageRef.current.value = null;
    };
    reader.readAsDataURL(file); // get base64 if needed
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
        } group relative flex size-[72px] items-end gap-y-3 hover:!border-primary-700 ${className}`}
        style={
          !error && base64Image && !isMutatingUploadPhoto
            ? { backgroundImage: `url(${base64Image})` }
            : { backgroundImage: "none" }
        }
        onClick={() => {
          if (!isMutatingUploadPhoto) {
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
        {isMutatingUploadPhoto ? (
          <>
            <ImageComponent
              className={styles.rotate_image}
              src="/img/loader.png"
              alt="loader"
              width={20}
              height={20}
            />
            <span className="text-[12px] font-semibold leading-[14.4px] text-neutral-900">
              Mengunggah...
            </span>
          </>
        ) : (
          <>
            {!error && !base64Image && (
              <>
                <IconComponent size="small" src="/icons/add_image.svg" />
                {isBig ? (
                  <span className="text-[12px] font-semibold leading-[14.4px] text-neutral-900 group-hover:text-primary-700">
                    {renderUploadText}
                  </span>
                ) : null}
              </>
            )}
            {error && (
              <>
                <IconComponent
                  className={"icon-error-400"}
                  size="medium"
                  src="/icons/restart24.svg"
                />
                {isBig ? (
                  <span className="text-[12px] font-semibold leading-[14.4px] text-error-400 group-hover:text-primary-700">
                    {renderErrorText}
                  </span>
                ) : null}
              </>
            )}
            {base64Image && !error && (
              <button
                className={`absolute right-[4px] top-[4px] flex items-center justify-center rounded-[24px] bg-[#FFFFFF] ${
                  isBig ? "size-5" : "size-4"
                }`}
                onClick={removeImage}
              >
                <IconComponent
                  height={12}
                  width={12}
                  src="/icons/silang12.svg"
                />
              </button>
            )}
            {isBig && isMain && base64Image && !error && (
              <div className="absolute bottom-[8px] left-[8px] flex h-[24px] items-center justify-center rounded-md bg-success-50 p-[7px] px-2 text-[12px] font-semibold text-success-400">
                {/* {t("labelGambarUtama")} */}
                Gambar Utama
              </div>
            )}
          </>
        )}
      </div>
      {isOpen ? (
        <CropperWeb
          imageFile={imageFile}
          imageSource={image}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          result={getCroppedData}
          onClose={clearInput}
          required={true}
          isCircle={isCircle}
          title={cropperTitle}
        />
      ) : null}
    </>
  );
}

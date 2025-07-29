"use client";

import { useRef } from "react";

import Button from "../Button/Button";
import IconComponent from "../IconComponent/IconComponent";

const FileUpload = ({
  className,
  label = "Unggah",
  maxSize = 5,
  onError = () => {},
  onSuccess = () => {},
  value = null,
  acceptedFormats = [".jpg", ".jpeg", ".png"],
  errorMessage,
}) => {
  const fileRef = useRef(null);

  const displayFormats = acceptedFormats
    .map((format) => format.replace(".", ""))
    .join("/");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      // If user cancels file selection, do nothing
      if (fileRef.current) {
        fileRef.current.value = null;
      }
      return;
    }

    // Client-side validation for format
    const fileExtension = `.${file.name.split(".").pop().toLowerCase()}`;
    if (!acceptedFormats.includes(fileExtension)) {
      onError("Format file tidak sesuai ketentuan");
      if (fileRef.current) {
        fileRef.current.value = null;
      }
      return;
    }

    // Client-side validation for size
    if (file.size > maxSize * 1024 * 1024) {
      onError(`Ukuran file melebihi ${maxSize}MB`);
      if (fileRef.current) {
        fileRef.current.value = null;
      }
      return;
    }

    // If validation passes, send the raw File object to the parent form
    onSuccess(file);
  };

  const handleDelete = () => {
    onSuccess(null);
    if (fileRef.current) {
      fileRef.current.value = null;
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept={acceptedFormats.join(",")}
        onChange={handleFileChange}
      />
      {value ? (
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <span
              className="truncate text-xs font-medium leading-[14.4px] text-success-400"
              title={value.name}
            >
              {value.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <IconComponent
              src="/icons/silang.svg"
              onClick={handleDelete}
              className="h-4 w-4 cursor-pointer"
              width={16}
              height={16}
              alt="Hapus file"
            />
            <span
              className="cursor-pointer text-xs font-medium leading-[14.4px] text-primary-700"
              onClick={() => fileRef.current.click()}
            >
              Ubah File
            </span>
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center">
          <Button
            type="button"
            className="shrink-0 rounded-full bg-amber-400 px-8 py-2 text-sm font-semibold text-black hover:bg-amber-500"
            name="upload"
            onClick={() => fileRef.current.click()}
          >
            {label}
          </Button>
          <div className="ml-4 flex w-full flex-1 flex-col">
            <div className="text-sm leading-tight text-neutral-600">
              Format file {displayFormats}
            </div>
            <div className="text-sm leading-tight text-neutral-600">
              maks. {maxSize}MB
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <span className="mt-2 block text-xs text-error-400">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default FileUpload;

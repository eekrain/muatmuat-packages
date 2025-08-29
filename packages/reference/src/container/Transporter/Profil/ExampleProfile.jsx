"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";

import Button from "@/components/Button/Button";
import CropperWeb from "@/components/Cropper/CropperWeb";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";

import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

// --- Internal Dropzone Component (logic from your modal file) ---
const Dropzone = ({ onFileAccepted, inputRef, maxSize, acceptedFormats }) => {
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = useCallback(
    (file) => {
      if (!file) return null;
      const fileExtension = `.${file.name.split(".").pop().toLowerCase()}`;
      if (!acceptedFormats.includes(fileExtension)) {
        toast.error("Format file tidak sesuai ketentuan");
        return null;
      }
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`Ukuran file maksimal ${maxSize}MB`);
        return null;
      }
      return file;
    },
    [acceptedFormats, maxSize]
  );

  const handleDragOver = (e) => (e.preventDefault(), setIsDragging(true));
  const handleDragLeave = (e) => (e.preventDefault(), setIsDragging(false));
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = validateFile(e.dataTransfer.files?.[0]);
      if (file) onFileAccepted(file);
    },
    [onFileAccepted, validateFile]
  );
  const handleFileChange = (e) => {
    const file = validateFile(e.target.files?.[0]);
    if (file) onFileAccepted(file);
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept={acceptedFormats.join(",")}
        className="hidden"
      />
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "mx-auto flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary-700 bg-neutral-50 transition-colors hover:border-primary-800",
          isDragging && "border-primary-700 bg-primary-50"
        )}
      >
        <span className="text-xs font-medium text-neutral-900">
          Browse File
        </span>
      </div>
      <p className="mt-2 text-xs text-neutral-600">
        Format file jpg/png maks. {maxSize}MB
      </p>
    </div>
  );
};

// --- Reusable Field Component ---
const EditableField = ({ label, value, href = "#" }) => (
  <div className="flex flex-col gap-1">
    <span className="mb-3 text-xs font-medium text-neutral-600">{label}</span>
    <div className="flex items-center gap-3">
      <span className="text-xs text-neutral-900">{value}</span>
      <Link href={href}>
        <div className="flex cursor-pointer items-center gap-1 text-sm text-primary-700 hover:text-primary-800">
          Ubah
          <IconComponent
            src="/icons/pencil-outline.svg"
            alt="Edit"
            width={16}
            height={16}
          />
        </div>
      </Link>
    </div>
  </div>
);

// --- Main Profile Component ---
const UserProfileInfo = ({ userProfile }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isCropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [sourceFile, setSourceFile] = useState(null);
  const fileInputRef = useRef(null);

  const userData = {
    initials: "DT",
    whatsapp: "0823212345840",
    email: "public.relation.mrsby@midtownight.com",
    name: "Daffa Toldi Dharmawan",
  };

  const handleFileAccepted = (file) => {
    setSourceFile(file);
    setImageToCrop(URL.createObjectURL(file));
    setUploadModalOpen(false);
    setCropModalOpen(true);
  };

  const handleCropSuccess = (file) => {
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
    console.log("New cropped file:", file);
    // Add logic here to upload the file to your server
    setCropModalOpen(false);
  };

  const handleCropClose = () => {
    setCropModalOpen(false);
    setImageToCrop(null);
    setSourceFile(null);
    setUploadModalOpen(true); // Re-open the upload modal if crop is cancelled
  };

  return (
    <>
      <div className="flex items-center gap-8 p-5 align-middle">
        {/* Left Section: Avatar layout preserved as per the image */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary-700">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-white">
                {userData.initials}
              </span>
            )}
          </div>
          <button type="button" onClick={() => setUploadModalOpen(true)}>
            <span className="cursor-pointer text-sm font-semibold text-primary-700 hover:underline">
              Ubah Foto
            </span>
          </button>
        </div>

        {/* Right Section: User Details */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-neutral-900">
            {userData.name}
          </h2>
          <div className="grid flex-1 grid-cols-2 gap-x-10 gap-y-6">
            <EditableField label="No. Whatsapp" value={userData.whatsapp} />
            <EditableField label="Email" value={userData.email} />
            <EditableField label="Password" value="********" />
          </div>
        </div>
      </div>

      {/* Modal for initial file selection */}
      <Modal open={isUploadModalOpen} onOpenChange={setUploadModalOpen}>
        <ModalContent size="small" className="w-[550px]" type="muattrans">
          <ModalHeader />
          <div className="rounded-lg bg-white p-6 px-[67px]">
            <h3 className="mb-6 mt-2 text-center text-sm font-bold">
              Ubah Foto Profil
            </h3>
            <Dropzone
              onFileAccepted={handleFileAccepted}
              inputRef={fileInputRef}
              maxSize={10}
              acceptedFormats={[".jpg", ".jpeg", ".png"]}
            />
          </div>
        </ModalContent>
      </Modal>

      {/* Modal for cropping the image */}
      <CropperWeb
        imageFile={sourceFile}
        imageSource={imageToCrop}
        isOpen={isCropModalOpen}
        setIsOpen={setCropModalOpen}
        onClose={handleCropClose}
        result={handleCropSuccess}
        isCircle={true}
        title="Ubah Foto Profil"
        aspectRatio={1}
      />
    </>
  );
};

export default UserProfileInfo;

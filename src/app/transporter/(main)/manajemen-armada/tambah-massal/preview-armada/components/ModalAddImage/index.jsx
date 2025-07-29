"use client";

import { useState } from "react";

import Button from "@/components/Button/Button";
import ImageUploaderWeb from "@/components/ImageUploader/ImageUploaderWeb";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";

export default function ModalAddArmadaImage({
  // Array of images to be uploaded
  isOpen,
  onClose,
  onSave,
}) {
  const [images, setImages] = useState({
    image_armada_depan: null,
    image_armada_belakang: null,
    image_armada_kanan: null,
    image_armada_kiri: null,
  });
  const handleSave = () => {
    // Logic to handle saving images
    onSave();
    onClose();
  };
  return (
    <Modal
      open={isOpen}
      onOpenChange={() => {
        onClose();
      }}
    >
      <ModalContent className="w-[562px]">
        <ModalHeader />
        <div className="flex w-full flex-col items-center gap-6 px-6 py-9">
          <div className="text-center">
            <h2 className="text-sm font-bold">Unggah Foto Armada</h2>
            <p className="mt-3 text-xs font-medium text-neutral-600">
              Format file gambar jpg/png max. 10MB
            </p>
          </div>
          <div className="flex w-full items-center justify-center gap-4">
            <ImageUploaderWeb
              getImage={(image) => {
                setImages((prev) => ({
                  ...prev,
                  image_armada_depan: image,
                }));
              }}
              errorText={"Foto armada wajib diisi"}
              uploadText={"Tampak Depan"}
              className="aspect-square size-full"
            />
            <ImageUploaderWeb
              uploadText={"Tampak Belakang"}
              className="aspect-square size-full"
            />
            <ImageUploaderWeb
              uploadText={"Tampak Kanan"}
              className="aspect-square size-full"
            />
            <ImageUploaderWeb
              uploadText={"Tampak Kiri"}
              className="aspect-square size-full"
            />
          </div>
          <Button className="!w-fit !min-w-[112px]">Simpan</Button>
        </div>
      </ModalContent>
    </Modal>
  );
}

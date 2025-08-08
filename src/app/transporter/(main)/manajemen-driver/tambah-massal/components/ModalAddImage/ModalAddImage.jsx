"use client";

import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import { toast } from "@/lib/toast";

import UploadVehiclePhotos from "../../../../manajemen-armada/tambah-massal/components/UploadVehiclePhotos/UploadVehiclePhotos";

/**
 * @typedef {Object} ModalAddArmadaImageProps
 * @property {boolean} isOpen - Whether the modal is open.
 * @property {Function} onClose - Function to call when the modal is closed.
 * @property {Object} ImagesSet - Object containing image files for the armada.
 * @property {(imageSet:ImagesSet)=>void} onSave - Function to call when images are saved.
 */

/**
 * ModalAddArmadaImage component for uploading multiple images of an armada.
 * @param {ModalAddArmadaImageProps} props - Component properties.
 */

export default function ModalAddImage({
  // Array of images to be uploaded
  value,
  isOpen,
  onClose,
  onSave,
}) {
  const [images, setImages] = useState(
    value || {
      driver_image: null,
    }
  );
  const [isError, setIsError] = useState(false);

  const handleImageChange = (imageType, image) => {
    setImages((prev) => ({
      ...prev,
      [imageType]: image,
    }));
  };

  const handleClose = () => {
    setImages({
      driver_image: null,
    });
    setIsError(false);
    onClose();
  };

  const handleSave = () => {
    // Logic to handle saving images
    if (!images.driver_image) {
      toast.error("Foto Driver wajib diisi");
      setIsError(true);
    } else {
      onSave(images);
      handleClose();
    }
  };

  useEffect(() => {
    if (value) {
      setImages(value);
    }
  }, [value]);
  return (
    <Modal
      open={isOpen}
      onOpenChange={() => {
        handleClose();
      }}
    >
      <ModalContent className="w-[464px]">
        <ModalHeader />
        <div className="flex w-full flex-col items-center gap-6 px-6 py-9">
          <div className="text-center">
            <h2 className="text-sm font-bold">Unggah Foto Driver</h2>
            <p className="mt-3 text-xs font-medium text-neutral-600">
              Format file gambar jpg/png maks. 10MB
            </p>
          </div>
          <div className="flex w-full items-center justify-center gap-4">
            <UploadVehiclePhotos
              value={images.driver_image}
              onUpload={(image) => handleImageChange("driver_image", image)}
              isError={isError && !images.driver_image}
              placeholder="Tambah Foto"
              className="w-32"
            />
          </div>
          <Button onClick={handleSave} className="!w-fit !min-w-[112px]">
            Simpan
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}

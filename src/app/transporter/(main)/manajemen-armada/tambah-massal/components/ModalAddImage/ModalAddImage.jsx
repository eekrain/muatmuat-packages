"use client";

import { useEffect, useState } from "react";

import { useUploadVehiclePhotos } from "@/services/Transporter/manajemen-armada/postUploadVehiclePhotos";

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
  const { trigger, isMutating, data, error } = useUploadVehiclePhotos();

  const [images, setImages] = useState(
    value || {
      image_armada_depan: null,
      image_armada_belakang: null,
      image_armada_kanan: null,
      image_armada_kiri: null,
    }
  );
  const [isError, setIsError] = useState(false);
  const [uploadError, setUploadError] = useState();

  const handleImageChange = (imageType, image) => {
    setImages((prev) => ({
      ...prev,
      [imageType]: image,
    }));
  };

  useEffect(() => {
    console.log("images", images);
  }, [images]);

  const handleClose = () => {
    setImages({
      image_armada_depan: null,
      image_armada_belakang: null,
      image_armada_kanan: null,
      image_armada_kiri: null,
    });
    setIsError(false);
    onClose();
  };

  const handleSave = () => {
    // Logic to handle saving images
    if (
      !images.image_armada_depan ||
      !images.image_armada_belakang ||
      !images.image_armada_kanan ||
      !images.image_armada_kiri
    ) {
      toast.error("Foto armada wajib diisi");
      setIsError(true);
    } else {
      onSave(images);
      onClose();
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
      closeOnOutsideClick={true}
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
            {/* <ImageUploaderWeb
              value={images.image_armada_depan}
              onUpload={(image) =>
                handleImageChange("image_armada_depan", image)
              }
              uploadText={"Tampak Depan"}
              className={cn(
                "aspect-square size-full",
                isError && !images.image_armada_depan && "!border-error-500"
              )}
              onError={(errorMessage) => toast.error(errorMessage)}
              isLoading={isMutating}
              isError={error}
            /> */}
            <UploadVehiclePhotos
              value={images.image_armada_depan}
              onUpload={(image) =>
                handleImageChange("image_armada_depan", image)
              }
              isError={isError && !images.image_armada_depan}
              placeholder="Tampak Depan"
            />
            <UploadVehiclePhotos
              value={images.image_armada_belakang}
              onUpload={(image) =>
                handleImageChange("image_armada_belakang", image)
              }
              isError={isError && !images.image_armada_belakang}
              placeholder="Tampak Belakang"
            />
            <UploadVehiclePhotos
              value={images.image_armada_kiri}
              onUpload={(image) =>
                handleImageChange("image_armada_kiri", image)
              }
              isError={isError && !images.image_armada_kiri}
              placeholder="Tampak Kiri"
            />
            <UploadVehiclePhotos
              value={images.image_armada_kanan}
              onUpload={(image) =>
                handleImageChange("image_armada_kanan", image)
              }
              isError={isError && !images.image_armada_kanan}
              placeholder="Tampak Kanan"
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

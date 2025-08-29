"use client";

import { useCallback, useRef } from "react";

import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";

import { Modal, ModalContent, ModalTitle } from "@/components/Modal/Modal";

import IconComponent from "../IconComponent/IconComponent";
import styles from "./CropperWeb.module.scss";
import "./cropper_az.css";

export default function CropperWeb({
  imageFile,
  imageSource,
  result,
  isOpen,
  setIsOpen,
  onClose,
  isCircle = false,
  title = "Unggah Gambar",
}) {
  const cropperRef = useRef(null);
  const defaultRatioRef = useRef(null);

  const handleClose = useCallback(() => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.reset();
    }
    setIsOpen(false);
    if (onClose) {
      onClose(true); // Notify parent component of cancellation
    }
  }, [setIsOpen, onClose]);

  const getCropData = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      // Get filename from imageFile or generate one
      let fileName =
        imageFile?.name ||
        `cropped_image_${Date.now()}.${
          imageFile?.type?.split("/")[1] || "jpeg"
        }`;

      // Ensure the filename doesn't have spaces or special characters
      fileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");

      cropper.getCroppedCanvas().toBlob(
        (blob) => {
          const file = new File([blob], fileName, { type: imageFile?.type });
          result(file); // Pass actual File object
          cropper.reset();
          setIsOpen(false);
        },
        imageFile?.type,
        0.7 // compress at 70%
      );
    }
  };

  const zoomOut = () => {
    const cropper = cropperRef.current?.cropper;
    cropper?.zoom(-0.1);
  };

  const zoomIn = () => {
    const cropper = cropperRef.current?.cropper;
    cropper?.zoom(0.1);
  };

  const handleZoom = (event) => {
    const oldRatio = event.detail.oldRatio;
    const newDefaultRatio =
      defaultRatioRef.current !== null ? defaultRatioRef.current : oldRatio;
    const ratio = event.detail.ratio;
    const isZoomingIn = ratio > oldRatio;
    defaultRatioRef.current = newDefaultRatio;

    // Only prevent zooming in beyond 2x the default ratio
    if (isZoomingIn && ratio > newDefaultRatio * 2) {
      event.preventDefault();
    }
    // Allow zooming out until minimum ratio
    if (!isZoomingIn && ratio < newDefaultRatio / 2) {
      event.preventDefault();
    }
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      closeOnOutsideClick
    >
      <ModalContent
        className={`${
          isCircle ? "modal-cropper-circle" : ""
        } w-[424px] rounded-xl bg-white px-6 py-9`}
      >
        <div className="mb-6 flex flex-col items-center gap-[18px]">
          <ModalTitle>{title}</ModalTitle>
          <div className="relative h-[386px] w-[386px]">
            <div className="absolute bottom-2 right-2 z-50 flex h-20 w-10 flex-col rounded-lg border border-[#E2E2E2] bg-white">
              <div
                className="flex h-1/2 cursor-pointer items-center justify-center"
                onClick={zoomIn}
                role="button"
                aria-label="Zoom In"
              >
                <IconComponent
                  className={styles.icon_zoom}
                  src="/icons/zoom_plus.svg"
                  width={20}
                  height={20}
                  alt="Zoom In"
                />
              </div>
              <div
                className="flex h-1/2 cursor-pointer items-center justify-center"
                onClick={zoomOut}
                role="button"
                aria-label="Zoom Out"
              >
                <IconComponent
                  className={styles.icon_zoom}
                  src="/icons/zoom_minus.svg"
                  width={20}
                  height={20}
                  alt="Zoom Out"
                />
              </div>
            </div>
            <Cropper
              ref={cropperRef}
              style={{ height: "100%", width: "100%" }}
              src={imageSource}
              aspectRatio={1}
              preview={".img-preview"}
              viewMode={0}
              background={true}
              responsive={true}
              autoCropArea={1}
              cropBoxResizable={true}
              minCropBoxHeight={isCircle ? 386 : 0}
              minCropBoxWidth={isCircle ? 386 : 0}
              zoom={handleZoom}
            />
            <div className="img-preview" />
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 min-w-[112px] items-center justify-center rounded-full border border-muat-trans-secondary-900 bg-white px-3 outline-none hover:bg-muat-trans-secondary-100"
          >
            <span className="text-sm font-semibold leading-[16.8px] text-muat-trans-secondary-900">
              Batal
            </span>
          </button>
          <button
            type="button"
            onClick={getCropData}
            className="flex h-8 min-w-[112px] items-center justify-center rounded-full bg-muat-trans-primary-400 px-3 outline-none hover:bg-muat-trans-primary-500"
            autoFocus
          >
            <span className="text-sm font-semibold leading-[16.8px] text-neutral-900">
              Simpan
            </span>
          </button>
        </div>
      </ModalContent>
    </Modal>
  );
}

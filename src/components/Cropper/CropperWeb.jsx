"use client";

import { useEffect, useRef } from "react";

//cropper
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";

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
  const modalRef = useRef(null);
  const defaultRatioRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        cancelCrop();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        cancelCrop();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const getCropData = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      // Get filename from imageFile or generate one
      let fileName =
        imageFile?.name ||
        `cropped_image_${Date.now()}.${imageFile?.type?.split("/")[1] || "jpeg"}`;

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
        0.7
      ); // compress at 70%
    }
  };

  const cancelCrop = () => {
    const cropper = cropperRef.current?.cropper;
    cropper.reset();
    setIsOpen(false);
    onClose(true);
  };

  const zoomOut = () => {
    const cropper = cropperRef.current?.cropper;
    cropper.zoom(-0.1);
  };

  const zoomIn = () => {
    const cropper = cropperRef.current?.cropper;
    cropper.zoom(0.1);
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
    // Allow zooming out until minimum ratio (usually around 0.1 or lower)
    // You can adjust this minimum value based on your needs
    if (!isZoomingIn && ratio < newDefaultRatio / 2) {
      event.preventDefault();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[20] overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity">
      <div className="flex min-h-full items-center justify-center p-4 text-center max-[600px]:items-center">
        <div
          ref={modalRef}
          className={`${
            isCircle ? "modal-cropper-circle" : ""
          } w-[424px] rounded-xl bg-white px-6 py-9`}
        >
          <div className="mb-6 flex flex-col items-center gap-[18px] bg-white">
            <span className="text-1b1b text-base font-bold leading-[19.2px]">
              {title}
            </span>
            <div className="relative h-[386px] w-[386px]">
              <div className="absolute bottom-2 right-2 z-50 flex h-20 w-10 flex-col rounded-lg border border-[#E2E2E2] bg-white">
                <div
                  className="flex h-1/2 cursor-pointer items-center justify-center"
                  onClick={zoomIn}
                >
                  <IconComponent
                    className={styles.icon_zoom}
                    src="/icons/zoom_plus.svg"
                    width={20}
                    height={20}
                  />
                </div>
                <div
                  className="flex h-1/2 cursor-pointer items-center justify-center"
                  onClick={zoomOut}
                >
                  <IconComponent
                    className={styles.icon_zoom}
                    src="/icons/zoom_minus.svg"
                    width={20}
                    height={20}
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
              onClick={cancelCrop}
              className="flex h-8 min-w-[112px] items-center justify-center rounded-full border border-[#176CF7] bg-white px-3 outline-none"
            >
              <span className="text-sm font-semibold leading-[16.8px] text-[#176CF7]">
                Batal
              </span>
            </button>
            <button
              type="button"
              onClick={getCropData}
              className="flex h-8 min-w-[112px] items-center justify-center rounded-full bg-[#176CF7] px-3 outline-none"
              autoFocus
            >
              <span className="text-sm font-semibold leading-[16.8px] text-neutral-50">
                Simpan
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

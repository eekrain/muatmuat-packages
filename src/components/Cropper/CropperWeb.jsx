"use client";
import React, { useEffect, useRef } from "react";

//cropper
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./cropper_az.css";
import IconComponent from "../IconComponent/IconComponent";
import styles from "./CropperWeb.module.scss";
// LB - 0513, LB - 0514, LB - 0515, LB - 0516
// 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2
// import { useTranslation } from "@/context/TranslationProvider";

export default function CropperWeb({
  imageSource = "",
  result,
  isOpen,
  setIsOpen,
  onClose,
  isCircle = false,
  fileType,
  title = "Unggah Gambar",
}) {
  const cropperRef = useRef(null);
  const modalRef = useRef(null);
  const defaultRatioRef = useRef(null);
  // const { t } = useTranslation();

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
    if (typeof cropperRef.current?.cropper !== "undefined") {
      result(
        cropperRef.current?.cropper.getCroppedCanvas().toDataURL(fileType, 1.0)
      );
    }
    const cropper = cropperRef.current?.cropper;
    cropper.reset();
    setIsOpen(false);
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
    <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center">
        <div
          ref={modalRef}
          className={`${
            isCircle ? "modal-cropper-circle" : ""
          } px-6 py-9 w-[424px] bg-white rounded-xl`}
        >
          <div className="bg-white flex flex-col gap-[18px] items-center mb-6">
            <span className="font-bold text-[16px] leading-[19.2px] text-1b1b">
              {title}
            </span>
            <div className="w-[386px] h-[386px] relative">
              <div className="bg-white flex flex-col absolute right-2 bottom-2 border border-[#E2E2E2] rounded-lg z-[100] w-10 h-20">
                <div
                  className="h-1/2 cursor-pointer flex justify-center items-center"
                  onClick={zoomIn}
                >
                  <IconComponent
                    classname={styles.icon_zoom}
                    src="/icons/zoom_plus.svg"
                    width={20}
                    height={20}
                  />
                </div>
                <div
                  className="h-1/2 cursor-pointer flex justify-center items-center"
                  onClick={zoomOut}
                >
                  <IconComponent
                    classname={styles.icon_zoom}
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
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={cancelCrop}
              className="rounded-full bg-white border border-[#176CF7] px-3 min-w-[112px] h-8 flex items-center justify-center outline-none"
            >
              <span className="font-semibold text-[14px] leading-[16.8px] text-[#176CF7]">
                {/* {t("buttonCancel")} */}
                Batal
              </span>
            </button>
            <button
              type="button"
              onClick={getCropData}
              className="rounded-full bg-[#176CF7] px-3 min-w-[112px] h-8 flex items-center justify-center outline-none"
              autoFocus
            >
              <span className="font-semibold text-[14px] leading-[16.8px] text-neutral-50">
                {/* {t("labelSimpanNav")} */}
                Simpan
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

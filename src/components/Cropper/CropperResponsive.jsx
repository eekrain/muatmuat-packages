"use client";
import React, { useRef, useState } from "react";

//cropper
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./cropper_az.css";
import style from "./CropperResponsive.module.scss";

import IconComponent from "../IconComponent/IconComponent";
// 24. THP 2 - MOD001 - MP - 015 - QC Plan - Web - MuatParts - Seller - Paket 039 A - Profil Seller - LB - 0066
// syntax fix CropperPreviewResponsive -> CropperReviewResponsive by fariz (tidak bisa build - biar cepat. kalau salah bisa direvert)
// LBM - ganti nama
// import CropperPreviewResponsive from "./CropperPreviewResponsive";
import { useHeader } from "@/common/ResponsiveContext";

export default function CropperResponsive({
  imageSource = "",
  result,
  isOpen,
  setIsOpen,
  onClose,
  isCircle = false,
  previewTitle,
  // 24. THP 2 - MOD001 - MP - 015 - QC Plan - Web - MuatParts - Seller - Paket 039 A - Profil Seller - LB - 0066
  previewDescription,
  uploadOptions,
  isShowPreview,
  setIsShowPreview,
  fileType
}) {
  const cropperRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const defaultRatioRef = useRef(null)
  const { setAppBar } = useHeader();

  const getCropData = () => {
    if (typeof cropperRef.current.cropper !== "undefined") {
      setPreviewImage(
        cropperRef.current?.cropper.getCroppedCanvas().toDataURL(fileType, 1.0)
      );
    }
    const cropper = cropperRef.current?.cropper;
    cropper.reset();
    setIsShowPreview(true);
  };

  const cancelCrop = () => {
    const cropper = cropperRef.current?.cropper;
    cropper.reset();
    // setAppBar({
    //   title: "Daftar Menjadi Toko",
    //   appBarType: "header_title",
    // });
    setIsOpen(false);
    onClose(true);
  };

  const handleConfirm = () => {
    //  setAppBar({
    //    title: "Daftar Menjadi Toko",
    //    appBarType: "header_title",
    //  });
    result(previewImage);
    setIsShowPreview(false);
    setIsOpen(false);
  };

  const handleZoom = (event) => {
    const oldRatio = event.detail.oldRatio;
    const newDefaultRatio = defaultRatioRef.current !== null ? defaultRatioRef.current : oldRatio;
    const ratio = event.detail.ratio;
    const isZoomingIn = ratio > oldRatio;
    defaultRatioRef.current = newDefaultRatio
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

  if (!isOpen) {
    return null;
  }

  // if (isShowPreview) {
  //   return (
  //     // 24. THP 2 - MOD001 - MP - 015 - QC Plan - Web - MuatParts - Seller - Paket 039 A - Profil Seller - LB - 0066
  //     // syntax fix CropperPreviewResponsive -> CropperReviewResponsive by fariz (tidak bisa build - biar cepat. kalau salah bisa direvert)
  //     <CropperPreviewResponsive
  //       title={previewTitle}
  //       description={previewDescription}
  //       src={previewImage}
  //       setIsShowPreview={setIsShowPreview}
  //       onConfirm={handleConfirm}
  //       uploadOptions={uploadOptions}
  //       onCancelCrop={cancelCrop}
  //     />
  //   );
  // }

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-screen z-[102] bg-[#20242F]`}
      >
        <div className="flex flex-row justify-between p-4 pt-3 items-center">
          <div className="flex flex-row gap-x-3 items-center">
            {/* <button
                            onClick={() => setIsOpen(false)}
                        > */}
            <IconComponent
              classname={style.close_btn_icon}
              src="/icons/silang.svg"
              size="medium"
              onclick={cancelCrop}
            />
            {/* </button> */}
            <span className="font-medium text-[16px] leading-[19.2px] text-white">
              Cropper
            </span>
          </div>
          <IconComponent
            // classname={style.close_btn_icon}
            src="/icons/check_white.svg"
            size="medium"
            onclick={getCropData}
          />
        </div>
        <div className="flex min-h-[600px]">
          <div
            className={`w-full aspect-square m-auto
                            ${isCircle ? "modal-cropper-circle" : ""}
                        `}
          >
            {/* <div className="bg-[white] flex flex-col absolute right-[8px] bottom-[7.5px] border-[#E2E2E2] border-[1px] rounded-[12px] z-[100] h-[80px]">
                            <div className="h-1/2 text-[25px] cursor-pointer text-[black] flex justify-center items-center" onClick={zoomIn}>
                                +
                            </div>
                            <div className="h-1/2 text-[25px] cursor-pointer text-[black] flex justify-center items-center p-[15px]" onClick={zoomOut}>
                                <div className="w-[12px] border-[1.25px] border-[#1B1B1B]">
                                </div>
                            </div>
                        </div> */}
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
              minCropBoxWidth={isCircle ? 300 : 0}
              zoom={handleZoom}
            />
          </div>
        </div>
      </div>
    </>
  );
}

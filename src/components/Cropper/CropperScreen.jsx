// import CropperResponsiveLayout from "./CropperResponsiveLayout";
import { useRef } from "react";

import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";

import CropperResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/CropperResponsiveLayout";
import { useImageUploaderStore } from "@/store/Shipper/forms/imageUploaderStore";

import "./cropper_az.css";

const CropperScreen = ({ onCheck, onClose }) => {
  const { image, isCircle } = useImageUploaderStore();
  const cropperRef = useRef(null);
  const defaultRatioRef = useRef(null);

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

  return (
    <CropperResponsiveLayout onCheck={onCheck} onClose={onClose}>
      <div className="flex min-h-screen items-center">
        <div
          className={`aspect-square w-full ${isCircle ? "modal-cropper-circle" : ""}`}
        >
          <Cropper
            ref={cropperRef}
            style={{ height: "100%", width: "100%" }}
            src={image}
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
    </CropperResponsiveLayout>
  );
};

export default CropperScreen;

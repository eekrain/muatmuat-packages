"use client";

import { useState } from "react";

import PropTypes from "prop-types";

import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { cn } from "@/lib/utils";

/**
 * ModalFotoPendukung - Modal to display driver photos with navigation
 * Shows a single photo with thumbnail navigation for multiple photos
 */
const ModalFotoPendukung = ({ isOpen, onClose, photos = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Ensure we have valid photos
  const validPhotos = photos;
  if (validPhotos.length === 0) return null;

  const currentPhoto = validPhotos[currentIndex];
  const hasMultiplePhotos = validPhotos.length > 1;

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % validPhotos.length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + validPhotos.length) % validPhotos.length
    );
  };

  const goToPhoto = (index) => {
    setCurrentIndex(index);
  };

  const handleClose = () => {
    setCurrentIndex(0); // Reset to first photo when closing
    onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={handleClose}>
      <ModalContent className="w-[600px] max-w-[90vw]" type="muattrans">
        <div className="flex flex-col items-center gap-6 px-3 pb-3 pt-8">
          {/* Title */}
          <h2 className="text-base font-bold text-neutral-900">
            Foto Pendukung
          </h2>

          {/* Main Photo Display */}
          <div className="relative">
            <div className="flex h-[400px] w-[550px] max-w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-100">
              <img
                src={currentPhoto || "/img/default-avatar.png"}
                alt={`Driver photo ${currentIndex + 1}`}
                className="h-full w-full object-contain"
              />
            </div>

            {/* Navigation arrows for multiple photos */}
            {hasMultiplePhotos && (
              <>
                <button
                  onClick={goToPrev}
                  className="absolute -left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg hover:bg-neutral-50"
                  aria-label="Previous photo"
                >
                  <IconComponent
                    src="/icons/chevron-left24.svg"
                    width={20}
                    height={20}
                  />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute -right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg hover:bg-neutral-50"
                  aria-label="Next photo"
                >
                  <IconComponent
                    src="/icons/chevron-right.svg"
                    width={20}
                    height={20}
                  />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail navigation for multiple photos */}
          {hasMultiplePhotos && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {validPhotos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => goToPhoto(index)}
                  className={cn(
                    "size-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                    index === currentIndex
                      ? "border-[#176CF7]"
                      : "border-transparent hover:border-neutral-300"
                  )}
                >
                  <img
                    src={
                      photo?.image || photo?.photo || "/img/default-avatar.png"
                    }
                    alt={photo?.name || `Driver thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Photo counter for multiple photos */}
          {/* {hasMultiplePhotos && (
            <div className="text-sm text-neutral-600">
              {currentIndex + 1} dari {validPhotos.length}
            </div>
          )} */}
        </div>
      </ModalContent>
    </Modal>
  );
};

ModalFotoPendukung.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      photo: PropTypes.string,
      name: PropTypes.string,
    })
  ),
};

export default ModalFotoPendukung;

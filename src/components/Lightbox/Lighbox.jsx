import { createContext, useContext, useMemo, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import useDevice from "@/hooks/use-device";
import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";
import { Modal, ModalContent } from "../Modal/Modal";

const LightboxContext = createContext(null);

/**
 * @typedef {Object} LightboxProviderProps
 * @property {string} title - Title of the lightbox
 * @property {string[]} images - Array of images to display in the lightbox
 * @property {string} image - Single image to display in the lightbox
 * @property {React.ReactNode} children - Children of the lightbox
 */

/**
 * @param {LightboxProviderProps} props
 */
export const LightboxProvider = ({ title, images = [], image, children }) => {
  const { isMobile } = useDevice();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  const openLightbox = (index) => {
    setCurrent(index);
    setOpen(true);
  };

  const closeLightbox = () => setOpen(false);
  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  const memoizedImages = useMemo(() => {
    if (image) {
      return [image];
    }
    return images;
  }, [image, images]);

  return (
    <LightboxContext.Provider
      value={{
        images: memoizedImages,
        current,
        open,
        openLightbox,
        closeLightbox,
        next,
        prev,
      }}
    >
      {children}

      <Modal
        open={open}
        onOpenChange={closeLightbox}
        closeOnOutsideClick={!isMobile}
        withCloseButton={!isMobile}
      >
        <ModalContent
          appearance={{
            backgroudClassname: "bg-black md:bg-black/25",
            wrapperClassname: "bg-neutral-50",
          }}
          className={cn(
            "flex h-full w-screen flex-col items-center md:h-[377px] md:w-[592px] md:bg-white md:px-6 md:pb-3 md:pt-8",
            memoizedImages.length > 1 && "md:h-[445px]"
          )}
          type="lightbox"
        >
          <h1 className="mb-3 hidden text-center text-base font-bold leading-[1.2] md:block">
            {title}
          </h1>
          <div className="relative">
            <img
              src={memoizedImages[current]}
              className="w-full bg-black object-contain md:h-[306px] md:w-[544px] md:rounded-[9px]"
              alt=""
            />

            {memoizedImages.length > 1 && (
              <>
                <button
                  className="absolute -left-3 top-1/2 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg md:flex"
                  onClick={prev}
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  className="absolute -right-3 top-1/2 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg md:flex"
                  onClick={next}
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>

          {/* Previews of images */}
          {memoizedImages.length > 1 && (
            <div className="mt-3 hidden flex-row gap-2 md:flex">
              {memoizedImages.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  className={cn(
                    "size-[56px] cursor-pointer rounded-[6px] border-2 border-neutral-400 object-cover",
                    current === index && "border-primary-700"
                  )}
                  onClick={() => setCurrent(index)}
                  alt=""
                />
              ))}
            </div>
          )}
        </ModalContent>
      </Modal>
    </LightboxContext.Provider>
  );
};

export const useLightbox = () => {
  const context = useContext(LightboxContext);
  if (!context)
    throw new Error("useLightbox must be used within a LightboxProvider");
  return context;
};

/**
 * @typedef {Object} LightboxPreviewProps
 * @property {string} image
 * @property {number} index
 * @property {string} alt
 * @property {string} className
 */

/**
 * @param {LightboxPreviewProps} props
 */
export const LightboxPreview = ({
  image,
  index = 0,
  className,
  alt,
  withZoom = true,
}) => {
  const { openLightbox } = useLightbox();

  return (
    <div className="relative block w-fit">
      <img
        className={cn("size-[68px] rounded-xl border object-cover", className)}
        src={image}
        alt={alt}
      />
      <div
        onClick={() => openLightbox(index)}
        className="absolute right-1 top-1 flex size-5 cursor-pointer items-center justify-center rounded-full bg-white"
      >
        <IconComponent
          src="/icons/zoom12.svg"
          width={12}
          height={12}
          className="text-neutral-500"
        />
      </div>
    </div>
  );
};

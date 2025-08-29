import { createContext, useContext, useMemo, useState } from "react";

import { cva } from "class-variance-authority";
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

export const lightboxModalVariants = cva(
  "flex w-screen flex-col items-center md:w-[592px] md:bg-white md:px-6 md:pb-3 md:pt-8",
  {
    variants: {
      variant: {
        shipper: "",
        square: "md:w-fit md:pb-[23px]",
      },
    },
    defaultVariants: { variant: "shipper" },
  }
);

export const lightboxTitleVariants = cva(
  "mb-3 hidden text-center text-base font-bold leading-[1.2] md:block",
  {
    variants: { variant: { shipper: "" } },
    defaultVariants: { variant: "shipper" },
  }
);

export const lightboxImageVariants = cva(
  "w-full object-cover md:h-[306px] md:w-[544px] md:rounded-[9px]",
  {
    variants: {
      variant: {
        shipper: "",
        square: "md:h-[364px] md:w-[364px] md:object-cover",
      },
    },
    defaultVariants: { variant: "shipper" },
  }
);

export const lightboxNavButtonVariants = cva(
  "absolute top-1/2 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg md:flex",
  {
    variants: {
      variant: { shipper: "" },
      position: { left: "-left-3", right: "-right-3" },
    },
    defaultVariants: { variant: "shipper", position: "left" },
  }
);

export const lightboxPreviewThumbVariants = cva(
  "size-[56px] cursor-pointer rounded-[6px] border-2 border-neutral-400 object-cover",
  {
    variants: {
      variant: { shipper: "" },
      active: { true: "border-primary-700", false: "" },
    },
    defaultVariants: { variant: "shipper", active: false },
  }
);

export const lightboxPreviewRootVariants = cva("relative block w-fit", {
  variants: { variant: { shipper: "" } },
  defaultVariants: { variant: "shipper" },
});

export const lightboxPreviewImageVariants = cva(
  "size-[68px] rounded-xl border border-neutral-400 object-contain",
  {
    variants: { variant: { shipper: "" } },
    defaultVariants: { variant: "shipper" },
  }
);

export const lightboxPreviewIconVariants = cva(
  "absolute right-1 top-1 flex size-5 cursor-pointer items-center justify-center rounded-full bg-white",
  {
    variants: { variant: { shipper: "" } },
    defaultVariants: { variant: "shipper" },
  }
);

export const LightboxProvider = ({
  title,
  images = [],
  image,
  children,
  variant = "shipper",
}) => {
  const { isMobile, mounted } = useDevice();
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

  const displayTitle = useMemo(() => {
    if (typeof title === "function") {
      return title(current);
    }
    return title;
  }, [current, title]);

  if (!mounted) return null;

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
          }}
          className={cn(
            lightboxModalVariants({ variant }),
            "rounded-none bg-white md:rounded-xl"
          )}
          type="lightbox"
        >
          <h1 className={lightboxTitleVariants({ variant })}>{displayTitle}</h1>
          <div className="relative w-full bg-white">
            <img
              src={memoizedImages[current]}
              className={cn(lightboxImageVariants({ variant }))}
              alt=""
            />
            {memoizedImages.length > 1 && (
              <>
                <button
                  className={lightboxNavButtonVariants({
                    variant,
                    position: "left",
                  })}
                  onClick={prev}
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  className={lightboxNavButtonVariants({
                    variant,
                    position: "right",
                  })}
                  onClick={next}
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>
          {/* Previews of images */}
          {memoizedImages.length > 1 && (
            <div className="mt-3 hidden justify-center gap-2 md:flex md:flex-row">
              {memoizedImages.map((image, index) => (
                <img
                  key={`${index}_${image}`}
                  src={image}
                  className={lightboxPreviewThumbVariants({
                    variant,
                    active: current === index,
                  })}
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
  variant = "shipper",
}) => {
  const { openLightbox } = useLightbox();

  return (
    <div className={cn(lightboxPreviewRootVariants({ variant }))}>
      <img
        className={cn(lightboxPreviewImageVariants({ variant }), className)}
        src={image}
        alt={alt}
      />
      <div
        onClick={(e) => {
          e.stopPropagation();
          openLightbox(index);
        }}
        className={lightboxPreviewIconVariants({ variant })}
      >
        <IconComponent
          src="/icons/zoom12.svg"
          width={12}
          height={12}
          className="text-neutral-700"
        />
      </div>
    </div>
  );
};

export const LightboxTrigger = ({ children, variant = "shipper" }) => {
  const { openLightbox } = useLightbox();

  return <div onClick={() => openLightbox(0)}>{children}</div>;
};

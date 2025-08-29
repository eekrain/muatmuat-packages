"use client";

import { cva } from "class-variance-authority";
import PropTypes from "prop-types";

import IconComponent from "@/components/IconComponent/IconComponent";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

const imageArmadaVariants = cva(
  "relative flex items-center justify-center overflow-hidden border border-neutral-400 bg-white",
  {
    variants: {
      size: {
        sm: "h-[52px] w-[52px] rounded-[9.18px]",
        md: "h-14 w-14 rounded", // 56px with 4px radius
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

const iconSizeMap = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
};

const ImageArmada = ({
  src,
  alt,
  plateNumber,
  size = "sm",
  className,
  fallbackIcon = "/icons/monitoring/daftar-pesanan-aktif/truck.svg",
  fallbackIconColor = "text-gray-600",
}) => {
  const { t } = useTranslation();
  return (
    <div className={cn(imageArmadaVariants({ size }), className)}>
      {src ? (
        <img
          src={src}
          alt={
            alt ||
            t("ImageArmada.truckAlt", { plateNumber }, `Truck ${plateNumber}`)
          }
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <IconComponent
          src={fallbackIcon}
          className={cn(iconSizeMap[size], fallbackIconColor)}
        />
      )}
    </div>
  );
};

ImageArmada.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  plateNumber: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md"]),
  className: PropTypes.string,
  fallbackIcon: PropTypes.string,
  fallbackIconColor: PropTypes.string,
};

export default ImageArmada;

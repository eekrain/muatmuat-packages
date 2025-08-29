"use client";

import IconComponent from "@/components/IconComponent/IconComponent";

import { cn } from "@/lib/utils";

const backgroundStyles = {
  muatmuat: "bg-primary-700",
  muattrans: "bg-muat-trans-primary-400",
};

/**
 * @typedef {Object} HeaderResponsiveContainerProps
 * @property {React.ReactNode} children
 * @property {string} className
 * @property {"muatmuat" | "muattrans"} type
 */

/**
 * @param {HeaderResponsiveContainerProps} props
 */
export const HeaderResponsiveContainer = ({
  children,
  className,
  variant = "muattrans",
}) => {
  return (
    <div
      className={cn(
        backgroundStyles[variant],
        "sticky left-0 top-0 z-10 w-full",
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * @typedef {Object} HeaderButtonBackProps
 * @property {() => void} onClick
 * @property {"muattrans" | "muatmuat"} variant
 */

/**
 * @param {HeaderButtonBackProps} props
 */
export const HeaderButtonBack = ({ onClick, variant }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex size-6 items-center justify-center rounded-xl",
        variant === "muattrans" &&
          "bg-muat-trans-secondary-900 text-muat-trans-primary-400",
        variant === "muatmuat" && "bg-neutral-50 text-primary-700"
      )}
    >
      <IconComponent
        src="/icons/chevron-left-12.svg"
        width={7}
        height={13}
        className="-ml-[1.5px] -mt-[0.5px]"
      />
    </button>
  );
};

export * from "./Default";
export * from "./Form";
export * from "./SearchBar";

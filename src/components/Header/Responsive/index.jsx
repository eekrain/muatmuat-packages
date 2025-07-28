"use client";

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

export * from "./Default";
export * from "./SearchBar";

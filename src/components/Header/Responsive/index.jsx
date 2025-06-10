"use client";

import { cn } from "@/lib/utils";

const backgroundClassnames = {
  muatmuat: "bg-neutral-50",
  muatparts: "bg-muat-parts-non-800",
  muattrans: "bg-muat-trans-primary-400",
};

export const HeaderResponsiveContainer = ({
  children,
  className,
  type = "muattrans",
}) => {
  return (
    <div
      className={cn(
        backgroundClassnames[type],
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

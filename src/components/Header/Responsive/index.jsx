"use client";

export const HeaderResponsiveContainer = ({
  children,
  className,
  type = "muattrans",
}) => {
  const backgroundClassnames = {
    muatmuat: "bg-neutral-50",
    muatparts: "bg-muat-parts-non-800",
    muattrans: "bg-muat-trans-primary-400",
  };
  const backgroundClassname = backgroundClassnames[type] || "";
  return (
    <div
      className={`${backgroundClassname} fixed left-0 top-0 z-[1] w-full ${className}`}
    >
      {children}
    </div>
  );
};

export * from "./Default";
export * from "./SearchBar";

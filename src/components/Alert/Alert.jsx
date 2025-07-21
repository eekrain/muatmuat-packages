import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";

const bgVariants = {
  warning: "bg-warning-100",
  secondary: "bg-secondary-100",
};

const iconVariants = {
  warning: "text-secondary-400",
  secondary: "text-warning-900",
};

const icon = {
  warning: "/icons/warning24.svg",
  secondary: "/icons/warning24.svg",
};

const alertSizes = {
  sm: "p-2",
  big: "py-4 px-6",
};

export const Alert = ({
  variant = "warning",
  size = "sm",
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md text-xs font-medium leading-[1.2] text-neutral-900",
        bgVariants[variant],
        alertSizes[size],
        className
      )}
    >
      {typeof icon[variant] === "string" && (
        <div className={cn("size-5", size === "big" && "size-6")}>
          <IconComponent
            src={icon[variant]}
            className={cn(
              "size-5",
              size === "big" && "size-6",
              iconVariants[variant]
            )}
          />
        </div>
      )}

      {typeof children === "string" ? (
        <span className="text-neutral-900">{children}</span>
      ) : (
        children
      )}
    </div>
  );
};

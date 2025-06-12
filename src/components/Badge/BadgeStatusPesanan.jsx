import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";

const badgeVariants = {
  primary: "bg-primary-50 text-primary-700",
  warning: "bg-warning-100 text-[#FF7A00]",
  error: "bg-error-50 text-error-400",
  success: "bg-success-50 text-success-400",
};

export const BadgeStatusPesanan = ({
  variant = "primary",
  className,
  icon = { iconLeft: "" },
  children,
}) => {
  return (
    <div
      className={cn(
        "inline-flex h-6 w-[176px] items-center justify-center gap-1 rounded-[6px] px-2 text-xs font-semibold leading-[1.2]",
        badgeVariants[variant],
        className
      )}
    >
      {typeof icon.iconLeft === "string" && (
        <IconComponent src={icon.iconLeft} width={14} height={14} />
      )}
      <span className="block">{children}</span>
    </div>
  );
};

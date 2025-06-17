import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";

const alertVariants = {
  warning: "bg-warning-100 [&_svg]:text-secondary-400 ",
};

const icon = {
  warning: "/icons/warning24.svg",
};

export const Alert = ({ variant = "warning", className, children }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md p-2",
        alertVariants[variant],
        className
      )}
    >
      {typeof icon[variant] === "string" && (
        <div className="mt-0.5 flex-shrink-0">
          <IconComponent src={icon[variant]} width={20} height={20} />
        </div>
      )}
      <p className="text-[12px] font-medium leading-[13px] text-neutral-900">
        {children}
      </p>
    </div>
  );
};

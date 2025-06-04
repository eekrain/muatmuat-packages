"use client";

import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/cn";
import { useResponsiveRouteParams } from "@/lib/responsive-navigation";

const DEFAULT_FUNCTION = () =>
  alert("Responsive Form Header: No function provided");

export const HeaderResponsiveForm = ({
  onClickBackButton = DEFAULT_FUNCTION,
  title = {
    label: "Form Title",
    className: "",
  },
  withMenu = null,
}) => {
  const params = useResponsiveRouteParams();

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-x-3">
        <button onClick={onClickBackButton}>
          <IconComponent
            className="icon-stroke-muat-trans-primary-400 rounded-xl bg-muat-trans-secondary-900"
            src="/icons/chevron-left24.svg"
            width={24}
            height={24}
          />
        </button>

        <h1
          className={cn(
            "mt-1 text-base font-bold leading-[1]",
            params?.header?.title?.className || title?.className
          )}
        >
          {params?.header?.title?.label || title?.label}
        </h1>
      </div>

      {withMenu && (
        <div className="flex items-center gap-x-2 text-muat-trans-secondary-900">
          <button
            onClick={withMenu?.onClickInfo || DEFAULT_FUNCTION}
            className="flex w-[38px] flex-col items-center gap-[2px]"
          >
            <IconComponent
              src="/icons/info-circle24.svg"
              width={24}
              height={24}
            />
            <span className="text-[10px] font-semibold">Info</span>
          </button>
          <button
            onClick={withMenu?.onClickMenu || DEFAULT_FUNCTION}
            className="flex w-[38px] flex-col items-center gap-[2px]"
          >
            <IconComponent src="/icons/menu-dot.svg" width={24} height={24} />
            <span className="text-[10px] font-semibold">Menu</span>
          </button>
        </div>
      )}
    </div>
  );
};

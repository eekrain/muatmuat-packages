"use client";

import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/cn";
import { useResponsiveRouteParams } from "@/lib/responsive-navigation";

const DEFAULT_FUNCTION = () =>
  alert("Responsive Form Header: No function provided");

export const HeaderResponsiveForm = () => {
  const params = useResponsiveRouteParams();

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-x-3">
        <button onClick={params?.header?.onClickBackButton || DEFAULT_FUNCTION}>
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
            params?.header?.title?.className
          )}
        >
          {params?.header?.title?.label}
        </h1>
      </div>

      {params?.header?.withMenu && (
        <div className="flex items-center gap-x-2 text-muat-trans-secondary-900">
          <button
            onClick={params?.header?.withMenu?.onClickInfo || DEFAULT_FUNCTION}
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
            onClick={params?.header?.withMenu?.onClickMenu || DEFAULT_FUNCTION}
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

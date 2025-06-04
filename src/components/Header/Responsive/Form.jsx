"use client";

import IconComponent from "@/components/IconComponent/IconComponent";
import { useResponsiveRouterStore } from "@/store/responsiveRouter";

export const HeaderResponsiveForm = () => {
  const screenStack = useResponsiveRouterStore((state) => state.screenStack);
  const currentScreen = screenStack[screenStack.length - 1];

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-x-3">
        <button onClick={currentScreen.header.onClickBackButton}>
          <IconComponent
            className="icon-stroke-muat-trans-primary-400 rounded-xl bg-muat-trans-secondary-900"
            src="/icons/chevron-left24.svg"
            width={24}
            height={24}
          />
        </button>

        <h1 className="text-base font-bold leading-[1]">
          {currentScreen?.header?.title?.label}
        </h1>
      </div>

      {currentScreen?.header?.withMenu && (
        <div className="flex items-center gap-x-2 text-muat-trans-secondary-900">
          <button
            onClick={currentScreen.header.withMenu.onClickInfo}
            className="flex w-[38px] flex-col items-center"
          >
            <IconComponent
              src="/icons/info-circle24.svg"
              width={24}
              height={24}
            />
            <span className="text-[10px] font-semibold">Info</span>
          </button>
          <button
            onClick={currentScreen.header.withMenu.onClickMenu}
            className="flex w-[38px] flex-col items-center"
          >
            <IconComponent src="/icons/menu-dot.svg" width={24} height={24} />
            <span className="text-[10px] font-semibold">Menu</span>
          </button>
        </div>
      )}
    </div>
  );
};

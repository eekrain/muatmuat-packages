"use client";

import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  useResponsiveRouter,
  useResponsiveRouterStore,
} from "@/store/responsiveRouter";

export const HeaderResponsiveSearchBar = () => {
  const searchValue = useResponsiveRouterStore((state) => state.searchValue);
  const screenStack = useResponsiveRouterStore((state) => state.screenStack);
  const currentScreen = screenStack[screenStack.length - 1];
  const { setSearchValue } = useResponsiveRouter();

  return (
    <div className="flex w-full items-center gap-x-3">
      <button onClick={currentScreen.header.onClickBackButton}>
        <IconComponent
          className="icon-stroke-muat-trans-primary-400 rounded-xl bg-muat-trans-secondary-900"
          src="/icons/chevron-left24.svg"
          width={24}
          height={24}
        />
      </button>

      <Input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.currentTarget.value)}
        placeholder={currentScreen.header.placeholder}
        className="w-full flex-1 border-none"
      />
    </div>
  );
};

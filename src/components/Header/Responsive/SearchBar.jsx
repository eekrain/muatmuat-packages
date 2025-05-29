"use client";

import { useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import Input from "@/components/Input/Input";
import { useResponsiveLayout } from "@/store/responsiveLayout";

export const HeaderResponsiveSearchBar = () => {
  const [searchValue, setSearchValue] = useState("");

  const searchBarState = useResponsiveLayout((state) => state.searchBar);

  return (
    <div className="flex w-full items-center justify-between self-center">
      <div className="flex items-center gap-x-3">
        <IconComponent
          className="icon-stroke-muat-trans-primary-400 rounded-xl bg-muat-trans-secondary-900"
          src="/icons/chevron-left24.svg"
          width={24}
          height={24}
          onclick={searchBarState.header.onClickBackButton}
        />

        <div className="w-full">
          <Input
            type="text"
            value={searchValue}
            changeEvent={(e) => {
              setSearchValue(e.target.value);
              searchBarState.header.onSearchValueChange(e.target.value);
            }}
            placeholder={searchBarState.header.placeholder}
            className="w-full flex-1 border-none"
          />
        </div>
      </div>
    </div>
  );
};

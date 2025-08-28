"use client";

import { useEffect } from "react";

import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";

import { useResponsiveNavigation } from "@/lib/responsive-navigation";

import { useResponsiveSearchStore } from "@/store/Shipper/zustand/responsiveSearchStore";

import { HeaderButtonBack } from ".";

/**
 * @typedef {Object} HeaderResponsiveSearchBarProps
 * @property {() => void | undefined} onClickBackButton
 * @property {string} placeholder
 */

/**
 * @param {HeaderResponsiveSearchBarProps} props
 * @returns {React.ReactNode}
 */
export const HeaderResponsiveSearchBar = ({
  onClickBackButton,
  placeholder = "Search...",
  withMenu = null,
  onEnterPress,
  shouldResetSearchValue = true,
  isDisabled = false,
}) => {
  const navigation = useResponsiveNavigation();
  const handleBackButton = () => {
    if (onClickBackButton) onClickBackButton();
    else navigation.pop();
  };

  const { searchValue, setSearchValue } = useResponsiveSearchStore();

  // Reset search value when component mounts
  useEffect(() => {
    if (shouldResetSearchValue) {
      setSearchValue("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldResetSearchValue]);

  return (
    <div className="flex w-full items-center justify-between gap-x-4">
      <div className="flex w-full items-center gap-x-2">
        <HeaderButtonBack onClick={handleBackButton} variant="muattrans" />

        <Input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
          placeholder={placeholder}
          className="w-full flex-1"
          appearance={{
            containerClassName: "border-none",
          }}
          icon={{
            left: (
              <IconComponent className="icon-blue" src="/icons/search16.svg" />
            ),
            right: searchValue ? (
              <IconComponent
                src="/icons/silang.svg"
                height={16}
                width={16}
                onClick={() => {
                  setSearchValue("");
                  onEnterPress("");
                }}
              />
            ) : null,
          }}
          onKeyDown={(e) =>
            onEnterPress &&
            e.key === "Enter" &&
            searchValue.length >= 3 &&
            onEnterPress(searchValue)
          }
          disabled={isDisabled}
        />
      </div>
      {withMenu ? (
        <div className="flex items-center">
          {withMenu?.onClickPeriod ? (
            <button
              className="flex flex-col items-center gap-y-0.5"
              onClick={() => withMenu?.onClickPeriod()}
              disabled={isDisabled}
            >
              {withMenu?.periodSelected ? (
                <div className="flex size-[24px] items-center justify-center rounded-full bg-muat-trans-secondary-900">
                  <IconComponent
                    src="/icons/calendar17.svg"
                    width={17}
                    height={17}
                  />
                </div>
              ) : (
                <IconComponent
                  className="icon-fill-muat-trans-secondary-900"
                  src="/icons/calendar24.svg"
                  size="medium"
                />
              )}
              <span className="text-xxs font-semibold leading-none text-muat-trans-secondary-900">
                Periode
              </span>
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

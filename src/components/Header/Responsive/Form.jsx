"use client";

import IconComponent from "@/components/IconComponent/IconComponent";

import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { cn } from "@/lib/utils";

import { HeaderButtonBack } from ".";

const DEFAULT_FUNCTION = () =>
  alert("Responsive Form Header: No function provided");

/**
 * @typedef {Object} HeaderResponsiveFormTitle
 * @property {string} label
 * @property {string} className
 */
/**
 * @typedef {Object} HeaderResponsiveFormWithMenu
 * @property {() => void | undefined} onClickInfo
 * @property {() => void | undefined} onClickMenu
 * @property {() => void | undefined} onClickShare
 */
/**
 * @typedef {Object} HeaderResponsiveFormProps
 * @property {() => void | undefined} onClickBackButton
 * @property {HeaderResponsiveFormTitle} title
 * @property {HeaderResponsiveFormWithMenu} withMenu
 */

/**
 * @param {HeaderResponsiveFormProps} props
 * @returns {React.ReactNode}
 */
export const HeaderResponsiveForm = ({
  onClickBackButton,
  title = {
    label: "Form Title",
    className: "",
  },
  withMenu = null,
  variant = "muattrans",
}) => {
  const navigation = useResponsiveNavigation();

  const handleBackButton = () => {
    if (onClickBackButton) onClickBackButton();
    else navigation.pop();
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="grid grid-cols-[24px_1fr] items-center gap-x-2">
        <HeaderButtonBack onClick={handleBackButton} variant={variant} />

        <h1
          className={cn(
            "mt-0 text-base font-bold leading-[1] text-neutral-900",
            variant === "muatmuat" && "text-white",
            title?.className
          )}
        >
          {title?.label}
        </h1>
      </div>

      {withMenu && (
        <div className="flex items-center gap-x-2 text-muat-trans-secondary-900">
          {withMenu.onClickInfo && (
            <button
              onClick={withMenu.onClickInfo || DEFAULT_FUNCTION}
              className={cn(
                "flex w-[38px] flex-col items-center gap-[2px]",
                variant === "muattrans" && "text-muat-trans-secondary-900",
                variant === "muatmuat" && "text-white"
              )}
            >
              <IconComponent
                src="/icons/info-circle24.svg"
                className="size-6"
              />
              <span className="text-xxs font-semibold">Info</span>
            </button>
          )}
          {withMenu.onClickMenu && (
            <button
              onClick={withMenu.onClickMenu || DEFAULT_FUNCTION}
              className={cn(
                "flex w-[38px] flex-col items-center gap-[2px]",
                variant === "muattrans" && "text-muat-trans-secondary-900",
                variant === "muatmuat" && "text-white"
              )}
            >
              <IconComponent src="/icons/menu-dot.svg" className="size-6" />
              <span className="text-xxs font-semibold">Menu</span>
            </button>
          )}
          {withMenu.onClickShare && (
            <button
              onClick={withMenu.onClickShare || DEFAULT_FUNCTION}
              className="flex w-[38px] flex-col items-center gap-[2px]"
            >
              <IconComponent src="/icons/share16.svg" className="size-6" />
              <span className="text-xxs font-semibold">Bagikan</span>
            </button>
          )}
        </div>
      )}
      {variant === "muatmuat" && (
        <img
          src="/img/header-mobile-meteor.png"
          alt="header-mobile-meteor"
          className="absolute right-0 h-[62px] w-[152px] object-cover"
        />
      )}
    </div>
  );
};

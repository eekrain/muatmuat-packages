"use client";

import IconComponent from "@/components/IconComponent/IconComponent";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { cn } from "@/lib/utils";

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
}) => {
  const navigation = useResponsiveNavigation();

  const handleBackButton = () => {
    if (onClickBackButton) onClickBackButton();
    else navigation.pop();
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-x-3">
        <button onClick={handleBackButton}>
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
              className="flex w-[38px] flex-col items-center gap-[2px]"
            >
              <IconComponent
                src="/icons/info-circle24.svg"
                width={24}
                height={24}
              />
              <span className="text-xxs font-semibold">Info</span>
            </button>
          )}
          {withMenu.onClickMenu && (
            <button
              onClick={withMenu.onClickMenu || DEFAULT_FUNCTION}
              className="flex w-[38px] flex-col items-center gap-[2px]"
            >
              <IconComponent src="/icons/menu-dot.svg" width={24} height={24} />
              <span className="text-xxs font-semibold">Menu</span>
            </button>
          )}
          {withMenu.onClickShare && (
            <button
              onClick={withMenu.onClickShare || DEFAULT_FUNCTION}
              className="flex w-[38px] flex-col items-center gap-[2px]"
            >
              <IconComponent src="/icons/share16.svg" width={24} height={24} />
              <span className="text-xxs font-semibold">Bagikan</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

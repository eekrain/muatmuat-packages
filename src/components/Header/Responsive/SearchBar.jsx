"use client";

import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  useResponsiveNavigation,
  useResponsiveSearch,
} from "@/lib/responsive-navigation";

const DEFAULT_FUNCTION = () =>
  alert("Responsive SearchBar Header: No function provided");

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
}) => {
  const navigation = useResponsiveNavigation();
  const handleBackButton = () => {
    if (onClickBackButton) onClickBackButton();
    else navigation.pop();
  };

  const { searchValue, setSearchValue } = useResponsiveSearch();

  return (
    <div className="flex w-full items-center gap-x-3">
      <button onClick={handleBackButton}>
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
        placeholder={placeholder}
        className="w-full flex-1 border-none"
      />
    </div>
  );
};

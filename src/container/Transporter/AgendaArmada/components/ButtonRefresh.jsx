import React from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

/**
 * A refresh button component with an icon and text.
 *
 * @param {object} props - The component props.
 * @param {function} props.onClick - The function to call when the button is clicked.
 * @param {string} [props.className] - Optional additional class names for styling.
 * @param {React.ReactNode} [props.children] - The text to display on the button. Defaults to "Refresh".
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @returns {JSX.Element} The rendered button component.
 */
const RefreshButton = ({ onClick, className, children, disabled = false }) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-7 items-center justify-center gap-2 rounded-full border border-primary-700 bg-white px-3 py-[7px] text-xxs font-semibold text-primary-700 shadow-sm transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      <IconComponent
        src="/icons/refresh14.svg"
        alt={t("ButtonRefresh.altRefresh", {}, "Refresh")}
        width={14}
        height={14}
      />
      <span>{children || t("ButtonRefresh.buttonRefresh", {}, "Refresh")}</span>
    </button>
  );
};

export default RefreshButton;

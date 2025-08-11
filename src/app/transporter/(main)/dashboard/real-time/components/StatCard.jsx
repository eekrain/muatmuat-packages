import Link from "next/link";
import React from "react";

import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";

const formatUnit = (valueUnit) =>
  valueUnit ? (
    <span className="text-sm font-semibold text-neutral-600">{valueUnit}</span>
  ) : null;

const StatCard = ({
  label,
  value,
  tooltipText,
  icon,
  labelIcon,
  href = "#",
  valueStyle = "text-2xl",
  valueUnit,
  variant = "default", // 'default' | 'soft'
  side = "top",
}) => {
  const isSoft = variant === "soft";

  const containerClass = isSoft
    ? "flex items-center gap-2 rounded-lg border border-neutral-400 hover:border-[#176CF7] bg-white px-6 py-3 cursor-pointer"
    : "flex items-center gap-3 rounded-lg bg-[#F8F8FB] px-3 py-4 cursor-pointer";

  const iconWrapper = isSoft
    ? icon && <IconComponent src={icon} width={40} height={40} />
    : icon && <IconComponent src={icon} />;

  const contentClass = isSoft
    ? "flex min-w-0 flex-1 justify-between"
    : "min-w-0 flex-1";

  const labelRowClass = isSoft
    ? "flex items-center justify-between gap-1"
    : "flex items-center justify-between gap-1";

  const valueRowClass = isSoft
    ? "mt-1 flex items-center gap-1"
    : "mt-1 flex items-baseline gap-1";

  const valueTextClass = `!text-base font-bold text-neutral-900 ${valueStyle}`;

  return (
    <Link href={href} className={containerClass}>
      {iconWrapper}
      <div className={contentClass}>
        <div className={labelRowClass}>
          <h3 className="truncate text-sm font-medium text-neutral-900">
            {label}
          </h3>
          {tooltipText && (
            <InfoTooltip side={side}>
              <p className="w-[336px] text-sm">{tooltipText}</p>
            </InfoTooltip>
          )}
        </div>
        <div className={valueRowClass}>
          {labelIcon && <IconComponent src={labelIcon} />}
          <div className="flex items-baseline gap-1">
            <span className={valueTextClass}>{value}</span>
            {formatUnit(valueUnit)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StatCard;

import { useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";

import useDevice from "@/hooks/use-device";
import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

const RatingInput = ({
  value = 0,
  onChange,
  disabled = false,
  withLabel = true,
}) => {
  const { isMobile } = useDevice();
  const { t } = useTranslation();
  const [hover, setHover] = useState(0);

  // Helper function to get rating text
  const getRatingLabel = (score) => {
    switch (score) {
      case 1:
        return t("labelSangatBuruk");
      case 2:
        return t("labelBuruk");
      case 3:
        return t("labelCukup");
      case 4:
        return t("labelBaik");
      case 5:
        return t("labelSangatBaik");
      default:
        return "";
    }
  };

  return (
    <div className="flex items-center gap-4 md:gap-1">
      <div className="flex [&>*+*]:pl-1">
        {[1, 2, 3, 4, 5].map((item) => (
          <button
            disabled={disabled}
            key={item}
            onClick={() => onChange && onChange(item)}
            onMouseEnter={() => setHover(item)}
            onMouseLeave={() => setHover(0)}
          >
            <IconComponent
              className={cn(
                "transition-all duration-200",
                (hover || value) >= item
                  ? "text-secondary-700"
                  : isMobile
                    ? "text-neutral-700"
                    : "text-neutral-400"
              )}
              src={
                isMobile && (hover || value) < item
                  ? "/icons/bintang-outline24.svg"
                  : "/icons/bintang-solid24.svg"
              }
              size="medium"
            />
          </button>
        ))}
      </div>
      {withLabel && value > 0 ? (
        <span className="text-xs font-semibold leading-[14.4px] text-neutral-900">
          {getRatingLabel(value)}
        </span>
      ) : null}
    </div>
  );
};

export default RatingInput;

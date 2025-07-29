import { useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";

const RatingInput = ({
  value = 0,
  onChange,
  disabled = false,
  withLabel = true,
}) => {
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
    <div className="flex items-center [&>*+*]:pl-1">
      {[1, 2, 3, 4, 5].map((item, key) => (
        <button
          disabled={disabled}
          key={key}
          onClick={() => onChange && onChange(item)}
          onMouseEnter={() => setHover(item)}
          onMouseLeave={() => setHover(0)}
        >
          <IconComponent
            className={`transition-colors duration-200 ${(hover || value) >= item ? "icon-fill-secondary-700" : "icon-fill-neutral-400"}`}
            src="/icons/bintang-solid24.svg"
            size="medium"
          />
        </button>
      ))}
      {withLabel && value > 0 ? (
        <span className="text-xs font-semibold leading-[14.4px] text-neutral-900">
          {getRatingLabel(value)}
        </span>
      ) : null}
    </div>
  );
};

export default RatingInput;

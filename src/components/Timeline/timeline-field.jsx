import { cn } from "@/lib/utils";

import { TimelineContainer, TimelineContentAddress, TimelineItem } from ".";
import IconComponent from "../IconComponent/IconComponent";

/**
 * @typedef {Object} TimelineFieldProps
 * @property {"muat" | "bongkar"} variant
 * @property {{name: string, value: string}[]} values
 * @property {number} maxLocation
 * @property {Function} onAddLocation
 * @property {Function} onDeleteLocation
 */
/**
 * @param {TimelineFieldProps} props
 */
export const TimelineField = ({
  variant,
  values,
  maxLocation = 5,
  onAddLocation,
  onDeleteLocation,
  onEditLocation,
  labelAddLocation = "Tambah Lokasi",
  className,
  errorMessage,
  disabled = false,
  withRemoveButton = true,
}) => {
  const getVariant = () => {
    const selected = {};

    if (values.length > 1) {
      if (variant === "bongkar") selected.variant = "field-bongkar";
      else selected.variant = "field-muat";
    } else {
      selected.variant = "bullet";
    }

    if (variant === "muat") selected.activeIndex = 0;
    else selected.activeIndex = -1;

    return selected;
  };

  const atLeastOneLocation = values.some((item) => item?.name);

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "rounded-[6px] border border-[#7B7B7B] p-3 md:rounded-md",
          errorMessage && "border-error-400",
          className,
          disabled && "cursor-not-allowed bg-neutral-200"
        )}
      >
        <TimelineContainer>
          {values.map((item, index) => (
            <TimelineItem
              key={index}
              variant={getVariant().variant}
              totalLength={values.length}
              index={index}
              activeIndex={getVariant().activeIndex}
            >
              <div>
                <div className="flex min-w-0 items-center">
                  <TimelineContentAddress
                    title={
                      item?.name ||
                      (variant === "muat"
                        ? "Masukkan Lokasi Muat"
                        : "Masukkan Lokasi Bongkar")
                    }
                    className={cn(
                      "mt-0.5 cursor-pointer pb-0",
                      !item?.name && "text-neutral-600",
                      disabled && "cursor-not-allowed"
                    )}
                    onClick={() => !disabled && onEditLocation(index)}
                  />

                  {atLeastOneLocation && withRemoveButton && (
                    <button
                      className="flex flex-shrink-0 items-center pl-2"
                      onClick={() => onDeleteLocation(index)}
                    >
                      <IconComponent
                        src="/icons/min-square24.svg"
                        size="medium"
                      />
                    </button>
                  )}
                </div>
                {values.length > 1 && (
                  <hr className="my-3 block border-[#C4C4C4]" />
                )}
              </div>
            </TimelineItem>
          ))}
        </TimelineContainer>
        {values.length === 1 && <hr className="my-3 block border-[#C4C4C4]" />}
        {values.length < maxLocation && (
          <div className="flex justify-center">
            <button
              className={cn(
                "flex items-center gap-2 text-sm font-semibold leading-[1.2] text-[#176CF7] md:text-xs",
                disabled && "cursor-not-allowed"
              )}
              onClick={onAddLocation}
              disabled={disabled}
            >
              <IconComponent
                width={20}
                height={20}
                src="/icons/plus-square24.svg"
                className="-mt-[2px] text-[#176CF7]"
                size="medium"
              />
              <span className="capsize">
                {labelAddLocation}
                <span className="capitalize md:hidden">&nbsp;{variant}</span>
              </span>
            </button>
          </div>
        )}
      </div>

      {errorMessage && (
        <span className="text-xs font-medium text-error-400">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

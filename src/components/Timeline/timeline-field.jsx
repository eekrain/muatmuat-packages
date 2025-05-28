import { useEffect, useState } from "react";

import { TimelineContainer, TimelineContentAddress, TimelineItem } from ".";
import IconComponent from "../IconComponent/IconComponent";

/**
 * @typedef {Object} TimelineFieldProps
 * @property {"muat" | "bongkar"} variant
 * @property {string[]} values
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
}) => {
  const [internalValues, setInternalValues] = useState(
    values.length > 0 ? values : [null]
  );

  useEffect(() => {
    setInternalValues(values);
  }, [values]);

  useEffect(() => {
    if (internalValues.length === 0) {
      setInternalValues([null]);
    }
  }, [internalValues]);

  const getVariant = () => {
    const selected = {};

    if (internalValues.length > 1) {
      if (variant === "bongkar") selected.variant = "field-bongkar";
      else selected.variant = "field-muat";
    } else {
      selected.variant = "bullet";
    }

    if (variant === "muat") selected.activeIndex = 0;
    else selected.activeIndex = -1;

    return selected;
  };

  return (
    <div className="rounded-xl border border-[#7B7B7B] p-3">
      <TimelineContainer>
        {internalValues.map((value, index) => (
          <TimelineItem
            key={value}
            variant={getVariant().variant}
            totalLength={internalValues.length}
            index={index}
            activeIndex={getVariant().activeIndex}
          >
            <div>
              <div className="flex min-w-0 items-center">
                <TimelineContentAddress
                  title={
                    value ||
                    (variant === "muat"
                      ? "Masukkan Lokasi Muat"
                      : "Masukkan Lokasi Bongkar")
                  }
                  className="min-w-0 flex-shrink p-0 font-medium"
                />

                <button
                  className="flex flex-shrink-0 items-center pl-2"
                  onClick={() => onDeleteLocation(index)}
                >
                  <IconComponent src="/icons/min-square24.svg" size="medium" />
                </button>
              </div>
              {internalValues.length > 1 && (
                <hr className="my-3 block border-[#C4C4C4]" />
              )}
            </div>
          </TimelineItem>
        ))}
      </TimelineContainer>
      {internalValues.length === 1 && (
        <hr className="my-3 block border-[#C4C4C4]" />
      )}
      {internalValues.length < maxLocation && (
        <div className="flex justify-center">
          <button
            className="flex items-center gap-2 text-sm font-semibold text-[#176CF7]"
            onClick={onAddLocation}
          >
            <IconComponent
              width={20}
              height={20}
              src="/icons/plus-square24.svg"
              classname="-mt-[2px] text-[#176CF7]"
              size="medium"
            />
            <span>Tambah Lokasi</span>
          </button>
        </div>
      )}
    </div>
  );
};

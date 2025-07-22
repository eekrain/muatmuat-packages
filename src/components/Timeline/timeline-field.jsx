import { createContext, useContext } from "react";

import { cn } from "@/lib/utils";

import { TimelineContainer, TimelineContentAddress, TimelineItem } from ".";
import IconComponent from "../IconComponent/IconComponent";

// Context for TimelineField
const TimelineFieldContext = createContext();

function useTimelineField() {
  const context = useContext(TimelineFieldContext);
  if (!context) {
    throw new Error(
      "TimelineField compound components must be used within <TimelineField>"
    );
  }
  return context;
}

/**
 * Compound TimelineField
 */
const Root = ({
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
  children,
}) => {
  // Provide all props via context for subcomponents
  const contextValue = {
    variant,
    values,
    maxLocation,
    onAddLocation,
    onDeleteLocation,
    onEditLocation,
    labelAddLocation,
    className,
    errorMessage,
    disabled,
  };

  return (
    <TimelineFieldContext.Provider value={contextValue}>
      <div className="flex flex-col gap-2">
        <div
          className={cn(
            "rounded-[6px] border border-[#7B7B7B] p-3 md:rounded-md",
            errorMessage && "border-error-400",
            className,
            disabled && "cursor-not-allowed bg-neutral-200"
          )}
        >
          <TimelineContainer>{children}</TimelineContainer>
        </div>
        {errorMessage && (
          <span className="text-xs font-medium text-error-400">
            {errorMessage}
          </span>
        )}
      </div>
    </TimelineFieldContext.Provider>
  );
};

const Item = ({ index, children }) => {
  const {
    variant,
    values,
    onDeleteLocation,
    onEditLocation,
    disabled,
    maxLocation,
  } = useTimelineField();

  const item = values[index];

  // Variant logic
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

  return (
    <TimelineItem
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
              "min-h-4 cursor-pointer pb-0",
              !item?.name && "text-neutral-600"
            )}
            onClick={() => !disabled && onEditLocation(index)}
          />
          {children}
        </div>
        {values.length !== 1 &&
        (index !== values.length - 1 || values.length < maxLocation) ? (
          <hr className="my-3 block border-[#C4C4C4]" />
        ) : null}
      </div>
    </TimelineItem>
  );
};

const AddButton = () => {
  const {
    values,
    maxLocation,
    onAddLocation,
    labelAddLocation,
    variant,
    disabled,
  } = useTimelineField();
  if (values.length >= maxLocation) return null;
  return (
    <>
      {values.length === 1 && <hr className="my-3 block border-[#C4C4C4]" />}
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
    </>
  );
};

const RemoveButton = ({ onClick }) => {
  const { onDeleteLocation } = useTimelineField();
  return (
    <button className="size-4" onClick={onClick || onDeleteLocation}>
      <IconComponent
        src="/icons/min-square24.svg"
        className="size-4"
        size="medium"
      />
    </button>
  );
};

const TimelineField = {
  Root,
  Item,
  AddButton,
  RemoveButton,
};
export default TimelineField;

// Usage example (for docs):
// <TimelineField.Root ...props>
//   {values.map((_, i) => <TimelineField.Item index={i} key={i}>
//     <TimelineField.RemoveButton />
//   </TimelineField.Item>)}
//   <TimelineField.AddButton />
// </TimelineField.Root>

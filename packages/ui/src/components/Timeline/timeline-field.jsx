import { createContext, useContext } from "react";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

import { NewTimelineItem, TimelineContainer } from ".";
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
  onEditLocation,
  labelAddLocation,
  className,
  errorMessage,
  disabled = false,
  children,
}) => {
  const { t } = useTranslation();
  // Provide all props via context for subcomponents
  const contextValue = {
    variant,
    values,
    maxLocation,
    onAddLocation,
    onEditLocation,
    labelAddLocation:
      labelAddLocation || t("TimelineField.addLocation", {}, "Tambah Lokasi"),
    className,
    errorMessage,
    disabled,
  };

  return (
    <TimelineFieldContext.Provider value={contextValue}>
      <div className="flex flex-col gap-2">
        <div
          className={cn(
            "rounded-[6px] border border-[#7B7B7B] px-3 py-2 md:rounded-md md:py-3",
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

const Item = ({ buttonRemove, index, className }) => {
  const { variant, values, onEditLocation, disabled, maxLocation } =
    useTimelineField();
  const { t } = useTranslation();

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
    <>
      <NewTimelineItem
        variant={getVariant().variant}
        totalLength={values.length}
        index={index}
        activeIndex={getVariant().activeIndex}
        title={
          item?.name ||
          (variant === "muat"
            ? t("TimelineField.loadingLocation", {}, "Masukkan Lokasi Muat")
            : t(
                "TimelineField.unloadingLocation",
                {},
                "Masukkan Lokasi Bongkar"
              ))
        }
        isLast={index === values.length - 1}
        buttonRemove={buttonRemove}
        onClick={() => {
          if (!disabled && onEditLocation) onEditLocation(index);
        }}
        className="pb-0 md:pb-0"
        appearance={{
          titleClassname: cn(
            "line-clamp-1 text-xs",
            !item?.name && "text-neutral-600",
            className
          ),
        }}
        withDivider={index !== values.length - 1}
      />
    </>
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
            className="text-[#176CF7]"
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
  return (
    <button className="size-4" onClick={onClick}>
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

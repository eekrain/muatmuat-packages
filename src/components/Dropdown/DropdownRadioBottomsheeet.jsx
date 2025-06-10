import { useEffect, useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import RadioButton from "@/components/Radio/RadioButton";
import usePrevious from "@/hooks/use-previous";
import { cn } from "@/lib/utils";

const DropdownRadioBottomsheeet = ({
  className,
  title,
  options = [],
  value,
  onChange = () => {},
}) => {
  const [tempValue, setTempValue] = useState("");
  const [isBottomsheetOpen, setIsBottomsheetOpen] = useState(false);
  const previousIsBottomsheetOpen = usePrevious(isBottomsheetOpen);

  useEffect(() => {
    if (isBottomsheetOpen && !previousIsBottomsheetOpen) {
      setTempValue(value);
    }
  }, [isBottomsheetOpen, previousIsBottomsheetOpen, value]);

  const handleSelectOption = () => {
    onChange(tempValue);
    setIsBottomsheetOpen(false);
  };

  const selectedItem = options.find((item) => item.value === value);

  return (
    <BottomSheet open={isBottomsheetOpen} onOpenChange={setIsBottomsheetOpen}>
      <button
        className={cn(
          "flex h-8 items-center justify-between rounded-md border border-neutral-600 bg-neutral-50 px-2",
          className
        )}
        onClick={() => setIsBottomsheetOpen(true)}
      >
        <span className="text-[14px] font-semibold leading-[15.4px] text-neutral-900">
          {selectedItem?.label ?? ""}
        </span>
        <IconComponent src="/icons/chevron-down.svg" />
      </button>
      <BottomSheetContent>
        <BottomSheetHeader>{title}</BottomSheetHeader>
        <div className="flex flex-col gap-y-4 px-4 py-6">
          {options.map((option, key) => {
            const isLastItem = options.length - 1 === key;
            return (
              <div
                className={`${isLastItem ? "" : "border-b border-b-neutral-400 pb-4"} flex justify-between`}
                key={key}
              >
                <span className="text-[14px] font-semibold leading-[15.4px] text-neutral-900">
                  {option.label}
                </span>
                <RadioButton
                  name={title}
                  value={option.value}
                  checked={tempValue === option.value}
                  onClick={(data) => setTempValue(data.value)}
                />
              </div>
            );
          })}
          <Button
            className="h-10 max-w-full"
            variant="muatparts-primary"
            onClick={handleSelectOption}
          >
            Terapkan
          </Button>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default DropdownRadioBottomsheeet;

import { useState } from "react";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/Bottomsheet/BottomSheet";
import Button from "@/components/Button/Button";
import DatePickerResponsive from "@/components/DatePicker/DatePickerResponsive";
import RadioButton from "@/components/Radio/RadioButton";
import { useTranslation } from "@/hooks/use-translation";

const PeriodDropdown = ({ isOpen, setIsOpen, options, onChange }) => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [error, setError] = useState({});

  // Handle apply button click
  const handleApplyPeriodFilter = () => {
    // Check if dates are provided when custom period is selected
    if (tempValue === "custom" && !startDate) {
      setError({ startDate: "Periode awal harus diisi" });
      return; // Exit the function early
    }
    if (tempValue === "custom" && startDate && !endDate) {
      setError({ endDate: "Periode akhir harus diisi" });
      return; // Exit the function early
    }

    // Create final result object with selected period data
    const periodData = {
      value: tempValue,
      startDate,
      endDate,
    };

    // Call onApply callback with the data
    if (onChange) {
      onChange(periodData);
    }

    // Close the bottom sheet
    setIsOpen(false);
  };

  // Calculate the min date for end date (start date + 1 day)
  const getMinEndDate = () => {
    if (!startDate) return "";

    const nextDay = new Date(startDate);
    nextDay.setDate(nextDay.getDate());
    return nextDay.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  // Calculate the max date for start date (end date - 1 day)
  const getMaxStartDate = () => {
    if (!endDate) return "";

    const previousDay = new Date(endDate);
    previousDay.setDate(previousDay.getDate());
    return previousDay.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  return (
    <BottomSheet open={isOpen} onOpenChange={setIsOpen}>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>Pilih Periode</BottomSheetTitle>
        </BottomSheetHeader>
        <div className="flex h-[380px] flex-col gap-y-4 overflow-y-auto px-4">
          {options.map((item, key) => (
            <div
              className="flex w-full items-center justify-between border-b border-b-neutral-400 pb-4"
              key={key}
            >
              <span className="text-sm font-semibold leading-[1.1] text-neutral-900">
                {item.name}
              </span>
              <RadioButton
                name={item.name}
                value={item.value}
                checked={tempValue === item.value}
                onClick={({ value }) => setTempValue(value)}
              />
            </div>
          ))}
          <div className="flex w-full items-center justify-between">
            <span className="text-sm font-semibold leading-[1.1] text-neutral-900">
              Pilih Periode
            </span>
            <RadioButton
              name="custom"
              value="custom"
              checked={tempValue === "custom"}
              onClick={({ value }) => setTempValue(value)}
            />
          </div>
          <div className="flex flex-col gap-y-3">
            <div className="flex items-center gap-x-3">
              <DatePickerResponsive
                value={startDate}
                onChange={setStartDate}
                placeholder="Periode Awal"
                disabled={tempValue !== "custom"}
                appearance={{
                  inputClassName: "left-0",
                }}
                max={getMaxStartDate()}
              />
              <span className="min-w-[18px] text-xs font-semibold leading-[1.1] text-[#676767]">
                {t("labelTo")}
              </span>
              <DatePickerResponsive
                value={endDate}
                onChange={setEndDate}
                placeholder="Periode Akhir"
                disabled={tempValue !== "custom" || !startDate}
                appearance={{
                  inputClassName: "-left-[80px]",
                }}
                min={getMinEndDate()}
              />
            </div>
            {error?.startDate || error?.endDate ? (
              <div className="flex justify-between gap-x-2">
                <div className="flex-1 text-xs font-medium leading-[1.1] text-error-400">
                  {error?.startDate}
                </div>
                <div className="min-w-[18px]" />
                <div className="flex-1 text-xs font-medium leading-[1.1] text-error-400">
                  {error?.endDate}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <BottomSheetFooter>
          <Button
            className="h-10 w-full"
            variant="muatparts-primary"
            onClick={handleApplyPeriodFilter}
          >
            Terapkan
          </Button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default PeriodDropdown;

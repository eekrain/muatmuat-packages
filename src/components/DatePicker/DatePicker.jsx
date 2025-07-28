import { useEffect, useRef, useState } from "react";

import { format } from "date-fns";
import { id } from "date-fns/locale/id";
import DatePickerLib, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { cn } from "@/lib/utils";

import ImageComponent from "../ImageComponent/ImageComponent";

// Helper function to ensure we're working with a proper Date object
const ensureDate = (dateValue) => {
  if (!dateValue) return null;
  if (dateValue instanceof Date && !isNaN(dateValue)) {
    return dateValue;
  }
  try {
    const newDate = new Date(dateValue);
    if (!isNaN(newDate.getTime())) {
      return newDate;
    }
  } catch (e) {
    console.error("Error parsing date:", e);
  }
  return null;
};

const DatePicker = ({
  value = null,
  onChange = () => {},
  minDate,
  maxDate,
  placeholder = "Tanggal",
  className = "",
  disabled = false,
  errorMessage = null,
}) => {
  const initialDate = ensureDate(value);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({});
  const pickerRef = useRef(null);

  registerLocale("id", id);

  useEffect(() => {
    const dateObj = ensureDate(value);
    setSelectedDate(dateObj);
  }, [value]);

  // Click outside detection
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update positioning when picker opens
  useEffect(() => {
    if (isPickerOpen && pickerRef.current) {
      const pickerRect = pickerRef.current.getBoundingClientRect();
      let position = {};
      position.top = "100%";
      position.marginTop = "8px";
      // Basic left/right positioning
      if (pickerRect.left + 360 > window.innerWidth) {
        position.right = 0;
      } else {
        position.left = 0;
      }
      setDropdownPosition(position);
    }
  }, [isPickerOpen]);

  // Custom calendar header component
  const CustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => (
    <div className="flex items-center justify-between px-2 py-2">
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="rounded-full p-1 hover:bg-gray-100 disabled:opacity-50"
        type="button"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div className="text-base font-medium">
        {format(date, "MMMM yyyy", { locale: id })}
      </div>
      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="rounded-full p-1 hover:bg-gray-100 disabled:opacity-50"
        type="button"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onChange(date);
    setIsPickerOpen(false);
  };

  return (
    // MODIFIED: Root element now handles vertical layout for error message
    <div className={cn("flex w-full flex-col gap-y-1", className)}>
      <div className="relative" ref={pickerRef}>
        <div
          onClick={() => !disabled && setIsPickerOpen(!isPickerOpen)}
          className={cn(
            "flex h-8 w-full items-center gap-x-2 rounded-md border border-neutral-600 px-3 transition-colors",
            // MODIFIED: Border color is now based on `errorMessage` prop
            errorMessage ? "border-error-400" : "hover:border-primary-700",
            disabled
              ? "cursor-not-allowed bg-neutral-200 hover:border-neutral-600"
              : "cursor-pointer"
          )}
        >
          <ImageComponent src="/icons/calendar16.svg" width={16} height={16} />
          <span
            className={`flex-1 text-xs font-medium leading-[14.4px] ${
              selectedDate ? "text-neutral-900" : "text-neutral-600"
            }`}
          >
            {selectedDate ? format(selectedDate, "dd MMM yyyy") : placeholder}
          </span>
        </div>
        {isPickerOpen && (
          <div
            className="absolute z-10 w-fit max-w-[calc(100dvw-32px)] rounded-lg border border-[#E5E7F0] bg-white shadow-lg"
            style={dropdownPosition}
          >
            <div className="flex max-w-[100%] overflow-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <DatePickerLib
                selected={selectedDate}
                onChange={handleDateChange}
                inline
                dateFormat="dd MMM yyyy"
                minDate={ensureDate(minDate)}
                maxDate={ensureDate(maxDate)}
                renderCustomHeader={CustomHeader}
                calendarClassName="!border-0"
                dayClassName={() =>
                  "rounded-lg text-center !w-[40px] !h-8 !leading-8"
                }
                weekDayClassName={() =>
                  "text-center !w-[40px] !h-8 !leading-8 font-medium"
                }
                monthClassName={() => "!mt-0"}
                renderDayContents={(day) => (
                  <div className="pickerDayContent rounded">{day}</div>
                )}
                locale="id"
              />
            </div>
          </div>
        )}
      </div>
      {/* MODIFIED: Added this block to display the error message */}
      {errorMessage && (
        <span className="text-xs font-medium text-error-400">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default DatePicker;

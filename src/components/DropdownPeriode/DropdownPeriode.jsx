import { useEffect, useRef, useState } from "react";

import { Plus } from "lucide-react";
import "react-calendar/dist/Calendar.css";

import IconComponent from "@/components/IconComponent/IconComponent";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

import ModalPilihPeriode from "./ModalPilihPeriode";

// Helper function to convert various date formats to YYYY-MM-DD
const formatToISODate = (dateStr) => {
  if (!dateStr) return "";

  // Handle DD Mon YYYY format (e.g., "04 Agu 2025")
  const monthMap = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    Mei: "05",
    Jun: "06",
    Jul: "07",
    Agu: "08",
    Sep: "09",
    Okt: "10",
    Nov: "11",
    Des: "12",
  };

  const spaceParts = dateStr.split(" ");
  if (spaceParts.length === 3) {
    const day = spaceParts[0];
    const month = spaceParts[1];
    const year = spaceParts[2];

    // Check if it's DD Mon YYYY format
    if (monthMap[month] && day.length <= 2 && year.length === 4) {
      const paddedDay = day.padStart(2, "0");
      const paddedMonth = monthMap[month];
      return `${year}-${paddedMonth}-${paddedDay}`;
    }
  }

  // Handle DD-MM-YYYY format
  const dashParts = dateStr.split("-");
  if (dashParts.length === 3) {
    return `${dashParts[2]}-${dashParts[1]}-${dashParts[0]}`;
  }

  // Handle DD/MM/YYYY format
  const slashParts = dateStr.split("/");
  if (slashParts.length === 3) {
    return `${slashParts[2]}-${slashParts[1]}-${slashParts[0]}`;
  }

  // If already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  return dateStr; // Return as is if unrecognized
};

const DropdownPeriode = ({
  options = [],
  recentSelections = [],
  onSelect,
  disable = false,
  value = null, // New prop to control the component externally
  width = "w-[202px]",
  buttonVariant = "muattrans-primary",
}) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(
    options[0] || { name: "Select an option", value: "" }
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isPeriode, setIsPeriode] = useState(false);
  const [validate, setValidate] = useState({
    start_date: false,
    end_date: false,
  });
  const [inputDateCustom, setInputDateCustom] = useState({
    status: null,
    start_date: "",
    end_date: "",
  });
  const dropdownRef = useRef(null);

  // Initial setup of selected option
  useEffect(() => {
    setSelected(options[0]);
  }, [options]);

  // Effect to handle external value changes
  useEffect(() => {
    if (value !== null) {
      // If value is explicitly provided, update the selected state
      if (typeof value === "string") {
        // Find the option with matching value
        const matchingOption = options.find((opt) => opt.value === value);
        if (matchingOption) {
          setSelected(matchingOption);
        } else if (value === "") {
          // Handle the default/empty case
          setSelected(options[0] || { name: "Select an option", value: "" });
        }
      } else if (typeof value === "object") {
        // If value is an object (like a custom date range), set it directly
        setSelected(value);
      }
    }
  }, [value, options]);

  const handleSelect = (option, range) => {
    if (range) {
      // Format dates to YYYY-MM-DD before sending to parent
      const formattedOption = {
        ...option,
        start_date: option?.start_date ?? inputDateCustom?.start_date,
        end_date: option?.end_date ?? inputDateCustom.end_date,
        // Convert to ISO format YYYY-MM-DD before passing to parent
        iso_start_date: formatToISODate(
          option?.start_date ?? inputDateCustom?.start_date
        ),
        iso_end_date: formatToISODate(
          option?.end_date ?? inputDateCustom.end_date
        ),
        range: true,
      };

      setSelected(formattedOption);
      setIsOpen(false);
      if (onSelect) onSelect(formattedOption); // Callback for parent with ISO dates included
    } else {
      setSelected(option);
      setIsOpen(false);
      if (onSelect) onSelect(option); // Callback for parent
    }
  };

  const resetValue = () => {
    setInputDateCustom({
      status: null,
      start_date: "",
      end_date: "",
    });
    setValidate({
      start_date: false,
      end_date: false,
    });
  };

  // Reset values when modal is opened
  useEffect(() => {
    if (isPeriode) {
      resetValue();
    }
  }, [isPeriode]);

  // Add outside click handler in a separate useEffect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative text-neutral-900", width)} ref={dropdownRef}>
      <button
        disabled={disable}
        className={cn(
          "flex h-8 w-full items-center justify-between gap-x-2 rounded-md border px-3",
          !disable
            ? "bg-neutral-50 text-neutral-900"
            : "cursor-not-allowed bg-neutral-200 text-neutral-600",
          isOpen && !isPeriode ? "border-primary-700" : "border-neutral-600",
          "hover:border-primary-700"
        )}
        onClick={() => (!disable ? setIsOpen(!isOpen) : "")}
      >
        <span className="medium-xs truncate">
          {selected.name.replace("(Default)", "")}
        </span>
        <div className="size-4">
          <IconComponent
            className={cn(
              "transition-transform duration-200 ease-in-out",
              isOpen && "rotate-180"
            )}
            src="/icons/chevron-down.svg"
          />
        </div>
      </button>

      {isOpen && !isPeriode && (
        <ul className="absolute z-20 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg">
          {options.map((option) => (
            <li
              key={option.value}
              className={`cursor-pointer bg-neutral-50 px-[10px] py-2 hover:bg-neutral-200 ${selected?.value === option?.value ? "semi-xs" : "medium-xs"}`}
              onClick={() => handleSelect(option)}
            >
              <div className="flex w-full items-center justify-between">
                <span className="line-clamp-1">{option.name}</span>
                {selected?.value === option?.value && (
                  <IconComponent
                    className="icon-stroke-primary-700"
                    src="/icons/check16.svg"
                  />
                )}
              </div>
            </li>
          ))}
          <hr className="border-neutral-400" />
          <li
            className="cursor-pointer px-[10px] py-2 font-medium"
            onClick={() => setIsPeriode(true)}
          >
            <div className="flex w-full gap-2">
              <Plus width={15} height={15} className="text-primary-700" />
              <span className="medium-xs">
                {t("AppMuatpartsAnalisaProdukPilihPeriode")}
              </span>
            </div>
          </li>
          {recentSelections.length > 0 && (
            <>
              {/* <hr className="border-gray-200" /> */}
              <li className="medium-xs px-[10px] py-2 text-neutral-600">
                Terakhir Dicari
              </li>
              {recentSelections.map((option) => (
                <li
                  key={option.value}
                  className={`cursor-pointer px-[10px] py-2 hover:text-primary-700 ${selected?.value === option?.value ? "semi-xs" : "medium-xs"}`}
                  onClick={() => handleSelect(option, true)}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="line-clamp-1">{option.name}</span>
                    {selected?.value === option?.value && (
                      <IconComponent
                        className="icon-stroke-primary-700"
                        src="/icons/check16.svg"
                      />
                    )}
                  </div>
                </li>
              ))}
            </>
          )}
        </ul>
      )}

      <ModalPilihPeriode
        open={isPeriode}
        onOpenChange={setIsPeriode}
        inputDateCustom={inputDateCustom}
        setInputDateCustom={setInputDateCustom}
        validate={validate}
        setValidate={setValidate}
        onApply={(opt) => handleSelect(opt, true)}
        buttonVariant={buttonVariant}
        t={t}
        formatToISODate={formatToISODate}
      />
    </div>
  );
};

export default DropdownPeriode;

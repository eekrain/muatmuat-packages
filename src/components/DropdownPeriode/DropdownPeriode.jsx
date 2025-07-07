import { useEffect, useRef, useState } from "react";

import { Plus } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import Input from "@/components/Input/Input";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { formatDateInput } from "@/lib/utils/dateFormat";

// Helper function to convert DD-MM-YYYY to YYYY-MM-DD
const formatToISODate = (dateStr) => {
  if (!dateStr) return "";

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

  return dateStr; // Return as is if already in correct format or unrecognized
};

const DropdownPeriode = ({
  options = [],
  recentSelections = [],
  onSelect,
  disable = false,
  value = null, // New prop to control the component externally
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
    status: "",
    start_date: "",
    end_date: "",
  });
  const dropdownRef = useRef(null);

  // Initial setup of selected option
  useEffect(() => {
    setSelected(options[0]);
  }, [JSON.stringify(options)]);

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
      status: "",
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
    <div className={"relative w-[202px] text-neutral-900"} ref={dropdownRef}>
      <button
        disabled={disable}
        className={cn(
          "flex h-8 w-full items-center justify-between gap-x-2 rounded-lg border px-3 py-2",
          !disable
            ? "bg-neutral-50 text-neutral-900"
            : "cursor-not-allowed bg-neutral-200 text-neutral-600",
          isOpen ? "border-primary-700" : "border-neutral-600",
          "hover:border-primary-700"
        )}
        onClick={() => (!disable ? setIsOpen(!isOpen) : "")}
      >
        <span className="medium-xs truncate">
          {selected.name.replace("(Default)", "")}
        </span>
        <IconComponent
          className={cn(
            "transition-transform duration-200 ease-in-out",
            isOpen && "rotate-180"
          )}
          src="/icons/chevron-down.svg"
        />
      </button>

      {isOpen && (
        <ul className="absolute z-20 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg">
          {options.map((option) => (
            <li
              key={option.value}
              className={`cursor-pointer px-[10px] py-2 hover:text-primary-700 ${selected?.value === option?.value ? "semi-xs" : "medium-xs"}`}
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
              <hr className="border-gray-200" />
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

      <Modal open={isPeriode} onOpenChange={setIsPeriode} closeOnOutsideClick>
        <ModalContent className="w-modal-small">
          <ModalHeader size="small" />
          <div className="flex flex-col items-center gap-6 px-4 py-7">
            <h3 className="bold-base text-center">
              {t("AppMuatpartsAnalisaProdukPilihPeriode")}
            </h3>

            <div className="relative flex items-center gap-2">
              <Input
                value={inputDateCustom?.start_date}
                onFocus={() =>
                  setInputDateCustom((a) => ({ ...a, status: "start_date" }))
                }
                onChange={() => {}}
                classInput={"w-full"}
                status={validate?.start_date && "error"}
                className={"!w-[136px] max-w-none"}
                placeholder={t("AppMuatpartsAnalisaProdukPeriodeAwal")}
                icon={{
                  right: <IconComponent src={"/icons/calendar16.svg"} />,
                }}
                supportiveText={{
                  title: validate?.start_date && "Periode awal harus diisi",
                  desc: "",
                }}
              />
              <span className="semi-xs text-neutral-600">s/d</span>
              <Input
                value={inputDateCustom?.end_date}
                supportiveText={{
                  title: validate?.end_date && "Periode akhir harus diisi",
                  desc: "",
                }}
                status={validate?.end_date && "error"}
                onFocus={() =>
                  setInputDateCustom((a) => ({ ...a, status: "end_date" }))
                }
                onChange={() => {}}
                classInput={"w-full"}
                className={"!w-[136px] max-w-none"}
                placeholder={t("AppMuatpartsAnalisaProdukPeriodeAkhir")}
                icon={{
                  right: <IconComponent src={"/icons/calendar16.svg"} />,
                }}
              />
              {inputDateCustom?.status && (
                <Calendar
                  className={"absolute top-2 rounded-md"}
                  onChange={(date) => {
                    setValidate((a) => ({
                      ...a,
                      [inputDateCustom.status]: false,
                    }));
                    setInputDateCustom((a) => ({
                      ...a,
                      [a.status]: formatDateInput(
                        date,
                        ["day", "month", "year"],
                        false
                      ),
                      status: "",
                    }));
                  }}
                />
              )}
            </div>

            <Button
              variant="muatparts-primary"
              className="!h-8 w-[112px]"
              onClick={() => {
                let next = true;
                if (inputDateCustom.start_date == "") {
                  setValidate((a) => ({ ...a, start_date: true }));
                  next = false;
                }
                if (inputDateCustom.end_date == "") {
                  setValidate((a) => ({ ...a, end_date: true }));
                  next = false;
                }
                if (!next) return;

                // Create the option object with both display and ISO formats
                const customOption = {
                  name: `${inputDateCustom.start_date} - ${inputDateCustom.end_date}`,
                  value: `${inputDateCustom.start_date} - ${inputDateCustom.end_date}`,
                  start_date: inputDateCustom.start_date,
                  end_date: inputDateCustom.end_date,
                  // Add ISO formatted dates
                  iso_start_date: formatToISODate(inputDateCustom.start_date),
                  iso_end_date: formatToISODate(inputDateCustom.end_date),
                  range: true,
                };

                handleSelect(customOption, true);
                setIsPeriode(false);
              }}
            >
              {t("AppMuatpartsAnalisaProdukTerapkan")}
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DropdownPeriode;

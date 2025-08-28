import { useMemo, useState } from "react";

import * as Popover from "@radix-ui/react-popover";

import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

export const CustomTransporterSelect = ({
  options = [],
  value,
  onChange,
  placeholder,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((option) =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelection = (clickedValue) => {
    const newValue = value === clickedValue ? null : clickedValue;
    if (onChange) {
      onChange(newValue);
    }
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild disabled={disabled}>
        <button
          className={cn(
            "flex h-8 w-[202px] items-center justify-between rounded-md border border-neutral-600 bg-white px-3 text-left text-xs font-medium text-neutral-900 transition-colors",
            "hover:border-primary-700 focus:border-primary-700 focus:outline-none",
            "disabled:cursor-not-allowed disabled:bg-neutral-200",
            open && "border-primary-700"
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.name : placeholder}
          </span>
          <IconComponent
            src="/icons/chevron-down24.svg"
            className="h-4 w-4 flex-shrink-0 text-neutral-700"
          />
        </button>
      </Popover.Trigger>

      <Popover.Content
        align="start"
        sideOffset={5}
        className="z-50 w-[202px] rounded-md border border-neutral-400 bg-white shadow-[0px_4px_11px_rgba(65,65,65,0.25)]"
      >
        <div className="p-2.5">
          <Input
            placeholder={t(
              "CustomTransporterSelect.placeholderCariTransporter",
              {},
              "Cari Transporter"
            )}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={{ left: "/icons/search.svg" }}
            className="h-8"
            withReset
          />
        </div>

        <div className="max-h-[210px] overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <label
                key={option.value}
                htmlFor={option.value}
                onClick={(e) => {
                  e.preventDefault(); // Prevent default label behavior
                  handleSelection(option.value);
                }}
                className="flex w-full cursor-pointer items-start gap-2 px-2.5 py-2 text-left hover:bg-neutral-200"
              >
                <input
                  type="radio"
                  id={option.value}
                  name="transporter-select"
                  value={option.value}
                  checked={value === option.value}
                  readOnly // Its state is managed by the label click
                  className="peer sr-only"
                />

                <div
                  className={cn(
                    "relative mt-0.5 h-4 w-4 flex-shrink-0 rounded-[4px] border border-neutral-600",
                    "peer-checked:border-primary-700 peer-checked:bg-primary-700",
                    "after:hidden after:content-[''] peer-checked:after:block",
                    "after:absolute after:left-[5px] after:top-[2px] after:h-[8px] after:w-[4px]",
                    "after:rotate-45 after:border-b-2 after:border-r-2 after:border-solid after:border-white"
                  )}
                />

                <div className="flex flex-col">
                  <span className="text-xs font-medium leading-tight text-neutral-900">
                    {option.name}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-medium text-neutral-900">
                    <IconComponent
                      src="/icons/transporter16.svg"
                      className="h-3 w-3 text-muat-trans-secondary-900"
                    />
                    <span>
                      {t(
                        "CustomTransporterSelect.labelUnitTersedia",
                        { count: option.availableUnits },
                        "{count} Unit Tersedia"
                      )}
                    </span>
                  </div>
                </div>
              </label>
            ))
          ) : (
            <div className="flex h-[42px] justify-center pt-3 text-xs font-medium text-neutral-900">
              {t(
                "CustomTransporterSelect.messageDataTidakDitemukan",
                {},
                "Data Tidak Ditemukan"
              )}
            </div>
          )}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};

export default CustomTransporterSelect;

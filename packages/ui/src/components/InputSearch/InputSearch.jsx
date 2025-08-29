"use client";

import { useMemo, useRef } from "react";

import { X } from "lucide-react";

import Input from "@/components/Form/Input";

import { useTranslation } from "@/hooks/use-translation";

const FilterableMenu = ({
  options = [],
  filterText,
  onSelectValue,
  getOptionLabel,
}) => {
  const { t } = useTranslation();

  const filteredOptions = useMemo(
    () =>
      options
        .filter((option) =>
          getOptionLabel(option)
            .toLowerCase()
            .includes(filterText.toLowerCase())
        )
        .slice(0, 50),
    [options, filterText, getOptionLabel]
  );

  return (
    <div className="relative w-full">
      <div
        className={`absolute z-50 mt-1 rounded-md border border-solid border-blue-600 bg-white ${
          filteredOptions.length > 0 ? "max-h-40 overflow-y-scroll" : ""
        } w-full`}
      >
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option, index) => {
            const label = getOptionLabel(option);
            const startIndex = label
              .toLowerCase()
              .indexOf(filterText.toLowerCase());
            const endIndex = startIndex + filterText.length;
            return (
              <div
                key={index}
                className="flex w-full items-start justify-between gap-3"
              >
                <button
                  className="m-2 flex w-full text-start text-xs font-semibold hover:text-primary-700"
                  onClick={() => onSelectValue(option)}
                >
                  <div className="flex-1 shrink gap-2.5 self-stretch">
                    {startIndex !== -1 ? (
                      <>
                        {label.substring(0, startIndex)}
                        <strong>{label.substring(startIndex, endIndex)}</strong>
                        {label.substring(endIndex)}
                      </>
                    ) : (
                      label
                    )}
                  </div>
                </button>
              </div>
            );
          })
        ) : (
          <div className="p-2 text-center text-xs font-semibold">
            {t("labelSearchNotFound")}
          </div>
        )}
      </div>
    </div>
  );
};

export const InputSearch = ({
  options,
  getOptionLabel,
  onSelectValue,
  searchValue,
  setSearchValue,
  hideDropdown = false,
  errorMessage = null,
  ...props
}) => {
  const inputRef = useRef(null);

  return (
    <div className="relative" tabIndex={0}>
      <Input
        {...props}
        ref={inputRef}
        icon={{ left: "/icons/search.svg" }}
        appearance={{
          inputClassName: "pr-4 !text-[#1b1b1b]",
        }}
        value={searchValue}
        onChange={(e) => setSearchValue(e.currentTarget.value)}
        errorMessage={errorMessage}
        hideErrorMessage={true}
      />

      {searchValue && searchValue.length > 0 ? (
        <div
          className="absolute right-2 top-2 cursor-pointer"
          onClick={() => {
            setSearchValue("");
            inputRef.current?.focus();
          }}
        >
          <X size={16} />
        </div>
      ) : null}

      {searchValue &&
      searchValue.length > 0 &&
      options.length > 0 &&
      !hideDropdown ? (
        <div className="relative">
          <FilterableMenu
            options={options}
            filterText={searchValue}
            onSelectValue={onSelectValue}
            getOptionLabel={getOptionLabel}
          />
        </div>
      ) : null}
    </div>
  );
};

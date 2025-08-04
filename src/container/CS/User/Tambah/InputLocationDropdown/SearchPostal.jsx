"use client";

import { useMemo, useRef } from "react";

import { X } from "lucide-react";

import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";

const FilterableMenu = ({
  options = [],
  filterText,
  onSelectValue,
  getOptionLabel,
  setSearchValue,
}) => {
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
        className={`absolute z-50 mt-1 rounded-md border border-solid border-neutral-400 bg-white shadow-lg ${
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
                className="flex w-full items-start justify-between gap-3 hover:bg-neutral-200"
              >
                <button
                  type="button"
                  className="m-2 flex w-full text-start text-xs font-semibold"
                  onClick={() => {
                    setSearchValue(label);
                    onSelectValue(option);
                  }}
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
          <div className="p-2">
            <div className="text-center text-xs font-semibold">
              Data tidak ditemukan
            </div>
            <div className="mt-4 flex w-full flex-row items-center gap-2.5 rounded-md border border-[#176CF7] px-3 py-2">
              <IconComponent
                src="/icons/info16.svg"
                height={16}
                width={16}
                className="text-[#176CF7]"
              />
              <p className="capsize text-xxs font-semibold leading-[14.4px] text-[#176CF7]">
                Tambahkan Data Lokasi Anda ke muattrans.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const SearchPostal = ({
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
          iconClassName: "text-neutral-600",
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

      {searchValue && searchValue.length > 0 && !hideDropdown ? (
        <div className="relative">
          <FilterableMenu
            options={options}
            filterText={searchValue}
            onSelectValue={onSelectValue}
            getOptionLabel={getOptionLabel}
            setSearchValue={setSearchValue}
          />
        </div>
      ) : null}
    </div>
  );
};

"use client";

import { useState } from "react";

import IconComponent from "../IconComponent/IconComponent";
import Select from "../Select";

export default function Dropdown({
  value,
  onChange,
  disabled,
  className,
  placeholder,
  searchPlaceholder,
  options,
  isAddable,
  isError = false,
  searchable = true,
}) {
  const [searchValue, setSearchValue] = useState("");
  return (
    <Select.Root
      disabled={disabled}
      className={className}
      defaultValue="option1"
      value={value}
      onValueChange={onChange}
      onSearch={setSearchValue}
    >
      <Select.Trigger placeholder={placeholder} isError={isError}>
        {/* <Select.Value placeholder={placeholder}/> */}
        <Select.Value placeholder={placeholder}>
          {options?.filter((item) => item.value === value)[0]?.label}
        </Select.Value>
      </Select.Trigger>
      <Select.Content
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
        className="w-64"
      >
        {isAddable && (
          <>
            <Select.Item
              value="add"
              className="!py-1"
              onClick={() => {
                // Handle add new item logic here
              }}
            >
              <div className="flex items-center gap-2">
                <IconComponent
                  src="/icons/plus16.svg"
                  className="text-primary-700"
                />
                <span className="text-xs font-medium">Tambah Baru</span>
              </div>
            </Select.Item>
            <Select.Separator />
          </>
        )}
        {options?.filter((rows) =>
          rows.label.toLowerCase().includes(searchValue.toLowerCase())
        ).length > 0 ? (
          options
            ?.filter((rows) =>
              rows.label.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((item) => (
              <Select.Item
                key={item.value}
                value={item.value}
                textValue={item.label}
                className="!py-1"
              >
                <div className="flex items-center gap-2">
                  {item.image && (
                    <img src={item.image} alt={item.label} className="w-8" />
                  )}
                  <span className="text-xs font-medium">{item.label}</span>
                </div>
              </Select.Item>
            ))
        ) : (
          <Select.Empty>No options available</Select.Empty>
        )}
        {/* <Select.Separator /> */}
        {/* Example items, can be replaced with dynamic data */}
        {/* <Select.Empty>No options available</Select.Empty> */}
      </Select.Content>
    </Select.Root>
  );
}

"use client";

import { useState } from "react";

import Select from "../Select";

export default function Dropdown({
  value,
  onChange,
  disabled,
  className,
  placeholder,
  searchPlaceholder,
  options,
}) {
  const [searchValue, setSearchValue] = useState("");
  const data = [
    { value: "option1", label: "Option 1", image: "/img/mock-armada/one.png" },
    { value: "option2", label: "Option 2", image: "/img/mock-armada/two.png" },
    {
      value: "option3",
      label: "Option 3",
      image: "/img/mock-armada/three.png",
    },
  ];
  return (
    <Select.Root
      disabled={disabled}
      className={className}
      defaultValue="option1"
      value={value}
      onValueChange={onChange}
      onSearch={setSearchValue}
    >
      <Select.Trigger placeholder={placeholder}>
        {/* <Select.Value placeholder={placeholder}/> */}
        <Select.Value placeholder={placeholder}>
          {options?.filter((item) => item.value === value)[0]?.label}
        </Select.Value>
      </Select.Trigger>
      <Select.Content
        searchable
        searchPlaceholder={searchPlaceholder}
        className="w-64"
      >
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

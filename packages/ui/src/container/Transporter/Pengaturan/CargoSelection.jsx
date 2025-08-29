"use client";

import React from "react";

import Checkbox from "@/components/Form/Checkbox";

import { CargoGroup } from "./CargoGroup";

export const CargoSelection = ({
  cargoTypeName,
  selectedCount,
  isAllSelected,
  isIndeterminate,
  onSelectAll,
  filteredCategories,
  selectedItems,
  onItemChange,
  onCategoryChange,
  titleCheckboxAll = "Pilih Semua Muatan",
}) => {
  return (
    <div className="rounded-lg border border-neutral-400 p-5">
      <h2 className="text-sm font-semibold text-[#1B1B1B]">
        {cargoTypeName}{" "}
        <span className="px-2 text-xs font-medium text-neutral-600">
          ({selectedCount} Terpilih)
        </span>
      </h2>
      <div className="py-4">
        <Checkbox
          id="select-all"
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onChange={onSelectAll}
        >
          <span className="text-xs font-medium text-neutral-900">
            {titleCheckboxAll}
          </span>
        </Checkbox>
      </div>
      <hr className="border-t border-neutral-400" />
      {filteredCategories.map((category, index) => (
        <CargoGroup
          key={category.id}
          category={category}
          selectedItems={selectedItems}
          onItemChange={onItemChange}
          onCategoryChange={onCategoryChange}
          isLast={index === filteredCategories.length - 1}
        />
      ))}
    </div>
  );
};

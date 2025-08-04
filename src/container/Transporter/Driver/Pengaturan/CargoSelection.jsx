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
}) => {
  return (
    <div className="rounded-lg border border-neutral-200 p-4">
      <h2 className="text-lg font-bold text-neutral-900">
        {cargoTypeName}{" "}
        <span className="text-neutral-500">({selectedCount} Terpilih)</span>
      </h2>
      <div className="border-b-[1px] py-4">
        <Checkbox
          id="select-all"
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onCheckedChange={onSelectAll}
        >
          <span className="text-sm font-medium text-neutral-900">
            Pilih Semua Muatan
          </span>
        </Checkbox>
      </div>
      <hr className="border-t border-neutral-200" />
      {filteredCategories.length > 0 ? (
        filteredCategories.map((category) => (
          <CargoGroup
            key={category.id}
            category={category}
            selectedItems={selectedItems}
            onItemChange={onItemChange}
            onCategoryChange={onCategoryChange}
          />
        ))
      ) : (
        <p className="py-8 text-center text-neutral-500">
          Tidak ada muatan yang cocok dengan pencarian Anda.
        </p>
      )}
    </div>
  );
};

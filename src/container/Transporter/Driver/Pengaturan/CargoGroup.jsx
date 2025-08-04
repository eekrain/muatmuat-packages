"use client";

import React, { useMemo } from "react";

import Checkbox from "@/components/Form/Checkbox";

export const CargoGroup = ({
  category,
  selectedItems,
  onCategoryChange,
  onItemChange,
}) => {
  // Determine the state of the category checkbox based on its children
  const allItemIds = useMemo(
    () => category.items.map((item) => item.id),
    [category.items]
  );
  const selectedItemCount = useMemo(
    () => allItemIds.filter((id) => selectedItems[id]).length,
    [allItemIds, selectedItems]
  );

  const isAllSelected =
    allItemIds.length > 0 && selectedItemCount === allItemIds.length;
  const isIndeterminate = selectedItemCount > 0 && !isAllSelected;

  const handleCategoryClick = () => {
    // When the category checkbox is clicked, toggle all its children
    const shouldSelectAll = !isAllSelected;
    onCategoryChange(allItemIds, shouldSelectAll);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b-[1px] border-neutral-200 py-4">
          <Checkbox
            id={category.id}
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onCheckedChange={handleCategoryClick}
          >
            <span className="text-sm font-medium text-neutral-900">
              {category.name}
            </span>
          </Checkbox>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 pb-4 pl-8 md:grid-cols-2 lg:grid-cols-3">
          {category.items.map((item) => (
            <Checkbox
              key={item.id}
              id={item.id}
              checked={!!selectedItems[item.id]}
              onCheckedChange={() => onItemChange(item.id)}
            >
              <span className="text-sm font-normal text-neutral-900">
                {item.name}
              </span>
            </Checkbox>
          ))}
        </div>
      </div>
    </div>
  );
};

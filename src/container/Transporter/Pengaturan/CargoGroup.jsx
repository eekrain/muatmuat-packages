"use client";

import React, { useMemo } from "react";

import Checkbox from "@/components/Form/Checkbox";

export const CargoGroup = ({
  category,
  selectedItems,
  onCategoryChange,
  onItemChange,
  isLast = false,
}) => {
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
    const shouldSelectAll = !isAllSelected;
    onCategoryChange(allItemIds, shouldSelectAll);
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b border-neutral-400 py-3">
          <Checkbox
            id={category.id}
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onChange={handleCategoryClick}
          >
            <span className="text-xs font-medium text-neutral-900">
              {category.name}
            </span>
          </Checkbox>
        </div>

        <div className="grid grid-cols-1 gap-x-[10px] pl-[25px] pt-3 md:grid-cols-2 lg:grid-cols-4">
          {category.items.map((item) => (
            <Checkbox
              key={item.id}
              id={item.id}
              checked={!!selectedItems[item.id]}
              onChange={() => onItemChange(item.id)}
            >
              <span className="text-xs font-medium text-neutral-900">
                {item.name}
              </span>
            </Checkbox>
          ))}
        </div>
        {!isLast && (
          <hr className="mx-[25px] mt-3 w-full border-t border-neutral-400" />
        )}
      </div>
    </div>
  );
};

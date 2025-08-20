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
  // This now correctly refers to the complete list of item IDs for the category,
  // passed from the parent, to ensure the checkbox state is accurate even when
  // the rendered items are filtered.
  const allItemIds = useMemo(
    () => category.allCargoIds,
    [category.allCargoIds]
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
    // The onClick handler also uses the complete list of IDs to ensure
    // all items are toggled, not just the visible/filtered ones.
    onCategoryChange(allItemIds, shouldSelectAll);
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col">
        <div className="flex items-center justify-between py-3">
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
          {/* Render the list of items, which is correctly filtered by the parent */}
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

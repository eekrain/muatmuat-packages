import { useEffect, useRef, useState } from "react";

import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";

const ActiveFiltersBar = ({
  filters = [],
  onRemoveFilter,
  onClearAll,
  className,
  showClearAll = true,
  clearAllText = "Hapus Semua Filter",
  emptyText = "Tidak ada filter aktif",
  tagClassName,
  scrollButtonClassName,
}) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    );
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [filters]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 200;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (filters.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-3 bg-white", className)}>
      {/* Clear All Button */}
      {showClearAll && (
        <button
          onClick={onClearAll}
          className="text-primary-700 hover:text-primary-800 shrink-0 text-xs font-bold"
        >
          {clearAllText}
        </button>
      )}

      {/* Scroll Left Button */}
      {(canScrollLeft || canScrollRight) && (
        <button
          onClick={() => scroll("left")}
          className={cn(
            "shrink-0 rounded-full border p-1 transition-all",
            canScrollLeft
              ? "border-neutral-600 text-neutral-900 hover:bg-neutral-100"
              : "border-neutral-500 text-neutral-500 hover:cursor-not-allowed",
            scrollButtonClassName
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      {/* Filter Tags Container */}
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex gap-2 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filters.map((filter, index) => (
            <div
              key={filter.id || index}
              className={cn(
                "border-primary-700 flex h-7 shrink-0 items-center gap-2 rounded-full border bg-neutral-50 px-3",
                tagClassName
              )}
            >
              {filter.item?.icon && (
                <IconComponent src={filter.item.icon} width={14} height={14} />
              )}
              <span className="text-primary-700 text-xs font-medium">
                {filter.label}
              </span>
              <button
                onClick={() => onRemoveFilter(filter)}
                className="text-primary-700 hover:bg-primary-100 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${filter.label} filter`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Right Button */}
      {(canScrollLeft || canScrollRight) && (
        <button
          onClick={() => scroll("right")}
          className={cn(
            "shrink-0 rounded-full border p-1 transition-all",
            canScrollRight
              ? "border-neutral-600 text-neutral-900 hover:bg-neutral-100"
              : "border-neutral-500 text-neutral-500 hover:cursor-not-allowed",
            scrollButtonClassName
          )}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ActiveFiltersBar;

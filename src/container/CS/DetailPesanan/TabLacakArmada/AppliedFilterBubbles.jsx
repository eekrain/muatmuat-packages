import { useCallback, useEffect, useRef, useState } from "react";

import { TagBubble } from "@/components/Badge/TagBubble";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";

import { useLacakArmadaContext } from "./use-lacak-armada";

export const AppliedFilterBubbles = () => {
  const { t } = useTranslation();
  const { appliedFilters, clearAllFilters, hasActiveFilters } =
    useLacakArmadaContext();

  const {
    scrollContainerRef,
    showLeftArrow,
    showRightArrow,
    isLeftArrowDisabled,
    isRightArrowDisabled,
    handleScroll,
    checkScroll,
  } = useFilterSlider();

  // Check scroll when applied filters change
  useEffect(() => {
    checkScroll();
  }, [appliedFilters, checkScroll]);

  if (!hasActiveFilters) return null;

  return (
    <div className="flex w-full items-center gap-3">
      <button
        onClick={clearAllFilters}
        className="w-[113px] flex-shrink-0 cursor-pointer text-xs font-bold text-primary-700 hover:text-primary-800"
      >
        {t(
          "AppliedFilterBubbles.buttonHapusSemuaFilter",
          {},
          "Hapus Semua Filter"
        )}
      </button>

      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => handleScroll("left")}
          disabled={isLeftArrowDisabled}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-neutral-600 bg-white text-black hover:bg-neutral-50 disabled:cursor-not-allowed disabled:border-neutral-500 disabled:text-neutral-500"
        >
          <IconComponent
            src="/icons/agenda/chevron-left-sharp.svg"
            height={12}
            width={7}
          />
        </button>
      )}

      {/* Scrollable Filters Container */}
      <div className="flex-1 overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {appliedFilters.map((filter, index) => (
            <div
              key={`${filter.type}-${filter.value}-${index}`}
              className="flex-shrink-0"
            >
              <TagBubble withRemove={filter.onRemove}>
                {t(filter.label)}
              </TagBubble>
            </div>
          ))}

          {/* {MOCK.map((item) => (
            <div key={item} className="flex-shrink-0">
              <TagBubble withRemove={{ onRemove: () => {} }}>{item}</TagBubble>
            </div>
          ))} */}
        </div>
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => handleScroll("right")}
          disabled={isRightArrowDisabled}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-neutral-600 bg-white text-black hover:bg-neutral-50 disabled:cursor-not-allowed disabled:border-neutral-500 disabled:text-neutral-500"
        >
          <IconComponent
            src="/icons/agenda/chevron-right-sharp.svg"
            height={12}
            width={7}
          />
        </button>
      )}
    </div>
  );
};

const useFilterSlider = () => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isLeftArrowDisabled, setIsLeftArrowDisabled] = useState(true);
  const [isRightArrowDisabled, setIsRightArrowDisabled] = useState(false);

  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      const isOverflowing = scrollWidth > clientWidth;
      setShowLeftArrow(isOverflowing);
      setShowRightArrow(isOverflowing);

      setIsLeftArrowDisabled(scrollLeft === 0);
      setIsRightArrowDisabled(
        Math.ceil(scrollLeft + clientWidth) >= scrollWidth
      );
    }
  }, []);

  const handleScroll = useCallback((direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200; // Adjust scroll amount as needed
      const currentScrollLeft = scrollContainerRef.current.scrollLeft;
      const newScrollLeft =
        direction === "left"
          ? currentScrollLeft - scrollAmount
          : currentScrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScroll();
      container.addEventListener("scroll", checkScroll);

      // Check on resize
      const resizeObserver = new ResizeObserver(checkScroll);
      resizeObserver.observe(container);

      return () => {
        container.removeEventListener("scroll", checkScroll);
        resizeObserver.disconnect();
      };
    }
  }, [checkScroll]);

  return {
    scrollContainerRef,
    showLeftArrow,
    showRightArrow,
    isLeftArrowDisabled,
    isRightArrowDisabled,
    handleScroll,
    checkScroll,
  };
};

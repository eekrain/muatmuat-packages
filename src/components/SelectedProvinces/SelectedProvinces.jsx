"use client";

import { useEffect, useRef, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { TagBubble } from "@/components/Badge/TagBubble";
import Button from "@/components/Button/Button";

export function SelectedProvinces({
  provinces,
  onRemove,
  onAdd,
  className = "",
}) {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const [isLeftArrowDisabled, setIsLeftArrowDisabled] = useState(true);
  const [isRightArrowDisabled, setIsRightArrowDisabled] = useState(false);

  const checkArrows = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setIsLeftArrowDisabled(scrollLeft === 0);
      setIsRightArrowDisabled(scrollLeft >= scrollWidth - clientWidth - 1);
    }
  };

  const handleScroll = (scrollOffset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (provinces.length > 8) {
        setShowLeftArrow(true);
        setShowRightArrow(true);
      } else {
        setShowLeftArrow(false);
        setShowRightArrow(false);
      }
      checkArrows();
    };

    handleResize(); // Initial check

    const currentRef = scrollContainerRef.current;
    currentRef.addEventListener("scroll", checkArrows);
    window.addEventListener("resize", handleResize);

    return () => {
      currentRef.removeEventListener("scroll", checkArrows);
      window.removeEventListener("resize", handleResize);
    };
  }, [provinces]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="whitespace-nowrap text-sm font-medium leading-[16.8px] text-neutral-900">
        Provinsi*
      </span>
      {showLeftArrow && (
        <Button
          size="icon"
          className="rounded-full border border-neutral-500 bg-transparent !px-2 !py-2"
          onClick={() => handleScroll(-200)}
          disabled={isLeftArrowDisabled}
        >
          <ChevronLeft size={16} className="text-neutral-500" />
        </Button>
      )}
      <div
        ref={scrollContainerRef}
        className="no-scrollbar flex flex-grow items-center gap-2 overflow-x-auto"
      >
        {provinces.map((province) => (
          <TagBubble
            key={province.id}
            withRemove={{
              onRemove: () => onRemove(province.id),
            }}
          >
            {province.province}
          </TagBubble>
        ))}
      </div>
      {showRightArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full border border-neutral-500 bg-transparent !px-2 !py-2"
          onClick={() => handleScroll(200)}
          disabled={isRightArrowDisabled}
        >
          <ChevronRight size={16} className="text-neutral-500" />
        </Button>
      )}
      <Button
        variant="muattrans-primary"
        className="ml-auto h-7 rounded-full px-4 text-xs"
        onClick={onAdd}
      >
        Tambah
      </Button>
    </div>
  );
}

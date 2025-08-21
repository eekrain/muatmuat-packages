"use client";

import { useEffect, useRef, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { TagBubble } from "@/components/Badge/TagBubble";
import Button from "@/components/Button/Button";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";

export function SelectedProvinces({
  provinces,
  onRemove,
  onAdd,
  className = "",
  addButtonText = "Tambah",
  showAddButton = true,
}) {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [provinceToRemove, setProvinceToRemove] = useState(null);

  const [isLeftArrowDisabled, setIsLeftArrowDisabled] = useState(true);
  const [isRightArrowDisabled, setIsRightArrowDisabled] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;

        const isOverflowing = scrollWidth > clientWidth;
        setShowLeftArrow(isOverflowing);
        setShowRightArrow(isOverflowing);

        setIsLeftArrowDisabled(scrollLeft === 0);
        setIsRightArrowDisabled(scrollLeft >= scrollWidth - clientWidth - 1);
      }
    };

    // Timeout to allow DOM to update before checking scroll
    const timer = setTimeout(checkScroll, 0);
    window.addEventListener("resize", checkScroll);
    const currentRef = scrollContainerRef.current;
    currentRef?.addEventListener("scroll", checkScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkScroll);
      currentRef?.removeEventListener("scroll", checkScroll);
    };
  }, [provinces]);

  const handleScroll = (scrollOffset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  };

  const handleRemoveClick = (province) => {
    setProvinceToRemove(province);
    setIsConfirmationOpen(true);
  };

  const handleConfirmRemove = () => {
    if (provinceToRemove) {
      onRemove(provinceToRemove.id);
      setIsConfirmationOpen(false);
      setProvinceToRemove(null);
    }
  };

  return (
    <>
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
          className={`no-scrollbar flex items-center gap-2 overflow-x-auto ${
            showRightArrow ? "flex-grow" : ""
          }`}
        >
          {provinces.map((province) => (
            <TagBubble
              key={province.id}
              withRemove={{
                onRemove: () => handleRemoveClick(province),
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
        {showAddButton && (
          <Button
            variant="muattrans-primary"
            className={`h-7 rounded-full px-4 text-xs ${
              showRightArrow ? "ml-auto" : "ml-2"
            }`}
            onClick={onAdd}
          >
            {addButtonText}
          </Button>
        )}
      </div>
      {provinceToRemove && (
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          setIsOpen={setIsConfirmationOpen}
          title={{
            className: "text-center font-semibold",
            text: `Apakah kamu yakin ingin menghapus provinsi ${provinceToRemove.province}?`,
          }}
          cancel={{
            text: "Tidak",
            onClick: () => setIsConfirmationOpen(false),
            classname: "w-[120px]",
          }}
          confirm={{
            text: "Ya",
            onClick: handleConfirmRemove,
            classname: "w-[120px]",
          }}
        />
      )}
    </>
  );
}

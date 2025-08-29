"use client";

import { useEffect, useRef } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * A horizontally scrollable container for any set of children elements (like tabs).
 * @param {React.ReactNode} children - The content to be placed inside the scrollable area.
 * @param {string} [className=""] - Optional additional class names for the main container.
 * @param {any[]} [dependencies=[]] - An array of dependencies that, when changed, will trigger a re-check of scrollability. Useful if tab content/width changes dynamically.
 */
export function ScrollableTabs({
  children,
  className = "",
  hasArrow = false,
  dependencies = [],
}) {
  const scrollContainerRef = useRef(null);
  // Arrow always visible, so no need for state

  useEffect(() => {
    const checkScrollability = () => {
      const container = scrollContainerRef.current;
      if (container) {
        const isOverflowing = container.scrollWidth > container.clientWidth;
        // Periksa apakah ada cukup ruang untuk scroll
        const canScrollLeft = container.scrollLeft > 0;
        const canScrollRight =
          container.scrollLeft <
          container.scrollWidth - container.clientWidth - 1;

        // Arrow visibility logic removed; arrows are always visible if hasArrow is true
      }
    };

    const container = scrollContainerRef.current;
    // Pengecekan awal dengan sedikit delay untuk memastikan layout sudah final
    const timer = setTimeout(checkScrollability, 100);

    if (container) {
      container.addEventListener("scroll", checkScrollability, {
        passive: true,
      });
    }
    window.addEventListener("resize", checkScrollability);

    return () => {
      clearTimeout(timer);
      if (container) {
        container.removeEventListener("scroll", checkScrollability);
      }
      window.removeEventListener("resize", checkScrollability);
    };
    // Jalankan efek ini setiap kali children atau dependencies yang diberikan berubah
  }, [children, ...dependencies]);

  const handleScroll = (scrollOffset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={`flex w-full items-center gap-2 ${className}`}>
      {hasArrow && (
        <button
          onClick={() => handleScroll(-250)}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white shadow-sm transition-colors hover:bg-neutral-100"
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} className="text-neutral-600" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="no-scrollbar flex flex-grow items-center gap-2 overflow-x-auto scroll-smooth py-6"
      >
        {/* Di sini kita render children yang diberikan dari luar */}
        {children}
      </div>

      {hasArrow && (
        <button
          onClick={() => handleScroll(250)}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white shadow-sm transition-colors hover:bg-neutral-100"
          aria-label="Scroll right"
        >
          <ChevronRight size={18} className="text-neutral-600" />
        </button>
      )}
    </div>
  );
}

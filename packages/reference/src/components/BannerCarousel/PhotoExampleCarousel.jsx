import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export const PhotoExampleCarousel = ({
  images = [],
  height = 391,
  width = 660,
  aspectRatio = "16/9",
  index: controlledIndex,
  onIndexChange,
  showControls = true,
  showIndicators = true,
  className = "",
  style = {},
  autoplaySpeed = 0, // 0 = no autoplay
}) => {
  const [internalIndex, setInternalIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoplayTimerRef = useRef(null);

  const total = images.length;
  const currentIndex =
    controlledIndex !== undefined ? controlledIndex : internalIndex;
  const setIndex = onIndexChange || setInternalIndex;

  // Stable callback for goToNext
  const goToNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % total);
  }, [setIndex, total]);

  const goToPrev = () => {
    setIndex((prev) => (prev - 1 + total) % total);
  };

  const goToSlide = (idx) => {
    setIndex(idx);
  };

  // Setup autoplay
  useEffect(() => {
    if (autoplaySpeed > 0) {
      autoplayTimerRef.current = setInterval(goToNext, autoplaySpeed);
    }
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [autoplaySpeed, goToNext]);

  // Pause on hover
  const handleMouseEnter = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (autoplaySpeed > 0 && !autoplayTimerRef.current) {
      autoplayTimerRef.current = setInterval(goToNext, autoplaySpeed);
    }
    setIsHovered(false);
  };

  return (
    <div
      className={cn(
        "relative mx-auto flex flex-col items-center justify-center bg-background",
        className
      )}
      style={{ width, height, aspectRatio, ...style }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative w-full overflow-hidden rounded-xl"
        style={{ height, width, aspectRatio }}
      >
        {images.map((img, idx) => (
          <div
            key={img.id || idx}
            className={cn(
              "absolute left-0 top-0 h-full w-full transition-opacity duration-500",
              idx === currentIndex ? "z-0 opacity-100" : "-z-10 opacity-0"
            )}
          >
            <img
              src={img.url || img.photoUrl}
              alt={img.alt || img.description || `Image ${idx + 1}`}
              className="h-full w-full bg-neutral-100 object-contain"
              style={{ minHeight: height, minWidth: width }}
            />
          </div>
        ))}
      </div>
      {/* Navigation Controls */}
      {showControls && total > 1 && (
        <div
          className={cn(
            "pointer-events-none absolute bottom-[42%] left-0 right-0 top-[42%] flex justify-between transition-opacity duration-500",
            !isHovered && "opacity-0"
          )}
        >
          <button
            className="pointer-events-auto z-10 flex size-[40px] items-center justify-center rounded-full bg-white shadow-lg"
            onClick={goToPrev}
            aria-label="Sebelumnya"
          >
            <img
              src="/icons/chevron-left16-2.svg"
              width={9}
              height={16}
              alt="Prev"
            />
          </button>
          <button
            onClick={goToNext}
            className="pointer-events-auto z-10 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white shadow-lg"
            aria-label="Berikutnya"
          >
            <img
              src="/icons/chevron-right16-2.svg"
              width={9}
              height={16}
              alt="Next"
            />
          </button>
        </div>
      )}
      {/* Indicator Dots */}
      {showIndicators && total > 1 && (
        <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 transform gap-[8px] p-3">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => goToSlide(idx)}
              className={cn(
                "h-[8px] transition-all",
                idx === currentIndex
                  ? "w-[32px] rounded-[14px] bg-white"
                  : "w-[8px] rounded-full bg-white"
              )}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoExampleCarousel;

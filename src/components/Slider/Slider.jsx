import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * @typedef {Object} SlideProps
 * @property {string} title - The title of the slide
 * @property {string} imgSrc - The image source to display
 * @property {React.ReactNode} content - The jsx content to display
 */

/**
 * @typedef {Object} OnboardingSliderProps
 * @property {SlideProps[]} slides - Array of slide data
 * @property {Function} [onComplete] - Callback when all slides are viewed
 * @property {Function} [onSlideChange] - Setter to sync with outer state
 * @property {object} [appearance] - Custom classNames for styling
 * @property {string} [appearance.titleClassname]
 * @property {string} [appearance.contentClassname]
 */

/**
 * Onboarding slider component that displays a series of slides with navigation
 * @param {OnboardingSliderProps} props
 */
export default function Slider({
  slides,
  onComplete,
  onSlideChange,
  className,
  appearance = {
    titleClassname: "",
    contentClassname: "",
  },
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlideIndex, setNextSlideIndex] = useState(null);
  const [direction, setDirection] = useState(null); // 'left' or 'right'
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const minSwipeDistance = 50;

  useEffect(() => {
    if (onSlideChange) onSlideChange(currentSlide);
  }, [currentSlide, onSlideChange]);

  useEffect(() => {
    if (currentSlide === slides.length - 1 && onComplete) {
      onComplete();
    }
  }, [currentSlide, onComplete, slides.length]);

  const handleSlideChange = useCallback(
    (index, dir) => {
      if (isAnimating || index === currentSlide) {
        return;
      }

      setIsAnimating(true);
      setNextSlideIndex(index);
      setDirection(dir);

      setTimeout(() => {
        setCurrentSlide(index);
        setNextSlideIndex(null);
        setDirection(null);
        setIsAnimating(false);
      }, 400);
    },
    [isAnimating, currentSlide]
  );

  const nextSlide = useCallback(() => {
    const nextIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
    handleSlideChange(nextIndex, "left");
  }, [currentSlide, slides.length, handleSlideChange]);

  const prevSlide = useCallback(() => {
    const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    handleSlideChange(prevIndex, "right");
  }, [currentSlide, slides.length, handleSlideChange]);

  const goToSlide = (index) => {
    if (index === currentSlide) return;
    const dir = index > currentSlide ? "left" : "right";
    handleSlideChange(index, dir);
  };

  const handleDragStart = useCallback((clientX) => {
    setTouchStart(clientX);
    setTouchEnd(clientX);
    setIsDragging(true);
  }, []);

  const handleDragMove = useCallback(
    (clientX) => {
      if (!isDragging) return;
      setTouchEnd(clientX);
      const offset = clientX - touchStart;
      setDragOffset(offset);
    },
    [isDragging, touchStart]
  );

  const handleDragEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
    setIsDragging(false);
    setDragOffset(0);
  }, [touchStart, touchEnd, nextSlide, prevSlide]);

  const handleTouchStart = useCallback(
    (e) => handleDragStart(e.touches[0].clientX),
    [handleDragStart]
  );
  const handleTouchMove = useCallback(
    (e) => handleDragMove(e.touches[0].clientX),
    [handleDragMove]
  );
  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      handleDragStart(e.clientX);
    },
    [handleDragStart]
  );
  const handleMouseMove = useCallback(
    (e) => {
      e.preventDefault();
      handleDragMove(e.clientX);
    },
    [handleDragMove]
  );
  const handleMouseUp = useCallback(
    (e) => {
      e.preventDefault();
      handleDragEnd();
    },
    [handleDragEnd]
  );
  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      handleDragEnd();
    }
  }, [isDragging, handleDragEnd]);

  const getSlideClasses = (index) => {
    if (index === currentSlide && nextSlideIndex === null) {
      return `absolute inset-0 opacity-100 transform ${
        isDragging ? `translate-x-[${dragOffset}px]` : "translate-x-0"
      }`;
    }
    if (index === currentSlide && nextSlideIndex !== null) {
      return `absolute inset-0 transform transition-all duration-300 ease-in-out ${
        direction === "left"
          ? "-translate-x-full opacity-0"
          : "translate-x-full opacity-0"
      }`;
    }
    if (index === nextSlideIndex) {
      return "absolute inset-0 transform transition-all duration-300 ease-in-out translate-x-0 opacity-100";
    }
    if (nextSlideIndex !== null && index === nextSlideIndex) {
      return `absolute inset-0 transform ${
        direction === "left"
          ? "translate-x-full opacity-0"
          : "-translate-x-full opacity-0"
      }`;
    }
    return "absolute inset-0 opacity-0";
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col items-center justify-center",
        className
      )}
    >
      <h2
        className={cn(
          "mb-5 text-base font-bold leading-[1.1] text-neutral-900 md:hidden",
          appearance.titleClassname
        )}
      >
        {slides[currentSlide]?.title}
      </h2>
      {/* Slides Container */}
      <div
        className="relative h-[150px] w-full cursor-grab active:cursor-grabbing md:h-[120px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${getSlideClasses(
              index
            )} flex flex-col items-center justify-center transition-all duration-300 ease-in-out`}
            style={{
              transform:
                nextSlideIndex === index && !isAnimating
                  ? `translateX(${direction === "left" ? "100%" : "-100%"})`
                  : undefined,
            }}
          >
            <img
              src={slide.imgSrc}
              alt={slide.title}
              className="h-[150px] w-[150px] object-contain md:h-[120px] md:w-[140px]"
            />
          </div>
        ))}

        {/* Desktop Navigation Arrows */}
        <button
          onClick={prevSlide}
          disabled={isAnimating}
          className={cn(
            "absolute left-0 top-1/2 hidden h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full bg-white lg:flex",
            isAnimating && "cursor-not-allowed opacity-50"
          )}
        >
          <svg
            className="h-6 w-6 text-primary-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          disabled={isAnimating}
          className={cn(
            "absolute right-0 top-1/2 hidden h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full bg-white lg:flex",
            isAnimating && "cursor-not-allowed opacity-50"
          )}
        >
          <svg
            className="h-6 w-6 text-primary-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Text Content */}
      <div className="flex flex-1 flex-col items-center gap-5">
        <h2
          className={cn(
            "hidden text-center text-base font-bold leading-[1.1] text-neutral-900 md:block",
            appearance.titleClassname
          )}
        >
          {slides[currentSlide]?.title}
        </h2>
        <div
          className={cn(
            "text-sm font-medium leading-[1.1] text-neutral-900",
            appearance.contentClassname
          )}
        >
          {slides[currentSlide]?.content}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex w-full flex-col gap-6">
        {/* Dots Navigation */}
        <div className="flex h-4 items-center justify-center">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
              className={`mx-1 h-[6px] w-[6px] rounded-full transition-all duration-200 ${
                currentSlide === index ? "bg-primary-700" : "bg-neutral-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Mobile Navigation Arrows */}
        <div className="flex items-center justify-end gap-[14px] lg:hidden">
          <button
            onClick={prevSlide}
            disabled={isAnimating}
            className={cn(
              "flex h-[31px] w-[31px] items-center justify-center rounded-[12px] border border-neutral-500 bg-white",
              isAnimating && "cursor-not-allowed opacity-50"
            )}
          >
            <svg
              className="h-6 w-6 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            disabled={isAnimating}
            className={cn(
              "flex h-[31px] w-[31px] items-center justify-center rounded-[12px] bg-primary-700",
              isAnimating && "cursor-not-allowed opacity-50"
            )}
          >
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

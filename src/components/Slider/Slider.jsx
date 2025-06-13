import { useCallback, useEffect, useState } from "react";

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
 */

/**
 * Onboarding slider component that displays a series of slides with navigation
 * @param {OnboardingSliderProps} props
 */

export default function Slider({ slides, onComplete, onSlideChange }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlideIndex, setNextSlideIndex] = useState(null);
  const [direction, setDirection] = useState(null); // 'left' or 'right'
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  // Minimum swipe distance (in px) to trigger slide change
  const minSwipeDistance = 50;

  useEffect(() => {
    if (onSlideChange) onSlideChange(currentSlide);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide]);

  // Call onComplete when the last slide is viewed
  useEffect(() => {
    if (currentSlide === slides.length - 1 && onComplete) {
      onComplete();
    }
  }, [currentSlide, onComplete, slides.length]);

  /**
   * Handle the slide transition
   * @param {number} index - Target slide index
   * @param {string} dir - Animation direction ('left' or 'right')
   */
  const handleSlideChange = (index, dir) => {
    if (
      isAnimating ||
      index === currentSlide ||
      index < 0 ||
      index >= slides.length
    ) {
      return;
    }

    setIsAnimating(true);
    setNextSlideIndex(index);
    setDirection(dir);

    // Complete the transition after animation
    setTimeout(() => {
      setCurrentSlide(index);
      setNextSlideIndex(null);
      setDirection(null);
      setIsAnimating(false);
    }, 400);
  };

  /**
   * Navigate to the next slide
   */
  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      handleSlideChange(currentSlide + 1, "left");
    }
  };

  /**
   * Navigate to the previous slide
   */
  const prevSlide = () => {
    if (currentSlide > 0) {
      handleSlideChange(currentSlide - 1, "right");
    }
  };

  /**
   * Navigate to a specific slide
   * @param {number} index - The slide index to navigate to
   */
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

      // Calculate drag offset for visual feedback
      const offset = clientX - touchStart;
      setDragOffset(offset);
    },
    [isDragging, touchStart]
  );

  const handleDragEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < slides.length - 1) {
      handleSlideChange(currentSlide + 1, "left");
    } else if (isRightSwipe && currentSlide > 0) {
      handleSlideChange(currentSlide - 1, "right");
    }

    // Reset states
    setTouchStart(null);
    setTouchEnd(null);
    setIsDragging(false);
    setDragOffset(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touchStart, touchEnd, currentSlide, slides.length]);

  // Touch event handlers
  const handleTouchStart = useCallback(
    (e) => {
      handleDragStart(e.touches[0].clientX);
    },
    [handleDragStart]
  );

  const handleTouchMove = useCallback(
    (e) => {
      handleDragMove(e.touches[0].clientX);
    },
    [handleDragMove]
  );

  // Mouse event handlers
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

  // Add mouse leave handler to prevent stuck dragging state
  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      handleDragEnd();
    }
  }, [isDragging, handleDragEnd]);

  // Determine slide classes based on animation state
  const getSlideClasses = (index) => {
    // Current slide
    if (index === currentSlide && nextSlideIndex === null) {
      return `absolute inset-0 opacity-100 transform ${
        isDragging ? `translate-x-[${dragOffset}px]` : "translate-x-0"
      }`;
    }

    // Current slide animating out
    if (index === currentSlide && nextSlideIndex !== null) {
      return `absolute inset-0 transform transition-all duration-300 ease-in-out ${
        direction === "left"
          ? "-translate-x-full opacity-0"
          : "translate-x-full opacity-0"
      }`;
    }

    // Next slide animating in
    if (index === nextSlideIndex) {
      return `absolute inset-0 transform transition-all duration-300 ease-in-out ${
        direction === "left"
          ? "translate-x-0 opacity-100"
          : "translate-x-0 opacity-100"
      }`;
    }

    // Initial position for next slide before animation
    if (nextSlideIndex !== null && index === nextSlideIndex) {
      return `absolute inset-0 transform ${
        direction === "left"
          ? "translate-x-full opacity-0"
          : "-translate-x-full opacity-0"
      }`;
    }

    // Hidden slides
    return "absolute inset-0 opacity-0";
  };

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden bg-white">
      <div
        className="relative h-[200px] cursor-grab overflow-hidden active:cursor-grabbing lg:h-[120px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Render all slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${getSlideClasses(
              index
            )} flex flex-col items-center justify-center px-6 transition-all duration-300 ease-in-out`}
            style={{
              // Set initial position before animation starts
              transform:
                nextSlideIndex === index && !isAnimating
                  ? `translateX(${direction === "left" ? "100%" : "-100%"})`
                  : undefined,
            }}
          >
            <img
              src={slide.imgSrc}
              alt={slide.title}
              className="h-[200px] w-[200px] object-contain lg:h-[120px] lg:w-[140px]"
            />
          </div>
        ))}

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0 || isAnimating}
          className={`absolute left-0 top-1/2 hidden h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full bg-white lg:flex ${
            currentSlide === 0 || isAnimating
              ? "cursor-not-allowed opacity-50"
              : "opacity-100 hover:bg-gray-100"
          }`}
        >
          <svg
            className={`h-6 w-6 ${
              currentSlide === 0 ? "text-gray-600" : "text-primary-700"
            }`}
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
          disabled={currentSlide === slides.length - 1 || isAnimating}
          className={`absolute right-0 top-1/2 hidden h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full bg-white lg:flex ${
            currentSlide === slides.length - 1 || isAnimating
              ? "cursor-not-allowed opacity-50"
              : "opacity-100 hover:bg-gray-100"
          }`}
        >
          <svg
            className={`h-6 w-6 ${
              currentSlide === slides.length - 1
                ? "text-gray-600"
                : "text-primary-700"
            }`}
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

      <h2 className="mb-3 hidden h-[44px] text-center text-lg font-bold lg:mt-6 lg:block">
        {slides[currentSlide]?.title}
      </h2>

      <div className="mx-auto mt-[18px] flex max-w-[328px] flex-col justify-between lg:mt-0 lg:h-[122px]">
        <div className="flex justify-center font-medium">
          {slides[currentSlide]?.content}
        </div>
        {/* Dots navigation */}
        <div className="mt-[18px] flex h-4 items-center justify-center lg:mt-0">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
              className={`mx-1 h-2 w-2 rounded-full ${
                currentSlide === index ? "h-3 w-3 bg-blue-500" : "bg-gray-300"
              } transition-all duration-200`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

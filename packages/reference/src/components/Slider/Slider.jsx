import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import IconComponent from "@/components/IconComponent/IconComponent";

import { cn } from "@/lib/utils";

import Button from "../Button/Button";

// 1. Create Slider Context
const SliderContext = createContext(null);

/**
 * Custom hook to access the slider's context.
 * Ensures that the hook is used within a Slider component.
 */
const useSlider = () => {
  const context = useContext(SliderContext);
  if (!context) {
    throw new Error("useSlider must be used within a <Slider.Root>");
  }
  return context;
};

/**
 * @typedef {Object} Item
 * @property {string} title - The title of the item.
 * @property {string} content - The content of the item.
 * @property {string} imgSrc - The image source of the item.
 */

/**
 * @typedef {Object} RootProps
 * @property {Array<Item>} items - The items to display in the slider.
 * @property {React.ReactNode} children - The children to display in the slider.
 * @property {string} className - The class name to apply to the slider.
 * @property {function} onSlideChange - The function to call when the slide changes.
 * @property {function} onComplete - The function to call when the slider is completed.
 * @property {boolean} loop - Whether the slider should loop infinitely or stop at boundaries.
 */

/**
 * @param {RootProps} props
 * @returns {React.ReactNode}
 */
const Root = ({
  items,
  children,
  className,
  onSlideChange,
  onComplete,
  loop = true,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (onSlideChange) onSlideChange(currentSlide);
    if (currentSlide === items.length - 1 && onComplete) {
      onComplete();
    }
  }, [currentSlide, items.length, onSlideChange, onComplete]);

  const handleSlideChange = useCallback(
    (index) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsAnimating(false);
      }, 300);
    },
    [isAnimating]
  );

  const nextSlide = useCallback(() => {
    if (loop) {
      handleSlideChange((currentSlide + 1) % items.length);
    } else {
      if (currentSlide < items.length - 1) {
        handleSlideChange(currentSlide + 1);
      }
    }
  }, [currentSlide, items.length, handleSlideChange, loop]);

  const prevSlide = useCallback(() => {
    if (loop) {
      handleSlideChange((currentSlide - 1 + items.length) % items.length);
    } else {
      if (currentSlide > 0) {
        handleSlideChange(currentSlide - 1);
      }
    }
  }, [currentSlide, items.length, handleSlideChange, loop]);

  const goToSlide = (index) => {
    if (index !== currentSlide) {
      handleSlideChange(index);
    }
  };

  const value = {
    items,
    currentSlide,
    isAnimating,
    nextSlide,
    prevSlide,
    goToSlide,
    loop,
    canGoNext: loop || currentSlide < items.length - 1,
    canGoPrev: loop || currentSlide > 0,
  };

  return (
    <SliderContext.Provider value={value}>
      <div className={cn("flex h-full flex-col", className)}>{children}</div>
    </SliderContext.Provider>
  );
};

const Content = ({ children, className }) => {
  const { items, currentSlide, nextSlide, prevSlide } = useSlider();
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            index === currentSlide ? "opacity-100" : "opacity-0"
          )}
          aria-hidden={index !== currentSlide}
        >
          {children(item, index)}
        </div>
      ))}
    </div>
  );
};

/**
 * Renders previous and next navigation buttons, positioned absolutely.
 * Must be placed inside a container with `position: relative`.
 * @param {{
 * className?: string;
 * prevButtonClassName?: string;
 * nextButtonClassName?: string;
 * }} props
 */
const DesktopNavigation = ({
  className,
  prevButtonClassName,
  nextButtonClassName,
}) => {
  const { prevSlide, nextSlide, isAnimating, canGoNext, canGoPrev } =
    useSlider();

  return (
    <div
      className={cn(
        "absolute inset-x-0 top-1/2 z-10 mt-3 flex -translate-y-1/2 justify-between",
        className
      )}
    >
      <button
        onClick={prevSlide}
        disabled={isAnimating || !canGoPrev}
        className={cn(
          "text-primary-700",
          !canGoPrev && "cursor-not-allowed opacity-30",
          prevButtonClassName
        )}
        aria-label="Previous slide"
      >
        <IconComponent src="/icons/chevron-left24.svg" width={24} height={24} />
      </button>
      <button
        onClick={nextSlide}
        disabled={isAnimating || !canGoNext}
        className={cn(
          "text-primary-700",
          !canGoNext && "cursor-not-allowed opacity-30",
          nextButtonClassName
        )}
        aria-label="Next slide"
      >
        <IconComponent
          src="/icons/chevron-right24.svg"
          width={24}
          height={24}
        />
      </button>
    </div>
  );
};

/**
 * Renders previous and next navigation buttons, positioned absolutely.
 * Must be placed inside a container with `position: relative`.
 * @param {{
 * className?: string;
 * prevButtonClassName?: string;
 * nextButtonClassName?: string;
 * }} props
 */
const MobileNavigation = ({ className }) => {
  const { prevSlide, nextSlide, canGoNext, canGoPrev } = useSlider();

  return (
    <div className={cn("flex items-center justify-end gap-[14px]", className)}>
      <Button
        onClick={prevSlide}
        disabled={!canGoPrev}
        variant="muatparts-primary-secondary"
        className={cn(
          "size-[31px] rounded-xl",
          !canGoPrev && "cursor-not-allowed opacity-30"
        )}
      >
        <IconComponent src="/icons/chevron-left24.svg" width={24} height={24} />
      </Button>
      <Button
        onClick={nextSlide}
        disabled={!canGoNext}
        variant="muatparts-primary"
        className={cn(
          "size-[31px] rounded-xl",
          !canGoNext && "cursor-not-allowed opacity-30"
        )}
      >
        <IconComponent
          src="/icons/chevron-right24.svg"
          width={24}
          height={24}
        />
      </Button>
    </div>
  );
};

const Indicator = ({ render, className }) => {
  const { items, currentSlide, goToSlide, isAnimating } = useSlider();

  return (
    <div className={cn("flex justify-center", className)}>
      {items.map((_, index) => {
        const isActive = currentSlide === index;
        const onClick = () => goToSlide(index);

        if (render) {
          return (
            <React.Fragment key={index}>
              {render({ isActive, index, onClick })}
            </React.Fragment>
          );
        }

        return (
          <button
            key={index}
            onClick={onClick}
            disabled={isAnimating}
            className={cn(
              "mx-1 h-1.5 w-1.5 rounded-full transition-colors duration-200 md:h-2 md:w-2",
              isActive ? "bg-primary-700" : "bg-neutral-400"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        );
      })}
    </div>
  );
};

const Title = ({ className }) => {
  const { items, currentSlide } = useSlider();
  const item = items[currentSlide];

  return (
    <h2
      className={cn(
        "h-[44px] overflow-hidden text-center text-base font-bold text-neutral-900",
        className
      )}
    >
      {item?.title}
    </h2>
  );
};

const Description = ({ className, ...props }) => {
  const { items, currentSlide } = useSlider();
  const item = items[currentSlide];
  if (typeof item?.content === "string") {
    return (
      <p
        className={cn("slider-list h-[102px] overflow-y-auto", className)}
        dangerouslySetInnerHTML={{ __html: item.content }}
      />
    );
  }
  return (
    <div
      className={cn("slider-list h-[102px] overflow-y-auto", className)}
      {...props}
    >
      {props.dangerouslySetInnerHTML ? null : item?.content}
    </div>
  );
};

export const Slider = {
  Root,
  Content,
  DesktopNavigation,
  MobileNavigation,
  Indicator,
  Title,
  Description,
};

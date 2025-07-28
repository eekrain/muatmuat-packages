import { useCallback, useRef, useState } from "react";

/**
 * A performant custom hook for handling swipe gestures on touch devices.
 *
 * @param {object} options - The options for configuring the swipe behavior.
 * @param {() => void} [options.onSwipeLeft] - Callback function for a left swipe.
 * @param {() => void} [options.onSwipeRight] - Callback function for a right swipe.
 * @param {number} [options.minSwipeDistance=50] - The minimum distance in pixels for a swipe to be registered.
 * @returns {{ dragOffset: number, swipeHandlers: { onTouchStart: (e: React.TouchEvent) => void, onTouchMove: (e: React.TouchEvent) => void, onTouchEnd: () => void } }}
 */
export const useSwipe = ({
  onSwipeLeft,
  onSwipeRight,
  minSwipeDistance = 50,
}) => {
  // Use a ref for the starting touch position to avoid re-renders on touch start.
  const touchStartRef = useRef({ x: 0, y: 0 });

  // Use state for the drag offset to provide visual feedback during the swipe.
  const [dragOffset, setDragOffset] = useState(0);

  const handleTouchStart = useCallback((e) => {
    // Reset previous touch data.
    touchStartRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
    setDragOffset(0);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!touchStartRef.current.x) return;

    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    const deltaX = currentX - touchStartRef.current.x;
    const deltaY = currentY - touchStartRef.current.y;

    // Prioritize vertical scroll over horizontal swipe.
    // This prevents the swipe from hijacking page scrolling.
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      touchStartRef.current = { x: 0, y: 0 }; // Reset to stop swipe tracking
      setDragOffset(0);
      return;
    }

    setDragOffset(deltaX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (dragOffset < -minSwipeDistance) {
      onSwipeLeft?.();
    } else if (dragOffset > minSwipeDistance) {
      onSwipeRight?.();
    }

    // Reset state and refs for the next swipe.
    setDragOffset(0);
    touchStartRef.current = { x: 0, y: 0 };
  }, [dragOffset, minSwipeDistance, onSwipeLeft, onSwipeRight]);

  return {
    dragOffset,
    swipeHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};

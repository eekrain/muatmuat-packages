import { useCallback, useState } from "react";

const SWIPE_THRESHOLD = 50; // Minimum distance for a swipe gesture

/**
 * A custom hook to handle both mouse and touch drag gestures.
 * @param {Object} options
 * @param {() => void} options.onSwipeLeft - Callback for a left swipe.
 * @param {() => void} options.onSwipeRight - Callback for a right swipe.
 * @returns {{ dragOffset: number, dragHandlers: Object }}
 */
export const useDrag = ({ onSwipeLeft, onSwipeRight }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const handleDragStart = useCallback((clientX) => {
    setIsDragging(true);
    setStartPos(clientX);
    document.body.style.cursor = "grabbing";
  }, []);

  const handleDragMove = useCallback(
    (clientX) => {
      if (!isDragging) return;
      const offset = clientX - startPos;
      setDragOffset(offset);
    },
    [isDragging, startPos]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    if (dragOffset < -SWIPE_THRESHOLD) {
      onSwipeLeft?.();
    } else if (dragOffset > SWIPE_THRESHOLD) {
      onSwipeRight?.();
    }

    // Reset states
    setIsDragging(false);
    setDragOffset(0);
    setStartPos(0);
    document.body.style.cursor = "";
  }, [isDragging, dragOffset, onSwipeLeft, onSwipeRight]);

  const onMouseDown = (e) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const onMouseMove = (e) => {
    e.preventDefault();
    handleDragMove(e.clientX);
  };

  const onMouseUp = () => {
    handleDragEnd();
  };

  const onMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  const onTouchStart = (e) => {
    handleDragStart(e.touches[0].clientX);
  };

  const onTouchMove = (e) => {
    handleDragMove(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    handleDragEnd();
  };

  return {
    dragOffset,
    dragHandlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
};

"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { Portal } from "@radix-ui/react-portal";

import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} BottomSheetContextType
 * @property {() => void} open - Function to open the sheet.
 * @property {() => void} close - Function to close the sheet.
 * @property {boolean} isOpen - Whether the sheet is currently open.
 */

const BottomSheetContext = createContext(undefined);

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error(
      "useBottomSheet must be used within a BottomSheet component"
    );
  }
  return context;
};

/**
 * @typedef {Object} BottomSheetProps
 * @property {React.ReactNode} children
 * @property {boolean} [open]
 * @property {(open: boolean) => void} [onOpenChange]
 * @property {boolean} [closeOnOutsideClick=true]
 */

export const BottomSheet = ({
  children,
  open: controlledOpen,
  onOpenChange,
  closeOnOutsideClick = true,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const sheetRef = useRef(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const open = useCallback(() => {
    if (isControlled) {
      onOpenChange?.(true);
    } else {
      setUncontrolledOpen(true);
    }
  }, [isControlled, onOpenChange]);

  const close = useCallback(() => {
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      setUncontrolledOpen(false);
    }
  }, [isControlled, onOpenChange]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  const handleClickOutside = useCallback(
    (e) => {
      if (
        closeOnOutsideClick &&
        sheetRef.current &&
        !sheetRef.current.contains(e.target)
      ) {
        close();
      }
    },
    [closeOnOutsideClick, close]
  );

  return (
    <BottomSheetContext.Provider
      value={{ open, close, isOpen, handleClickOutside }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export const BottomSheetTrigger = ({ children, className }) => {
  const baseClass =
    "rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700";
  const { open } = useBottomSheet();
  return (
    <button onClick={open} className={className ?? baseClass}>
      {children}
    </button>
  );
};

export const BottomSheetContent = ({ children, className }) => {
  const { isOpen, handleClickOutside, close } = useBottomSheet();
  const sheetRef = useRef(null);
  const baseClass =
    "fixed left-0 right-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] w-full mx-auto animate-slideUp";

  // Drag state
  const [dragging, setDragging] = React.useState(false);
  const [startY, setStartY] = React.useState(0);
  const [translateY, setTranslateY] = React.useState(0);
  const [velocity, setVelocity] = React.useState(0);
  const [shouldClose, setShouldClose] = React.useState(false);
  const lastYRef = React.useRef(0);
  const lastTimeRef = React.useRef(Date.now());

  // Prevent background scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Touch/mouse event handlers
  const onDragStart = (e) => {
    setDragging(true);
    setShouldClose(false);
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setStartY(clientY - translateY);
    lastYRef.current = clientY;
    lastTimeRef.current = Date.now();
  };

  const onDragMove = (e) => {
    if (!dragging) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - startY;

    if (deltaY < 0) {
      setTranslateY(0); // Don't allow drag up
      setShouldClose(false);
      return;
    }

    setTranslateY(deltaY);

    // Calculate velocity
    const now = Date.now();
    const timeDelta = now - lastTimeRef.current;
    if (timeDelta > 0) {
      setVelocity((clientY - lastYRef.current) / timeDelta);
    }
    lastYRef.current = clientY;
    lastTimeRef.current = now;

    // Enhanced threshold calculation - more sensitive to "near bottom"
    const sheetHeight = sheetRef.current?.offsetHeight || 0;
    const viewportHeight = window.innerHeight;

    // Close threshold: 150px, 30% of sheet height, or 20% of viewport height (whichever is larger)
    const closeThreshold = Math.max(
      150,
      sheetHeight * 0.3,
      viewportHeight * 0.2
    );

    // Set visual feedback when approaching close threshold
    setShouldClose(deltaY > closeThreshold * 0.7);
  };

  const onDragEnd = () => {
    setDragging(false);
    setShouldClose(false);

    // Enhanced threshold calculation
    const sheetHeight = sheetRef.current?.offsetHeight || 0;
    const viewportHeight = window.innerHeight;

    // Multiple conditions for closing:
    // 1. Distance threshold (more generous)
    const distanceThreshold = Math.max(
      150,
      sheetHeight * 0.3,
      viewportHeight * 0.2
    );

    // 2. Velocity threshold (more sensitive)
    const velocityThreshold = 0.8;

    // 3. Near bottom threshold (if dragged more than 60% of viewport height)
    const nearBottomThreshold = viewportHeight * 0.6;

    if (
      translateY > distanceThreshold ||
      velocity > velocityThreshold ||
      translateY > nearBottomThreshold
    ) {
      // Animate out
      const finalPosition = Math.max(sheetHeight, viewportHeight);
      setTranslateY(finalPosition);
      setTimeout(() => {
        setTranslateY(0);
        close();
      }, 250);
    } else {
      // Snap back with smooth animation
      setTranslateY(0);
    }
  };

  // Attach/remove event listeners
  React.useEffect(() => {
    if (!dragging) return;
    const move = (e) => onDragMove(e);
    const up = () => onDragEnd();

    const options = { passive: false };
    window.addEventListener("touchmove", move, options);
    window.addEventListener("touchend", up);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    return () => {
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, startY, translateY]);

  if (!isOpen || typeof window === "undefined") return null;

  // Calculate opacity for backdrop fade effect when dragging
  const backdropOpacity = Math.max(
    0.1,
    1 - translateY / (window.innerHeight * 0.5)
  );

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-end bg-neutral-900/30 bg-opacity-40 transition-opacity duration-200"
        style={{
          backgroundColor: `rgba(38, 38, 38, ${0.3 * backdropOpacity})`,
        }}
        onMouseDown={handleClickOutside}
      >
        <div
          ref={sheetRef}
          className={className ?? baseClass}
          style={{
            transform: `translateY(${translateY}px)`,
            transition: dragging
              ? "none"
              : "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
            touchAction: "none",
            opacity: dragging
              ? Math.max(0.3, 1 - translateY / (window.innerHeight * 0.4))
              : 1,
          }}
          onTouchStart={onDragStart}
          onTouchMove={(e) => dragging && e.preventDefault()}
          onTouchEnd={onDragEnd}
          onMouseDown={onDragStart}
        >
          {/* Enhanced drag handle with visual feedback */}
          <div className="flex cursor-grab select-none justify-center pb-4 pt-2 active:cursor-grabbing">
            <div
              className={
                "h-1.5 w-[38px] rounded-sm bg-[#DDDDDD] transition-colors duration-200"
              }
            />
          </div>
          {children}
        </div>
      </div>
    </Portal>
  );
};

export const BottomSheetHeader = ({ className, children }) => {
  const { close } = useBottomSheet();
  return (
    <div className={cn("flex items-center justify-between px-4", className)}>
      <button
        onClick={close}
        className="flex size-[24px] items-center justify-between"
      >
        <IconComponent
          // className={iconClassnames[type] || iconClassnames.muattrans}
          src="/icons/close24.svg"
          width={24}
          height={24}
        />
      </button>
      <span className="text-[14px] font-bold leading-[15.4px]">{children}</span>
      <div className="size-[24px]" />
    </div>
  );
};

export const BottomSheetFooter = ({ children, className }) => {
  const baseClass = "border-t px-6 py-4 bg-gray-50 rounded-b-2xl";
  return <div className={className ?? baseClass}>{children}</div>;
};

export const BottomSheetClose = ({ children }) => {
  const { close } = useBottomSheet();
  return <button onClick={close}>{children}</button>;
};

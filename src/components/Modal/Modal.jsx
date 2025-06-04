"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { cn } from "@/lib/cn";

/**
 * @typedef {Object} ModalContextType
 * @property {() => void} open - Function to open the modal.
 * @property {() => void} close - Function to close the modal.
 * @property {boolean} isOpen - Whether the modal is currently open.
 */

const ModalContext = createContext(undefined);

/**
 * @returns {ModalContextType}
 */
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a Modal component");
  }
  return context;
};

/**
 * @typedef {Object} ModalRootProps
 * @property {React.ReactNode} children
 * @property {boolean} [open]
 * @property {(open: boolean) => void} [onOpenChange]
 * @property {boolean} [closeOnOutsideClick=true]
 */

/**
 * @param {ModalRootProps} props
 */
export const Modal = ({
  children,
  open: controlledOpen,
  onOpenChange,
  closeOnOutsideClick = false,
  withCloseButton = true,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const dialogRef = useRef(null);

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

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleClickOutside = useCallback(
    (e) => {
      if (
        closeOnOutsideClick &&
        dialogRef.current &&
        !dialogRef.current.contains(e.target)
      ) {
        close();
      }
    },
    [closeOnOutsideClick, close]
  );

  return (
    <ModalContext.Provider
      value={{
        open,
        close,
        isOpen,
        handleClickOutside,
        withCloseButton,
        dialogRef,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

/**
 * @param {{ children: React.ReactNode }} props
 */
export const ModalTrigger = ({ children }) => {
  const { open } = useModal();

  return (
    <div
      onClick={open}
      className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
    >
      {children}
    </div>
  );
};

/**
 * @param {{ children: React.ReactNode, className?: string }} props
 */
export const ModalContent = ({
  size = "small",
  type = "muattrans",
  children,
  className,
}) => {
  const { close, isOpen, handleClickOutside, withCloseButton, dialogRef } =
    useModal();
  const baseClass = "";

  const iconClassnames = {
    muatmuat: "icon-fill-primary-700",
    muatparts: "icon-fill-muat-parts-non-800",
    muattrans: "icon-fill-muat-trans-secondary-900",
  };

  if (!isOpen || typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/25"
      )}
      onMouseDown={handleClickOutside}
    >
      <div ref={dialogRef} className="relative rounded-xl bg-neutral-50">
        {withCloseButton && (
          <button
            className="absolute right-2 top-2 z-[99999] flex cursor-pointer items-center justify-center rounded-full bg-neutral-50"
            onClick={close}
          >
            <IconComponent
              className={iconClassnames[type] || iconClassnames.muattrans}
              src="/icons/close20.svg"
              width={20}
              height={20}
            />
          </button>
        )}
        <div className={className ?? baseClass}>{children}</div>
      </div>
    </div>,
    document.body
  );
};

/**
 * @param {{ children: React.ReactNode, className?: string }} props
 */
export const ModalHeader = ({
  children,
  className,
  type = "muattrans",
  size = "small",
}) => {
  const widths = {
    big: 454,
    small: 386,
  };
  return (
    <div className="overflow-hidden rounded-t-xl">
      <ImageComponent
        src={`/img/${type}-header-${size}.png`}
        width={widths[size] || widths.small}
        height={70}
      />
    </div>
  );
};

/**
 * @param {{ children: React.ReactNode, className?: string }} props
 */
export const ModalFooter = ({ children, className }) => {
  const baseClass = "border-t px-6 py-4 bg-gray-50 rounded-b-2xl";
  return <div className={className ?? baseClass}>{children}</div>;
};

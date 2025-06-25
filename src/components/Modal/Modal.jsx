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

  // Track allowed nodes (e.g., dropdowns rendered via portal)
  const allowedRefs = useRef(new Set());

  const registerAllowedNode = useCallback((node) => {
    if (node) allowedRefs.current.add(node);
  }, []);
  const unregisterAllowedNode = useCallback((node) => {
    if (node) allowedRefs.current.delete(node);
  }, []);

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
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        // Check if this modal is the topmost
        const modals = Array.from(document.querySelectorAll(".modal-parent"));
        const topmost = modals[modals.length - 1];
        // dialogRef.current is the inner dialog, so get its parent
        const thisModalParent = dialogRef.current?.parentElement;
        if (thisModalParent === topmost) {
          close();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close, dialogRef]);

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

  // Updated handleClickOutside to check allowedRefs
  const handleClickOutside = useCallback(
    (e) => {
      if (!closeOnOutsideClick) return;

      // Check if this modal is the topmost one
      const modals = Array.from(document.querySelectorAll(".modal-parent"));
      const topmost = modals[modals.length - 1];
      const thisModalParent = dialogRef.current?.parentElement;

      // Only handle outside click if this modal is the topmost one
      if (thisModalParent !== topmost) return;

      const isInsideDialog =
        dialogRef.current && dialogRef.current.contains(e.target);
      const isInsideAllowed = Array.from(allowedRefs.current).some(
        (node) =>
          node && typeof node.contains === "function" && node.contains(e.target)
      );
      if (!isInsideDialog && !isInsideAllowed) {
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
        registerAllowedNode,
        unregisterAllowedNode,
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
    <div className="cursor-pointer" onClick={open}>
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
  appearance = {
    backgroudClassname: "",
    closeButtonClassname: "",
  },
}) => {
  const { close, isOpen, handleClickOutside, withCloseButton, dialogRef } =
    useModal();

  const iconClassnames = {
    muatmuat: "icon-fill-primary-700",
    muatparts: "icon-fill-muat-parts-non-800",
    muattrans: "icon-fill-muat-trans-secondary-900",
  };
  useEffect(() => {
    if (!isOpen) return;

    // Delay to ensure all modals are mounted in the DOM
    const timeout = setTimeout(() => {
      const modals = Array.from(document.querySelectorAll(".modal-parent"));
      // modals.forEach((modal, idx) => {
      //   modal.classList.remove("invisible");
      //   if (idx < modals.length - 1) {
      //     modal.classList.add("invisible");
      //   }
      // });
    }, 10); // 10ms is usually enough

    // Cleanup: when this modal unmounts, re-check visibility
    return () => {
      clearTimeout(timeout);
      const modals = Array.from(document.querySelectorAll(".modal-parent"));
      // modals.forEach((modal, idx) => {
      //   modal.classList.remove("invisible");
      //   if (idx < modals.length - 1) {
      //     modal.classList.add("invisible");
      //   }
      // });
    };
  }, [isOpen]);

  if (!isOpen || typeof window === "undefined") {
    return null;
  }

  return (
    <Portal>
      <div
        className={cn(
          "modal-parent fixed inset-0 z-50 flex items-center justify-center bg-black/25",
          appearance.backgroudClassname
        )}
        onMouseDown={handleClickOutside}
      >
        {type === "lightbox" && (
          <button
            onClick={close}
            className="absolute left-4 top-[55px] text-white"
          >
            <IconComponent
              className="text-white"
              src="/icons/close20.svg"
              width={24}
              height={24}
            />
          </button>
        )}

        <div
          ref={dialogRef}
          className={cn("relative rounded-xl bg-neutral-50", className)}
        >
          {withCloseButton && (
            <button
              className={cn(
                "absolute right-2 top-2 z-50 flex cursor-pointer items-center justify-center rounded-full bg-neutral-50",
                appearance.closeButtonClassname
              )}
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
          {children}
        </div>
      </div>
    </Portal>
  );
};

const widthStyles = {
  big: "w-modal-big",
  small: "w-modal-small",
};
/**
 * @param {{ children: React.ReactNode, className?: string }} props
 */
export const ModalHeader = ({
  className,
  type = "muattrans",
  size = "small",
}) => {
  return (
    <img
      src={`/img/${type}-header-${size}.png`}
      height={70}
      className={cn("w-f rounded-t-xl", widthStyles[size], className)}
      alt="Modal Header"
    />
  );
};

/**
 * @param {{ children: React.ReactNode, className?: string }} props
 */
export const ModalFooter = ({ children, className }) => {
  const baseClass = "border-t px-6 py-4 bg-gray-50 rounded-b-2xl";
  return <div className={className ?? baseClass}>{children}</div>;
};

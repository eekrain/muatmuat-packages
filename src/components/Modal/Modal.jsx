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
 * @typedef {'muatmuat' | 'muatparts' | 'muattrans' | 'lightbox'} ModalType
 */

/**
 * @typedef {'xl' | 'big' | 'small'} ModalSize
 */

/**
 * @typedef {Object} ModalAppearance
 * @property {string} [backgroudClassname] - Additional CSS classes for the modal background overlay.
 * @property {string} [closeButtonClassname] - Additional CSS classes for the close button.
 */

/**
 * @typedef {Object} ModalContextType
 * @property {() => void} open - Function to open the modal.
 * @property {() => void} close - Function to close the modal.
 * @property {boolean} isOpen - Whether the modal is currently open.
 * @property {(e: MouseEvent) => void} handleClickOutside - Internal handler for clicks outside the modal.
 * @property {boolean} withCloseButton - Whether the modal should display a close button.
 * @property {React.RefObject<HTMLDivElement>} dialogRef - Ref to the modal's dialog element.
 * @property {(node: HTMLElement | null) => void} registerAllowedNode - Registers a node that is considered "inside" the modal for outside click detection.
 * @property {(node: HTMLElement | null) => void} unregisterAllowedNode - Unregisters an allowed node.
 */

/** @type {React.Context<ModalContextType | undefined>} */
const ModalContext = createContext(undefined);

/**
 * A hook to access the modal context, providing functions to open and close the modal, and its current open state.
 * @returns {ModalContextType}
 * @throws {Error} If used outside of a Modal.Root component.
 */
export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a Modal.Root");
  }
  return context;
};

/**
 * @typedef {Object} ModalRootProps
 * @property {React.ReactNode} children - The child components to be rendered within the modal context.
 * @property {boolean} [open] - Controls the open state of the modal. If provided, the modal becomes a controlled component.
 * @property {(open: boolean) => void} [onOpenChange] - Callback fired when the open state of the modal changes.
 * @property {boolean} [closeOnOutsideClick=false] - If true, the modal will close when clicking outside of it.
 * @property {boolean} [withCloseButton=true] - If true, the modal will render a default close button.
 */

/**
 * The root component for the modal. It provides the context for other modal components.
 * Can be used as a controlled or uncontrolled component.
 * @param {ModalRootProps} props
 * @returns {JSX.Element}
 */
export const Modal = ({
  children,
  open: controlledOpen,
  onOpenChange,
  closeOnOutsideClick = false,
  withCloseButton = true,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  /** @type {React.RefObject<HTMLDivElement>} */
  const dialogRef = useRef(null);

  /** @type {React.MutableRefObject<Set<HTMLElement>>} */
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
  }, [isOpen, close]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;

      // Calculate scrollbar width BEFORE hiding the scrollbar
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Prevent background scroll
      document.body.style.overflow = "hidden";

      // Add padding to prevent layout shift when scrollbar disappears
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    } else {
      // Reset padding when modal is not open
      document.body.style.paddingRight = "";
    }
  }, [isOpen]);

  const handleClickOutside = useCallback(
    /**
     * @param {MouseEvent} e - The mouse event.
     */
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
 * @typedef {Object} ModalTriggerProps
 * @property {React.ReactNode} children - The content of the trigger.
 * @property {string} [className] - Additional CSS classes for the trigger element.
 */

/**
 * A component that triggers the opening of the modal when clicked.
 * @param {ModalTriggerProps} props
 * @returns {JSX.Element}
 */
export const ModalTrigger = ({ className, children }) => {
  const { open } = useModal();

  return (
    <div className={cn("cursor-pointer", className)} onClick={open}>
      {children}
    </div>
  );
};

/**
 * @typedef {Object} ModalCloseProps
 * @property {React.ReactNode} children - The content of the close button.
 * @property {() => void} [onClick] - Optional click handler that fires before the modal closes.
 */

/**
 * A component that triggers the closing of the modal when clicked.
 * @param {ModalCloseProps} props
 * @returns {JSX.Element}
 */
export const ModalClose = ({ children, onClick }) => {
  const { close } = useModal();

  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        onClick?.();
        close();
      }}
    >
      {children}
    </div>
  );
};

/**
 * @typedef {Object} ModalContentProps
 * @property {ModalSize} [size='small'] - The size of the modal content.
 * @property {ModalType} [type='muattrans'] - The type of modal, influencing styling (e.g., header image, icon color).
 * @property {React.ReactNode} children - The content to be displayed inside the modal.
 * @property {string} [className] - Additional CSS classes for the modal content container.
 * @property {ModalAppearance} [appearance] - Custom appearance options for the modal.
 */

/**
 * The main content area of the modal. Renders the modal overlay and the dialog itself.
 * @param {ModalContentProps} props
 * @returns {JSX.Element | null}
 */
export const ModalContent = ({
  size = "small",
  type = "muatmuat",
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
    lightbox: "icon-fill-primary-700",
  };

  useEffect(() => {
    if (!isOpen) return;

    // Delay to ensure all modals are mounted in the DOM
    const timeout = setTimeout(() => {
      const modals = Array.from(document.querySelectorAll(".modal-parent"));
      modals.forEach((modal, idx) => {
        modal.classList.remove("invisible");
        // Hide all but the topmost modal
        if (idx < modals.length - 1) {
          modal.classList.add("invisible");
        }
      });
    }, 10); // 10ms is usually enough

    // Cleanup: when this modal unmounts, re-check visibility for other modals
    return () => {
      clearTimeout(timeout);
      const modals = Array.from(document.querySelectorAll(".modal-parent"));
      modals.forEach((modal, idx) => {
        modal.classList.remove("invisible");
        if (idx < modals.length - 1) {
          modal.classList.add("invisible");
        }
      });
    };
  }, [isOpen]);

  if (!isOpen || typeof window === "undefined") {
    return null;
  }

  return (
    <Portal
      className={cn(
        "modal-parent fixed inset-0 z-50 flex items-center justify-center bg-black/25",
        appearance.backgroudClassname
      )}
      onMouseDown={handleClickOutside}
    >
      {type === "lightbox" && (
        <button
          onClick={close}
          className="absolute left-4 top-[55px] block text-white md:hidden"
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
        className={cn(
          "relative rounded-xl bg-neutral-50",
          type === "lightbox" && "bg-transparent",
          className
        )}
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
              className={cn(
                "size-6 md:size-5",
                iconClassnames[type] || iconClassnames.muattrans,
                appearance.closeButtonClassname
              )}
              src="/icons/close20.svg"
            />
          </button>
        )}

        <div className="md:rounded-xl">{children}</div>
      </div>
    </Portal>
  );
};

const widthStyles = {
  xl: "w-modal-xl",
  big: "w-modal-big",
  small: "w-modal-small",
};

/**
 * @typedef {Object} ModalHeaderProps
 * @property {ModalType} [type='muattrans'] - The type of modal, influencing the header image.
 * @property {ModalSize} [size='small'] - The size of the modal, influencing the header image.
 * @property {string} [className] - Additional CSS classes for the header image.
 */

/**
 * A component to display a header image for the modal.
 * @param {ModalHeaderProps} props
 * @returns {JSX.Element}
 */
export const ModalHeader = ({
  className,
  type = "muattrans",
  size = "small",
}) => {
  return (
    <div className="overflow-hidden rounded-t-xl">
      <img
        src={`/img/${type}-header-${size}.png`}
        height={70}
        className={cn("rounded-t-xl", widthStyles[size], className)}
        alt="Modal Header"
      />
    </div>
  );
};

/**
 * @typedef {Object} ModalFooterProps
 * @property {React.ReactNode} children - The content of the footer.
 * @property {string} [className] - Additional CSS classes for the footer container.
 */

/**
 * A component to display a footer section within the modal.
 * @param {ModalFooterProps} props
 * @returns {JSX.Element}
 */
export const ModalFooter = ({ children, className }) => {
  const baseClass = "border-t px-6 py-4 bg-gray-50 rounded-b-2xl";
  return <div className={className ?? baseClass}>{children}</div>;
};

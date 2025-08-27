"use client";

import { createContext, useContext, useRef, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";

import IconComponent from "@/components/IconComponent/IconComponent";

import { cn } from "@/lib/utils";

const ModalContext = createContext(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === null) {
    throw new Error("useModal must be used within a Modal");
  }
  return context;
};

export const Modal = ({
  children,
  open: controlledOpen,
  onOpenChange,
  ...props
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = (newOpenState) => {
    if (!isControlled) {
      setUncontrolledOpen(newOpenState);
    }
    onOpenChange?.(newOpenState);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <ModalContext.Provider value={{ open: isOpen, ...props }}>
        {children}
      </ModalContext.Provider>
    </Dialog.Root>
  );
};

export const ModalTitle = ({ className, children }) => {
  return (
    <Dialog.Title
      className={cn(
        "text-center text-base font-bold text-neutral-900",
        className
      )}
    >
      {children}
    </Dialog.Title>
  );
};

export const ModalTrigger = ({ className, children, asChild = true }) => {
  return (
    <Dialog.Trigger asChild={asChild} className={className}>
      {children}
    </Dialog.Trigger>
  );
};

export const ModalContent = ({
  size = "small",
  type = "muatmuat",
  children,
  className,
  appearance = {
    backgroudClassname: "",
    closeButtonClassname: "",
  },
  ...props
}) => {
  const {
    open,
    withCloseButton = true,
    closeOnOutsideClick = false,
  } = useModal();
  const dialogRef = useRef(null);

  const iconClassnames = {
    muatmuat: "text-primary-700",
    muatparts: "text-muat-parts-non-800",
    muattrans: "text-muat-trans-secondary-900",
    lightbox: "text-primary-700",
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay
        data-stack-item="true"
        className={cn(
          "fixed inset-0 z-[50] bg-black/25",
          "data-[state=open]:animate-overlay-show",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          appearance.backgroudClassname
        )}
      >
        {type === "lightbox" && (
          <Dialog.Close className="absolute left-4 top-[55px] z-[9999] block text-white md:hidden">
            <IconComponent
              className="text-white"
              src="/icons/close20.svg"
              width={24}
              height={24}
            />
          </Dialog.Close>
        )}
      </Dialog.Overlay>

      <Dialog.Content
        ref={dialogRef}
        data-stack-content="true"
        onEscapeKeyDown={(e) => {
          const stackItems = Array.from(
            document.querySelectorAll('[data-stack-item="true"]')
          );
          const isTopmost =
            dialogRef.current?.parentElement?.parentElement ===
            stackItems[stackItems.length - 1];
          if (!isTopmost) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if (!closeOnOutsideClick) {
            e.preventDefault();
          }
        }}
        {...props}
        className={cn(
          "fixed left-1/2 top-1/2 z-[51] -translate-x-1/2 -translate-y-1/2",
          "rounded-xl bg-neutral-50 shadow-lg",
          "data-[state=open]:animate-content-show",
          // --- THIS LINE IS THE ONLY CHANGE ---
          "data-[state=closed]:animate-content-hide",
          type === "lightbox" && "bg-transparent shadow-none",
          className
        )}
      >
        {children}
        {withCloseButton && (
          <Dialog.Close asChild>
            <button
              className={cn(
                "absolute right-2 top-2 z-50 flex cursor-pointer items-center justify-center rounded-full bg-neutral-50",
                appearance.closeButtonClassname
              )}
              aria-label="Close"
            >
              <IconComponent
                className={cn(
                  "size-6 md:size-5",
                  iconClassnames[type] || iconClassnames.muattrans
                )}
                src="/icons/close20.svg"
              />
            </button>
          </Dialog.Close>
        )}
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export const ModalHeader = ({ className }) => (
  <div
    className={cn(
      "relative flex h-[70px] justify-between overflow-hidden rounded-t-xl bg-muat-trans-primary-400",
      className
    )}
  >
    <div>
      <img
        alt="svg header modal kiri"
        src="/img/header-modal/header-kiri.svg"
        className="h-full w-full object-cover"
      />
    </div>
    <div className="my-auto">
      <img
        alt="logo muatmuat header coklat"
        src="/img/header-modal/muatmuat-brown.svg"
      />
    </div>
    <div>
      <img
        alt="svg header modal kanan "
        src="/img/header-modal/header-kanan.svg"
        className="h-full w-full object-cover"
      />
    </div>
  </div>
);

export const ModalFooter = ({ className, children }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 rounded-b-xl bg-white px-6 pb-9 pt-6",
        className
      )}
    >
      {children}
    </div>
  );
};

export const ModalClose = ({ asChild = true, children }) => {
  return <Dialog.Close asChild={asChild}>{children}</Dialog.Close>;
};

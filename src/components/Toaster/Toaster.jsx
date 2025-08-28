"use client";

import { useEffect, useMemo } from "react";

import { Portal } from "@radix-ui/react-portal";
import PropTypes from "prop-types";

import IconComponent from "@/components/IconComponent/IconComponent";

import useDevice from "@/hooks/use-device";

import { cn } from "@/lib/utils";

import { useToastStore } from "@/store/Shipper/toastStore";

const Toaster = ({ className }) => {
  const dataToast = useToastStore((state) => state.dataToast);
  const { removeToast, removeAll } = useToastStore((state) => state.actions);
  const { isMobile, mounted } = useDevice();

  const bottomOffset = useMemo(() => {
    // Getting the right offset for the toast
    // 29px is the position of Pusat Bantuan Icon
    // 70px is the height of Pusat Bantuan Icon
    // 69px is the offset from the Pusat Bantuan Icon
    if (!isMobile) return "calc(29px + 70px + 14px)";

    // Getting the height of the responsive footer
    const footerHeight =
      document.getElementById("responsive-footer")?.clientHeight || 0;

    return `calc(20px + ${footerHeight}px)`;

    // dataToast must be added to the dependency array, so we can recalculate the offset when the toast is added or removed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, dataToast]);

  useEffect(() => {
    return () => {
      removeAll();
    };
  }, [removeAll]);

  if (!mounted) return null;

  return (
    <Portal>
      <div
        className={cn(
          "pointer-events-none fixed z-[51] flex flex-col gap-2", // defaults
          "left-0 w-full px-4", // mobile specific
          "md:left-auto md:right-[48px] md:w-fit md:items-end md:px-0" // desktop specific
        )}
        style={{
          bottom: bottomOffset,
        }}
        role="region"
        aria-label="Notifications"
      >
        {dataToast.map((toast, index) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex h-[48px] w-full items-center justify-between gap-3 rounded-lg border px-3 md:w-[440px]",
              toast.type === "success" && "border-success-400 bg-success-50",
              toast.type === "error" && "border-error-400 bg-error-50",
              toast.isLeaving ? "animate-leave" : "animate-enter",
              className
            )}
            style={{
              animationDelay: toast.isLeaving ? "0ms" : `${index * 150}ms`,
            }}
            role="alert"
            aria-live="polite"
          >
            <div className="flex flex-1 items-center gap-3">
              <div className="flex-shrink-0">
                <IconComponent
                  src={
                    toast.type === "success"
                      ? "/icons/toast-succes.svg"
                      : "/icons/toast-error.svg"
                  }
                  className={cn(
                    toast.type === "success"
                      ? "text-success-400"
                      : "text-error-400"
                  )}
                  height={18}
                  width={18}
                  aria-hidden="true"
                />
              </div>
              <span className="flex-1 text-xs font-semibold leading-[1.2] tracking-tight text-neutral-900">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex size-6 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/10"
              aria-label="Close notification"
            >
              <IconComponent
                src="/icons/toast-close.svg"
                height={16}
                width={16}
                className="text-neutral-700"
              />
            </button>
          </div>
        ))}
      </div>
    </Portal>
  );
};

Toaster.propTypes = {
  className: PropTypes.string,
};

export default Toaster;

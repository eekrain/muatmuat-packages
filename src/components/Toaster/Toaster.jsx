"use client";

import { useEffect, useMemo, useState } from "react";

import PropTypes from "prop-types";
import { createPortal } from "react-dom";

import IconComponent from "@/components/IconComponent/IconComponent";
import useDevice from "@/hooks/use-device";
import { cn } from "@/lib/cn";
import { useToastStore } from "@/store/toastStore";

const Toaster = ({ className }) => {
  const [mounted, setMounted] = useState(false);
  const dataToast = useToastStore((state) => state.dataToast);
  const { removeToast, removeAll } = useToastStore((state) => state.actions);
  const { isMobile } = useDevice();

  const bottomOffset = useMemo(() => {
    if (!isMobile) return "80px";
    const footerHeight =
      document.getElementById("responsive-footer")?.clientHeight || 0;
    console.log("🚀 ~ bottomOffset ~ footerHeight:", footerHeight);

    return `calc(20px + ${footerHeight}px)`;
  }, [isMobile]);
  console.log("🚀 ~ bottomOffset ~ bottomOffset:", bottomOffset);

  useEffect(() => {
    return () => {
      removeAll();
    };
  }, [removeAll]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        "fixed left-0 z-50 mx-4 flex flex-col items-end gap-2 md:right-0 md:mx-0",
        "pointer-events-none"
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
            "pointer-events-auto flex w-fit items-center justify-between rounded-lg border px-4 py-3 text-sm font-semibold text-neutral-900",
            "animate-enter",
            toast.type === "success" && "border-success-400 bg-success-50",
            toast.type === "error" && "border-error-400 bg-error-50",
            className
          )}
          style={{
            animationDelay: `${index * 150}ms`,
          }}
          role="alert"
          aria-live="polite"
        >
          <div className="flex w-[328px] items-center gap-3 pr-2 md:w-[380px]">
            <div className="flex-shrink-0">
              <IconComponent
                src={
                  toast.type === "success"
                    ? "/icons/toast-succes.svg"
                    : "/icons/toast-error.svg"
                }
                height={20}
                className={cn(
                  toast.type === "success"
                    ? "text-success-400"
                    : "text-error-400"
                )}
                width={20}
                aria-hidden="true"
              />
            </div>
            <span className="flex-1 text-xs font-semibold">
              {toast.message}
            </span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 cursor-pointer rounded-full p-1 transition-colors hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/10"
            aria-label="Close notification"
          >
            <IconComponent
              src="/icons/toast-close.svg"
              height={20}
              width={20}
            />
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
};

Toaster.propTypes = {
  className: PropTypes.string,
};

export default Toaster;

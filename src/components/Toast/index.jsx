"use client";

import { useEffect, useState } from "react";

import PropTypes from "prop-types";
import { createPortal } from "react-dom";

import IconComponent from "@/components/IconComponent/IconComponent";
import { useToastStore } from "@/store/toastStore";

const Toaster = ({ className }) => {
  const [mounted, setMounted] = useState(false);
  const { dataToast, actions } = useToastStore();

  useEffect(() => {
    return () => {
      dataToast.forEach((toast) => clearTimeout(toast._timeout));
    };
  }, [dataToast]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="bg-blue fixed bottom-0 right-0 z-[9999999999] flex flex-col items-end gap-2 sm:bottom-20 sm:left-0 sm:right-0 sm:mx-4">
      {dataToast.map((toast) => (
        <div
          key={toast.id}
          className={`flex w-fit items-center justify-between rounded-lg border px-4 py-3 text-sm font-semibold text-neutral-900 transition-all duration-500 ease-in-out ${
            toast.type === "success"
              ? "border-success-400 bg-success-50"
              : "border-error-400 bg-error-50"
          } ${className}`}
        >
          <div className="flex w-[380px] items-center gap-3 pr-2">
            <div className="flex-shrink-0">
              <IconComponent
                src={
                  toast.type === "success"
                    ? "/icons/toast-succes.svg"
                    : "/icons/toast-error.svg"
                }
                height={20}
                width={20}
              />
            </div>
            <span className="flex-1 text-xs font-semibold">
              {toast.message}
            </span>
          </div>
          <IconComponent
            src="/icons/toast-close.svg"
            height={20}
            width={20}
            className="flex-shrink-0 cursor-pointer"
            onClick={() => actions.removeToast(toast.id)}
          />
        </div>
      ))}
    </div>,
    typeof window !== "undefined" ? document.body : undefined
  );
};

Toaster.propTypes = {
  className: PropTypes.string,
};

export default Toaster;

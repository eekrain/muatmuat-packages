"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import PropTypes from "prop-types";
import { createPortal } from "react-dom";

import IconComponent from "@/components/IconComponent/IconComponent";
import toast from "@/store/toast";

export const TopToast = ({
  className,
  children = "Toast",
  onClick,
  iconSrc,
  showToast,
  setShowToast,
  dataToast,
}) => {
  const pathname = usePathname();

  useEffect(() => {
    if (showToast) {
      setShowToast(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showToast, onClick]);

  // 25. 11 - QC Plan - Web - Ronda Live Mei - LB - 0072
  // Using portal to render toast in the body ensuring they are not affected by any parent stacking context
  return createPortal(
    <div
      className={`fixed bottom-[75px] right-[25px] z-[9999999999] transition-all duration-500 ease-in-out max-[600px]:bottom-20 max-[600px]:left-0 max-[600px]:right-0 max-[600px]:mx-4 ${showToast ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-10 opacity-0"} ${showToast ? "max-[600px]:translate-y-0" : "max-[600px]:translate-y-full"} flex items-center justify-between rounded-lg border p-3 text-neutral-900 ${
        dataToast.type === "success"
          ? "border-[#27CF23] bg-[#ECFAE5] text-[#27CF23]"
          : "border-[#F71717] bg-[#FDD1D1] text-[#F71717]"
      } ${className} `}
    >
      {/* Content Container */}
      <div className="flex w-[380px] items-center gap-x-2 pr-2 max-[600px]:w-full">
        {/* Icon */}
        <IconComponent
          src={
            iconSrc ||
            (dataToast.type === "success"
              ? "/icons/success-toast.svg"
              : "/icons/error-toast.svg")
          }
        />

        {/* Message */}
        <span
          className={`flex-1 text-[12px] font-medium leading-[14.4px] text-neutral-900 ${dataToast.type === "success" ? "!text-[#27CF23]" : ""} ${dataToast.type === "error" ? "!text-[#F71717]" : ""}`}
        >
          {dataToast.message || children}
        </span>
      </div>

      {/* Close Button */}
      <IconComponent
        src="/icons/silang.svg"
        height={14}
        width={14}
        className="flex-shrink-0 cursor-pointer"
        onClick={() => (onClick ? onClick() : setShowToast(false))}
      />
    </div>,
    typeof window !== "undefined" ? document.body : undefined
  );
};

const Toast = ({ className, children = "Toast", onClick, iconSrc }) => {
  const { showToast, setShowToast, dataToast } = toast();
  const pathname = usePathname();

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showToast, onClick]);

  useEffect(() => {
    if (showToast) {
      setShowToast(false);
    }
  }, [pathname]);

  // Using portal to render toast in the body ensuring they are not affected by any parent stacking context
  return createPortal(
    <div
      className={`fixed bottom-[75px] right-[25px] z-[9999999999] transition-all duration-500 ease-in-out max-[600px]:bottom-20 max-[600px]:left-0 max-[600px]:right-0 max-[600px]:mx-4 ${showToast ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-10 opacity-0"} ${showToast ? "max-[600px]:translate-y-0" : "max-[600px]:translate-y-full"} flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-semibold text-neutral-900 ${
        dataToast.type === "success"
          ? "border-success-400 bg-success-50"
          : "border-error-400 bg-error-50"
      } ${className} `}
    >
      {/* Content Container */}
      <div className=":w-full flex items-center gap-3 pr-2 lg:w-[380px]">
        {/* Icon */}
        <div className="flex-shrink-0">
          <IconComponent
            src={
              iconSrc ||
              (dataToast.type === "success"
                ? "/icons/success-toast.svg"
                : "/icons/error-toast.svg")
            }
            height={20}
            width={20}
          />
        </div>

        {/* Message */}
        <span className="flex-1 text-xs font-semibold">
          {dataToast.message || children}
        </span>
      </div>

      {/* Close Button */}
      <IconComponent
        src="/icons/silang.svg"
        height={20}
        width={20}
        className="flex-shrink-0 cursor-pointer"
        onClick={() => (onClick ? onClick() : setShowToast(false))}
      />
    </div>,
    typeof window !== "undefined" ? document.body : undefined
  );
};

Toast.propTypes = {
  className: PropTypes.string,
  children: PropTypes.string,
  onClick: PropTypes.func,
  iconSrc: PropTypes.string,
};

export default Toast;

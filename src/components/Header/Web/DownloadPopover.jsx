"use client";

import { useEffect, useRef, useState } from "react";

import { Portal } from "@radix-ui/react-portal";

import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/cn";

export const DownloadPopover = () => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const downloadRef = useRef(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Update popover position based on trigger element
  const updatePosition = () => {
    if (downloadRef.current) {
      const rect = downloadRef.current.getBoundingClientRect();
      setPosition({
        // Since header is fixed, we use the bottom position directly from getBoundingClientRect
        top: rect.bottom,
        // For horizontal position, we still need window.scrollX to account for horizontal scrolling
        left: rect.left + window.scrollX,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!open) return;

      const isOverLink = downloadRef.current?.contains(e.target);
      const isOverPopover = popoverRef.current?.contains(e.target);

      if (!isOverLink && !isOverPopover) {
        setOpen(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [open]);

  return (
    <a
      ref={downloadRef}
      className="relative flex cursor-pointer items-center gap-1 text-xs font-medium no-underline"
      href={`${process.env.NEXT_PUBLIC_INTERNAL_WEB}register/download_apps`}
      onMouseEnter={() => {
        updatePosition();
        setOpen(true);
      }}
    >
      <div className="flex items-center gap-x-1">
        <IconComponent src="/icons/mobile.svg" />
        <span className="text-[12px] font-semibold leading-[12px]">
          {t("linkDownloadMuatMuat")}
        </span>
      </div>
      <Portal>
        <div
          ref={popoverRef}
          className={cn(
            "fixed z-50 pt-[22px]",
            open ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          style={{
            top: position.top,
            left: position.left,
          }}
        >
          <div className="flex w-[392px] items-center gap-6 rounded-xl bg-white p-8 shadow-lg">
            <ImageComponent
              src="/img/qr-downloadapps.png"
              width={132}
              height={132}
              alt="download"
            />
            <div className="flex flex-col items-center justify-center gap-4">
              <span className="text-center text-sm font-semibold text-[#1b1b1b]">
                {t("labelScanQr")}
              </span>
              <ImageComponent
                loading="lazy"
                src="/icons/play-store.svg"
                alt="Download Apps"
                className="cursor-pointer object-contain"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(
                    "https://play.google.com/store/apps/developer?id=PT.+AZLOGISTIK+DOT+COM",
                    "_blank"
                  );
                }}
              />
            </div>
          </div>
        </div>
      </Portal>
    </a>
  );
};

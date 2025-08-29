"use client";

import { usePathname } from "next/navigation";

import FloatingButton from "@/components/FloatingButton/FloatingButton";

import { cn } from "@/lib/utils";

import { useOverlay } from "@/store/Shared/overlayStore";
import { useNotificationCounterStore } from "@/store/Shipper/notificationCounterStore";

import HeaderLayout from "../HeaderLayout/HeaderLayout";

export default function DesktopLayout({ children }) {
  const pathname = usePathname();

  const { notification, chat } = useNotificationCounterStore();
  const { isOverlayActive } = useOverlay();

  const arr = ["/register/otp"];
  if (arr.some((item) => pathname.includes(item))) {
    return children;
  }

  // Check if we're on the monitoring page
  const isMonitoringPage =
    pathname.includes("/monitoring") && !pathname.includes("/detail-pesanan");

  return (
    <div className="relative min-h-screen">
      <HeaderLayout notifCounter={{ notification, chat }} />
      {isOverlayActive && (
        <div className="fixed inset-0 top-[92px] z-30 bg-black/25" />
      )}
      <div className={cn("mx-auto max-h-[calc(100dvh-92px)] max-w-[1232px]")}>
        {children}
      </div>
      {!isMonitoringPage && <FloatingButton />}

      <img
        src="/img/background-indonesia-map.webp"
        alt="bg-muattrans"
        className="fixed bottom-0 left-0 z-[-1] w-screen object-contain"
      />
    </div>
  );
}

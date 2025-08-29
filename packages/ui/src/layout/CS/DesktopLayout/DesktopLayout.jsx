"use client";

import { usePathname } from "next/navigation";

import FloatingButton from "@/components/FloatingButton/FloatingButton";

import { useAuth } from "@/hooks/use-auth";

import { cn } from "@/lib/utils";

import { useOverlay } from "@/store/Shared/overlayStore";
import { useNotificationCounterStore } from "@/store/Shipper/notificationCounterStore";

import HeaderLayout from "../HeaderLayout/HeaderLayout";

export default function DesktopLayout({ children }) {
  const pathname = usePathname();

  const { isLoggedIn } = useAuth();
  const { notification, chat } = useNotificationCounterStore();
  const { isOverlayActive } = useOverlay();

  const arr = ["/register/otp"];
  if (arr.some((item) => pathname.includes(item))) {
    return children;
  }
  // Check if we're on the monitoring page
  const isMonitoringPage = pathname.includes("/monitoring");
  return (
    <div className="relative min-h-screen">
      <HeaderLayout notifCounter={{ notification, chat }} />
      <main
        className={cn(
          "relative",
          true ? "min-h-[calc(100dvh-92px)]" : "min-h-[calc(100dvh-60px)]"
        )}
      >
        {children}
        {isOverlayActive && (
          <div className="absolute inset-0 z-20 bg-black/25" />
        )}
      </main>
      {!isMonitoringPage && <FloatingButton />}

      <img
        src="/img/background-indonesia-map.webp"
        alt="bg-muattrans"
        className="fixed bottom-0 left-0 z-[-1] w-screen object-contain"
      />
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";

import FloatingButton from "@/components/FloatingButton/FloatingButton";
import HeaderWeb from "@/components/Header/Web/HeaderWeb";
import { useAuth } from "@/hooks/use-auth";
import { useNotificationCounterStore } from "@/store/Shipper/notificationCounterStore";

export default function DesktopLayout({ children }) {
  const pathname = usePathname();

  const { isLoggedIn } = useAuth();
  const { notification, chat } = useNotificationCounterStore();

  const arr = ["/register/otp"];
  if (arr.some((item) => pathname.includes(item))) {
    return children;
  }

  return (
    <div className="relative min-h-screen">
      <HeaderWeb notifCounter={{ notification, chat }} />
      <div
        className={
          isLoggedIn ? "min-h-[calc(100dvh-92px)]" : "min-h-[calc(100dvh-60px)]"
        }
      >
        {children}
      </div>
      <FloatingButton />

      <img
        src="/img/background-indonesia-map.webp"
        alt="bg-muattrans"
        className="fixed bottom-0 left-0 z-[-1] w-screen object-contain"
      />
    </div>
  );
}

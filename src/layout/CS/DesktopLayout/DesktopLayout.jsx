"use client";

import { usePathname } from "next/navigation";

import FloatingButton from "@/components/FloatingButton/FloatingButton";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useNotificationCounterStore } from "@/store/Shipper/notificationCounterStore";

import HeaderLayout from "../HeaderLayout/HeaderLayout";

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
      <HeaderLayout notifCounter={{ notification, chat }} />
      <main
        className={cn(
          isLoggedIn ? "max-h-[calc(100dvh-92px)]" : "max-h-[calc(100dvh-60px)]"
        )}
      >
        {children}
      </main>
      <FloatingButton />

      <img
        src="/img/background-indonesia-map.webp"
        alt="bg-muattrans"
        className="fixed bottom-0 left-0 z-[-1] w-screen object-contain"
      />
    </div>
  );
}

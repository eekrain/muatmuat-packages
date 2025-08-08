"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

import LoadingInteractive from "@/components/Loading/LoadingInteractive";
import LoadingStatic from "@/components/Loading/LoadingStatic";
import Toaster from "@/components/Toaster/Toaster";
import { AuthenticationProvider } from "@/hooks/use-auth";
import useDevice from "@/hooks/use-device";
import { TranslationProvider } from "@/hooks/use-translation";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { StackManagerInitializer } from "@/lib/stack-manager";
import { useLoadingAction } from "@/store/Shared/loadingStore";
import { useNotificationCounterActions } from "@/store/Shipper/notificationCounterStore";

const MainLayout = ({ children }) => {
  return (
    <Suspense fallback={<LoadingStatic />}>
      <TranslationProvider>
        <LoadingInteractive />

        <AuthenticationProvider>{children}</AuthenticationProvider>
      </TranslationProvider>
      <Toaster />
      <Script />
      <StackManagerInitializer />
    </Suspense>
  );
};

export default MainLayout;

const Script = () => {
  useDefaultTimeoutLoading();
  useResetNavigationOnDesktop();

  const { fetchSidebarData } = useNotificationCounterActions();
  useEffect(() => {
    fetchSidebarData().catch((error) => {
      // Error fetching sidebar data
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

const useResetNavigationOnDesktop = () => {
  const router = useRouter();
  const { isMobile, mounted } = useDevice();
  const { replace: replaceNavigation } = useResponsiveNavigation();
  const searchParams = useSearchParams();
  const screenSearchParam = searchParams.get("screen");

  useEffect(() => {
    if (!mounted || !screenSearchParam) return;
    if (!isMobile) {
      const currentSeach = new URLSearchParams(window.location.search);
      currentSeach.delete("screen");
      router.replace(`${window.location.pathname}?${currentSeach.toString()}`, {
        scroll: false,
      });
      replaceNavigation("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, mounted, screenSearchParam]);
};

const useDefaultTimeoutLoading = () => {
  const { setIsGlobalLoading } = useLoadingAction();
  const timer = useRef();

  useEffect(() => {
    // Jaga jaga kalau pada lupa untuk menutup loading, secara default loading selalu muncul dan akan reset menjadi false selama 2 detik
    timer.current = setTimeout(() => {
      setIsGlobalLoading(false);
    }, 2000);

    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

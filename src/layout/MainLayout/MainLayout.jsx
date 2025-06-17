"use client";

import { Suspense, useEffect, useRef } from "react";

import LoadingInteractive from "@/components/Loading/LoadingInteractive";
import LoadingStatic from "@/components/Loading/LoadingStatic";
import Toaster from "@/components/Toaster/Toaster";
import { useInitAuthentication } from "@/hooks/use-auth";
import useDevice from "@/hooks/use-device";
import { useInitTranslation, useTranslation } from "@/hooks/use-translation";
import { useLoadingAction } from "@/store/loadingStore";
import { useNotificationCounterActions } from "@/store/notificationCounterStore";

import DesktopLayout from "../DesktopLayout/DesktopLayout";

const Script = () => {
  useInitAuthentication();

  const { fetchSidebarData } = useNotificationCounterActions();
  useEffect(() => {
    fetchSidebarData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

const MainLayout = ({ children }) => {
  const { isMobile, mounted } = useDevice();
  const isTranslationsReady = useTranslation(
    (state) => state.isTranslationsReady
  );
  const { setIsGlobalLoading } = useLoadingAction();
  const timer = useRef();

  useInitTranslation();

  useEffect(() => {
    // Jaga jaga kalau pada lupa untuk menutup loading, secara default loading selalu muncul dan akan reset menjadi false selama 2 detik
    timer.current = setTimeout(() => {
      setIsGlobalLoading(false);
    }, 2000);

    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  if (isMobile) {
    return (
      <>
        <Suspense fallback={<LoadingStatic />}>
          <Script />
          <LoadingInteractive />
          {isTranslationsReady ? children : null}
        </Suspense>
        <Toaster />
      </>
    );
  }

  return (
    <DesktopLayout>
      <Suspense fallback={<LoadingStatic />}>
        <Script />
        <LoadingInteractive />
        {isTranslationsReady ? children : null}
      </Suspense>
      <Toaster />
    </DesktopLayout>
  );
};

export default MainLayout;

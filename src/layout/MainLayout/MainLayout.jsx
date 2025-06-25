"use client";

import { Suspense, useEffect, useRef } from "react";

import LoadingInteractive from "@/components/Loading/LoadingInteractive";
import LoadingStatic from "@/components/Loading/LoadingStatic";
import Toaster from "@/components/Toaster/Toaster";
import { InitializeAuthentication } from "@/hooks/use-auth";
import { TranslationProvider } from "@/hooks/use-translation";
import { useLoadingAction } from "@/store/loadingStore";
import { useNotificationCounterActions } from "@/store/notificationCounterStore";

const MainLayout = ({ children }) => {
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

  const { fetchSidebarData } = useNotificationCounterActions();
  useEffect(() => {
    fetchSidebarData().catch((error) => {
      console.warn("Error fetching sidebar data", error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Suspense fallback={<LoadingStatic />}>
        <InitializeAuthentication />
        <LoadingInteractive />
        <TranslationProvider>{children}</TranslationProvider>
      </Suspense>
      <Toaster />
    </>
  );
};

export default MainLayout;

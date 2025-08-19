"use client";

import { Suspense, useEffect, useRef } from "react";

import LoadingInteractive from "@/components/Loading/LoadingInteractive";
import LoadingStatic from "@/components/Loading/LoadingStatic";
import Toaster from "@/components/Toaster/Toaster";
import { AuthenticationProvider } from "@/hooks/Transporter/use-auth";
import { TranslationProvider } from "@/hooks/use-translation";
import { StackManagerInitializer } from "@/lib/stack-manager";
import { useLoadingAction } from "@/store/Shared/loadingStore";

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

  // TODO: Implement fetch sidebar count
  useEffect(() => {}, []);

  return null;
};

const useResetNavigationOnDesktop = () => {};

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

"use client";

import { Suspense } from "react";

import Loading from "@/components/Loading/Loading";
import Toaster from "@/components/Toaster/Toaster";
import { useInitAuthentication } from "@/hooks/use-auth";
import useDevice from "@/hooks/use-device";
import { useInitTranslation, useTranslation } from "@/hooks/use-translation";

import DesktopLayout from "../DesktopLayout/DesktopLayout";

const Script = () => {
  useInitAuthentication();
  return <></>;
};

const MainLayout = ({ children }) => {
  const { isMobile, mounted } = useDevice();
  const isTranslationsReady = useTranslation(
    (state) => state.isTranslationsReady
  );
  useInitTranslation();

  if (!mounted) return null;

  if (isMobile) {
    return (
      <>
        <Suspense fallback={<Loading />}>
          <Script />
          {isTranslationsReady ? children : <Loading />}
        </Suspense>
        <Toaster />
      </>
    );
  }

  return (
    <DesktopLayout>
      <main className="min-h-[calc(100vh-60px)]">
        <Suspense fallback={<Loading />}>
          <Script />
          {isTranslationsReady ? children : <Loading />}
        </Suspense>
      </main>
      <Toaster />
    </DesktopLayout>
  );
};

export default MainLayout;

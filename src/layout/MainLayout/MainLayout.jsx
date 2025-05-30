"use client";

import { Suspense } from "react";

import Loading from "@/components/Loading/Loading";
import Toaster from "@/components/Toast";
import { useInitAuthentication } from "@/hooks/use-auth";
import useDevice from "@/hooks/use-device";
import { useInitTranslation, useTranslation } from "@/hooks/use-translation";

import DesktopLayout from "../DesktopLayout/DesktopLayout";
import ResponsiveLayout from "../ResponsiveLayout/ResponsiveLayout";

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
      <ResponsiveLayout>
        <Suspense fallback={<Loading />}>
          <Script />
          {isTranslationsReady ? children : <Loading />}
        </Suspense>
        <Toaster />
      </ResponsiveLayout>
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

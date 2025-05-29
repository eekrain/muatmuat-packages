"use client";

import { Suspense } from "react";

import Loading from "@/components/Loading/Loading";
import Toaster from "@/components/Toast";
import { useInitAuthentication } from "@/hooks/use-auth";
import useDevice from "@/hooks/use-device";
import { useInitTranslation, useTranslation } from "@/hooks/use-translation";

import DesktopLayout from "../DesktopLayout/DesktopLayout";
import ResponsiveLayout from "../ResponsiveLayout/ResponsiveLayout";

function MainLayoutContent({ children }) {
  const { isMobile, mounted } = useDevice();
  const { isTranslationsReady } = useTranslation();

  useInitAuthentication();
  useInitTranslation();

  if (!isTranslationsReady) {
    return <Loading />;
  }

  if (!mounted) {
    return null;
  }

  if (isMobile) {
    return (
      <ResponsiveLayout>
        {children}
        <Toaster />
      </ResponsiveLayout>
    );
  }

  return (
    <DesktopLayout>
      <main className="min-h-[calc(100vh-60px)]">{children}</main>
      <Toaster />
    </DesktopLayout>
  );
}

const MainLayout = ({ children }) => {
  return (
    <Suspense fallback={<Loading />}>
      <MainLayoutContent>{children}</MainLayoutContent>
    </Suspense>
  );
};

export default MainLayout;

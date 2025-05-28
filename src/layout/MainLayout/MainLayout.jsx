"use client";

import Toaster from "@/components/Toast";
import useDevice from "@/hooks/use-device";

import DesktopLayout from "../DesktopLayout/DesktopLayout";
import ResponsiveLayout from "../ResponsiveLayout/ResponsiveLayout";

const MainLayout = ({ children }) => {
  const { isMobile, mounted } = useDevice();

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
};

export default MainLayout;

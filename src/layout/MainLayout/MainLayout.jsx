"use client";

import Toast from "@/components/Toast/Toast";
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
        <Toast />
      </ResponsiveLayout>
    );
  }
  return (
    <DesktopLayout>
      <div className="min-h-[calc(100vh-62px)]">{children}</div>
      <Toast />
    </DesktopLayout>
  );
};

export default MainLayout;

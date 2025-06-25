"use client";

import useDevice from "@/hooks/use-device";
import DesktopLayout from "@/layout/DesktopLayout/DesktopLayout";

export default function RootLayout({ children }) {
  const { isMobile, mounted } = useDevice();

  if (!mounted) return null;

  if (isMobile) {
    return <>{children}</>;
  }

  return <DesktopLayout>{children}</DesktopLayout>;
}

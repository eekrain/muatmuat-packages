"use client";

import useDevice from "@/hooks/use-device";

import DesktopLayout from "@/layout/CS/DesktopLayout/DesktopLayout";

export default function RootLayout({ children }) {
  const { mounted } = useDevice();

  if (!mounted) return null;

  return <DesktopLayout>{children}</DesktopLayout>;
}

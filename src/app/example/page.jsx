"use client";

import ExampleResponsive from "@/container/Example/Responsive/ExampleResponsive";
import ExampleWeb from "@/container/Example/Web/ExampleWeb";
import useDevice from "@/hooks/use-device";

export default function Page() {
  const { isMobile, mounted } = useDevice();

  if (!mounted) {
    return null;
  }
  if (isMobile) {
    return <ExampleResponsive />;
  }
  return <ExampleWeb />;
}

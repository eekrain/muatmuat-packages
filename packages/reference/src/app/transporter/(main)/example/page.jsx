"use client";

import ExampleResponsive from "@/container/Shipper/Example/Responsive/ExampleResponsive";
import ExampleWeb from "@/container/Shipper/Example/Web/ExampleWeb";

import useDevice from "@/hooks/use-device";

export default function Page() {
  const { isMobile } = useDevice();

  if (isMobile) {
    return <ExampleResponsive />;
  }
  return <ExampleWeb />;
}

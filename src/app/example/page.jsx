"use client";

import { useEffect } from "react";

import ExampleResponsive from "@/container/Example/Responsive/ExampleResponsive";
import ExampleWeb from "@/container/Example/Web/ExampleWeb";
import useDevice from "@/hooks/use-device";
import { useResponsiveRouterActions } from "@/store/responsiveRouter";

const ExampleResponsiveDefault = () => {
  const { resetScreen } = useResponsiveRouterActions();

  useEffect(() => {
    resetScreen({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ExampleResponsive />;
};
export default function Page() {
  const { isMobile, mounted } = useDevice();

  if (!mounted) {
    return null;
  }
  if (isMobile) {
    return <ExampleResponsiveDefault />;
  }
  return <ExampleWeb />;
}

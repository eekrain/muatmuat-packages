"use client";

import ExampleResponsive from "@/container/Example/Responsive/ExampleResponsive";
import ExampleWeb from "@/container/Example/Web/ExampleWeb";
import useDevice from "@/hooks/use-device";
import { ResponsiveRoute } from "@/lib/responsive-navigation";

export default function Page() {
  const { isMobile, mounted } = useDevice();

  if (!mounted) {
    return null;
  }
  if (isMobile) {
    return (
      <>
        <ResponsiveRoute path="/" index component={<ExampleResponsive />} />
        <ResponsiveRoute
          path="/mobile-searchbar"
          component={<ExampleResponsive />}
        />
        <ResponsiveRoute
          path="/mobile-form"
          component={<ExampleResponsive />}
        />
        <ResponsiveRoute
          path="/mobile-form-with-menu"
          component={<ExampleResponsive />}
        />
      </>
    );
  }
  return <ExampleWeb />;
}

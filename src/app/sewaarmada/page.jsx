"use client";

import SewaArmadaResponsive from "@/container/SewaArmada/Responsive/SewaArmadaResponsive";
import SewaArmadaWeb from "@/container/SewaArmada/Web/SewaArmadaWeb";
import useDevice from "@/hooks/use-device";

const Page = () => {
  const { isMobile, mounted } = useDevice();

  if (!mounted) {
    return null;
  }
  if (isMobile) {
    return <SewaArmadaResponsive />;
  }
  return <SewaArmadaWeb />;
};

export default Page;

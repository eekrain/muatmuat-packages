"use client";

import DetailPesananResponsive from "@/container/Shipper/DetailPesanan/Responsive/DetailPesananResponsive";
import DetailPesananWeb from "@/container/Shipper/DetailPesanan/Web/DetailPesananWeb";
import useDevice from "@/hooks/use-device";

const Page = () => {
  const { isMobile, mounted } = useDevice();

  if (!mounted) return null;
  if (isMobile) {
    return <DetailPesananResponsive />;
  }
  return <DetailPesananWeb />;
};

export default Page;

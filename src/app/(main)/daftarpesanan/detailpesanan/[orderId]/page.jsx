"use client";

import DetailPesananResponsive from "@/container/DetailPesanan/Responsive/DetailPesananResponsive";
import DetailPesananWeb from "@/container/DetailPesanan/Web/DetailPesananWeb";
import useDevice from "@/hooks/use-device";

const Page = () => {
  const { isMobile } = useDevice();

  if (isMobile) {
    return <DetailPesananResponsive />;
  }
  return <DetailPesananWeb />;
};

export default Page;

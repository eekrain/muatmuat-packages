"use client";

// import DetailPesananResponsive from "@/container/DetailPesanan/Responsive/DetailPesananResponsive";
import LacakArmadaWeb from "@/container/LacakArmada/LacakArmadaWeb";
import useDevice from "@/hooks/use-device";

const Page = () => {
  const { isMobile, mounted } = useDevice();

  if (!mounted) {
    return null;
  }
  //   if (isMobile) {
  //     return <DetailPesananResponsive />;
  //   }
  return <LacakArmadaWeb />;
};

export default Page;

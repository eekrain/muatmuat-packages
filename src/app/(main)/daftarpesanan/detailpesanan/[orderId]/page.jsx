"use client";

// import DetailPesananResponsive from "@/container/DetailPesanan/Responsive/DetailPesananResponsive";
import DetailPesananWeb from "@/container/DetailPesanan/Web/DetailPesananWeb";

const Page = () => {
  const { isMobile, mounted } = useDevice();

  // if (!mounted) {
  //   return null;
  // }
  //   if (isMobile) {
  //     return <DetailPesananResponsive />;
  //   }
  return <DetailPesananWeb />;
};

export default Page;

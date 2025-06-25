"use client";

import DaftarPesananWeb from "@/container/DaftarPesanan/Web";

// import useDevice from "@/hooks/use-device";

const Page = () => {
  //const { isMobile, mounted } = useDevice();

  // if (!mounted) {
  //   return null;
  // }
  //   if (isMobile) {
  //     return <DetailPesananResponsive />;
  //   }
  return <DaftarPesananWeb />;
};

export default Page;

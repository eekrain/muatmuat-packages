"use client";

// import DetailPesananResponsive from "@/container/DetailPesanan/Responsive/DetailPesananResponsive";
import { useEffect } from "react";

import LacakArmadaWeb from "@/container/LacakArmada/LacakArmadaWeb";
import useDevice from "@/hooks/use-device";
import { useLoadingAction } from "@/store/loadingStore";

const Page = () => {
  const { isMobile, mounted } = useDevice();
  const { setIsGlobalLoading } = useLoadingAction();

  useEffect(() => {
    setIsGlobalLoading(false);
  }, []);

  if (!mounted) {
    return null;
  }
  //   if (isMobile) {
  //     return <DetailPesananResponsive />;
  //   }
  return <LacakArmadaWeb />;
};

export default Page;

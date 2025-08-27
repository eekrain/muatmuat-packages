"use client";

import useGetSewaArmadaFormOptionData from "@/services/Shipper/sewaarmada/getSewaArmadaFormOption";

import DetailPesananResponsive from "@/container/Shipper/DetailPesanan/Responsive/DetailPesananResponsive";
import DetailPesananWeb from "@/container/Shipper/DetailPesanan/Web/DetailPesananWeb";

import useDevice from "@/hooks/use-device";

const Page = () => {
  const {
    // cargoCategories,
    // cargoTypes,
    // additionalServicesOptions,
    paymentMethods,
    // settingsTime,
  } = useGetSewaArmadaFormOptionData("reorder");

  const { isMobile, mounted } = useDevice();

  if (!mounted) return null;
  if (isMobile) {
    return <DetailPesananResponsive paymentMethods={paymentMethods} />;
  }
  return <DetailPesananWeb />;
};

export default Page;

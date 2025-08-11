"use client";

import DetailPesananResponsive from "@/container/Shipper/DetailPesanan/Responsive/DetailPesananResponsive";
import DetailPesananWeb from "@/container/Shipper/DetailPesanan/Web/DetailPesananWeb";
import useDevice from "@/hooks/use-device";
import useGetSewaArmadaFormOptionData from "@/services/Shipper/sewaarmada/getSewaArmadaFormOption";

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

"use client";

import DetailPesanan from "@/container/CS/DetailPesanan/DetailPesanan";

import { useTranslation } from "@/hooks/use-translation";

const Page = () => {
  const { t } = useTranslation();
  const breadcrumbData = [
    {
      name: t("SOSDetailPesananPage.breadcrumbMonitoring", {}, "Monitoring"),
      href: "/monitoring",
    },
    { name: t("SOSDetailPesananPage.breadcrumbSOS", {}, "SOS") },
    {
      name: t(
        "SOSDetailPesananPage.breadcrumbDetailPesanan",
        {},
        "Detail Pesanan"
      ),
    },
  ];
  return <DetailPesanan breadcrumbData={breadcrumbData} />;
};

export default Page;

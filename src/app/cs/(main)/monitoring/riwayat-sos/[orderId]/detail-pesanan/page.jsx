"use client";

import DetailPesanan from "@/container/CS/DetailPesanan/DetailPesanan";
import { useTranslation } from "@/hooks/use-translation";

const Page = () => {
  const { t } = useTranslation();
  const breadcrumbData = [
    {
      name: t(
        "RiwayatSOSDetailPesananPage.breadcrumbMonitoring",
        {},
        "Monitoring"
      ),
      href: "/monitoring",
    },
    {
      name: t(
        "RiwayatSOSDetailPesananPage.breadcrumbRiwayatSOS",
        {},
        "Riwayat SOS"
      ),
    },
    {
      name: t(
        "RiwayatSOSDetailPesananPage.breadcrumbDetailPesanan",
        {},
        "Detail Pesanan"
      ),
    },
  ];
  return <DetailPesanan breadcrumbData={breadcrumbData} />;
};

export default Page;

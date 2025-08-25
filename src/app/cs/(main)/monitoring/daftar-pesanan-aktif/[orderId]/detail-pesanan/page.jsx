"use client";

import DetailPesanan from "@/container/CS/DetailPesanan/DetailPesanan";
import { useTranslation } from "@/hooks/use-translation";

const Page = () => {
  const { t } = useTranslation();
  const breadcrumbData = [
    {
      name: t(
        "DaftarPesananAktifDetailPesananPage.breadcrumbMonitoring",
        {},
        "Monitoring"
      ),
      href: "/monitoring",
    },
    {
      name: t(
        "DaftarPesananAktifDetailPesananPage.breadcrumbDaftarPesananAktif",
        {},
        "Daftar Pesanan Aktif"
      ),
    },
    {
      name: t(
        "DaftarPesananAktifDetailPesananPage.breadcrumbDetailPesanan",
        {},
        "Detail Pesanan"
      ),
    },
  ];
  return <DetailPesanan breadcrumbData={breadcrumbData} />;
};

export default Page;

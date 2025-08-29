"use client";

import DetailTransporter from "@/container/CS/RiwayatTransporterTidakAktif/DetailTransporterTidakAktif/DetailTransporter";

const Page = () => {
  const breadcrumbData = [
    { name: "Laporan", href: "/laporan" },
    {
      name: "Laporan Riwayat Transporter Tidak Aktif",
      href: "/laporan/riwayat-transporter-tidak-aktif",
    },
    { name: "Detail Transporter" },
  ];

  return <DetailTransporter breadcrumbData={breadcrumbData} />;
};

export default Page;

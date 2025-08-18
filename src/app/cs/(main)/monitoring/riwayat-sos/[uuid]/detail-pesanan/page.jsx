"use client";

import DetailPesanan from "@/container/CS/DetailPesanan/DetailPesanan";

const Page = () => {
  const breadcrumbData = [
    { name: "Monitoring", href: "/monitoring" },
    { name: "Riwayat SOS" },
    { name: "Detail Pesanan" },
  ];
  return <DetailPesanan breadcrumbData={breadcrumbData} />;
};

export default Page;

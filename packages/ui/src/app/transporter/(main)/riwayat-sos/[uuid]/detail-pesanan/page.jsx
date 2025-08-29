"use client";

import DetailPesanan from "@/container/Transporter/DetailPesanan/DetailPesanan";

const Page = () => {
  const breadcrumbData = [
    { name: "Riwayat SOS", href: "/monitoring" },
    { name: "Detail Pesanan" },
  ];

  return <DetailPesanan breadcrumbData={breadcrumbData} />;
};

export default Page;

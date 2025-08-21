"use client";

import DetailPesanan from "@/container/Transporter/DetailPesanan/DetailPesanan";

const Page = () => {
  const breadcrumbData = [
    { name: "Daftar Pesanan", href: "/daftar-pesanan" },
    { name: "Detail Pesanan" },
  ];
  return <DetailPesanan breadcrumbData={breadcrumbData} />;
};

export default Page;

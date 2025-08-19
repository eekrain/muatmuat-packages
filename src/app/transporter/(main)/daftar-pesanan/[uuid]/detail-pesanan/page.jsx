"use client";

import { useParams } from "next/navigation";

import DetailPesanan from "@/container/Transporter/DetailPesanan/DetailPesanan";

const Page = () => {
  const params = useParams();

  const breadcrumbData = [
    { name: "Daftar Pesanan", href: "/daftar-pesanan" },
    { name: "Detail Pesanan" },
  ];
  return <DetailPesanan breadcrumbData={breadcrumbData} />;
};

export default Page;

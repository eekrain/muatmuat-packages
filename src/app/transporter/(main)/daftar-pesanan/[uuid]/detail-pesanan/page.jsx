"use client";

import { useParams } from "next/navigation";

import DetailPesanan from "@/container/Transporter/DetailPesanan/DetailPesanan";
import { useGetOrderDetail } from "@/services/Transporter/daftar-pesanan/detail-pesanan/getOrderDetail";

const Page = () => {
  const params = useParams();

  const { data: dataOrderDetail } = useGetOrderDetail(params.uuid);
  console.log("dataOrderDetail", dataOrderDetail);
  const breadcrumbData = [
    { name: "Daftar Pesanan", href: "/daftar-pesanan" },
    { name: "Detail Pesanan" },
  ];
  return <DetailPesanan breadcrumbData={breadcrumbData} />;
};

export default Page;

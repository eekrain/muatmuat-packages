"use client";

import { useSearchParams } from "next/navigation";

import DetailPesanan from "@/container/Transporter/DetailPesanan/DetailPesanan";

const Page = () => {
  const searchParams = useSearchParams();
  const isFromUrgentIssue = searchParams.has("urgent-issue");

  const breadcrumbData = isFromUrgentIssue
    ? [
        { name: "Monitoring", href: "/monitoring" },
        { name: "Urgent Issue", href: "/monitoring?tab=urgent" },
        { name: "Detail Pesanan" },
      ]
    : [{ name: "Monitoring", href: "/monitoring" }, { name: "Detail Pesanan" }];

  return <DetailPesanan breadcrumbData={breadcrumbData} />;
};

export default Page;

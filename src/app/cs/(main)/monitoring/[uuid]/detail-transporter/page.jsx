"use client";

import { useSearchParams } from "next/navigation";

import DetailTransporter from "@/container/CS/DetailTransporter/DetailTransporter";

const Page = () => {
  const searchParams = useSearchParams();
  // Contoh: jika ada parameter khusus, bisa tambahkan logic di sini
  // const isFromUrgentIssue = searchParams.has("urgent-issue");

  const breadcrumbData = [
    { name: "Monitoring", href: "/monitoring" },
    {
      name: "Transporter Tidak Aktif",
      href: "/monitoring?tab=transporter-tidak-aktif",
    },
    { name: "Detail Transporter" },
  ];

  return <DetailTransporter breadcrumbData={breadcrumbData} />;
};

export default Page;

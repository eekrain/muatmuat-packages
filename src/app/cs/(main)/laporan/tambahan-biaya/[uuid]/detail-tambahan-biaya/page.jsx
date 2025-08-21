"use client";

import { useState } from "react";

import DetailTambahanBiaya from "@/container/CS/LaporanTambahanBiaya/DetailTambahanBiaya";
import useDevice from "@/hooks/use-device";

const Page = () => {
  const breadcrumbData = [
    { name: "Laporan Tambahan Biaya", href: "#" },
    { name: "Selesai", href: "#" },
    { name: "Detail Tambahan Biaya", href: "#" },
  ];
  const { mounted } = useDevice();

  const [activeTab, setActiveTab] = useState("active");

  if (!mounted) return null;

  return <DetailTambahanBiaya breadcrumbData={breadcrumbData} />;
};

export default Page;

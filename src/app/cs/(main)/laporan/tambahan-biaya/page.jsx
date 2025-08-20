"use client";

import { useState } from "react";

import LaporanTambahanBiaya from "@/container/CS/LaporanTambahanBiaya/LaporanTambahanBiaya";
import useDevice from "@/hooks/use-device";

const Page = () => {
  const { mounted } = useDevice();

  const [activeTab, setActiveTab] = useState("active");

  if (!mounted) return null;

  return (
    <LaporanTambahanBiaya activeTab={activeTab} setActiveTab={setActiveTab} />
  );
};

export default Page;

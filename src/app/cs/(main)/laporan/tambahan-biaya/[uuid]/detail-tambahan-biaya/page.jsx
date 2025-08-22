"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import DetailTambahanBiaya from "@/container/CS/LaporanTambahanBiaya/DetailTambahanBiaya";
import useDevice from "@/hooks/use-device";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useGetAdditionalCostReportDetail } from "@/services/CS/laporan/tambahan-biaya/detail-tambahan-biaya/getAdditionalCostReportDetail";
import { ORDER_STATUS } from "@/utils/CS/orderStatus";

const Page = () => {
  const { mounted } = useDevice();

  const params = useParams();
  const { data: report = {} } = useGetAdditionalCostReportDetail(params.uuid);

  const breadcrumbData = useShallowMemo(
    () => [
      { name: "Laporan Tambahan Biaya", href: "/laporan/tambahan-biaya" },
      {
        name:
          report?.order?.status === ORDER_STATUS.COMPLETED
            ? "Selesai"
            : "Aktif",
        href: `/laporan/tambahan-biaya/${report?.order?.status === ORDER_STATUS.COMPLETED ? "?tab=completed" : ""}`,
      },
      { name: "Detail Tambahan Biaya" },
    ],
    [report?.order?.status]
  );

  const [activeTab, setActiveTab] = useState("active");

  if (!mounted) return null;

  return (
    <DetailTambahanBiaya breadcrumbData={breadcrumbData} report={report} />
  );
};

export default Page;

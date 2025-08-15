"use client";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import { useTranslation } from "@/hooks/use-translation";

import PenaltyTable from "./components/PenaltyTable";

const PenaltyPage = () => {
  const { t } = useTranslation();

  const breadcrumbData = [
    {
      name: t("PenaltyPage.breadcrumbDashboard", {}, "Dashboard Real-time"),
      href: "/dashboard/real-time",
    },
    { name: t("PenaltyPage.titlePage", {}, "Jumlah Penalti") },
  ];

  return (
    <div className="space-y-4 py-9">
      <BreadCrumb data={breadcrumbData} />
      <PenaltyTable />
    </div>
  );
};

export default PenaltyPage;

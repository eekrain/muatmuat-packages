"use client";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";

import { useTranslation } from "@/hooks/use-translation";

import UlasanTable from "./components/UlasanTable";

const UlasanPage = () => {
  const { t } = useTranslation();

  const breadcrumbData = [
    {
      name: t("UlasanPage.breadcrumbDashboard", {}, "Dashboard Real-time"),
      href: "/dashboard/real-time",
    },
    { name: t("UlasanPage.titleReviewList", {}, "Daftar Ulasan") },
  ];

  return (
    <div className="space-y-4 py-8">
      <BreadCrumb data={breadcrumbData} />
      <UlasanTable />
    </div>
  );
};

export default UlasanPage;

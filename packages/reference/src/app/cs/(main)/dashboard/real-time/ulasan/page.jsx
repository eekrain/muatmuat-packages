"use client";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";

import { useTranslation } from "@/hooks/use-translation";

import UlasanTable from "./components/UlasanTable";

const UlasanPage = () => {
  const { t } = useTranslation();
  const breadcrumbData = [
    {
      name: t("csDashboard.pageTitle", {}, "Dashboard Real-time"),
      href: "/dashboard/real-time",
    },
    { name: t("csUlasan.pageTitle", {}, "Daftar Ulasan") },
  ];
  return (
    <div className="mx-auto max-w-7xl space-y-4 p-6">
      <BreadCrumb data={breadcrumbData} />
      <UlasanTable />
    </div>
  );
};
export default UlasanPage;

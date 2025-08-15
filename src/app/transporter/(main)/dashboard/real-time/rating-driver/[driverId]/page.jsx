"use client";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import { useTranslation } from "@/hooks/use-translation";

import RatingHistoryTable from "./components/RatingHistoryTable";

const RatingDriverHistoryPage = () => {
  const { t } = useTranslation();

  const breadcrumbData = [
    {
      name: t(
        "RatingDriverHistoryPage.breadcrumbDashboard",
        {},
        "Dashboard Real-time"
      ),
      href: "/dashboard/real-time",
    },
    {
      name: t(
        "RatingDriverHistoryPage.breadcrumbOverallRating",
        {},
        "Rating Driver Keseluruhan"
      ),
      href: "/dashboard/real-time/rating-driver",
    },
    {
      name: t(
        "RatingDriverHistoryPage.titlePage",
        {},
        "Riwayat Rating Driver Keseluruhan"
      ),
    },
  ];

  return (
    <div className="space-y-4 py-8">
      <BreadCrumb data={breadcrumbData} />
      <RatingHistoryTable />
    </div>
  );
};

export default RatingDriverHistoryPage;

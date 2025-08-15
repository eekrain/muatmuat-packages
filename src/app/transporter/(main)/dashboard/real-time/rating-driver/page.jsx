"use client";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import { useTranslation } from "@/hooks/use-translation";

import DriverRatingTable from "./components/DriverRatingTable";

const RatingDriverPage = () => {
  const { t } = useTranslation();

  const breadcrumbData = [
    {
      name: t(
        "RatingDriverPage.breadcrumbDashboard",
        {},
        "Dashboard Real-time"
      ),
      href: "/dashboard/real-time",
    },
    {
      name: t(
        "RatingDriverPage.titleOverallDriverRating",
        {},
        "Rating Driver Keseluruhan"
      ),
    },
  ];

  return (
    <div className="space-y-4 py-8">
      <BreadCrumb data={breadcrumbData} />
      <DriverRatingTable />
    </div>
  );
};

export default RatingDriverPage;

"use client";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import { useTranslation } from "@/hooks/use-translation";

import DriverDetailRatingTable from "./components/DriverDetailRatingTable";

const DetailRatingDriverPage = () => {
  const { t } = useTranslation();

  const breadcrumbData = [
    {
      name: t("csDashboard.pageTitle", {}, "Dashboard Real-time"),
      href: "/dashboard/real-time",
    },
    {
      name: t(
        "csRatingTransporter.pageTitle",
        {},
        "Rating Transporter Keseluruhan"
      ),
      href: "/dashboard/real-time/rating-transporter",
    },
    {
      name: t(
        "csDriverRating.pageTitle",
        {},
        "Detail Rating Driver Transporter"
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-6">
      <BreadCrumb data={breadcrumbData} />
      <DriverDetailRatingTable />
    </div>
  );
};

export default DetailRatingDriverPage;

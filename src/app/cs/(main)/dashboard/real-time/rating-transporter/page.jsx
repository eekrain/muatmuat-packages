"use client";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import { useTranslation } from "@/hooks/use-translation";

import TransporterRatingTable from "./components/TransporterRatingTable";

const RatingTransporterPage = () => {
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
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-6">
      <BreadCrumb data={breadcrumbData} />
      <TransporterRatingTable />
    </div>
  );
};

export default RatingTransporterPage;

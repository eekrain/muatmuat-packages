"use client";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";

import RatingHistoryTable from "./components/RatingHistoryTable";

const RatingDriverHistoryPage = () => {
  const breadcrumbData = [
    { name: "Dashboard Real-time", href: "/dashboard/real-time" },
    {
      name: "Rating Driver Keseluruhan",
      href: "/dashboard/real-time/rating-driver",
    },
    { name: "Riwayat Rating Driver Keseluruhan" },
  ];

  return (
    <div className="space-y-4 py-8">
      <BreadCrumb data={breadcrumbData} />
      <RatingHistoryTable />
    </div>
  );
};

export default RatingDriverHistoryPage;

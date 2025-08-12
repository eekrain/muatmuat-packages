import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";

import DriverRatingTable from "./components/DriverRatingTable";

const RatingDriverPage = () => {
  const breadcrumbData = [
    { name: "Dashboard Real-time", href: "/dashboard/real-time" },
    { name: "Rating Driver Keseluruhan" },
  ];

  return (
    <div className="space-y-4 py-8">
      <BreadCrumb data={breadcrumbData} />
      <DriverRatingTable />
    </div>
  );
};

export default RatingDriverPage;

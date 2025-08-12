import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";

import PenaltyTable from "./components/PenaltyTable";

const PenaltyPage = () => {
  const breadcrumbData = [
    { name: "Dashboard Real-time", href: "/dashboard/real-time" },
    { name: "Jumlah Penalti" },
  ];

  return (
    <div className="space-y-4 py-9">
      <BreadCrumb data={breadcrumbData} />
      <PenaltyTable />
    </div>
  );
};

export default PenaltyPage;

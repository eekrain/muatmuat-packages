import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import PageTitle from "@/components/PageTitle/PageTitle";

import PotentialEarningsTable from "./components/PotentialEarningsTable";

const PotentialEarningsPage = () => {
  const breadcrumbData = [
    { name: "Dashboard Real-time", href: "/dashboard/real-time" },
    { name: "Potensi Pendapatan" },
  ];

  return (
    <div className="space-y-4 !py-6">
      <BreadCrumb data={breadcrumbData} />
      <PageTitle withBack={true}>Potensi Pendapatan</PageTitle>
      <PotentialEarningsTable />
    </div>
  );
};

export default PotentialEarningsPage;

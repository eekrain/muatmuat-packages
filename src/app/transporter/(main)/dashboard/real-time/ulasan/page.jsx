import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";

import UlasanTable from "./components/UlasanTable";

const UlasanPage = () => {
  const breadcrumbData = [
    { name: "Dashboard Real-time", href: "/dashboard/real-time" },
    { name: "Daftar Ulasan" },
  ];

  return (
    <div className="space-y-4 py-8">
      <BreadCrumb data={breadcrumbData} />
      <UlasanTable />
    </div>
  );
};

export default UlasanPage;

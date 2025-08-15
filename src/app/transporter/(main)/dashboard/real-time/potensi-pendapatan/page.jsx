"use client";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useTranslation } from "@/hooks/use-translation";

import PotentialEarningsTable from "./components/PotentialEarningsTable";

const PotentialEarningsPage = () => {
  const { t } = useTranslation();

  const breadcrumbData = [
    {
      name: t(
        "PotentialEarningsPage.breadcrumbDashboard",
        {},
        "Dashboard Real-time"
      ),
      href: "/dashboard/real-time",
    },
    {
      name: t(
        "PotentialEarningsPage.titlePotentialEarnings",
        {},
        "Potensi Pendapatan"
      ),
    },
  ];

  return (
    <div className="space-y-4 !py-6">
      <BreadCrumb data={breadcrumbData} />
      <PageTitle withBack={true}>
        {t(
          "PotentialEarningsPage.titlePotentialEarnings",
          {},
          "Potensi Pendapatan"
        )}
      </PageTitle>
      <PotentialEarningsTable />
    </div>
  );
};

export default PotentialEarningsPage;

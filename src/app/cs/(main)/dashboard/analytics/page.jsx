"use client";

import { useMemo } from "react";

import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import LeaderboardCombo from "@/container/CS/Dashboard/LeaderboardCombo";
import LeaderboardTop10 from "@/container/CS/Dashboard/LeaderboardTop10";
import ShipmentSummary from "@/container/CS/Dashboard/ShipmentSummary";
import TotalAdditionalCost from "@/container/CS/Dashboard/TotalAdditionalCost";
import TotalIncome from "@/container/CS/Dashboard/TotalIncome";
import TotalShipper from "@/container/CS/Dashboard/TotalShipper";
import TotalTransporterShipper from "@/container/CS/Dashboard/TotalTransporterShipper";
import { generateDynamicPeriodOptions } from "@/lib/utils/generateDynamicPeriodOptions";
import { useGetDashboardAnalyticsTop10 } from "@/services/CS/dashboard/analytics/getTop10Leaderboard";
import { useAnalyticsStore } from "@/store/Transporter/analyticStore";

function Page() {
  const { period, setPeriod } = useAnalyticsStore();

  // Generate period options dynamically and memoize the result
  const basePeriodOptions = useMemo(() => generateDynamicPeriodOptions(), []);

  // Fetch data for each leaderboard category
  const { data: transportersData, isLoading: isTransportersLoading } =
    useGetDashboardAnalyticsTop10({
      category: "transporters",
      period,
    });

  const { data: loadingAreasData, isLoading: isLoadingAreasLoading } =
    useGetDashboardAnalyticsTop10({
      category: "loading-areas",
      period,
    });

  const { data: unloadingAreasData, isLoading: isUnloadingAreasLoading } =
    useGetDashboardAnalyticsTop10({
      category: "unloading-areas",
      period,
    });

  const handlePeriodSelect = (selectedOption) => {
    console.log(
      `[Analytics.jsx] handlePeriodSelect triggered with:`,
      selectedOption
    );
    setPeriod(selectedOption.value);
  };

  let selectedOption = basePeriodOptions.find(
    (option) => option.value === period
  );
  const finalOptions = [...basePeriodOptions];

  if (!selectedOption && period) {
    const customOption = { name: period, value: period };
    selectedOption = customOption;
    finalOptions.unshift(customOption);
  }
  console.log("selected date:", selectedOption);
  return (
    <div className="mx-auto max-w-[1280px] p-6">
      <h1 className="text-xl font-bold">
        Ringkasan Total Mitra & Armada Terdaftar
      </h1>
      <div className="flex w-full flex-row gap-4 pb-6 pt-4">
        <TotalShipper />
        <TotalTransporterShipper />
      </div>
      <div className="flex flex-row items-center justify-between pb-4">
        <h1 className="text-xl font-bold">Dashboard Analytics</h1>
        <DropdownPeriode
          options={finalOptions}
          onSelect={handlePeriodSelect}
          value={selectedOption}
        />
      </div>
      <ShipmentSummary />
      <div className="pb flex flex-row gap-4 pt-4">
        <TotalIncome />
        <TotalAdditionalCost />
      </div>
      <div className="flex flex-row gap-4 pb-4 pt-4">
        {/* Leaderboard for Transporters */}
        <LeaderboardTop10
          title="Transporter"
          tooltipText="10 nama transporter yang paling banyak menyelesaikan pesanan"
          category="transporters"
          data={transportersData?.items}
          isLoading={isTransportersLoading}
        />
        {/* Leaderboard for Loading Areas */}
        <LeaderboardTop10
          title="Area Muat"
          tooltipText="10 Kota/Kabupaten yang paling banyak menjadi tujuan muat"
          category="loading-areas"
          data={loadingAreasData?.items}
          isLoading={isLoadingAreasLoading}
        />
        {/* Leaderboard for Unloading Areas */}
        <LeaderboardTop10
          title="Area Bongkar"
          tooltipText="10 Kota/Kabupaten yang paling banyak menjadi tujuan bongkar"
          category="unloading-areas"
          data={unloadingAreasData?.items}
          isLoading={isUnloadingAreasLoading}
        />
      </div>
      <LeaderboardCombo />
    </div>
  );
}

export default Page;

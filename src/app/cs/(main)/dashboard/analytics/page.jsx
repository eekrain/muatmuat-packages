"use client";

import React from "react";

import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import ShipmentSummary from "@/container/CS/Dashboard/ShipmentSummary";
import TotalAdditionalCost from "@/container/CS/Dashboard/TotalAdditionalCost";
import TotalIncome from "@/container/CS/Dashboard/TotalIncome";
import TotalShipper from "@/container/CS/Dashboard/TotalShipper";
import TotalTransporterShipper from "@/container/CS/Dashboard/TotalTransporterShipper";
import { useAnalyticsStore } from "@/store/Transporter/analyticStore";

const basePeriodOptions = [
  { name: "Bulan Ini", value: "month" },
  { name: "Hari Ini", value: "today" },
  { name: "1 Minggu Terakhir", value: "week" },
  { name: "30 Hari Terakhir", value: "30days" },
  { name: "1 Tahun Terakhir", value: "365days" },
];

function Page() {
  const { period, setPeriod } = useAnalyticsStore();

  const handlePeriodSelect = (selectedOption) => {
    console.log(
      `[Analytics.jsx] handlePeriodSelect triggered with:`,
      selectedOption
    );
    setPeriod(selectedOption.value);
  };

  // 2. Try to find the selected period in the default list.
  let selectedOption = basePeriodOptions.find(
    (option) => option.value === period
  );
  const finalOptions = [...basePeriodOptions];

  if (!selectedOption && period) {
    // Create a new option object for the custom period.
    const customOption = { name: period, value: period };
    selectedOption = customOption;
    // Add the custom option to the top of the list so it's visible.
    finalOptions.unshift(customOption);
  }

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
      {/* <div className="flex flex-row pt-4 gap-4">
          <TotalIncome />
          <TotalAdditionalCost />
        </div> */}
    </div>
  );
}

export default Page;

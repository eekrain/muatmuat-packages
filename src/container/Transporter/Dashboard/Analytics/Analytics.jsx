"use client";

import React from "react";

import { useGetDashboardAnalyticsTop5 } from "@/services/Transporter/dashboard/analytics/getDashboardAnalyticsTop5";

import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";

// This utility already provides dates in the correct 'yyyy-mm-dd' format
import { generateDynamicPeriodOptions } from "@/lib/utils/generateDynamicPeriodOptions";

import { useAnalyticsStore } from "@/store/Transporter/analyticStore";

import Leaderboard from "./Statistics/Leaderboard";
import SummaryShipment from "./Statistics/SummaryShipment";
import TotalMissedOrders from "./Statistics/TotalMissedOrders";
import TotalOrders from "./Statistics/TotalOrders";
import TotalRevenue from "./Statistics/TotalRevenue";

// Generate the period options dynamically
const periodOptions = generateDynamicPeriodOptions();

function Analytics() {
  // Use the state with `period` (as key) and `label` (as display text)
  const { period, label, startDate, endDate, setPeriodOption } =
    useAnalyticsStore();

  const handlePeriodSelect = (selectedOption) => {
    // The DropdownPeriode component adds `range: true` for custom date selections.
    if (selectedOption.range) {
      // This is a custom date range. Format it for the store.
      const newOption = {
        name: selectedOption.value, // The unique key is the date range string (e.g., "01/01/2025 - 10/01/2025")
        value: `Dalam Periode ${selectedOption.value}`, // The display label
        startDate: selectedOption.iso_start_date,
        endDate: selectedOption.iso_end_date,
      };
      setPeriodOption(newOption);
    } else {
      // This is a predefined option. Save it directly.
      setPeriodOption(selectedOption);
    }
  };

  // Correctly find the selected option from the predefined list using 'name' as the unique key.
  let selectedOption = periodOptions.find((option) => option.name === period);
  const finalOptions = [...periodOptions];

  // This block now correctly handles only custom periods that are not in the predefined list.
  if (!selectedOption && period) {
    const customOption = {
      name: period, // The unique key (e.g., "01/01/2025 - 10/01/2025")
      value: label, // The display label (e.g., "Dalam Periode 01/01/2025 - 10/01/2025")
    };
    selectedOption = customOption;
    // Add the custom option to the top of the list so it can be displayed.
    finalOptions.unshift(customOption);
  }

  const { data: driversData, isLoading: isLoadingDrivers } =
    useGetDashboardAnalyticsTop5({ category: "drivers", startDate, endDate });
  const { data: truckTypesData, isLoading: isLoadingTrucks } =
    useGetDashboardAnalyticsTop5({ category: "fleets", startDate, endDate });
  const { data: loadingAreasData, isLoading: isLoadingLoading } =
    useGetDashboardAnalyticsTop5({ category: "loads", startDate, endDate });
  const { data: unloadingAreasData, isLoading: isLoadingUnloading } =
    useGetDashboardAnalyticsTop5({ category: "unloads", startDate, endDate });

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">
          Dashboard Analytics
        </h1>
        <DropdownPeriode
          options={finalOptions}
          onSelect={handlePeriodSelect}
          value={selectedOption}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left and Center Columns */}
        <div className="grid content-start gap-6 lg:col-span-2">
          <TotalOrders />
          <TotalRevenue />
        </div>

        {/* Right Column */}
        <div className="grid content-start gap-6 lg:col-span-1">
          <TotalMissedOrders />
          <SummaryShipment />
        </div>

        {/* Bottom Full-Width Row */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-3 xl:grid-cols-4">
          <Leaderboard
            title="Driver"
            variant="default"
            category="drivers"
            data={driversData}
            isLoading={isLoadingDrivers}
            tooltipText="5 Nama driver yang paling sering ditugaskan untuk pengiriman."
          />
          <Leaderboard
            title="Jenis Armada"
            variant="alternate"
            category="fleets"
            data={truckTypesData}
            isLoading={isLoadingTrucks}
            tooltipText="5 Jenis armada yang paling banyak ditugaskan untuk pengiriman."
          />
          <Leaderboard
            title="Area Muat"
            variant="alternate"
            category="loads"
            data={loadingAreasData}
            isLoading={isLoadingLoading}
            tooltipText="5 Kota/Kabupaten yang paling banyak menjadi tujuan muat."
          />
          <Leaderboard
            title="Area Bongkar"
            variant="alternate"
            category="unloads"
            data={unloadingAreasData}
            isLoading={isLoadingUnloading}
            tooltipText="5 Kota/Kabupaten yang paling banyak menjadi tujuan bongkar."
          />
        </div>
      </div>
    </>
  );
}

export default Analytics;

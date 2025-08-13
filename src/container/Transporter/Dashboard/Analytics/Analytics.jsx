"use client";

import React, { useState } from "react";

import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import { useGetDashboardAnalyticsSummary } from "@/services/Transporter/dashboard/analytics/getDashboardAnalyticsSummary";
import { useGetDashboardAnalyticsTop5 } from "@/services/Transporter/dashboard/analytics/getDashboardAnalyticsTop5";

import Leaderboard from "./Statistics/Leaderboard";
import SummaryShipment from "./Statistics/SummaryShipment";
import TotalMissedOrders from "./Statistics/TotalMissedOrders";
import TotalOrders from "./Statistics/TotalOrders";
import TotalRevenue from "./Statistics/TotalRevenue";

const periodOptions = [
  { name: "Bulan Ini (Default)", value: "month" },
  { name: "Hari Ini", value: "today" },
  { name: "1 Minggu Terakhir", value: "week" },
  { name: "30 Hari Terakhir", value: "30days" },
  { name: "1 Tahun Terakhir", value: "365days" },
];

function Analytics() {
  const [period, setPeriod] = useState("month");

  const handlePeriodSelect = (selectedOption) => {
    setPeriod(selectedOption.value);
  };

  // --- Data Fetching ---

  // Fetch summary data for the top cards
  const {
    data: summaryData,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
  } = useGetDashboardAnalyticsSummary({ period });

  // Fetch data for each leaderboard category
  const { data: driversData, isLoading: isLoadingDrivers } =
    useGetDashboardAnalyticsTop5({ category: "drivers", period });
  const { data: truckTypesData, isLoading: isLoadingTrucks } =
    useGetDashboardAnalyticsTop5({ category: "truck-types", period });
  const { data: loadingAreasData, isLoading: isLoadingLoading } =
    useGetDashboardAnalyticsTop5({ category: "loading-areas", period });
  const { data: unloadingAreasData, isLoading: isLoadingUnloading } =
    useGetDashboardAnalyticsTop5({ category: "unloading-areas", period });

  // Handle error case for summary data
  if (isErrorSummary) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-error-500">Gagal memuat data ringkasan.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">
          Dashboard Analytics
        </h1>
        <DropdownPeriode
          options={periodOptions}
          onSelect={handlePeriodSelect}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left and Center Columns */}
        <div className="grid content-start gap-6 lg:col-span-2">
          <TotalOrders
            data={summaryData?.summary}
            isLoading={isLoadingSummary}
          />
          <TotalRevenue
            data={summaryData?.summary}
            isLoading={isLoadingSummary}
          />
        </div>

        {/* Right Column */}
        <div className="grid content-start gap-6 lg:col-span-1">
          <TotalMissedOrders
            data={summaryData?.summary}
            isLoading={isLoadingSummary}
          />
          <SummaryShipment
            data={summaryData?.shipmentSummary}
            isLoading={isLoadingSummary}
          />
        </div>

        {/* Bottom Full-Width Row */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-3 xl:grid-cols-4">
          <Leaderboard
            title="Driver"
            variant="default"
            category="drivers"
            data={driversData?.items}
            isLoading={isLoadingDrivers}
            tooltipText="5 Nama driver yang paling sering ditugaskan untuk pengiriman."
          />
          <Leaderboard
            title="Jenis Armada"
            variant="alternate"
            category="truck-types"
            data={truckTypesData?.items}
            isLoading={isLoadingTrucks}
            tooltipText="5 Jenis armada yang paling banyak ditugaskan untuk pengiriman."
          />
          <Leaderboard
            title="Area Muat"
            variant="alternate"
            category="loading-areas"
            data={loadingAreasData?.items}
            isLoading={isLoadingLoading}
            tooltipText="5 Kota/Kabupaten yang paling banyak menjadi tujuan muat."
          />
          <Leaderboard
            title="Area Bongkar"
            variant="alternate"
            category="unloading-areas"
            data={unloadingAreasData?.items}
            isLoading={isLoadingUnloading}
            tooltipText="5 Kota/Kabupaten yang paling banyak menjadi tujuan bongkar."
          />
        </div>
      </div>
    </>
  );
}

export default Analytics;

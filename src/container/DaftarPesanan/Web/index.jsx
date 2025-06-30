"use client";

import { useState } from "react";

import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import NeedConfirmationWarning from "@/components/NeedConfirmationWarning/NeedConfirmationWarning";
import Pagination from "@/components/Pagination/Pagination";
import PesananTable from "@/components/Table/PesananTable";
import { useTranslation } from "@/hooks/use-translation";

const DaftarPesananWeb = ({
  queryParams,
  onChangeQueryParams,
  orders,
  pagination,
  countByStatus,
  isOrdersLoading,
  requiringConfirmationCount,
}) => {
  const { t } = useTranslation();
  const [tempSearch, setTempSearch] = useState("");

  const [getRecentOptionsSort, setRecentOptionsSort] = useState([]);

  const hasOrders = orders.length > 0;

  // Helper function to format DD-MM-YYYY to YYYY-MM-DD without timezone issues
  const formatToYYYYMMDD = (dateStr) => {
    if (!dateStr) return "";

    // Handle DD-MM-YYYY format (with dashes)
    const dashParts = dateStr.split("-");
    if (dashParts.length === 3 && dashParts[0].length <= 2) {
      return `${dashParts[2]}-${dashParts[1]}-${dashParts[0]}`;
    }

    // Handle DD/MM/YYYY format (with slashes)
    const slashParts = dateStr.split("/");
    if (slashParts.length === 3 && slashParts[0].length <= 2) {
      return `${slashParts[2]}-${slashParts[1]}-${slashParts[0]}`;
    }

    // If already in YYYY-MM-DD format, return as is
    return dateStr;
  };

  const handleSelectSort = (selectedOption) => {
    // For custom date range option
    if (selectedOption?.range) {
      // Use string manipulation, not Date object with toISOString()
      const formattedStartDate = formatToYYYYMMDD(selectedOption.start_date);
      const formattedEndDate = formatToYYYYMMDD(selectedOption.end_date);

      onChangeQueryParams("startDate", formattedStartDate);
      onChangeQueryParams("endDate", formattedEndDate);

      // Update recent selections
      if (
        getRecentOptionsSort?.some((s) => s?.value === selectedOption?.value)
      ) {
        setRecentOptionsSort(
          getRecentOptionsSort?.filter(
            (z) => z?.value !== selectedOption?.value
          )
        );
      } else {
        setRecentOptionsSort((prev) => [...prev, selectedOption]);
      }
    }
    // For default "Semua Periode" option
    else if (selectedOption?.value === "") {
      onChangeQueryParams("startDate", null);
      onChangeQueryParams("endDate", null);
    }
    // For predefined period options (today, last 7 days, etc.)
    else if (selectedOption?.value !== undefined) {
      // Get local dates using direct component extraction, not toISOString()
      const getLocalDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      // Get today as end date
      const today = new Date();
      const endDate = getLocalDateString(today);

      // Calculate start date
      let startDate;
      if (selectedOption.value === 0) {
        // Today
        startDate = endDate;
      } else {
        // Other periods (7 days, 30 days, etc.)
        const startDateObj = new Date();
        // Set to noon to avoid any date boundary issues
        startDateObj.setHours(12, 0, 0, 0);
        startDateObj.setDate(today.getDate() - selectedOption.value);
        startDate = getLocalDateString(startDateObj);
      }

      onChangeQueryParams("startDate", startDate);
      onChangeQueryParams("endDate", endDate);
    }
  };

  const periodOptions = [
    {
      name: `${t("EksekusiTenderIndexSemuaPeriode")} (Default)`,
      value: "",
      format: "day",
    },
    {
      name: t("AppMuatpartsAnalisaProdukHariIni"),
      value: 0,
      format: "day",
    },
    {
      name: t("AppMuatpartsAnalisaProduk1MingguTerakhir"),
      value: 7,
      format: "day",
    },
    {
      name: t("AppMuatpartsAnalisaProduk30HariTerakhir"),
      value: 30,
      format: "month",
    },
    {
      name: t("AppMuatpartsAnalisaProduk90HariTerakhir"),
      value: 90,
      format: "month",
    },
    {
      name: t("AppMuatpartsAnalisaProduk1TahunTerakhir"),
      value: 365,
      format: "year",
    },
  ];

  return (
    <>
      <main className="flex justify-center px-10 py-8">
        <div className="mx-auto flex max-w-[1280px] flex-col">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-[20px] font-bold leading-[120%] text-neutral-900">
              Daftar Pesanan
            </h1>
            <DropdownPeriode
              options={periodOptions}
              onSelect={handleSelectSort}
              recentSelections={getRecentOptionsSort}
            />
          </div>

          {requiringConfirmationCount &&
          requiringConfirmationCount.hasConfirmationRequired > 0 ? (
            <NeedConfirmationWarning
              breakdown={requiringConfirmationCount.breakdown}
            />
          ) : null}

          <PesananTable
            queryParams={queryParams}
            onChangeQueryParams={onChangeQueryParams}
            tempSearch={tempSearch}
            setTempSearch={setTempSearch}
            orders={orders}
            isOrdersLoading={isOrdersLoading}
            hasOrders={hasOrders}
            countByStatus={countByStatus}
          />

          {/* Pagination */}
          {hasOrders ? (
            <div className="mt-4 flex items-center justify-between">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                perPage={pagination.itemsPerPage}
                onPageChange={(value) => onChangeQueryParams("page", value)}
                onPerPageChange={(value) => onChangeQueryParams("limit", value)}
              />
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
};

export default DaftarPesananWeb;

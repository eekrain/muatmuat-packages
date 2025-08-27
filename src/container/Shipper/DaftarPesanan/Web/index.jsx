"use client";

import { useMemo, useState } from "react";

import { AlertMultiline } from "@/components/Alert/AlertMultiline";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import Pagination from "@/components/Pagination/Pagination";
import PesananTable from "@/components/Table/PesananTable";

import { useTranslation } from "@/hooks/use-translation";

import { translatedPeriodOptions } from "@/lib/constants/Shared/periodOptions";
import { formatToYYYYMMDD } from "@/lib/utils/dateFormat";

const DaftarPesananWeb = ({
  queryParams,
  onChangeQueryParams,
  orders,
  pagination,
  isOrdersLoading,
  settlementAlertInfo,
  hasNoOrders,
  lastFilterField,
  statusTabOptions,
  statusRadioOptions,
  currentPeriodValue,
  setCurrentPeriodValue,
}) => {
  const { t } = useTranslation();
  const [tempSearch, setTempSearch] = useState("");
  const [recentPeriodOptions, setRecentPeriodOptions] = useState([]);

  const alertItems = useMemo(() => {
    if (!settlementAlertInfo) return [];

    const listPesananUrl = [
      "/daftarpesanan/pesananmenunggupembayaran",
      "/daftarpesanan/pesananmenunggupelunasan",
      "/daftarpesanan/butuhkonfirmasianda",
      "/daftarpesanan/butuhkonfirmasianda",
    ];
    return settlementAlertInfo
      .map((item, key) => {
        if (!item.orderId || item.orderId.length === 0) {
          return null;
        }
        return {
          label: item.alertText,
          link: {
            label: "Lihat Pesanan",
            link:
              item.orderId.length === 1
                ? `/daftarpesanan/detailpesanan/${item.orderId[0]}`
                : listPesananUrl[key],
          },
        };
      })
      .filter(Boolean);
  }, [settlementAlertInfo]);

  const hasFilteredOrders = orders.length > 0;

  const handleSelectPeriod = (selectedOption) => {
    // For custom date range option
    if (selectedOption?.range) {
      // Use string manipulation, not Date object with toISOString()
      const formattedStartDate = formatToYYYYMMDD(selectedOption.start_date);
      const formattedEndDate = formatToYYYYMMDD(selectedOption.end_date);

      onChangeQueryParams("startDate", formattedStartDate);
      onChangeQueryParams("endDate", formattedEndDate);

      // Update recent selections - only add if not already in the array
      if (
        !recentPeriodOptions?.some((s) => s?.value === selectedOption?.value)
      ) {
        setRecentPeriodOptions((prev) => [...prev, selectedOption]);
      }

      // Update the current period value
      setCurrentPeriodValue(selectedOption);
    }
    // For default "Semua Periode" option
    else if (selectedOption?.value === "") {
      onChangeQueryParams("startDate", null);
      onChangeQueryParams("endDate", null);

      // Update the current period value
      setCurrentPeriodValue(selectedOption);
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

      // Update the current period value
      setCurrentPeriodValue(selectedOption);
    }
  };

  // Example function to reset the period dropdown
  const resetPeriodDropdown = () => {
    // Reset to default option (first option in the list)
    setCurrentPeriodValue(periodOptions[0]);
    onChangeQueryParams("startDate", null);
    onChangeQueryParams("endDate", null);
  };

  const periodOptions = translatedPeriodOptions(t);

  return (
    <main className="flex justify-center">
      <div className="mx-auto flex max-w-[1280px] flex-1 flex-col px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold leading-[120%] text-neutral-900">
            Daftar Pesanan
          </h1>
          <DropdownPeriode
            disable={
              hasNoOrders ||
              (!hasFilteredOrders &&
                !queryParams.startDate &&
                !queryParams.endDate)
            }
            options={periodOptions}
            onSelect={handleSelectPeriod}
            recentSelections={recentPeriodOptions}
            value={currentPeriodValue} // Pass the current value to control the dropdown
            buttonVariant="muatparts-primary"
          />
        </div>

        <AlertMultiline items={alertItems} className="mt-6" />

        <PesananTable
          queryParams={queryParams}
          onChangeQueryParams={(field, value) => {
            // Example: When changing certain filters, also reset the period dropdown
            if (field === "search") {
              resetPeriodDropdown();
            }
            onChangeQueryParams(field, value);
          }}
          tempSearch={tempSearch}
          setTempSearch={setTempSearch}
          orders={orders}
          isOrdersLoading={isOrdersLoading}
          hasNoOrders={hasNoOrders}
          hasFilteredOrders={hasFilteredOrders}
          lastFilterField={lastFilterField}
          statusTabOptions={statusTabOptions}
          statusRadioOptions={statusRadioOptions}
        />

        {/* Pagination */}
        {hasFilteredOrders ? (
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
  );
};

export default DaftarPesananWeb;

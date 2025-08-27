"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import PageTitle from "@/components/PageTitle/PageTitle";

import { useTranslation } from "@/hooks/use-translation";

import DashboardDataTable from "@/app/transporter/(main)/dashboard/real-time/components/DashboardDataTable";

import Period from "../../../components/Period";
import TruncatedTooltip from "../../../components/TruncatedTooltip";
import ExpandableReview from "./ExpandableReview";

const toYYYYMMDD = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    console.error("Invalid date provided to toYYYYMMDD:", date);
    return null;
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const RatingHistoryTable = () => {
  const { t } = useTranslation();
  const params = useParams();
  const driverId = params.driverId;

  const [tableData, setTableData] = useState({
    history: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    },
    summary: { totalRating: 0 },
    emptyState: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ sort: "date", order: "desc" });
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});
  const [period, setPeriod] = useState(null);
  const [recentPeriodOptions, setRecentPeriodOptions] = useState([]);
  const [controlsDisabled, setControlsDisabled] = useState({
    disablePeriod: false,
  });

  useEffect(() => {
    if (!driverId) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: perPage,
      });
      if (searchValue) queryParams.append("search", searchValue);
      if (sortConfig.sort) {
        queryParams.append("sort", sortConfig.sort);
        queryParams.append("order", sortConfig.order);
      }
      if (filters.rating?.length) {
        filters.rating.forEach((r) => queryParams.append("rating", r.id));
      }
      if (period) {
        let dateFrom, dateTo;
        if (period.iso_start_date && period.iso_end_date) {
          dateFrom = toYYYYMMDD(period.iso_start_date);
          dateTo = toYYYYMMDD(period.iso_end_date);
        } else if (typeof period.value === "number") {
          const today = new Date();
          const fromDate = new Date();
          fromDate.setDate(today.getDate() - period.value);
          dateTo = toYYYYMMDD(today);
          dateFrom = toYYYYMMDD(fromDate);
        }
        if (dateFrom && dateTo) {
          queryParams.append("dateFrom", dateFrom);
          queryParams.append("dateTo", dateTo);
        }
      }
      try {
        const response = await fetch(
          `/api/v1/ratings/drivers/${driverId}?${queryParams.toString()}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        setTableData(result.Data);
      } catch (e) {
        console.error(e);
        setError(
          t(
            "RatingHistoryTable.messageErrorFetch",
            {},
            "Gagal memuat riwayat rating."
          )
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [
    driverId,
    currentPage,
    perPage,
    sortConfig,
    searchValue,
    filters,
    period,
    t,
  ]);

  const handleSelectPeriod = (selectedOption) => {
    if (selectedOption?.range) {
      if (
        !recentPeriodOptions.some((item) => item.value === selectedOption.value)
      ) {
        setRecentPeriodOptions((prev) => [selectedOption, ...prev].slice(0, 3));
      }
    }
    setPeriod(selectedOption);
  };

  const formatDate = (dateString) => {
    return `${new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(dateString))} WIB`;
  };

  const columns = useMemo(
    () => [
      {
        key: "date",
        header: t("RatingHistoryTable.columnDate", {}, "Tanggal"),
        sortable: true,
        className: "!text-xs font-medium align-top",
        width: "185px",
        render: (row) => formatDate(row.date),
      },
      {
        key: "orderNumber",
        header: t("RatingHistoryTable.columnOrderNumber", {}, "No. Pesanan"),
        width: "204px",
        sortable: true,
        className:
          "text-primary-700 font-medium !text-xs hover:text-primary-800 align-top",
        render: (row) => (
          <Link href={`/daftar-pesanan/${row.orderNumber}`}>
            {row.orderNumber}
          </Link>
        ),
      },
      {
        key: "driverName",
        header: t("RatingHistoryTable.columnDriverName", {}, "Nama Driver"),
        width: "230px",
        className: "!text-xs font-medium align-top",
        sortable: true,
        render: (row) => (
          <TruncatedTooltip text={row.driverName} lineClamp={2} />
        ),
      },
      {
        key: "armada",
        header: t("RatingHistoryTable.columnFleet", {}, "Armada"),
        width: "300px",
        className: "align-top",
        sortable: false,
        render: (row) => (
          <div>
            <p className="text-xs font-bold">{row.armada.name}</p>
            <p className="mt-px text-[10px] font-medium text-neutral-900">
              <span className="text-neutral-600">
                {t("RatingHistoryTable.labelCarrier", {}, "Carrier :")}
              </span>
              {row.armada.carrier}
            </p>
            <span className="mt-2 flex items-center gap-1 text-[10px] font-medium text-neutral-900">
              <IconComponent
                src="/icons/transporter-brown.svg"
                width={14}
                height={14}
              />
              {row.armada.licensePlate}
            </span>
          </div>
        ),
      },
      {
        key: "rating",
        header: t(
          "RatingHistoryTable.columnRatingReview",
          {},
          "Rating dan Ulasan"
        ),
        className: "align-top",
        sortable: true,
        render: (row) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 font-semibold">
              <IconComponent
                src="/icons/star_icon.svg"
                className="text-secondary-500"
              />
              <p className="mt-[2px] text-xs font-semibold text-neutral-900">
                {Number(row.rating).toFixed(1)}
                <span className="text-[10px] text-neutral-600">/5</span>
              </p>
            </div>
            <ExpandableReview text={row.review} />
          </div>
        ),
      },
    ],
    [t]
  );

  const filterConfig = useMemo(
    () => ({
      categories: [
        {
          key: "rating",
          label: t("RatingHistoryTable.filterLabelRating", {}, "Rating"),
          type: "checkbox-multi",
        },
      ],
      data: {
        rating: [
          {
            id: 5,
            label: t("RatingHistoryTable.filterOption5Stars", {}, "5 Bintang"),
            icon: "/icons/star_icon.svg",
          },
          {
            id: 4,
            label: t("RatingHistoryTable.filterOption4Stars", {}, "4 Bintang"),
            icon: "/icons/star_icon.svg",
          },
          {
            id: 3,
            label: t("RatingHistoryTable.filterOption3Stars", {}, "3 Bintang"),
            icon: "/icons/star_icon.svg",
          },
          {
            id: 2,
            label: t("RatingHistoryTable.filterOption2Stars", {}, "2 Bintang"),
            icon: "/icons/star_icon.svg",
          },
          {
            id: 1,
            label: t("RatingHistoryTable.filterOption1Star", {}, "1 Bintang"),
            icon: "/icons/star_icon.svg",
          },
        ],
      },
    }),
    [t]
  );

  const periodOptions = useMemo(
    () => [
      {
        name: t(
          "RatingHistoryTable.periodOptionAll",
          {},
          "Semua Periode (Default)"
        ),
        value: "",
      },
      {
        name: t("RatingHistoryTable.periodOptionToday", {}, "Hari Ini"),
        value: 0,
      },
      {
        name: t(
          "RatingHistoryTable.periodOptionLast7Days",
          {},
          "7 Hari Terakhir"
        ),
        value: 7,
      },
      {
        name: t(
          "RatingHistoryTable.periodOptionLast30Days",
          {},
          "30 Hari Terakhir"
        ),
        value: 30,
      },
      {
        name: t(
          "RatingHistoryTable.periodOptionLastYear",
          {},
          "1 Tahun Terakhir"
        ),
        value: 365,
      },
    ],
    [t]
  );

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <PageTitle withBack={true} className="!mb-0">
          {t(
            "RatingDriverHistoryPage.titlePage",
            {},
            "Riwayat Rating Driver Keseluruhan"
          )}
        </PageTitle>
        <div className="flex items-center gap-4">
          <Period
            value={period}
            onSelect={handleSelectPeriod}
            options={periodOptions}
            recentSelections={recentPeriodOptions}
            disable={controlsDisabled.disablePeriod}
          />
          <Button
            variant="muattrans-primary"
            className="px-6 py-2 text-muat-trans-secondary-900 disabled:text-neutral-600"
            iconLeft="/icons/download16.svg"
            disabled={loading || !tableData.history.length}
            appearance={{
              iconClassName:
                "text-muat-trans-secondary-900 disabled:text-neutral-600",
            }}
          >
            {t("RatingHistoryTable.buttonDownload", {}, "Unduh")}
          </Button>
        </div>
      </div>
      <DashboardDataTable
        data={tableData.history}
        columns={columns}
        loading={loading}
        totalItems={tableData.pagination.totalItems}
        currentPage={tableData.pagination.currentPage}
        perPage={tableData.pagination.itemsPerPage}
        onPageChange={setCurrentPage}
        onPerPageChange={setPerPage}
        activeSearchValue={searchValue}
        onSearchChange={setSearchValue}
        activeFilters={filters}
        onFilterChange={setFilters}
        isPeriodActive={period && period.value !== ""}
        onSort={(sort, order) => setSortConfig({ sort, order })}
        onControlsStateChange={setControlsDisabled}
        searchPlaceholder={t(
          "RatingHistoryTable.searchPlaceholder",
          {},
          "Cari No. Pesanan / Armada"
        )}
        filterConfig={filterConfig}
        headerActions={
          <div className="flex items-center gap-4">
            <div className="text-sm font-semibold">
              {t("RatingHistoryTable.headerTotalRating", {}, "Total Rating")} :
              <span className="text-base font-bold">
                {tableData.summary.totalRating}
                <span className="text-sm font-medium text-neutral-600">/5</span>
              </span>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default RatingHistoryTable;

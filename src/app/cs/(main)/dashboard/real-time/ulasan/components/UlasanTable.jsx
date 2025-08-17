"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import DashboardDataTable from "@/app/transporter/(main)/dashboard/real-time/components/DashboardDataTable";
import Period from "@/app/transporter/(main)/dashboard/real-time/components/Period";
import TruncatedTooltip from "@/app/transporter/(main)/dashboard/real-time/components/TruncatedTooltip";
import ExpandableReview from "@/app/transporter/(main)/dashboard/real-time/rating-driver/[driverId]/components/ExpandableReview";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useTranslation } from "@/hooks/use-translation";

const toYYYYMMDD = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const UlasanTable = () => {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState({
    reviews: [],
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
    summary: { averageRating: 0, newCount: 0, readCount: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [transporterOptions, setTransporterOptions] = useState([]);

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
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchTransporters = async () => {
      try {
        const response = await fetch("/api/v1/cs/transporters/filter-options");
        const result = await response.json();
        setTransporterOptions(result.data);
      } catch (error) {
        console.error("Failed to fetch transporter options", error);
      }
    };
    fetchTransporters();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setSelectedRows([]);
      const params = new URLSearchParams({
        page: currentPage,
        limit: perPage,
      });
      if (searchValue) params.append("search", searchValue);
      if (sortConfig.sort) {
        params.append("sort", sortConfig.sort);
        params.append("order", sortConfig.order);
      }
      if (filters.ratingFilter?.length) {
        filters.ratingFilter.forEach((r) =>
          params.append("ratingFilter", r.id)
        );
      }
      if (filters.transporterFilter?.length) {
        filters.transporterFilter.forEach((t) =>
          params.append("transporterFilter", t.id)
        );
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
          params.append("dateFrom", dateFrom);
          params.append("dateTo", dateTo);
        }
      }
      try {
        const response = await fetch(`/api/v1/cs/reviews?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const result = await response.json();
        setTableData(result.Data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, perPage, sortConfig, searchValue, filters, period]);

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

  const columns = useMemo(() => {
    const baseColumns = [
      {
        key: "date",
        header: t("csUlasan.table.header.date", {}, "Tanggal"),
        sortable: true,
        width: "184px",
        className: "align-top text-xs font-medium",
        render: (row) =>
          `${new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(row.date))} WIB`,
      },
      {
        key: "transporter",
        header: t("csUlasan.table.header.transporter", {}, "Transporter"),
        sortable: true,
        width: "220px",
        className: "align-top",
        render: (row) => (
          <div className="flex items-center gap-2">
            <Image
              src={row.transporter.logo}
              alt={row.transporter.name}
              width={40}
              height={40}
              className="aspect-square rounded-full border border-neutral-600"
            />
            <TruncatedTooltip
              text={row.transporter.name}
              lineClamp={2}
              className="text-xs font-bold"
            />
          </div>
        ),
      },
      {
        key: "orderNumber",
        header: t("csUlasan.table.header.orderNo", {}, "No. Pesanan"),
        sortable: true,
        width: "130px",
        className:
          "text-primary-700 font-medium hover:text-primary-800 align-top text-xs",
        render: (row) => (
          <Link href={`/daftar-pesanan/${row.orderNumber}`}>
            {row.orderNumber}
          </Link>
        ),
      },
      {
        key: "driver",
        header: t("csUlasan.table.header.driver", {}, "Driver"),
        sortable: true,
        width: "260px",
        className: "align-top",
        render: (row) => (
          <div>
            <TruncatedTooltip
              text={row.driver.name}
              lineClamp={2}
              className="text-xs font-bold"
            />
            <span className="mt-1 flex items-center gap-1 text-[10px] text-neutral-900">
              <IconComponent
                src="/icons/transporter-brown.svg"
                width={14}
                height={14}
              />
              {row.driver.licensePlate}
            </span>
          </div>
        ),
      },
      {
        key: "rating",
        header: t(
          "csUlasan.table.header.ratingReview",
          {},
          "Rating dan Ulasan"
        ),
        sortable: true,
        className: "align-top",
        render: (row) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 font-semibold">
              <IconComponent
                src="/icons/star_icon.svg"
                className="text-secondary-500"
              />
              <p className="mt-[2px] text-xs font-semibold">
                {Number(row.rating).toFixed(1)}
                <span className="text-[10px] text-neutral-600">/5</span>
              </p>
            </div>
            <ExpandableReview text={row.review} limit={62} />
          </div>
        ),
      },
    ];

    return baseColumns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRows, tableData.reviews, t]);

  const filterConfig = {
    categories: [
      {
        key: "ratingFilter",
        label: t("csUlasan.filter.rating", {}, "Rating"),
        type: "checkbox-multi",
      },
      {
        key: "transporterFilter",
        label: t("csUlasan.filter.transporter", {}, "Transporter"),
        type: "checkbox-multi",
        searchable: true,
      },
    ],
    data: {
      ratingFilter: [
        {
          id: 5,
          label: t(
            "csRatingTransporter.filter.rating.fiveStars",
            {},
            "5 Bintang"
          ),
          icon: "/icons/star_icon.svg",
        },
        {
          id: 4,
          label: t(
            "csRatingTransporter.filter.rating.fourStars",
            {},
            "4 Bintang"
          ),
          icon: "/icons/star_icon.svg",
        },
        {
          id: 3,
          label: t(
            "csRatingTransporter.filter.rating.threeStars",
            {},
            "3 Bintang"
          ),
          icon: "/icons/star_icon.svg",
        },
        {
          id: 2,
          label: t(
            "csRatingTransporter.filter.rating.twoStars",
            {},
            "2 Bintang"
          ),
          icon: "/icons/star_icon.svg",
        },
        {
          id: 1,
          label: t(
            "csRatingTransporter.filter.rating.oneStar",
            {},
            "1 Bintang"
          ),
          icon: "/icons/star_icon.svg",
        },
      ],
      transporterFilter: transporterOptions,
    },
  };

  const periodOptions = [
    { name: t("csUlasan.period.all", {}, "Semua Periode"), value: "" },
    { name: t("csUlasan.period.today", {}, "Hari Ini"), value: 0 },
    { name: t("csUlasan.period.last7Days", {}, "1 Minggu Terakhir"), value: 7 },
    {
      name: t("csUlasan.period.last30Days", {}, "30 Hari Terakhir"),
      value: 30,
    },
    {
      name: t("csUlasan.period.last1Year", {}, "1 Tahun Terakhir"),
      value: 365,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <PageTitle withBack={true} className="!m-0">
          {t("csUlasan.pageTitle", {}, "Daftar Ulasan")}
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
            className="h-9 px-6 text-muat-trans-secondary-900 disabled:text-neutral-600"
            iconLeft="/icons/download16.svg"
            appearance={{
              iconClassName: "text-muat-trans-secondary-900",
            }}
            disabled={loading || !tableData.reviews.length}
          >
            {t("csUlasan.button.download", {}, "Unduh")}
          </Button>
        </div>
      </div>
      <DashboardDataTable
        data={tableData.reviews}
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
        searchPlaceholder={t("csUlasan.searchPlaceholder", {}, "Cari Ulasan")}
        filterConfig={filterConfig}
        showDisplayView={true}
        headerActions={
          <div className="text-sm font-semibold">
            {t("csUlasan.summaryTitle", {}, "Total Rating")} :
            <span className="ml-1 text-base font-bold">
              {tableData.summary.averageRating}
              <span className="text-sm font-medium text-neutral-600">/5</span>
            </span>
          </div>
        }
      />
    </div>
  );
};

export default UlasanTable;

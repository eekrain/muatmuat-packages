"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useGetDriverRatings } from "@/services/CS/dashboard/realtime/getDriverRatings";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import PageTitle from "@/components/PageTitle/PageTitle";

import { useTranslation } from "@/hooks/use-translation";

import DashboardDataTable from "@/app/transporter/(main)/dashboard/real-time/components/DashboardDataTable";
import TruncatedTooltip from "@/app/transporter/(main)/dashboard/real-time/components/TruncatedTooltip";

const DriverDetailRatingTable = () => {
  const { t } = useTranslation();
  const params = useParams();
  const transporterId = params.transporterId;

  console.log(transporterId);

  const [tableData, setTableData] = useState({
    drivers: [],
    transporter: {},
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    },
    summary: { averageRatingAll: 0 },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ sort: "name", order: "asc" });
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});

  // Build query string for API call
  const queryString = useMemo(() => {
    const params = new URLSearchParams({ page: currentPage, limit: perPage });
    if (searchValue) params.append("search", searchValue);
    if (sortConfig.sort) {
      params.append("sort", sortConfig.sort);
      params.append("order", sortConfig.order);
    }
    if (filters.ratingFilter?.length) {
      filters.ratingFilter.forEach((r) => params.append("ratingFilter", r.id));
    }
    return params.toString();
  }, [currentPage, perPage, sortConfig, searchValue, filters]);

  // Use SWR hook for data fetching
  const {
    data: apiData,
    error,
    isLoading,
  } = useGetDriverRatings(transporterId, queryString);
  const loading = isLoading;

  // Update table data when API data changes
  useEffect(() => {
    if (apiData) {
      setTableData({
        drivers: apiData.drivers || [],
        transporter: apiData.transporter || {},
        pagination: apiData.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
        },
        summary: { averageRatingAll: apiData.transporter?.overallRating || 0 },
      });
    }
  }, [apiData]);

  const columns = useMemo(
    () => [
      {
        key: "no",
        header: t("csDriverRating.table.header.no", {}, "No."),
        width: "100px",
        className: "text-xs font-medium",
        sortable: false,
        render: (_, index) => (currentPage - 1) * perPage + index + 1,
      },
      {
        key: "name",
        header: t("csDriverRating.table.header.driver", {}, "Driver"),
        width: "580px",
        sortable: true,
        render: (row) => (
          <div>
            <TruncatedTooltip
              text={row.name}
              lineClamp={2}
              className="text-xs font-bold"
            />
            <div className="mt-1 flex items-center gap-px">
              <IconComponent src="/icons/call16.svg" width={14} height={14} />
              <p className="text-neutral-900">{row.phoneNumber}</p>
            </div>
          </div>
        ),
      },
      {
        key: "average_rating",
        header: t("csDriverRating.table.header.rating", {}, "Rating"),
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-1 font-semibold">
            <IconComponent src="/icons/star_icon.svg" />
            <p className="mt-1 text-xs">
              {Number(row.rating?.averageRating || 0).toFixed(1)}
              <span className="text-[10px] text-neutral-600">/5</span>
            </p>
          </div>
        ),
      },
      {
        key: "total_orders",
        header: t(
          "csDriverRating.table.header.orderCount",
          {},
          "Jumlah Pesanan"
        ),
        sortable: true,
        className: "text-xs font-medium",
        render: (row) =>
          `${row.orderStats?.totalOrders || row.orderCount || 0} ${t("csDriverRating.table.orderUnit", {}, "Pesanan")}`,
      },
    ],
    [currentPage, perPage, t]
  );

  const filterConfig = {
    categories: [
      {
        key: "ratingFilter",
        label: t("csDriverRating.filter.rating", {}, "Rating"),
        type: "checkbox-multi",
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
    },
  };

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <PageTitle withBack={true} className={"!m-0"}>
          {t(
            "csDriverRating.pageTitle",
            {},
            "Detail Rating Driver Transporter"
          )}
        </PageTitle>
        <Button
          variant="muattrans-primary"
          className="h-9 px-6 text-muat-trans-secondary-900 disabled:text-neutral-600"
          appearance={{
            iconClassName: "text-muat-trans-secondary-900",
          }}
          iconLeft="/icons/download16.svg"
          disabled={loading || !tableData.drivers.length}
        >
          {t("csDriverRating.button.download", {}, "Unduh")}
        </Button>
      </div>

      <DashboardDataTable
        data={tableData.drivers}
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
        onSort={(sort, order) => setSortConfig({ sort, order })}
        searchPlaceholder={t(
          "csDriverRating.searchPlaceholder",
          {},
          "Cari Nama Driver"
        )}
        filterConfig={filterConfig}
        firsTimerTitle={t(
          "csDriverRating.emptyState.title",
          {},
          "Oops, rating driver masih kosong"
        )}
        firstTimerSubtitle={t(
          "csDriverRating.emptyState.subtitle",
          {},
          "Belum ada Shipper yang memberikan rating kepada Driver di Transporter ini"
        )}
        containerClassName={"!pb-1"}
        infoView={
          <div className="order-1 flex w-full items-center justify-between">
            {tableData.transporter.companyName ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-neutral-600">
                  {t("csDriverRating.transporterLabel", {}, "Transporter")} :
                </span>
                <Image
                  src={
                    tableData.transporter.logo || "/images/logo-placeholder.png"
                  }
                  alt={tableData.transporter.companyName || "Transporter"}
                  width={24}
                  height={24}
                  className="aspect-square rounded-full border border-neutral-700"
                />
                <span className="text-xs font-bold">
                  {tableData.transporter.companyName}
                </span>
              </div>
            ) : (
              <div></div>
            )}

            <div className="text-sm font-semibold text-neutral-900">
              {t(
                "csDriverRating.summaryTitle",
                {},
                "Rating Driver Keseluruhan"
              )}{" "}
              :
              <span className="ml-1 text-base font-bold">
                {Number(tableData.summary.averageRatingAll).toFixed(1)}
                <span className="text-sm font-medium text-neutral-600">/5</span>
              </span>
            </div>
          </div>
        }
      />
    </>
  );
};

export default DriverDetailRatingTable;

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useGetTransporterRatings } from "@/services/CS/dashboard/realtime/getTransporterRatings";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import PageTitle from "@/components/PageTitle/PageTitle";

import { useTranslation } from "@/hooks/use-translation";

import DashboardDataTable from "@/app/transporter/(main)/dashboard/real-time/components/DashboardDataTable";
import TruncatedTooltip from "@/app/transporter/(main)/dashboard/real-time/components/TruncatedTooltip";

const TransporterRatingTable = () => {
  const { t } = useTranslation(); // <-- INSTANTIATE HOOK
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    sort: "company_name",
    order: "asc",
  });
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});

  // Build query string for API
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
  } = useGetTransporterRatings(queryString);
  console.log(apiData);

  // Transform API data to match UI expectations
  const tableData = useMemo(() => {
    if (!apiData) {
      return {
        transporters: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
        },
        summary: { averageRatingAll: 0 },
      };
    }

    // Transform transporter data to match UI structure
    const transformedTransporters =
      apiData.transporters?.map((transporter) => ({
        id: transporter.id,
        companyName: transporter.companyName,
        logo: transporter.logo,
        rating: transporter.rating?.averageRating || 0,
        orderCount: transporter.orderStats?.totalOrders || 0,
      })) || [];

    return {
      transporters: transformedTransporters,
      pagination: {
        currentPage: apiData.pagination?.currentPage || 1,
        totalPages: apiData.pagination?.totalPages || 1,
        totalItems: apiData.pagination?.totalItems || 0,
        itemsPerPage: apiData.pagination?.itemsPerPage || 10,
      },
      summary: {
        averageRatingAll: apiData.statistics?.averageRatingAll || 0,
      },
    };
  }, [apiData]);

  const columns = useMemo(
    () => [
      {
        key: "no",
        header: t("csRatingTransporter.table.header.no", {}, "No."),
        width: "50px",
        className: "text-xs font-medium",
        sortable: false,
        render: (_, index) => (currentPage - 1) * perPage + index + 1,
      },
      {
        key: "company_name",
        width: "680px",
        header: t(
          "csRatingTransporter.table.header.transporter",
          {},
          "Transporter"
        ),
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-2">
            <Image
              src={row.logo}
              alt={row.companyName}
              width={40}
              height={40}
              className="aspect-square rounded-full border border-neutral-500 object-cover"
            />
            <TruncatedTooltip
              text={row.companyName}
              lineClamp={2}
              className="text-xs font-bold"
            />
          </div>
        ),
      },
      {
        key: "average_rating",
        header: t("csRatingTransporter.table.header.rating", {}, "Rating"),
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-1 text-sm font-semibold">
            <IconComponent src="/icons/star_icon.svg" />
            <div>
              {Number(row.rating).toFixed(1)}
              {""}
              <span className="text-[10px] text-neutral-600">/5</span>
            </div>
          </div>
        ),
      },
      {
        key: "total_orders",
        header: t(
          "csRatingTransporter.table.header.orderCount",
          {},
          "Jumlah Pesanan"
        ),
        sortable: true,
        className: "text-xs font-medium",
        render: (row) => `${row.orderCount} Pesanan`,
      },
      {
        key: "action",
        header: "",
        sortable: false,
        width: "120px",
        render: (row) => (
          <Button
            variant="muattrans-primary"
            className="h-9 w-full !px-7 text-sm text-muat-trans-secondary-900 disabled:text-neutral-600"
            onClick={() =>
              router.push(`/dashboard/real-time/rating-driver/${row.id}`)
            }
          >
            {t("csRatingTransporter.table.button.detail", {}, "Detail")}
          </Button>
        ),
      },
    ],
    [currentPage, perPage, router, t]
  );
  const filterConfig = {
    categories: [
      {
        key: "ratingFilter",
        label: t("csRatingTransporter.filter.rating", {}, "Rating"),
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
            "csRatingTransporter.pageTitle",
            {},
            "Rating Transporter Keseluruhan"
          )}
        </PageTitle>
        <Button
          variant="muattrans-primary"
          className="h-9 px-6 text-muat-trans-secondary-900 disabled:text-neutral-600"
          appearance={{
            iconClassName: "text-muat-trans-secondary-900",
          }}
          iconLeft="/icons/download16.svg"
          disabled={isLoading || !tableData.transporters.length}
        >
          {t("csRatingTransporter.button.download", {}, "Unduh")}
        </Button>
      </div>
      <DashboardDataTable
        data={tableData.transporters}
        columns={columns}
        loading={isLoading}
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
          "csRatingTransporter.searchPlaceholder",
          {},
          "Cari Nama Transporter"
        )}
        filterConfig={filterConfig}
        firsTimerTitle={t(
          "csRatingTransporter.emptyState.title",
          {},
          "Oops, rating transporter keseluruhan masih kosong"
        )}
        firstTimerSubtitle={t(
          "csRatingTransporter.emptyState.subtitle",
          {},
          "Belum ada Shipper yang memberikan rating kepada Transporter"
        )}
        headerActions={
          <div className="text-sm font-semibold text-neutral-900">
            {t(
              "csRatingTransporter.summaryTitle",
              {},
              "Rating Transporter Keseluruhan"
            )}{" "}
            :
            <span className="ml-1 text-base font-bold">
              {tableData.summary.averageRatingAll}
              <span className="text-sm font-medium text-neutral-600">/5</span>
            </span>
          </div>
        }
      />
    </>
  );
};

export default TransporterRatingTable;

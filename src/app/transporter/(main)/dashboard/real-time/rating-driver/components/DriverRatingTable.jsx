"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import DashboardDataTable from "@/app/transporter/(main)/dashboard/real-time/components/DashboardDataTable";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useTranslation } from "@/hooks/use-translation";

import TruncatedTooltip from "../../components/TruncatedTooltip";

const DriverRatingTable = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [tableData, setTableData] = useState({
    drivers: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    },
    summary: { overallAverageRating: 0 },
    emptyState: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ sort: null, order: null });
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ page: currentPage, limit: perPage });
      if (searchValue) params.append("search", searchValue);
      if (sortConfig.sort) {
        params.append("sort", sortConfig.sort);
        params.append("order", sortConfig.order);
      }
      if (filters.rating?.length) {
        filters.rating.forEach((r) => params.append("rating", r.id));
      }

      try {
        const response = await fetch(
          `/api/v1/ratings/drivers?${params.toString()}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        setTableData(result.Data);
      } catch (e) {
        console.error("Failed to fetch data:", e);
        setError(
          t(
            "DriverRatingTable.messageErrorFetch",
            {},
            "Gagal mengambil data. Silakan coba lagi."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, perPage, sortConfig, searchValue, filters, t]);

  const columns = useMemo(
    () => [
      {
        key: "no",
        header: t("DriverRatingTable.columnNo", {}, "No."),
        width: "100px",
        className: "!text-xs",
        sortable: false,
        render: (_value, rowIndex) => {
          const page = Number(currentPage) || 1;
          const itemsPerPage = Number(perPage) || 10;
          return (page - 1) * itemsPerPage + rowIndex + 1;
        },
      },
      {
        key: "name",
        header: t("DriverRatingTable.columnDriver", {}, "Driver"),
        width: "380px",
        sortable: true,
        render: (row) => (
          <div>
            <TruncatedTooltip
              text={row.name}
              lineClamp={2}
              className="text-xs font-bold"
            />
            <div className="mt-1 flex items-center gap-px">
              <IconComponent src="/icons/phone16.svg" width={14} height={14} />
              <p className="text-neutral-900">{row.phoneNumber}</p>
            </div>
          </div>
        ),
      },
      {
        key: "rating",
        header: t("DriverRatingTable.columnRating", {}, "Rating"),
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-1 font-semibold">
            <IconComponent src="/icons/star_icon.svg" />
            <p className="mt-1 text-xs">
              {Number(row.rating).toFixed(1)}
              <span className="text-[10px] text-neutral-600">/5</span>
            </p>
          </div>
        ),
      },
      {
        key: "orderCount",
        header: t("DriverRatingTable.columnOrderCount", {}, "Jumlah Pesanan"),
        sortable: true,
        render: (row) => (
          <p className="text-xs font-medium text-neutral-900">
            {t(
              "DriverRatingTable.unitOrders",
              { count: row.orderCount },
              "{count} Pesanan"
            )}
          </p>
        ),
      },
      {
        key: "action",
        header: "",
        width: "120px",
        sortable: false,
        render: (row) => (
          <Button
            variant="muattrans-primary-secondary"
            className="h-8 w-full"
            onClick={() =>
              router.push(`/dashboard/real-time/rating-driver/${row.id}`)
            }
          >
            {t("DriverRatingTable.buttonHistory", {}, "Riwayat")}
          </Button>
        ),
      },
    ],
    [router, currentPage, perPage, t]
  );

  const filterConfig = useMemo(
    () => ({
      categories: [
        {
          key: "rating",
          label: t("DriverRatingTable.filterLabelRating", {}, "Rating"),
          type: "checkbox-multi",
        },
      ],
      data: {
        rating: [
          {
            id: 5,
            label: t("DriverRatingTable.filterOption5Stars", {}, "5 Bintang"),
            icon: "/icons/star_icon.svg",
          },
          {
            id: 4,
            label: t("DriverRatingTable.filterOption4Stars", {}, "4 Bintang"),
            icon: "/icons/star_icon.svg",
          },
          {
            id: 3,
            label: t("DriverRatingTable.filterOption3Stars", {}, "3 Bintang"),
            icon: "/icons/star_icon.svg",
          },
          {
            id: 2,
            label: t("DriverRatingTable.filterOption2Stars", {}, "2 Bintang"),
            icon: "/icons/star_icon.svg",
          },
          {
            id: 1,
            label: t("DriverRatingTable.filterOption1Star", {}, "1 Bintang"),
            icon: "/icons/star_icon.svg",
          },
        ],
      },
    }),
    [t]
  );

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <PageTitle className={"!leading-0 mb-0 self-center"} withBack={true}>
          {t(
            "RatingDriverPage.titleOverallDriverRating",
            {},
            "Rating Driver Keseluruhan"
          )}
        </PageTitle>
        <Button
          variant="muattrans-primary"
          className="px-6 py-2 text-muat-trans-secondary-900 disabled:text-neutral-600"
          disabled={loading || !tableData.drivers.length}
          appearance={{
            iconClassName:
              "text-muat-trans-secondary-900 disabled:text-neutral-600",
          }}
          iconLeft="/icons/download16.svg"
        >
          {t("DriverRatingTable.buttonDownload", {}, "Unduh")}
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
          "DriverRatingTable.searchPlaceholder",
          {},
          "Cari Nama Driver / No WhatsApp"
        )}
        filterConfig={filterConfig}
        firsTimerTitle={t(
          "DriverRatingTable.emptyStateTitle",
          {},
          "Oops, rating driver masih kosong"
        )}
        firstTimerSubtitle={t(
          "DriverRatingTable.emptyStateSubtitle",
          {},
          "Mulai terima permintaan sekarang untuk menampilkan data rating driver disini"
        )}
        firstTimerButtonText={t(
          "DriverRatingTable.emptyStateButton",
          {},
          "Lihat Permintaan"
        )}
        firstTimerButtonLink="/monitoring"
        headerActions={
          <div className="text-sm font-semibold text-neutral-900">
            {t(
              "DriverRatingTable.headerOverallRating",
              {},
              "Rating Driver Keseluruhan"
            )}{" "}
            :
            <span className="ml-1 text-base font-bold">
              {Number(tableData.summary.overallAverageRating).toFixed(1)}
              <span className="text-sm font-medium text-neutral-600">/5</span>
            </span>
          </div>
        }
      />
    </>
  );
};

export default DriverRatingTable;

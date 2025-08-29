"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import { InfoTooltip } from "@/components/Form/InfoTooltip";

import { useTranslation } from "@/hooks/use-translation";

import DashboardDataTable from "@/app/transporter/(main)/dashboard/real-time/components/DashboardDataTable";

const PotentialEarningsTable = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [tableData, setTableData] = useState({
    earnings: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    },
    summary: { totalPotential: 0 },
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

      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", perPage);
      if (searchValue) params.append("search", searchValue);
      if (sortConfig.sort) {
        params.append("sort", sortConfig.sort);
        params.append("order", sortConfig.order);
      }
      const statusFilter = filters.status;
      if (statusFilter) {
        if (Array.isArray(statusFilter) && statusFilter.length > 0) {
          statusFilter.forEach((s) => params.append("status", s.id));
        } else if (
          typeof statusFilter === "object" &&
          !Array.isArray(statusFilter) &&
          statusFilter.id
        ) {
          params.append("status", statusFilter.id);
        }
      }

      try {
        const response = await fetch(
          `/api/v1/earnings/potential-earnings?${params.toString()}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setTableData(result.Data);
      } catch (e) {
        console.error("Failed to fetch data:", e);
        setError(
          t(
            "PotentialEarningsTable.messageErrorFetch",
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

  const formatCurrency = (amount) =>
    `Rp${new Intl.NumberFormat("id-ID").format(amount)}`;

  const getStatusBadge = (status) => {
    const statusMap = {
      waiting_confirmation: { variant: "primary", icon: null, tooltip: true },
      confirmed: { variant: "primary", icon: null },
      scheduled: { variant: "primary", icon: null },
      loading: { variant: "primary", icon: null },
      unloading: { variant: "primary", icon: null },
      document_preparation: { variant: "primary", icon: null },
      document_delivery: { variant: "primary", icon: null },
      need_assignment: { variant: "warning", icon: "/icons/warning24.svg" },
      need_response: { variant: "warning", icon: "/icons/warning24.svg" },
      need_confirmation: { variant: "error", icon: "/icons/warning24.svg" },
    };

    const statusKeyMap = {
      waiting_confirmation: "WaitingConfirmation",
      confirmed: "Confirmed",
      scheduled: "Scheduled",
      loading: "Loading",
      unloading: "Unloading",
      document_preparation: "DocumentPreparation",
      document_delivery: "DocumentDelivery",
      need_assignment: "NeedAssignment",
      need_response: "NeedResponse",
      need_confirmation: "NeedConfirmation",
    };

    const keySuffix = statusKeyMap[status] || status;
    const label = t(`PotentialEarningsTable.status${keySuffix}`);
    const tooltip = t(`PotentialEarningsTable.tooltip${keySuffix}`, {}, ""); // Fallback to empty string if no tooltip

    const config = statusMap[status] || { variant: "default", label: status };

    return (
      <div className="inline-block">
        <BadgeStatusPesanan
          className="text-center"
          variant={config.variant}
          icon={{ iconLeft: config.icon }}
        >
          <div className="flex items-center gap-1">
            {tooltip && config.tooltip && (
              <InfoTooltip
                className={"w-[336px]"}
                appearance={{
                  iconClassName: "text-primary-700 !w-3 !h-3",
                }}
              >
                <p className="text-sm">{tooltip}</p>
              </InfoTooltip>
            )}
            <p>{label}</p>
          </div>
        </BadgeStatusPesanan>
      </div>
    );
  };

  const columns = useMemo(
    () => [
      {
        key: "orderNumber",
        header: t(
          "PotentialEarningsTable.columnOrderNumber",
          {},
          "No. Pesanan"
        ),
        sortable: true,
        render: (row) => (
          <div className="font-semibold text-neutral-900">
            {row.orderNumber}
          </div>
        ),
      },
      {
        key: "potentialAmount",
        header: t(
          "PotentialEarningsTable.columnPotentialAmount",
          {},
          "Potensi Pendapatan"
        ),
        sortable: true,
        render: (row) => (
          <div className="font-semibold text-neutral-900">
            {formatCurrency(row.potentialAmount)}
          </div>
        ),
      },
      {
        key: "status",
        header: t("PotentialEarningsTable.columnStatus", {}, "Status Pesanan"),
        sortable: true,
        render: (row) => getStatusBadge(row.status),
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
              router.push(
                `/dashboard/real-time/potensi-pendapatan/${row.earningId}`
              )
            }
          >
            {t("PotentialEarningsTable.buttonDetail", {}, "Detail")}
          </Button>
        ),
      },
    ],
    [router, t]
  );

  const filterConfig = useMemo(
    () => ({
      categories: [
        {
          key: "status",
          label: t("PotentialEarningsTable.filterLabelStatus", {}, "Status"),
          type: "radio-single",
        },
      ],
      data: {
        status: [
          {
            id: "waiting_confirmation",
            label: t(
              "PotentialEarningsTable.filterOptionWaitingConfirmation",
              {},
              "Menunggu Konfirmasi Shipper"
            ),
          },
          {
            id: "confirmed",
            label: t(
              "PotentialEarningsTable.filterOptionConfirmed",
              {},
              "Pesanan Terkonfirmasi"
            ),
          },
          {
            id: "scheduled",
            label: t(
              "PotentialEarningsTable.filterOptionScheduled",
              {},
              "Armada Dijadwalkan"
            ),
          },
          {
            id: "need_response",
            label: t(
              "PotentialEarningsTable.filterOptionNeedResponse",
              {},
              "Perlu Respon Perubahan"
            ),
          },
          {
            id: "need_confirmation",
            label: t(
              "PotentialEarningsTable.filterOptionNeedConfirmation",
              {},
              "Perlu Konfirmasi Siap"
            ),
          },
          {
            id: "need_assignment",
            label: t(
              "PotentialEarningsTable.filterOptionNeedAssignment",
              {},
              "Perlu Assign Armada"
            ),
          },
          {
            id: "loading",
            label: t(
              "PotentialEarningsTable.filterOptionLoading",
              {},
              "Proses Muat"
            ),
          },
          {
            id: "unloading",
            label: t(
              "PotentialEarningsTable.filterOptionUnloading",
              {},
              "Proses Bongkar"
            ),
          },
          {
            id: "document_delivery",
            label: t(
              "PotentialEarningsTable.filterOptionDocumentDelivery",
              {},
              "Proses Pengiriman Dokumen"
            ),
          },
        ],
      },
    }),
    [t]
  );

  return (
    <DashboardDataTable
      data={tableData.earnings}
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
        "PotentialEarningsTable.searchPlaceholder",
        {},
        "Cari Pesanan"
      )}
      filterConfig={filterConfig}
      firsTimerTitle={t(
        "PotentialEarningsTable.emptyStateTitle",
        {},
        "Oops, potensi pendapatan masih kosong"
      )}
      firstTimerSubtitle={t(
        "PotentialEarningsTable.emptyStateSubtitle",
        {},
        "Mulai terima permintaan sekarang untuk menampilkan data potensi pendapatan disini"
      )}
      firstTimerButtonText={t(
        "PotentialEarningsTable.emptyStateButton",
        {},
        "Lihat Permintaan"
      )}
      firstTimerButtonLink="/monitoring"
      headerActions={
        <div className="text-sm font-semibold text-neutral-900">
          {t(
            "PotentialEarningsTable.headerTotalPotential",
            {},
            "Total Potensi Pendapatan"
          )}{" "}
          :{" "}
          <span className="text-lg font-bold">
            {formatCurrency(tableData.summary.totalPotential)}
          </span>
        </div>
      }
    />
  );
};

export default PotentialEarningsTable;

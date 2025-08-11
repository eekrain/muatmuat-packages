"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { DataTable } from "@/components/DataTable";
import { InfoTooltip } from "@/components/Form/InfoTooltip";

import EmptyState from "./EmptyState";

const PotentialEarningsTable = () => {
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
      if (filters.status && filters.status.length > 0) {
        filters.status.forEach((s) => params.append("status", s.id));
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
        setError("Gagal mengambil data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, perPage, sortConfig, searchValue, filters]);

  const formatCurrency = (amount) =>
    `Rp${new Intl.NumberFormat("id-ID").format(amount)}`;

  const getStatusBadge = (status) => {
    const statusMap = {
      waiting_confirmation: {
        variant: "primary",
        label: "Menunggu Konfirmasi",
        icon: "",
        tooltip:
          "Armada kamu telah tercatat untuk pesanan ini, harap menunggu maks. 1 jam untuk konfirmasi dari Shipper.",
      },
      confirmed: { variant: "primary", label: "Pesanan Terkonfirmasi" },
      scheduled: { variant: "primary", label: "Armada Dijadwalkan" },
      loading: { variant: "primary", label: "Proses Muat" },
      unloading: { variant: "primary", label: "Proses Bongkar" },
      document_preparation: {
        variant: "primary",
        label: "Dokumen Sedang Disiapkan",
      },
      document_delivery: {
        variant: "primary",
        label: "Proses Pengiriman Dokumen",
      },
      // Warning (Yellow)
      need_assignment: {
        variant: "warning",
        label: "Perlu Assign Armada",
        icon: "/icons/warning24.svg",
      },
      need_response: {
        variant: "warning",
        label: "Perlu Respon Perubahan",
        icon: "/icons/warning24.svg",
      },
      // Error (Red)
      need_confirmation: {
        variant: "error",
        label: "Perlu Konfirmasi Siap",
        icon: "/icons/warning24.svg",
      },
    };

    const config = statusMap[status] || { variant: "default", label: status };

    return (
      <div className="inline-block">
        <BadgeStatusPesanan
          variant={config.variant}
          icon={{ iconLeft: config.icon }}
        >
          <div className="flex items-center gap-1">
            {config.tooltip && (
              <InfoTooltip
                className={"w-[336px]"}
                appearance={{
                  iconClassName: "text-primary-700 !w-3 !h-3",
                }}
              >
                <p className="text-sm">{config.tooltip}</p>
              </InfoTooltip>
            )}
            <p>{config.label}</p>
          </div>
        </BadgeStatusPesanan>
      </div>
    );
  };

  // useMemo to prevent re-creating columns on every render
  const columns = useMemo(
    () => [
      {
        key: "orderNumber",
        header: "No. Pesanan",
        sortable: true,
        render: (row) => (
          <div className="font-semibold text-neutral-900">
            {row.orderNumber}
          </div>
        ),
      },
      {
        key: "potentialAmount",
        header: "Potensi Pendapatan",
        sortable: true,
        render: (row) => (
          <div className="font-semibold text-neutral-900">
            {formatCurrency(row.potentialAmount)}
          </div>
        ),
      },
      {
        key: "status",
        header: "Status Pesanan",
        sortable: true,
        render: (row) => getStatusBadge(row.status, row.statusTooltip),
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
            Detail
          </Button>
        ),
      },
    ],
    [router]
  );

  const filterConfig = {
    categories: [{ key: "status", label: "Status", type: "checkbox-multi" }],
    data: {
      status: [
        { id: "waiting_confirmation", label: "Menunggu Konfirmasi Shipper" },
        { id: "confirmed", label: "Pesanan Terkonfirmasi" },
        { id: "scheduled", label: "Armada Dijadwalkan" },
        { id: "need_response", label: "Perlu Respon Perubahan" },
        { id: "need_confirmation", label: "Perlu Konfirmasi Siap" },
        { id: "need_assignment", label: "Perlu Assign Armada" },
        { id: "loading", label: "Proses Muat" },
        { id: "unloading", label: "Proses Bongkar" },
        { id: "document_delivery", label: "Proses Pengiriman Dokumen" },
      ],
    },
  };

  const renderEmptyContent = () => {
    if (error) {
      return <DataNotFound className="h-full gap-y-5 pb-10" title={error} />;
    }
    if (tableData?.emptyState?.actionButton) {
      return <EmptyState data={tableData.emptyState} />;
    }
    if (tableData?.emptyState?.title) {
      return (
        <DataNotFound
          className="h-full gap-y-5 pb-10"
          title={tableData.emptyState.title}
        />
      );
    }
    return (
      <DataNotFound
        className="h-full gap-y-5 pb-10"
        title="Keyword Tidak Ditemukan"
      />
    );
  };

  return (
    <div>
      <DataTable
        data={tableData.earnings}
        columns={columns}
        loading={loading}
        searchPlaceholder="Cari Pesanan"
        showFilter={true}
        showTotalCount={false}
        filterConfig={filterConfig}
        totalItems={tableData.pagination.totalItems}
        currentPage={tableData.pagination.currentPage}
        totalPages={tableData.pagination.totalPages}
        perPage={tableData.pagination.itemsPerPage}
        onPageChange={setCurrentPage}
        onPerPageChange={setPerPage}
        onSearch={setSearchValue}
        onFilter={setFilters}
        onSort={(sort, order) => setSortConfig({ sort, order })}
        headerActions={
          <div className="text-sm font-semibold text-neutral-900">
            Total Potensi Pendapatan :{" "}
            <span className="text-lg font-bold">
              {formatCurrency(tableData.summary.totalPotential)}
            </span>
          </div>
        }
        emptyComponent={renderEmptyContent()}
      />
    </div>
  );
};

export default PotentialEarningsTable;

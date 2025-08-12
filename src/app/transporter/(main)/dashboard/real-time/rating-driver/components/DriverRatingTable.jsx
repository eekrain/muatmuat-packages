"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { DataTable } from "@/components/DataTable";
import IconComponent from "@/components/IconComponent/IconComponent";
import PageTitle from "@/components/PageTitle/PageTitle";

import EmptyState from "./EmptyState";

const DriverRatingTable = () => {
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
      const params = new URLSearchParams({
        page: currentPage,
        limit: perPage,
      });
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
        setError("Gagal mengambil data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, perPage, sortConfig, searchValue, filters]);

  const columns = useMemo(
    () => [
      {
        key: "no",
        header: "No.",
        width: "100px",
        sortable: false,
        render: (_value, rowIndex) => {
          const page = Number(currentPage) || 1;
          const itemsPerPage = Number(perPage) || 10;
          return (page - 1) * itemsPerPage + rowIndex + 1;
        },
      },
      {
        key: "name",
        header: "Driver",
        width: "380px",
        sortable: true,
        render: (row) => (
          <div>
            <p className="line-clamp-2 text-xs font-bold text-neutral-900">
              {row.name}
            </p>
            <div className="mt-1 flex items-center gap-px">
              <IconComponent src="/icons/phone16.svg" width={14} height={14} />
              <p className="text-neutral-900">{row.phoneNumber}</p>
            </div>
          </div>
        ),
      },
      {
        key: "rating",
        header: "Rating",
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-1 font-semibold">
            <IconComponent src="/icons/star_icon.svg" />
            <p className="text-xs">
              {row.rating.toFixed(1)}
              <span className="text-[10px] text-neutral-600">/5</span>
            </p>
          </div>
        ),
      },
      {
        key: "orderCount",
        header: "Jumlah Pesanan",
        sortable: true,
        render: (row) => (
          <p className="text-xs font-medium text-neutral-900">
            {row.orderCount} Pesanan
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
            Riwayat
          </Button>
        ),
      },
    ],
    [router, currentPage, perPage]
  );

  const filterConfig = {
    categories: [{ key: "rating", label: "Rating", type: "checkbox-multi" }],
    data: {
      rating: [
        { id: 5, label: "5 Bintang" },
        { id: 4, label: "4 Bintang" },
        { id: 3, label: "3 Bintang" },
        { id: 2, label: "2 Bintang" },
        { id: 1, label: "1 Bintang" },
      ],
    },
  };

  const renderEmptyContent = () => {
    if (error) return <DataNotFound title={error} />;
    if (tableData?.emptyState?.actionButton) {
      return <EmptyState data={tableData.emptyState} />;
    }
    if (tableData?.emptyState?.title) {
      return <DataNotFound title={tableData.emptyState.title} />;
    }
    return <DataNotFound title="Data tidak ditemukan" />;
  };

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <PageTitle className={"!leading-0 mb-0 self-center"} withBack={true}>
          Rating Driver Keseluruhan
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
          <IconComponent src="/icons/download.svg" className="mr-2" />
          Unduh
        </Button>
      </div>
      <DataTable
        data={tableData.drivers}
        columns={columns}
        loading={loading}
        searchPlaceholder="Cari Nama Driver / No WhatsApp"
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
          <div className="flex items-center gap-4">
            <div className="text-sm font-semibold text-neutral-900">
              Rating Driver Keseluruhan :
              <span className="ml-1 text-base font-bold">
                {tableData.summary.overallAverageRating}
                <span className="text-sm font-medium text-neutral-600">/5</span>
              </span>
            </div>
          </div>
        }
        emptyComponent={renderEmptyContent()}
        showTotalCount={false}
      />
    </>
  );
};

export default DriverRatingTable;

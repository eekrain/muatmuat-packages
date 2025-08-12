"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import Button from "@/components/Button/Button";
import { DataTable } from "@/components/DataTable";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import IconComponent from "@/components/IconComponent/IconComponent";
import PageTitle from "@/components/PageTitle/PageTitle";

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
        console.log("SELECTED PERIOD", period);
        if (period.start_date && period.end_date) {
          dateFrom = toYYYYMMDD(period.start_date);
          dateTo = toYYYYMMDD(period.end_date);
          console.log("dateFrom", dateFrom, dateTo);
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
        setError("Gagal memuat riwayat rating.");
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
    return `${new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(dateString))} WIB`;
  };

  const columns = useMemo(
    () => [
      {
        key: "date",
        header: "Tanggal",
        sortable: true,
        className: "!text-xs font-medium align-top",
        width: "185px",
        render: (row) => formatDate(row.date),
      },
      {
        key: "orderNumber",
        header: "No. Pesanan",
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
        header: "Nama Driver",
        width: "230px",
        className: "!text-xs font-medium align-top",
        sortable: true,
        render: (row) => <p className="line-clamp-2">{row.driverName}</p>,
      },
      {
        key: "armada",
        header: "Armada",
        width: "300px",
        className: "align-top",
        sortable: false,
        render: (row) => (
          <div>
            <p className="text-xs font-bold">{row.armada.name}</p>
            <p className="mt-px text-[10px] font-medium text-neutral-900">
              <span className="text-neutral-600">Carrier :</span>
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
        header: "Rating dan Ulasan",
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
    []
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

  const periodOptions = [
    { name: "Semua Periode (Default)", value: "" },
    { name: "Hari Ini", value: 0 },
    { name: "1 Minggu Terakhir", value: 7 },
    { name: "30 Hari Terakhir", value: 30 },
    { name: "1 Tahun Terakhir", value: 365 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <PageTitle withBack={true} className="!mb-0">
          Riwayat Rating Driver Keseluruhan
        </PageTitle>
        <div className="flex items-center gap-4">
          <DropdownPeriode
            value={period}
            onSelect={handleSelectPeriod}
            options={periodOptions}
            recentSelections={recentPeriodOptions}
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
            Unduh
          </Button>
        </div>
      </div>

      <DataTable
        data={tableData.history}
        columns={columns}
        loading={loading}
        searchPlaceholder="Cari No. Pesanan / Armada"
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
          <div className="text-sm font-semibold">
            Total Rating :
            <span className="text-base font-bold">
              {tableData.summary.totalRating}
              <span className="text-sm font-medium text-neutral-600">/5</span>
            </span>
          </div>
        }
        showTotalCount={false}
      />
    </div>
  );
};

export default RatingHistoryTable;

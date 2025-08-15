"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import DashboardDataTable from "@/app/transporter/(main)/dashboard/real-time/components/DashboardDataTable";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import PageTitle from "@/components/PageTitle/PageTitle";

import Period from "../../components/Period";

const toYYYYMMDD = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const PenaltyTable = () => {
  const [tableData, setTableData] = useState({
    penalties: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    },
    summary: { totalPenalties: 0 },
    emptyState: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    sort: "cancellationDate",
    order: "desc",
  });

  // States to be controlled by the parent for DashboardDataTable
  const [searchValue, setSearchValue] = useState("");
  const [period, setPeriod] = useState(null);
  const [recentPeriodOptions, setRecentPeriodOptions] = useState([]);
  const [controlsDisabled, setControlsDisabled] = useState({
    disablePeriod: false,
  });

  useEffect(() => {
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

      if (period) {
        console.log("period", period);
        let dateFrom, dateTo;
        if (period.iso_start_date && period.iso_end_date) {
          dateFrom = toYYYYMMDD(period.iso_start_date);
          dateTo = toYYYYMMDD(period.iso_end_date);
          console.log("period", dateFrom, dateTo);
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
          `/api/v1/penalties?${queryParams.toString()}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        setTableData(result.Data);
      } catch (e) {
        setError("Gagal memuat data penalti.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, perPage, sortConfig, searchValue, period]);

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
        key: "cancellationDate",
        header: "Tanggal Pembatalan",
        className: "!text-xs font-medium align-top",
        sortable: true,
        render: (row) => formatDate(row.cancellationDate),
      },
      {
        key: "orderNumber",
        header: "No. Pesanan",
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
        key: "armada",
        header: "Armada",
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
        key: "reason",
        header: "Keterangan",
        sortable: false,
        className: "!text-xs font-medium align-top",
      },
    ],
    []
  );

  const periodOptions = [
    { name: "Semua Periode (Default)", value: "" },
    { name: "Hari Ini", value: 0 },
    { name: "1 Minggu Terakhir", value: 7 },
    { name: "30 Hari Terakhir", value: 30 },
    { name: "1 Tahun Terakhir", value: 365 },
  ];

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <PageTitle withBack={true} className="!mb-0">
          Jumlah Penalti
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
            disabled={loading || !tableData.penalties.length}
            appearance={{
              iconClassName:
                "text-muat-trans-secondary-900 disabled:text-neutral-600",
            }}
          >
            Unduh
          </Button>
        </div>
      </div>

      <DashboardDataTable
        data={tableData.penalties}
        columns={columns}
        loading={loading}
        totalItems={tableData.pagination.totalItems}
        currentPage={tableData.pagination.currentPage}
        perPage={tableData.pagination.itemsPerPage}
        onPageChange={setCurrentPage}
        onPerPageChange={setPerPage}
        // Wire up the new props
        activeSearchValue={searchValue}
        onSearchChange={setSearchValue}
        isPeriodActive={period && period.value !== ""}
        onControlsStateChange={setControlsDisabled}
        onSort={(sort, order) => setSortConfig({ sort, order })}
        searchPlaceholder="Cari No. Pesanan / No. Polisi / Armada"
        showFilter={false}
        firsTimerTitle="Tidak ada pesanan yang dibatalkan"
        firstTimerSubtitle="Penalti dihitung dari jumlah pembatalan pesanan oleh Transporter atau Shipper"
        headerActions={
          <div className="text-base font-semibold">
            Total Penalti :{" "}
            <span className="font-bold">
              {tableData.summary.totalPenalties} Penalti
            </span>
          </div>
        }
      />
    </>
  );
};

export default PenaltyTable;

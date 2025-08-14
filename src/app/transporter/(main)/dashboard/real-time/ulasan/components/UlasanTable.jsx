"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import DashboardDataTable from "@/app/transporter/(main)/dashboard/real-time/components/DashboardDataTable";
import ExpandableReview from "@/app/transporter/(main)/dashboard/real-time/rating-driver/[driverId]/components/ExpandableReview";
import Button from "@/components/Button/Button";
import Checkbox from "@/components/Form/Checkbox";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import PageTitle from "@/components/PageTitle/PageTitle";
import { toast } from "@/lib/toast";

import Period from "../../components/Period";
import TruncatedTooltip from "../../components/TruncatedTooltip";

const toYYYYMMDD = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const UlasanTable = () => {
  const [tableData, setTableData] = useState({
    reviews: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    },
    summary: { averageRating: 0, newCount: 0, readCount: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false);

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
  const [activeTab, setActiveTab] = useState("new");

  const [isSelectionModeActive, setIsSelectionModeActive] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setSelectedRows([]);
      setIsSelectionModeActive(false);

      const params = new URLSearchParams({
        page: currentPage,
        limit: perPage,
        status: activeTab,
      });
      if (searchValue) params.append("search", searchValue);
      if (sortConfig.sort) {
        params.append("sort", sortConfig.sort);
        params.append("order", sortConfig.order);
      }
      if (filters.rating?.length) {
        filters.rating.forEach((r) => params.append("rating", r.id));
      }
      if (period) {
        let dateFrom, dateTo;
        if (period.iso_start_date && period.end_date) {
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
        const response = await fetch(`/api/v1/reviews?${params.toString()}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        setTableData(result.Data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [
    currentPage,
    perPage,
    sortConfig,
    searchValue,
    filters,
    period,
    activeTab,
    refetchTrigger,
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

  const handleMarkAsRead = async () => {
    setIsMarkingAsRead(true);
    try {
      const response = await fetch("/api/v1/reviews/mark-as-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewIds: selectedRows }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.Message.Text || "Gagal menandai ulasan");
      toast.success("Ulasan berhasil ditandai sebagai sudah dibaca");
      setRefetchTrigger((prev) => prev + 1);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setShowConfirmation(false);
      setIsMarkingAsRead(false);
    }
  };

  const handleSelectAll = ({ checked }) => {
    if (checked) {
      setSelectedRows(tableData.reviews.map((r) => r.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = ({ checked }, rowId) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, rowId]);
    } else {
      setSelectedRows((prev) => prev.filter((id) => id !== rowId));
    }
  };

  const handleCancelSelectionMode = () => {
    setIsSelectionModeActive(false);
    setSelectedRows([]);
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        key: "date",
        header: "Tanggal",
        width: "180px",
        sortable: true,
        className: "!text-xs font-medium align-top",
        render: (row) =>
          `${new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(row.date))} WIB`,
      },
      {
        key: "orderNumber",
        header: "No. Pesanan",
        width: "200px",
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
        key: "driver",
        header: "Driver",
        width: "360px",
        sortable: true,
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
        header: "Rating dan Ulasan",
        width: "450px",
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

    if (isSelectionModeActive && activeTab === "new") {
      return [
        {
          key: "select",
          sortable: false,
          header: (
            <Checkbox
              checked={
                selectedRows.length === tableData.reviews.length &&
                tableData.reviews.length > 0
              }
              onChange={handleSelectAll}
              label=""
            />
          ),
          width: "30px",
          className: "align-top",
          render: (row) => (
            <Checkbox
              checked={selectedRows.includes(row.id)}
              onChange={(payload) => handleSelectRow(payload, row.id)}
              label=""
            />
          ),
        },
        ...baseColumns,
      ];
    }
    return baseColumns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isSelectionModeActive, selectedRows, tableData.reviews]);

  const filterConfig = {
    categories: [{ key: "rating", label: "Rating", type: "checkbox-multi" }],
    data: {
      rating: [
        { id: 5, label: "5 Bintang", icon: "/icons/star_icon.svg" },
        { id: 4, label: "4 Bintang", icon: "/icons/star_icon.svg" },
        { id: 3, label: "3 Bintang", icon: "/icons/star_icon.svg" },
        { id: 2, label: "2 Bintang", icon: "/icons/star_icon.svg" },
        { id: 1, label: "1 Bintang", icon: "/icons/star_icon.svg" },
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

  const displayOptions = {
    totalCount: tableData.pagination.totalItems,
    statusOptions: [
      {
        value: "new",
        label: "Baru",
        hasNotification: activeTab === "read" && tableData.summary.newCount > 0,
        count: tableData.summary.newCount,
      },
      {
        value: "read",
        label: "Sudah Dibaca",
        count: tableData.summary.readCount,
      },
    ],
    showAllOption: false,
    currentStatus: activeTab,
    onStatusChange: (status) => {
      setActiveTab(status);
      setCurrentPage(1);
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <PageTitle withBack={true} className="!mb-0">
          Daftar Ulasan
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
            className="h-9 px-6"
            disabled={loading || !tableData.reviews.length}
          >
            Unduh
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
        searchPlaceholder="Cari Ulasan"
        filterConfig={filterConfig}
        showDisplayView={true}
        displayOptions={displayOptions}
        firsTimerTitle="Oops, Daftar Ulasan masih kosong"
        firstTimerSubtitle="Ulasan dari shipper akan ditampilkan disini"
        firstTimerButtonText="Lihat Permintaan"
        firstTimerButtonLink="/monitoring"
        displayActions={
          <>
            {activeTab === "new" && (
              <div className="flex items-center justify-end gap-4">
                {!isSelectionModeActive ? (
                  <Button
                    variant="muattrans-primary"
                    className="h-9 px-6 text-muat-trans-secondary-900 disabled:text-neutral-600"
                    onClick={() => setIsSelectionModeActive(true)}
                    disabled={loading || tableData.reviews.length === 0}
                    iconLeft="/icons/read.svg"
                  >
                    Tandai Sudah Dibaca
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="muattrans-error-secondary"
                      className="px-6"
                      onClick={handleCancelSelectionMode}
                    >
                      Batal
                    </Button>
                    <InfoTooltip
                      trigger={
                        <Button
                          className="h-9 px-6 text-muat-trans-secondary-900 disabled:text-neutral-600"
                          onClick={() => setShowConfirmation(true)}
                          disabled={selectedRows.length === 0}
                          iconLeft="/icons/read.svg"
                        >
                          Tandai Sudah Dibaca
                        </Button>
                      }
                      className={`w-[210px] text-sm ${selectedRows.length !== 0 && "hidden"}`}
                      side="top"
                      sideOffset={2}
                      align="start"
                    >
                      Pilih minimal 1 ulasan untuk ditandai sudah dibaca
                    </InfoTooltip>
                  </>
                )}
              </div>
            )}
          </>
        }
        headerActions={
          <div>
            <div className="text-sm font-semibold">
              Total Rating :{" "}
              <span className="text-base font-bold">
                {tableData.summary.averageRating}
                <span className="text-sm font-medium text-neutral-600">/5</span>
              </span>
            </div>
          </div>
        }
      />
      <ConfirmationModal
        isOpen={showConfirmation}
        setIsOpen={setShowConfirmation}
        description={{
          text: "Ulasan akan dipindahkan ke tab Sudah Dibaca dan tidak akan muncul lagi di daftar Daftar Ulasan. Kamu yakin ingin melanjutkan?",
        }}
        confirm={{
          text: "Ya",
          onClick: handleMarkAsRead,
          classname: "w-[112px]",
        }}
        cancel={{
          text: "Tidak",
          onClick: () => setShowConfirmation(false),
          classname: "w-[112px]",
        }}
      />
    </div>
  );
};

export default UlasanTable;

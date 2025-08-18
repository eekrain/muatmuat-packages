"use client";

import { useMemo, useState } from "react";

import { X } from "lucide-react";

import DashboardFilter from "@/app/transporter/(main)/dashboard/real-time/components/DashboardFilter";
import { FilterSelect } from "@/components/Form/FilterSelect";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";

const PesananActionBar = ({
  searchQuery,
  onSearchChange,
  activeFilters,
  onFilterChange,
  sortConfig,
  onSortChange,
  urgentStatusFilter,
  onUrgentStatusChange,
  urgentCounts,
  filterOptions,
  loading,
  lastAction,
  totalItems,
}) => {
  const { t } = useTranslation();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchKeyUp = (e) => {
    if (e.key === "Enter") onSearchChange(localSearch);
  };
  const handleClearSearch = () => {
    setLocalSearch("");
    onSearchChange("");
  };

  const noData = totalItems === 0;
  const disableSearch = loading || (noData && lastAction !== "search");
  const disableFilter = loading || (noData && lastAction !== "filter");
  const disableUrgent = loading || (noData && lastAction !== "urgent");
  const disableSort = loading || noData;
  const disableViewBy = loading || noData;

  const filterConfig = useMemo(
    () => ({
      categories: [
        {
          key: "transporter",
          label: t("pesananActionBar.filterByTransporter", {}, "Transporter"),
          searchable: true,
          type: "checkbox-multi",
        },
        {
          key: "shipper",
          label: t("pesananActionBar.filterByShipper", {}, "Shipper"),
          searchable: true,
          type: "checkbox-multi",
        },
        {
          key: "status",
          label: t("pesananActionBar.filterByStatus", {}, "Status"),
          type: "checkbox-multi",
        },
      ],
      data: {
        transporter: filterOptions?.transporters || [],
        shipper: filterOptions?.shippers || [],
        status: filterOptions?.statuses || [],
      },
    }),
    [filterOptions, t]
  );

  const sortOptions = [
    { label: "Waktu Muat Terdekat", value: "waktu_muat_terdekat" },
    { label: "Waktu Muat Terlama", value: "waktu_muat_terlama" },
    { label: "No. Pesanan (A-Z, 0-9)", value: "no_pesanan_asc" },
    { label: "No. Pesanan (Z-A, 9-0)", value: "no_pesanan_desc" },
  ];

  const urgentStatusOptions = useMemo(
    () => [
      {
        value: "all",
        label: t("pesananActionBar.urgent.all", {}, "Semua Status (Default)"),
      },
      {
        value: "PERLU_RESPON_PERUBAHAN",
        label: `${t("pesananActionBar.urgent.response", {}, "Perlu Respon Perubahan")} (${urgentCounts?.PERLU_RESPON_PERUBAHAN || 0})`,
      },
      {
        value: "PERLU_KONFIRMASI_SIAP",
        label: `${t("pesananActionBar.urgent.ready", {}, "Perlu Konfirmasi Siap")} (${urgentCounts?.PERLU_KONFIRMASI_SIAP || 0})`,
      },
      {
        value: "PERLU_ASSIGN_ARMADA",
        label: `${t("pesananActionBar.urgent.assign", {}, "Perlu Assign Armada")} (${urgentCounts?.PERLU_ASSIGN_ARMADA || 0})`,
      },
    ],
    [urgentCounts, t]
  );

  const totalUrgentCount = useMemo(
    () =>
      Object.values(urgentCounts || {}).reduce((sum, count) => sum + count, 0),
    [urgentCounts]
  );

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <Input
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyUp={handleSearchKeyUp}
          placeholder={t("daftarPesanan.searchPlaceholder", {}, "Cari Pesanan")}
          disabled={disableSearch}
          appearance={{
            containerClassName:
              "!border-neutral-600 hover:!border-primary-700 ",
          }}
          icon={{
            left: (
              <IconComponent src="/icons/datatable-search.svg" width={12} />
            ),
            right: localSearch ? (
              <button onClick={handleClearSearch}>
                <X className="h-4 w-4" />
              </button>
            ) : null,
          }}
          className="w-[262px]"
        />
        <FilterSelect
          placeholder={t("pesananActionBar.urgentStatus", {}, "Status Urgent")}
          options={urgentStatusOptions}
          value={urgentStatusFilter}
          onChange={onUrgentStatusChange}
          disabled={disableUrgent}
          showNotificationDot={totalUrgentCount > 0}
          notificationCount={totalUrgentCount}
          className="w-[158px] !border-neutral-600 hover:!border-primary-700"
          itemClassName="hover:!bg-neutral-200"
        />
        <DashboardFilter
          categories={filterConfig.categories}
          data={filterConfig.data}
          selectedValues={activeFilters}
          onSelectionChange={onFilterChange}
          disabled={disableFilter || !filterOptions}
        />
        <FilterSelect
          value={sortConfig.value}
          onChange={(val) =>
            onSortChange(sortOptions.find((o) => o.value === val))
          }
          icon="/icons/sort-gray.svg"
          options={sortOptions}
          disabled={disableSort}
          className="w-[136px] !border-neutral-600 hover:!border-primary-700"
          itemClassName="hover:!bg-neutral-200"
        />
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-600">
        <span>View by:</span>
        <div className="w-[150px]">
          <FilterSelect
            options={[
              { label: "Pesanan", value: "pesanan" },
              { label: "Transporter", value: "transporter" },
            ]}
            value={"pesanan"}
            onChange={() => {}}
            className="!border-neutral-600 hover:!border-primary-700"
            itemClassName="hover:!bg-neutral-200"
            disabled={disableViewBy}
          />
        </div>
        <span className="text-base font-semibold text-neutral-900">
          Total : {totalItems} {t("daftarPesanan.orders", {}, "Pesanan")}
        </span>
      </div>
    </div>
  );
};

export default PesananActionBar;

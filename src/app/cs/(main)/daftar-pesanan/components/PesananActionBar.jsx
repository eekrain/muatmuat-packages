"use client";

import { useMemo, useState } from "react";

import { X } from "lucide-react";

import DashboardFilter from "@/app/transporter/(main)/dashboard/real-time/components/DashboardFilter";
import { FilterSelect } from "@/components/Form/FilterSelect";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

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
  viewBy,
  onViewByChange,
  isHistory = false,
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

  const totalUrgentCount = useMemo(
    () =>
      Object.values(urgentCounts || {}).reduce((sum, count) => sum + count, 0),
    [urgentCounts]
  );

  const isFilterActive = Object.values(activeFilters).some(
    (val) => Array.isArray(val) && val.length > 0
  );

  const noData = totalItems === 0;
  const disableSearch =
    loading || (noData && lastAction !== "search" && localSearch === "");
  const disableFilter =
    loading || (noData && lastAction !== "filter" && !isFilterActive);
  const disableUrgent =
    loading ||
    (noData && lastAction !== "urgent" && urgentStatusFilter === "all") ||
    totalUrgentCount === 0;
  const disableSort = loading || noData;
  const disableViewBy = loading || noData;

  console.log("PesananActionBar", {
    disableFilter,
    activeFilters,
  });
  const filterConfig = useMemo(
    () => ({
      categories: [
        {
          key: "transporter",
          label: "Transporter",
          searchable: true,
          type: "checkbox-multi",
          searchPlaceholder: t(
            "pesananActionBar.filterByTransporter",
            {},
            "Cari Transporter"
          ),
        },
        {
          key: "shipper",
          label: "Shipper",
          searchable: true,
          type: "checkbox-multi",
          searchPlaceholder: t(
            "pesananActionBar.filterByShipper",
            {},
            "Cari Shipper"
          ),
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

  // consider sort active when user chooses a non-default option
  const isSortActive = !!(
    sortConfig?.value &&
    sortConfig.value !== "waktu_muat_terdekat" &&
    !disableSort
  );

  const urgentStatusOptions = useMemo(
    () => [
      {
        value: "all",
        label: t("pesananActionBar.urgent.all", {}, "Semua Status (Default)"),
      },
      {
        value: "PERLU_RESPON_PERUBAHAN",
        label: `${t("pesananActionBar.urgent.response", {}, "Perlu Respon Perubahan")} (${urgentCounts?.PERLU_RESPON_PERUBAHAN || 0})`,
        count: urgentCounts?.PERLU_RESPON_PERUBAHAN || 0,
      },
      {
        value: "PERLU_KONFIRMASI_SIAP",
        label: `${t("pesananActionBar.urgent.ready", {}, "Perlu Konfirmasi Siap")} (${urgentCounts?.PERLU_KONFIRMASI_SIAP || 0})`,
        count: urgentCounts?.PERLU_KONFIRMASI_SIAP || 0,
      },
      {
        value: "PERLU_ASSIGN_ARMADA",
        label: `${t("pesananActionBar.urgent.assign", {}, "Perlu Assign Armada")} (${urgentCounts?.PERLU_ASSIGN_ARMADA || 0})`,
        count: urgentCounts?.PERLU_ASSIGN_ARMADA || 0,
      },
    ],
    [urgentCounts, t]
  );
  const urgentPlaceholder = `${t("pesananActionBar.urgentStatus", {}, "Status Urgent")} (${totalUrgentCount > 99 ? "99+" : totalUrgentCount})`;

  const renderUrgentItem = (option) => (
    <span className="inline-flex items-start truncate whitespace-nowrap">
      {option.label}
      {option.count > 0 && (
        <span className="relative aspect-square h-1 w-1 rounded-full bg-red-500"></span>
      )}
    </span>
  );

  return (
    <div className="flex items-center justify-between px-4 pt-4">
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
        {!isHistory && (
          <FilterSelect
            placeholder={urgentPlaceholder}
            options={urgentStatusOptions}
            value={urgentStatusFilter}
            showNotificationDotWithoutNumber={totalUrgentCount !== 0}
            onChange={onUrgentStatusChange}
            disabled={disableUrgent}
            className="w-[158px] !border-neutral-600 hover:!border-primary-700"
            contentClassName="relative overflow-hidden"
            itemClassName={cn(
              "bg-white",
              "hover:!bg-neutral-200",
              "aria-selected:font-semibold"
            )}
            displayValueOverride={
              urgentStatusFilter !== "all"
                ? urgentStatusOptions.find(
                    (o) => o.value === urgentStatusFilter
                  )?.label
                : urgentPlaceholder
            }
            renderItem={renderUrgentItem}
          />
        )}

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
          icon={
            isSortActive ? "/icons/sort-active.svg" : "/icons/sort-gray.svg"
          }
          options={sortOptions}
          disabled={disableSort}
          contentClassName="relative overflow-hidden"
          itemClassName={cn(
            "bg-white",
            "hover:!bg-neutral-200",
            "aria-selected:font-semibold"
          )}
          className={cn(
            "w-[136px] hover:!border-primary-700",
            isSortActive ? "!border-primary-700" : "!border-neutral-600"
          )}
          isActive={isSortActive}
        />
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-600">
        <span>View by:</span>
        <div className="">
          <FilterSelect
            options={[
              { label: "Pesanan", value: "pesanan" },
              { label: "Transporter", value: "transporter" },
              { label: "Shipper", value: "shipper" },
            ]}
            value={viewBy}
            onChange={onViewByChange}
            className="w-[132px] !border-neutral-600 hover:!border-primary-700"
            contentClassName="min-w-[132px] relative overflow-hidden"
            itemClassName={cn(
              "font-medium text-neutral-900 hover:!bg-neutral-200",
              "hover:!bg-neutral-200",
              "bg-white aria-selected:font-semibold"
            )}
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

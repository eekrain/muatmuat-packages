"use client";

import { useState } from "react";

import { format } from "date-fns";
import { id } from "date-fns/locale";

import BadgeOrderType from "@/components/Badge/BadgeOrderType";
import BadgeStatus from "@/components/Badge/BadgeStatus";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import NotificationDot from "@/components/NotificationDot/NotificationDot";
import Search from "@/components/Search/Search";
import MuatBongkarStepper from "@/components/Stepper/MuatBongkarStepper";
import Table from "@/components/Table/Table";
import { cn } from "@/lib/utils";
import { ORDER_STATUS, getOrderStatusBadge } from "@/lib/utils/orderStatus";
import { useGetActiveOrders } from "@/services/Transporter/monitoring/daftar-pesanan-active/getActiveOrders";
import { useGetActiveOrdersCount } from "@/services/Transporter/monitoring/daftar-pesanan-active/getActiveOrdersCount";

const DaftarPesananAktif = ({ onToggleExpand, isExpanded }) => {
  const { data: activeOrdersCount } = useGetActiveOrdersCount();
  const [sortConfig, setSortConfig] = useState({ sort: null, order: null });
  const [searchValue, setSearchValue] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);

  // Map filter keys to lowercase status values for API
  const getFilterStatus = (filterKey) => {
    const statusMap = {
      NEED_CHANGE_RESPONSE: "need_change_response",
      NEED_CONFIRMATION_READY: "need_confirmation_ready",
      NEED_ASSIGN_VEHICLE: "need_assign_vehicle",
    };
    return statusMap[filterKey] || null;
  };

  const { data, isLoading } = useGetActiveOrders({
    search: searchValue,
    status: getFilterStatus(selectedFilter),
    ...sortConfig,
  });

  const formatLoadTime = (order) => {
    const startDate = new Date(order.loadTimeStart);
    const endDate = new Date(order.loadTimeEnd);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const orderDate = new Date(startDate);
    orderDate.setHours(0, 0, 0, 0);

    // Calculate days difference
    const timeDiff = orderDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    let dateLabel = "";
    let dateColor = "";

    if (daysDiff === 0) {
      dateLabel = "Muat Hari Ini";
      dateColor = "text-success-400"; // Green for today
    } else if (daysDiff === 1) {
      dateLabel = "Muat Besok";
      dateColor = "text-success-400"; // Green for tomorrow
    } else if (daysDiff >= 2 && daysDiff <= 5) {
      dateLabel = `Muat ${daysDiff} Hari Lagi`;
      dateColor = "text-warning-900"; // Orange for 2-5 days
    } else if (daysDiff > 5) {
      dateLabel = `Muat ${daysDiff} Hari Lagi`;
      dateColor = "text-primary-700"; // Blue for >5 days
    } else {
      // For past dates (negative daysDiff)
      dateLabel = `Muat ${format(startDate, "dd MMM yyyy", { locale: id })}`;
      dateColor = "text-gray-600";
    }

    // Format time range based on day difference
    let timeRange = "";
    if (daysDiff === 0) {
      // Today: show date and time start only
      timeRange = `${format(startDate, "dd MMM yyyy HH:mm")} WIB`;
    } else if (daysDiff === 1) {
      // Tomorrow: show date time start - time end
      if (
        order.loadTimeEnd &&
        format(startDate, "HH:mm") !== format(endDate, "HH:mm")
      ) {
        timeRange = `${format(startDate, "dd MMM yyyy HH:mm")} WIB - ${format(endDate, "HH:mm")} WIB`;
      } else {
        timeRange = `${format(startDate, "dd MMM yyyy HH:mm")} WIB`;
      }
    } else {
      // Other days: show date time start - date time end
      if (order.loadTimeEnd) {
        // Check if end date is different day
        const startDateStr = format(startDate, "dd MMM yyyy");
        const endDateStr = format(endDate, "dd MMM yyyy");

        if (startDateStr === endDateStr) {
          // Same day: show date once with time range
          timeRange = `${format(startDate, "dd MMM yyyy HH:mm")} WIB - ${format(endDate, "HH:mm")} WIB`;
        } else {
          // Different days: show full date and time for both
          timeRange = `${format(startDate, "dd MMM yyyy HH:mm")} WIB - ${format(endDate, "dd MMM yyyy HH:mm")} WIB`;
        }
      } else {
        timeRange = `${format(startDate, "dd MMM yyyy HH:mm")} WIB`;
      }
    }

    return { dateLabel, timeRange, dateColor };
  };

  const columns = [
    {
      header: "No. Pesanan",
      key: "orderCode",
      sortable: true,
      headerClassName: "px-4 py-3",
      className: "p-4",
      render: (row) => (
        <div className="flex flex-col gap-2.5">
          <span className="text-xxs font-semibold text-gray-900">
            {row.orderCode}
          </span>
          <BadgeOrderType type={row.orderType} className="w-[70px]" />
        </div>
      ),
    },
    {
      header: "Waktu Muat",
      key: "loadTimeStart",
      sortable: true,
      headerClassName: "px-4 py-3",
      className: "p-4",
      render: (row) => {
        const { dateLabel, timeRange, dateColor } = formatLoadTime(row);
        return (
          <div className="flex flex-col gap-1">
            <span className={`text-xs font-semibold ${dateColor}`}>
              {dateLabel}
            </span>
            <span className="text-xxs font-medium">{timeRange}</span>
          </div>
        );
      },
    },
    {
      header: "Rute Muat & Bongkar",
      key: "route",
      sortable: false,
      width: "350px",
      headerClassName: "px-4 py-3",
      className: "p-4",
      render: (row) => (
        <MuatBongkarStepper
          pickupLocations={row.pickupLocations}
          dropoffLocations={row.dropoffLocations}
          appearance={{
            titleClassName: "text-xxs font-semibold",
          }}
        />
      ),
    },
    {
      header: "Armada",
      key: "armada",
      sortable: false,
      headerClassName: "px-4 py-3",
      className: "p-4",
      render: (row) => (
        <div className="flex w-[140px] flex-col gap-1">
          <span className="line-clamp-1 break-all text-xs font-bold">
            {row.truckType.name}
          </span>
          <span className="line-clamp-1 break-all text-xs font-medium">
            <span className="text-neutral-600">Carrier :</span>{" "}
            {row.carrierTruck.name}
          </span>
          <div className="mt-1 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <IconComponent
                src="/icons/monitoring/daftar-pesanan-aktif/truck.svg"
                className="h-4 w-4 text-gray-600"
              />
              <span className="text-xxs font-medium">
                {row.truckCount} Unit
              </span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1">
              <IconComponent
                src="/icons/monitoring/daftar-pesanan-aktif/scales.svg"
                className="h-4 w-4 text-gray-600"
              />
              <span className="text-xxs font-medium">
                {row.totalWeight} {row.weightUnit}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      key: "orderStatus",
      sortable: false,
      headerClassName: "px-4 py-3 ",
      className: "p-4",
      render: (row) => {
        const statusBadge = getOrderStatusBadge(row.orderStatus);
        return (
          <div className="flex items-center gap-2">
            {row.orderStatus === ORDER_STATUS.SCHEDULED_FLEET && (
              <IconComponent
                src="/icons/info-circle.svg"
                className="h-4 w-4 text-primary-700"
              />
            )}
            <BadgeStatus variant={statusBadge.variant} className="w-[176px]">
              {statusBadge.label}
            </BadgeStatus>
          </div>
        );
      },
    },
    {
      header: "",
      key: "actions",
      sortable: false,
      headerClassName: "px-4 py-3",
      className: "p-4",
      render: () => (
        <button className="flex h-6 w-6 items-center justify-center rounded-lg hover:border hover:border-primary-700 hover:bg-neutral-200">
          <IconComponent
            src="/icons/monitoring/daftar-pesanan-aktif/action.svg"
            className="h-[13px] w-[13px]"
          />
        </button>
      ),
    },
  ];

  const handleSort = (columnKey) => {
    let newOrder = null;
    let newSort = columnKey;

    if (sortConfig.sort === columnKey) {
      if (sortConfig.order === "asc") {
        newOrder = "desc";
      } else if (sortConfig.order === "desc") {
        newOrder = null;
        newSort = null;
      } else {
        newOrder = "asc";
      }
    } else {
      newOrder = "asc";
    }

    setSortConfig({ sort: newSort, order: newOrder });
  };

  const renderEmptyState = () => (
    <tr>
      <td colSpan={columns.length} className="px-6 py-8 text-center">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-base font-semibold text-neutral-600">
              Belum ada pesanan aktif
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Pesanan aktif akan muncul di sini
            </p>
          </div>
        </div>
      </td>
    </tr>
  );

  const orders = data?.orders || [];
  const totalActiveOrders = activeOrdersCount?.totalActiveOrders || 0;
  const availableStatuses = data?.availableStatuses || {};

  // Filter configuration
  const filterConfig = [
    {
      key: "NEED_CHANGE_RESPONSE",
      label: "Respon Perubahan",
      hasFilter: availableStatuses?.hasNeedChangeResponse,
      count: availableStatuses?.totalNeedChangeResponse || 0,
    },
    {
      key: "NEED_CONFIRMATION_READY",
      label: "Perlu Konfirmasi Siap",
      hasFilter: availableStatuses?.hasNeedConfirmationReady,
      count: availableStatuses?.totalNeedConfirmationReady || 0,
    },
    {
      key: "NEED_ASSIGN_VEHICLE",
      label: "Assign Armada",
      hasFilter: availableStatuses?.hasNeedAssignVehicle,
      count: availableStatuses?.totalNeedAssignVehicle || 0,
    },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold">
            Daftar <br /> Pesanan Aktif
          </h3>
          <InfoTooltip
            side="left"
            appearance={{
              iconClassName: "size-3.5",
            }}
          >
            <p>Daftar pesanan aktif yang sedang berlangsung.</p>
          </InfoTooltip>
        </div>
        <div className="flex items-center gap-3">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-2">
            {filterConfig.map(
              (filter) =>
                filter.hasFilter && (
                  <div key={filter.key} className="relative">
                    <button
                      onClick={() =>
                        setSelectedFilter(
                          selectedFilter === filter.key ? null : filter.key
                        )
                      }
                      className={cn(
                        "flex items-center gap-1 rounded-2xl border px-3 py-1.5 text-[10px] font-semibold leading-[130%] transition-colors",
                        selectedFilter === filter.key
                          ? "border-primary-700 bg-white text-primary-700"
                          : "border-primary-700 bg-white text-primary-700"
                      )}
                    >
                      <span>{filter.label}</span>
                      {filter.count > 0 && (
                        <span>
                          ({filter.count > 99 ? "99+" : filter.count})
                        </span>
                      )}
                    </button>
                    {filter.count > 0 && (
                      <NotificationDot
                        position="absolute"
                        positionClasses="right-[1px] top-[-1px]"
                        size="md"
                        color="red"
                        animated={true}
                      />
                    )}
                  </div>
                )
            )}
          </div>
          <Search
            placeholder="Cari Pesanan"
            onSearch={(value) => {
              setSearchValue(value);
              // TODO: Implement search functionality
            }}
            onFocus={() => {
              if (!isExpanded) {
                onToggleExpand();
              }
            }}
            containerClassName="h-8 w-[180px]"
            inputClassName="text-xs"
            disabled={totalActiveOrders === 0}
          />
          <button
            onClick={onToggleExpand}
            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
          >
            <IconComponent
              src="/icons/monitoring/collapse.svg"
              className={cn(
                "h-5 w-5 transform transition-transform duration-300 ease-in-out",
                !isExpanded && "rotate-180"
              )}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="flex-1 overflow-hidden">
          {/* Check if there are no active orders */}
          {!isLoading && totalActiveOrders === 0 ? (
            <div className="flex h-full items-center justify-center p-4">
              <DataNotFound className="h-full gap-y-5 pb-10" type="data">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-center text-base font-semibold leading-tight text-neutral-600">
                    Oops, daftar pesananmu masih kosong
                  </p>
                  <p className="text-center text-xs font-medium leading-tight text-neutral-600">
                    Mohon bersabar untuk menanti permintaan baru
                  </p>
                </div>
              </DataNotFound>
            </div>
          ) : (
            <div className="h-full border-0">
              <Table
                data={orders}
                columns={columns}
                loading={isLoading}
                onSort={handleSort}
                sortConfig={sortConfig}
                emptyComponent={renderEmptyState()}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DaftarPesananAktif;

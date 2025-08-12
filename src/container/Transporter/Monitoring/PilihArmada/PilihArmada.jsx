"use client";

import { useState } from "react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import Table from "@/components/Table/Table";
import { cn } from "@/lib/utils";
import { useGetAvailableFleet } from "@/services/Transporter/monitoring/getAvailableFleet";

const DaftarPesananAktif = ({ onToggleExpand, isExpanded }) => {
  const [sortConfig, setSortConfig] = useState({ sort: null, order: null });
  const [searchValue, setSearchValue] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);

  // Get available fleet data for the selected order (using a mock orderId for now)
  const { data: fleetData, isLoading: fleetLoading } = useGetAvailableFleet(
    "order-uuid-1",
    {
      search: searchValue,
      operationalStatus: selectedFilter ? [selectedFilter] : undefined,
    }
  );

  const columns = [
    {
      header: "Jenis Armada",
      key: "truckType",
      sortable: false,
      headerClassName: "px-5 py-3",
      className: "align-top relative px-5 py-9",
      render: (row) => (
        <div>
          <div className="absolute left-0 top-0">
            {row.isRecommended && (
              <span className="inline-block rounded-r bg-success-400 p-2 text-xs font-semibold text-success-50">
                Rekomendasi Armada
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="w-[188px] text-sm font-medium text-gray-900">
              {(() => {
                const text = `${row.truckTypeName || ""} - ${row.carrierName || ""}`;
                return text.length > 56 ? (
                  <InfoTooltip
                    side="top"
                    align="center"
                    sideOffset={8}
                    trigger={
                      <span className="cursor-pointer text-sm font-medium text-gray-900">
                        {`${text.slice(0, 56)}...`}
                      </span>
                    }
                  >
                    <div className="text-sm">
                      <div>{text}</div>
                    </div>
                  </InfoTooltip>
                ) : (
                  <span className="text-sm font-medium text-gray-900">
                    {text}
                  </span>
                );
              })()}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "No. Polisi",
      key: "licensePlate",
      sortable: true,
      headerClassName: "px-5 py-6",
      className: "py-9 px-5 align-top",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-900">
            {row.licensePlate}
          </span>
          {row.operationalStatus === "ON_DUTY" && !row.isRecommended && (
            <span className="text-xs font-medium text-orange-600">
              Potensi Overload
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Driver",
      key: "driver",
      sortable: true,
      headerClassName: "px-5 py-3",
      className: "py-9 px-5 align-top",
      render: (row) => (
        <div className="flex w-[188px] flex-col gap-1">
          {row.driver?.name ? (
            row.driver.name.length > 49 ? (
              <InfoTooltip
                side="top"
                align="center"
                sideOffset={8}
                trigger={
                  <span className="cursor-pointer text-sm font-medium text-gray-900">
                    {`${row.driver.name.slice(0, 49)}...`}
                  </span>
                }
              >
                <div className="text-sm">
                  <div>{row.driver.name}</div>
                </div>
              </InfoTooltip>
            ) : (
              <span className="text-sm font-medium text-gray-900">
                {row.driver.name}
              </span>
            )
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      header: "Lokasi",
      key: "location",
      sortable: true,
      headerClassName: "px-5 py-3",
      className: "py-9 px-5 align-top",
      render: (row) => (
        <div className="flex flex-col">
          {(() => {
            const address = row.location?.address || "-";
            return address.length > 25 ? (
              <InfoTooltip
                side="top"
                align="center"
                sideOffset={8}
                trigger={
                  <span className="mb-3 w-[188px] cursor-pointer text-sm font-medium text-gray-900">
                    {`${address.slice(0, 25)}...`}
                  </span>
                }
              >
                <div className="text-sm">
                  <div>{address}</div>
                </div>
              </InfoTooltip>
            ) : (
              <span className="mb-3 w-[188px] text-sm font-medium text-gray-900">
                {address}
              </span>
            );
          })()}

          <span className="flex gap-1 text-xs font-medium text-gray-600">
            <IconComponent
              src="/icons/location14.svg"
              className={cn(
                "h-[14px] w-[14px] transform transition-transform duration-300 ease-in-out",
                !isExpanded && "rotate-180"
              )}
            />
            {row.distanceFromPickup} km dari lokasi muat
          </span>
        </div>
      ),
    },
    {
      header: "Jadwal Terdekat",
      key: "schedule",
      sortable: true,
      headerClassName: "px-5 py-3",
      className: "py-9 px-5 align-top",
      render: (row) => (
        <div className="flex flex-col">
          <span className="mb-3 text-sm font-medium text-gray-900">
            {row.schedule?.hasSchedule
              ? row.schedule?.estimatedFinish || "-"
              : "-"}
          </span>
          <span className="cursor-pointer text-sm font-medium text-[#2574EA]">
            Cek Jadwal
          </span>
        </div>
      ),
    },
    {
      header: "Status Armada",
      key: "operationalStatus",
      sortable: true,
      headerClassName: "px-5 py-3",
      className: "py-9 px-5 align-top",
      render: (row) => {
        const getStatusBadge = (status) => {
          switch (status) {
            case "READY_FOR_ORDER":
              if (row.isRecommended) {
                return {
                  className: "bg-success-400 text-success-50",
                  text: "Siap Menerima Order",
                };
              }
              return { variant: "success", text: "Siap Menerima Order" };

            case "ON_DUTY":
              if (row.isRecommended) {
                return {
                  className: "bg-primary-700 text-primary-50",
                  text: "Bertugas",
                };
              }
              return { variant: "primary", text: "Bertugas" };
            case "WAITING_LOADING_TIME":
              return { variant: "info", text: "Akan Muat Hari Ini" };
            default:
              return { variant: "default", text: status };
          }
        };

        const statusBadge = getStatusBadge(row.operationalStatus);

        return (
          <div className="flex flex-col gap-2">
            {statusBadge.className ? (
              <BadgeStatus
                className={`w-[150px] py-2 text-xs font-semibold ${statusBadge.className}`}
              >
                {statusBadge.text}
              </BadgeStatus>
            ) : (
              <BadgeStatus
                variant={statusBadge.variant}
                className="w-[150px] py-2 text-xs font-semibold"
              >
                {statusBadge.text}
              </BadgeStatus>
            )}
          </div>
        );
      },
    },
    {
      header: "",
      key: "",
      sortable: false,
      headerClassName: "px-5 py-3",
      className: "py-9 px-5 align-top",
      render: (row) => {
        return (
          <div className="flex gap-2">
            <Button
              variant="muattrans-primary-secondary"
              className="h-8 w-[112px] text-sm font-semibold"
            >
              Pilih
            </Button>
          </div>
        );
      },
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
              Belum ada armada tersedia
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Armada tersedia akan muncul di sini
            </p>
          </div>
        </div>
      </td>
    </tr>
  );

  const vehicles = fleetData?.vehicles || [];
  const totalVehicles = vehicles.length || 0;

  // Function to get row className based on recommendation status
  const getRowClassName = (row) => {
    return row.isRecommended
      ? "bg-success-50 hover:bg-success-50 border-b border-success-400"
      : "hover:bg-muat-trans-primary-50 hover:border hover:border-muat-trans-primary-400";
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center gap-3 px-4">
        <div className="flex items-center gap-2">
          <h3 className="whitespace-nowrap text-xs font-bold">
            Pilih armada yang ditugaskan
          </h3>
        </div>
        <div className="flex w-full items-center justify-end gap-3">
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
          {/* Check if there are no available vehicles */}
          {!fleetLoading && totalVehicles === 0 ? (
            <div className="flex h-full items-center justify-center p-4">
              <DataNotFound className="h-full gap-y-5 pb-10" type="data">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-center text-base font-semibold leading-tight text-neutral-600">
                    Oops, belum ada armada tersedia
                  </p>
                  <p className="text-center text-xs font-medium leading-tight text-neutral-600">
                    Armada tersedia akan muncul di sini
                  </p>
                </div>
              </DataNotFound>
            </div>
          ) : (
            <div className="h-full border-0">
              <Table
                data={vehicles}
                columns={columns}
                loading={fleetLoading}
                onSort={handleSort}
                sortConfig={sortConfig}
                emptyComponent={renderEmptyState()}
                rowClassName={getRowClassName}
                rowRecomendations={[0, 1]}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DaftarPesananAktif;

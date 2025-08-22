"use client";

import Image from "next/image";
import { useState } from "react";

import BadgeOrderType from "@/components/Badge/BadgeOrderType";
import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import MuatBongkarStepperWithModal from "@/components/Stepper/MuatBongkarStepperWithModal";
import { cn } from "@/lib/utils";
import {
  getOrderStatusActions,
  getOrderStatusBadge,
} from "@/utils/CS/orderStatus";
import { formatMuatTime } from "@/utils/Transporter/dateTimeUtils";

// A detailed component to render a single order row within the expanded shipper view.
const DetailedOrderItem = ({
  row,
  onActionClick,
  onViewFleetStatus,
  isOpen,
  onToggleDropdown,
  isLast,
}) => {
  const { dateLabel, timeRange, dateColor } = formatMuatTime(row);
  const statusBadge = getOrderStatusBadge(row.orderStatus);
  const config = getOrderStatusActions(row.orderStatus, row);

  return (
    <div
      className={cn(
        "flex w-full flex-row items-start gap-3 px-3 py-4",
        !isLast && "border-b border-neutral-300"
      )}
    >
      {/* Column 1: Order Code & Type */}
      <div className="flex w-[92px] flex-shrink-0 flex-col gap-3">
        <span className="text-xs font-medium text-primary-700 hover:cursor-pointer hover:underline">
          {row.orderCode}
        </span>
        <BadgeOrderType type={row.orderType} />
      </div>

      {/* Column 2: Waktu Muat */}
      <div className="flex w-[130px] flex-shrink-0 flex-col gap-2">
        <span className={cn("text-xs font-semibold", dateColor)}>
          {dateLabel}
        </span>
        <span className="text-[10px] font-medium leading-tight text-black">
          {timeRange}
        </span>
      </div>

      {/* Column 3: Rute */}
      <div className="w-[139px] flex-shrink-0">
        <MuatBongkarStepperWithModal
          pickupLocations={row.pickupLocations}
          dropoffLocations={row.dropoffLocations}
          appearance={{
            titleClassName: "text-[10px] font-semibold",
            showAddress: true,
          }}
        />
      </div>

      {/* Column 4: Armada */}
      <div className="flex w-[200px] flex-shrink-0 flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="truncate text-xs font-semibold text-black">
            {row.truckType.name}
          </p>
          <p className="truncate text-[10px] font-semibold text-black">
            {row.carrierTruck.name}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <IconComponent
                src="/icons/monitoring/daftar-pesanan-aktif/truck.svg"
                className="h-3.5 w-3.5"
              />
              <span className="text-[10px] font-medium">
                {row.truckCount} Unit
              </span>
            </div>
            <div className="h-0.5 w-0.5 rounded-full bg-neutral-600" />
            <div className="flex items-center gap-1">
              <IconComponent
                src="/icons/monitoring/daftar-pesanan-aktif/scales.svg"
                className="h-3.5 w-3.5"
              />
              <span className="truncate text-[10px] font-medium">
                {row.informasiMuatan[0]} ({row.totalWeight} {row.weightUnit})
              </span>
            </div>
          </div>
          {row.informasiMuatan.length > 1 && (
            <InfoTooltip
              trigger={
                <span className="w-fit cursor-pointer text-[10px] font-medium text-primary-700 hover:underline">
                  +{row.informasiMuatan.length - 1} lainnya
                </span>
              }
            >
              <div className="max-w-xs">
                <p className="mb-2 font-semibold">Informasi Muatan</p>
                <ol className="list-inside list-decimal">
                  {row.informasiMuatan.slice(1).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              </div>
            </InfoTooltip>
          )}
        </div>
      </div>

      {/* Column 5: Status */}
      <div className="flex w-[120px] flex-grow justify-start">
        <BadgeStatus
          variant={statusBadge.variant}
          className="px-2 py-2 text-center text-xs"
        >
          {statusBadge.label}
        </BadgeStatus>
      </div>

      {/* Column 6: Actions */}
      <div className="flex w-6 flex-shrink-0">
        {config && (
          <SimpleDropdown
            open={isOpen}
            onOpenChange={(open) => onToggleDropdown(row.id, open)}
          >
            <SimpleDropdownTrigger asChild>
              <button className="flex h-6 w-6 items-center justify-center rounded-lg hover:bg-neutral-200">
                <IconComponent
                  src="/icons/more-vertical.svg"
                  className="h-4 w-4"
                />
              </button>
            </SimpleDropdownTrigger>
            <SimpleDropdownContent className="mr-4 mt-0">
              {config.actions.map((action) => (
                <SimpleDropdownItem
                  key={action.type}
                  onClick={() => onActionClick(action.type, row)}
                  className={cn(action.isError && "text-error-400")}
                >
                  {action.label}
                </SimpleDropdownItem>
              ))}
            </SimpleDropdownContent>
          </SimpleDropdown>
        )}
      </div>
    </div>
  );
};

// Component for the collapsible shipper group.
const ShipperGroupItem = ({
  shipperData,
  onActionClick,
  onViewFleetStatus,
  openDropdownId,
  onToggleDropdown,
}) => {
  const [isOpen, setIsOpen] = useState(true); // Default to open

  return (
    <div className="flex flex-col">
      {/* Shipper Header */}
      <div className="border-t border-neutral-300 bg-neutral-100">
        <div className="flex cursor-pointer items-center gap-3 p-3">
          <span className="text-xs font-medium text-neutral-600">
            Shipper :
          </span>
          <div className="flex flex-1 items-center gap-2 overflow-hidden">
            <Image
              src={shipperData.logoUrl || "/img/placeholder-logo.png"}
              alt={shipperData.name}
              width={24}
              height={24}
              className="h-6 w-6 flex-shrink-0 rounded-full object-cover"
            />
            <span className="truncate text-xs font-semibold text-black">
              {shipperData.name}
            </span>
          </div>
          <div className="flex flex-shrink-0 items-center gap-4">
            <Button
              variant="link"
              className="flex items-center gap-1 p-0 text-xs font-medium text-primary-700 hover:text-primary-800"
              iconLeft={
                <IconComponent src="/icons/call16.svg" className="h-4 w-4" />
              }
            >
              Hubungi
            </Button>
            <IconComponent
              src="/icons/chevron-down.svg"
              className={cn(
                "h-4 w-4 text-neutral-700 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </div>
      </div>

      {/* Expanded Content: List of Orders */}
      {isOpen && (
        <div className="border border-neutral-300 bg-white">
          {shipperData.orders.map((order, index) => (
            <DetailedOrderItem
              key={order.id}
              row={order}
              isLast={index === shipperData.orders.length - 1}
              onActionClick={onActionClick}
              onViewFleetStatus={onViewFleetStatus}
              isOpen={openDropdownId === order.id}
              onToggleDropdown={onToggleDropdown}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main component for the "View by Transporter" list item.
const DaftarPesananAktifListItemByTransporter = ({
  transporterData,
  isOpen,
  onToggle,
  onActionClick,
  onViewFleetStatus,
  openDropdownId,
  onToggleDropdown,
}) => {
  return (
    <div className="flex flex-col bg-white">
      {/* Transporter Header */}
      <div
        className="flex cursor-pointer items-center gap-4 border-b border-neutral-300 px-4 py-3"
        onClick={onToggle}
      >
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          <span className="flex-shrink-0 text-xs font-medium text-neutral-600">
            Transporter :
          </span>
          <Image
            src={transporterData.logoUrl || "/img/placeholder-logo.png"}
            alt={transporterData.name}
            width={24}
            height={24}
            className="h-6 w-6 flex-shrink-0 rounded-full border border-neutral-400 object-cover"
          />
          <span className="truncate text-xs font-semibold text-black">
            {transporterData.name}
          </span>
          {transporterData.hasUrgent && (
            <div className="h-2 w-2 flex-shrink-0 rounded-full bg-error-400" />
          )}
        </div>
        <div className="flex flex-shrink-0 items-center gap-4">
          <Button
            variant="link"
            className="flex items-center gap-1 p-0 text-xs font-medium text-primary-700 hover:text-primary-800"
            iconLeft={
              <IconComponent src="/icons/call16.svg" className="h-4 w-4" />
            }
          >
            Hubungi
          </Button>
          <div className="h-6 w-px bg-neutral-300" />
          <IconComponent
            src="/icons/chevron-down.svg"
            className={cn(
              "h-4 w-4 text-neutral-700 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {/* Expanded Content: List of Shippers */}
      {isOpen && (
        <div className="p-4 pt-0">
          <div className="flex flex-col gap-3">
            {transporterData.shippers.map((shipper) => (
              <ShipperGroupItem
                key={shipper.id}
                shipperData={shipper}
                onActionClick={onActionClick}
                onViewFleetStatus={onViewFleetStatus}
                openDropdownId={openDropdownId}
                onToggleDropdown={onToggleDropdown}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftarPesananAktifListItemByTransporter;

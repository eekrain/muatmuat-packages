"use client";

import React from "react";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
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
import { formatMuatTime } from "@/utils/Transporter/dateTimeUtils";
import {
  ORDER_ACTIONS,
  ORDER_STATUS,
  getOrderStatusActions,
  getOrderStatusBadge,
} from "@/utils/Transporter/orderStatus";

const DaftarPesananAktifListItem = ({
  row,
  isOpen,
  onToggleDropdown,
  onActionClick,
  onViewFleetStatus,
}) => {
  const [showHubungiModal, setShowHubungiModal] = React.useState(false);
  const { dateLabel, timeRange, dateColor } = formatMuatTime(row);
  const statusBadge = getOrderStatusBadge(row.orderStatus);
  const config = getOrderStatusActions(row.orderStatus, row);

  const handleActionClick = (actionType) => {
    switch (actionType) {
      case ORDER_ACTIONS.ASSIGN_FLEET.type:
      case ORDER_ACTIONS.RESPOND_CHANGE.type:
      case ORDER_ACTIONS.CONFIRM_READY.type:
        onToggleDropdown(row.id, false);
        break;
    }
    onActionClick(actionType, row);
  };

  return (
    <div className="relative z-0 -mt-px flex h-40 w-full flex-col items-start border-b border-neutral-400 bg-white">
      {/* Header Section */}
      <div className="flex w-full flex-row items-center justify-between border-t border-neutral-400 bg-neutral-100 py-3">
        <div className="flex w-full flex-row items-center gap-1">
          {/* Transporter Section */}
          <div className="flex w-full items-center gap-2 border-r border-neutral-400 px-4">
            <span className="shrink-0 text-xs font-medium text-neutral-600">
              Transporter :
            </span>
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-600">
              <span className="text-xs font-bold text-white">S</span>
            </div>

            <span className="line-clamp-1 break-all text-xs font-semibold text-black">
              PT Siba Surya PT Siba Surya PT Panjang Sekali Ini Omygod
            </span>
            <div className="border-l border-neutral-400 py-1 pl-2">
              <Button
                variant="link"
                iconLeft={
                  <IconComponent src="/icons/call16.svg" className="h-4 w-4" />
                }
                className="flex items-center gap-1 p-0 text-xs font-medium text-blue-600 hover:text-blue-700"
                onClick={() => setShowHubungiModal(true)}
              >
                Hubungi
              </Button>
            </div>
          </div>

          {/* Vertical Separator */}
          {/* <div className="mx-6 h-6 w-px bg-neutral-400" /> */}

          {/* Shipper Section */}
          <div className="flex w-full items-center gap-2 border-l border-neutral-400 px-4">
            <span className="shrink-0 text-xs font-medium text-neutral-600">
              Shipper :
            </span>
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-600">
              <span className="text-xs font-bold text-white">A</span>
            </div>
            <span className="line-clamp-1 flex-grow break-all text-xs font-semibold text-black">
              Agam Tunggal Jaya Agam Tung Tung Tung Tung Tung TUng SASHUUUURRRRR
            </span>
            <div className="border-l border-neutral-400 py-1 pl-2">
              <Button
                variant="link"
                iconLeft={
                  <IconComponent src="/icons/call16.svg" className="h-4 w-4" />
                }
                className="flex items-center gap-1 p-0 text-xs font-medium text-blue-600 hover:text-blue-700"
                onClick={() => setShowHubungiModal(true)}
              >
                Hubungi
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full items-start gap-4 p-4">
        {/* Order Code & Type */}
        <div className="flex w-[120px] flex-col gap-2.5">
          <div className="flex items-center gap-1 text-xxs font-semibold text-primary-700 hover:text-primary-800">
            <InfoTooltip
              side="right"
              appearance={{
                iconClassName: "text-primary-700  size-4",
              }}
            >
              <p className="max-w-[312px]">
                Armada kamu telah tercatat untuk pesanan ini, harap menunggu
                maks. 1 jam untuk konfirmasi dari Shipper
              </p>
            </InfoTooltip>
            {row.orderCode}
          </div>
          <BadgeOrderType type={row.orderType} className="w-[70px]" />
        </div>

        {/* Waktu Muat */}
        <div className="flex w-[140px] flex-col gap-1">
          <span className={`text-xs font-semibold ${dateColor}`}>
            {dateLabel}
          </span>
          <span className="text-xxs font-medium">{timeRange}</span>
        </div>

        {/* Rute Muat & Bongkar */}
        <div className="max-w-[350px] flex-1">
          <MuatBongkarStepperWithModal
            pickupLocations={row.pickupLocations}
            dropoffLocations={row.dropoffLocations}
            appearance={{
              titleClassName: "text-xxs font-semibold",
            }}
          />
        </div>

        {/* Armada */}
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
          {/* SOS Indicator for UNLOADING status with SOS */}
          {row.orderStatus === ORDER_STATUS.UNLOADING &&
            row.sosStatus?.hasSos &&
            row.sosStatus?.sosCount > 0 && (
              <div className="mt-1 flex items-center gap-2">
                <div className="flex h-[14px] items-center gap-1 rounded bg-error-400 px-1">
                  <span className="text-[8px] font-bold leading-[130%] text-white">
                    SOS : {row.sosStatus.sosCount} Unit
                  </span>
                </div>
                <Button
                  variant="link"
                  onClick={() => {
                    // TODO: Implement SOS details view
                  }}
                  className="h-auto p-0 text-xs font-medium"
                >
                  Lihat SOS
                </Button>
              </div>
            )}
        </div>

        {/* Status */}
        <div className="flex w-[200px] flex-col gap-2">
          <BadgeStatus variant={statusBadge.variant} className="w-[176px] px-0">
            {row.orderStatus === ORDER_STATUS.WAITING_CONFIRMATION_SHIPPER && (
              <InfoTooltip
                side="top"
                appearance={{
                  iconClassName: "text-primary-700 mr-1 size-3.5",
                }}
              >
                <p>
                  Armada kamu telah tercatat untuk pesanan ini, harap menunggu
                  maks. 1 jam untuk konfirmasi dari Shipper
                </p>
              </InfoTooltip>
            )}
            {row.orderStatus === ORDER_STATUS.NEED_CONFIRMATION_READY && (
              <IconComponent
                src="/icons/warning-red.svg"
                className="mr-1 h-3.5 w-3.5"
              />
            )}
            {row.orderStatus === ORDER_STATUS.NEED_CHANGE_RESPONSE && (
              <IconComponent
                src="/icons/warning24.svg"
                className="mr-1 h-3.5 w-3.5 text-warning-900"
              />
            )}
            {row.orderStatus === ORDER_STATUS.LOADING
              ? `${statusBadge.label} : ${row.truckCount || 0} Unit`
              : statusBadge.label}
          </BadgeStatus>
          {row.orderStatus === ORDER_STATUS.LOADING && (
            <Button
              variant="link"
              onClick={() => {
                onViewFleetStatus?.(row);
              }}
              className="self-start text-xs font-semibold"
            >
              Lihat Status Lainnya
            </Button>
          )}
          {row.orderStatus === ORDER_STATUS.NEED_ASSIGN_FLEET && (
            <Button
              variant="muattrans-primary"
              onClick={() => handleActionClick(ORDER_ACTIONS.ASSIGN_FLEET.type)}
              className="mx-auto h-8 w-[147px] text-sm md:p-0"
            >
              Assign Armada
            </Button>
          )}
          {row.orderStatus === ORDER_STATUS.NEED_CONFIRMATION_READY && (
            <Button
              variant="muattrans-primary"
              onClick={() =>
                handleActionClick(ORDER_ACTIONS.CONFIRM_READY.type)
              }
              className="mx-auto h-8 w-[147px] text-sm md:p-0"
            >
              Konfirmasi Siap
            </Button>
          )}
          {row.orderStatus === ORDER_STATUS.NEED_CHANGE_RESPONSE && (
            <Button
              variant="muattrans-primary"
              onClick={() =>
                handleActionClick(ORDER_ACTIONS.RESPOND_CHANGE.type)
              }
              className="mx-auto h-8 w-[147px] text-sm md:p-0"
            >
              Respon Perubahan
            </Button>
          )}
        </div>

        {/* Actions */}
        <div className="flex w-[40px] justify-center">
          {config ? (
            <SimpleDropdown
              open={isOpen || false}
              onOpenChange={(open) => onToggleDropdown(row.id, open)}
            >
              <SimpleDropdownTrigger asChild>
                <button
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-lg",
                    isOpen
                      ? "border border-primary-700 bg-primary-50"
                      : "hover:border hover:border-primary-700 hover:bg-neutral-200"
                  )}
                >
                  <IconComponent
                    src="/icons/monitoring/daftar-pesanan-aktif/action.svg"
                    className={cn(
                      "h-[13px] w-[13px]",
                      isOpen ? "text-primary-700" : ""
                    )}
                  />
                </button>
              </SimpleDropdownTrigger>

              <SimpleDropdownContent
                className={cn("mr-1 mt-0", config.width)}
                side="left"
              >
                {config.actions.map((actionItem, index) => (
                  <SimpleDropdownItem
                    key={index}
                    onClick={() => handleActionClick(actionItem.type)}
                    className={cn(
                      "flex h-8 items-center",
                      actionItem.isError &&
                        "text-error-400 hover:text-error-500"
                    )}
                  >
                    {actionItem.label}
                  </SimpleDropdownItem>
                ))}
              </SimpleDropdownContent>
            </SimpleDropdown>
          ) : (
            <button className="flex h-6 w-6 items-center justify-center rounded-lg hover:border hover:border-primary-700 hover:bg-neutral-200">
              <IconComponent
                src="/icons/monitoring/daftar-pesanan-aktif/action.svg"
                className="h-[13px] w-[13px]"
              />
            </button>
          )}
        </div>
      </div>
      {/* HubungiModal integration */}
      <HubungiModal
        isOpen={showHubungiModal}
        onClose={() => setShowHubungiModal(false)}
        transporterData={null} // TODO: pass actual transporter data if available
      />
    </div>
  );
};

export default DaftarPesananAktifListItem;

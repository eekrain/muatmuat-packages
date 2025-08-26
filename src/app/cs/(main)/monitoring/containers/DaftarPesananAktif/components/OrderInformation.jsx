"use client";

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
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import {
  ORDER_STATUS,
  getOrderStatusActions,
  getOrderStatusBadge,
} from "@/utils/CS/orderStatus";
import { formatMuatTime } from "@/utils/Transporter/dateTimeUtils";

// Helper function copied from parent file
const formatInformasiMuatan = (informasiMuatan = [], t) => {
  if (!informasiMuatan || informasiMuatan.length === 0) {
    return { displayText: "-", hasMore: false, remainingItems: [] };
  }

  if (informasiMuatan.length === 1) {
    return {
      displayText: informasiMuatan[0],
      hasMore: false,
      remainingItems: [],
    };
  }

  const firstItem = informasiMuatan[0];
  const remainingCount = informasiMuatan.length - 1;
  const remainingItems = informasiMuatan.slice(1);

  return {
    displayText: t(
      "OrderInformation.moreItems",
      { firstItem, count: remainingCount },
      `${firstItem}, +${remainingCount} lainnya`
    ),
    hasMore: true,
    remainingItems,
  };
};

const OrderInformation = ({
  row,
  isOpen,
  onToggleDropdown,
  onActionClick,
  onViewFleetStatus,
  className,
}) => {
  const { t } = useTranslation();
  const { dateLabel, timeRange, dateColor } = formatMuatTime(row, t);
  const statusBadge = getOrderStatusBadge(row.orderStatus);
  const config = getOrderStatusActions(row.orderStatus, row);

  const id = row.orderId || row.id;
  const orderCode = row.orderNumber || row.orderCode || "";

  const vehicleType = row.fleetInfo?.vehicleType || row.truckType?.name || "";
  const carrierType =
    row.fleetInfo?.carrierType || row.carrierTruck?.name || "";
  const totalUnits = row.fleetInfo?.totalUnits || row.truckCount || 0;
  const informasiMuatan = row.fleetInfo?.cargoName || row.informasiMuatan || [];
  const totalWeight = row.fleetInfo?.totalWeight || row.totalWeight || 0;
  const weightUnit = row.fleetInfo?.weightUnit || row.weightUnit || "kg";
  const sosStatus = row.sosStatus ?? {
    hasSos: (row.sosUnit || 0) > 0,
    sosCount: row.sosUnit || 0,
  };

  const muatanInfo = formatInformasiMuatan(informasiMuatan, t);

  const handleActionClick = (actionType) => {
    // Mirror previous behavior: close dropdown for certain actions
    if (actionType === "CONFIRM_READY") {
      onToggleDropdown?.(id, false);
    }
    onActionClick?.(actionType, row);
  };

  return (
    <div
      className={cn("flex w-full shrink-0 items-start gap-4 p-4", className)}
    >
      {/* Order Code & Type */}
      <div className="flex w-full max-w-[120px] flex-col gap-2.5">
        <div className="line-clamp-1 flex items-center gap-1 truncate text-xs font-medium">
          {row.orderStatus === ORDER_STATUS.WAITING_CONFIRMATION_SHIPPER && (
            <InfoTooltip
              side="right"
              appearance={{ iconClassName: "text-primary-700 mr-1 size-3.5" }}
            >
              <p className="max-w-[312px]">
                {t(
                  "OrderInformation.waitingConfirmationTooltip",
                  {},
                  "Armada kamu telah tercatat untuk pesanan ini, harap menunggu maks. 1 jam untuk konfirmasi dari Shipper"
                )}
              </p>
            </InfoTooltip>
          )}
          {row.orderStatus === ORDER_STATUS.NEED_CONFIRMATION_READY && (
            <InfoTooltip
              icon="/icons/warning20.svg"
              side="right"
              appearance={{ iconClassName: "text-error-400 mr-1 size-3.5" }}
            >
              <p className="max-w-[312px]">
                {t(
                  "OrderInformation.needConfirmationTooltip",
                  {},
                  "Pesanan belum di konfirmasi siap, mohon segera melakukan pengecekan kesiapan armada dan konfirmasi siap sebelum waktu muat"
                )}
              </p>
            </InfoTooltip>
          )}
          {row.orderStatus === ORDER_STATUS.NEED_CHANGE_RESPONSE && (
            <InfoTooltip
              icon="/icons/warning20.svg"
              side="right"
              appearance={{ iconClassName: "text-warning-900 mr-1 size-3.5" }}
            >
              <p className="max-w-[312px]">
                {t(
                  "OrderInformation.changeResponseTooltip",
                  {},
                  "Terdapat perubahan pesanan dari Shipper, mohon pelajari perubahannya dan segera beri respon"
                )}
              </p>
            </InfoTooltip>
          )}
          {row.orderStatus === ORDER_STATUS.NEED_ASSIGN_FLEET && (
            <InfoTooltip
              icon="/icons/warning20.svg"
              side="right"
              appearance={{ iconClassName: "text-warning-900 mr-1 size-3.5" }}
            >
              <p className="max-w-[312px]">
                {t(
                  "OrderInformation.needAssignFleetTooltip",
                  {},
                  "Pesanan ini belum memiliki armada yang ditugaskan. Silakan lakukan Assign Armada secepatnya agar jadwal muat dan pengiriman berjalan sesuai rencana."
                )}
              </p>
            </InfoTooltip>
          )}
          <span className="text-primary-700 hover:cursor-pointer hover:text-primary-800">
            {orderCode}
          </span>
        </div>
        <BadgeOrderType type={row.orderType} className="w-[70px]" />
      </div>

      {/* Waktu Muat */}
      <div className="flex w-[140px] shrink-0 flex-col gap-1">
        <span className={`text-xs font-semibold ${dateColor}`}>
          {dateLabel}
        </span>
        <span className="text-xxs font-medium">{timeRange}</span>
      </div>

      {/* Rute Muat & Bongkar */}
      <div className="flex w-[160px] shrink-0">
        <MuatBongkarStepperWithModal
          pickupLocations={
            row.route?.pickupLocations || row.pickupLocations || []
          }
          dropoffLocations={
            row.route?.dropoffLocations || row.dropoffLocations || []
          }
          appearance={{ titleClassName: "text-xxs font-semibold" }}
        />
      </div>

      {/* Armada */}
      <div className="flex w-full flex-col gap-1">
        <div className="line-clamp-1 break-all text-xs font-semibold">
          {vehicleType}
        </div>
        <span className="line-clamp-1 break-all text-xs font-medium">
          <div className="line-clamp-1 break-all text-[10px] font-semibold">
            {carrierType}
          </div>
        </span>
        <div className="mt-1 flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-4">
          <div className="flex shrink-0 items-center gap-1">
            <IconComponent
              src="/icons/monitoring/daftar-pesanan-aktif/truck.svg"
              className="h-4 w-4 text-gray-600"
            />
            <span className="text-xxs font-medium">
              {totalUnits} {t("OrderInformation.unit", {}, "Unit")}
            </span>
          </div>
          <span className="hidden text-gray-300 lg:block">•</span>
          <div className="flex max-w-[118px] items-center gap-1">
            <IconComponent
              src="/icons/monitoring/daftar-pesanan-aktif/scales.svg"
              className="h-4 w-4 shrink-0 text-gray-600"
            />
            <span className="text-xxs font-medium">
              {muatanInfo.hasMore ? (
                <>
                  {informasiMuatan[0]},
                  <InfoTooltip
                    trigger={
                      <span className="cursor-pointer text-primary-700 hover:text-primary-800">
                        +{muatanInfo.remainingItems.length}{" "}
                        {t("OrderInformation.others", {}, "lainnya")}
                      </span>
                    }
                    side="top"
                    align="start"
                  >
                    <div className="max-w-[312px]">
                      <div className="mb-2 font-semibold text-black">
                        {t(
                          "OrderInformation.cargoInfo",
                          {},
                          "Informasi Muatan"
                        )}
                      </div>
                      <ol className="list-inside list-decimal space-y-1">
                        {muatanInfo.remainingItems.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ol>
                    </div>
                  </InfoTooltip>{" "}
                  ({totalWeight} {weightUnit})
                </>
              ) : (
                `${muatanInfo.displayText} (${totalWeight} ${weightUnit})`
              )}
            </span>
          </div>
        </div>

        {row.orderStatus === ORDER_STATUS.UNLOADING &&
          sosStatus?.hasSos &&
          sosStatus?.sosCount > 0 && (
            <div className="mt-1 flex items-center gap-2">
              <div className="flex h-[14px] items-center gap-1 rounded bg-error-400 px-1">
                <span className="text-[8px] font-bold leading-[130%] text-white">
                  SOS : {sosStatus.sosCount} Unit
                </span>
              </div>
              <Button
                variant="link"
                onClick={() => {}}
                className="h-auto p-0 text-xs font-medium"
              >
                {t("OrderInformation.viewSOS", {}, "Lihat SOS")}
              </Button>
            </div>
          )}
      </div>

      {/* Status */}
      <div className="flex w-[120px] shrink-0 flex-col gap-2">
        <BadgeStatus
          variant={statusBadge.variant}
          className="w-full p-2 text-center"
        >
          {row.orderStatus === ORDER_STATUS.LOADING
            ? `${statusBadge.label} : ${row.truckCount || 0} ${t("OrderInformation.unit", {}, "Unit")}`
            : statusBadge.label}
        </BadgeStatus>
        {row.orderStatus === ORDER_STATUS.LOADING && (
          <Button
            variant="link"
            onClick={() => onViewFleetStatus?.(row)}
            className="self-start text-xs font-semibold"
          >
            {t("OrderInformation.viewOtherStatus", {}, "Lihat Status Lainnya")}
          </Button>
        )}
      </div>

      {/* Actions */}
      <div className="flex w-[40px] grow-0 justify-center">
        {config ? (
          <SimpleDropdown
            open={isOpen || false}
            onOpenChange={(open) => onToggleDropdown?.(id, open)}
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
                    actionItem.isError && "text-error-400 hover:text-error-500"
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
  );
};

export default OrderInformation;

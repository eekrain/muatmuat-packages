"use client";

import {
  AlertTriangle,
  ChevronDown,
  MapPin,
  Phone,
  Truck,
  User,
} from "lucide-react";

import Button from "@/components/Button/Button";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";
import { cn } from "@/lib/utils";
import { getTruckIcon } from "@/lib/utils/armadaStatus";

export default function CardFleet({
  fleet,
  isExpanded,
  onToggleExpand,
  onOpenDriverModal,
  isSOS,
  className,
}) {
  const cardClasses = cn(
    "overflow-hidden rounded-lg border p-3 transition-all duration-200",
    isSOS
      ? isExpanded
        ? "border-error-400 bg-error-50"
        : "border-gray-200 bg-error-50 hover:border-error-400 hover:bg-[#FFE9ED]"
      : isExpanded
        ? "border-[#FFC217] bg-[#FFFBEB]"
        : "border-gray-200 bg-white hover:border-[#FFC217] hover:bg-[#FFFBEB]",
    className
  );

  const chevronClasses = cn(
    "h-5 w-5 text-gray-400 transition-transform",
    isExpanded && "rotate-180"
  );

  const renderHeader = () => (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <TruckIcon status={fleet.status} />
        <span className="text-sm font-bold text-gray-900">
          {fleet.licensePlate}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {fleet.needsResponseChange && <ResponseChangeIndicator />}
        {fleet.hasSOSAlert && <SOSIndicator />}
        <ChevronDown className={chevronClasses} />
      </div>
    </div>
  );

  const renderCollapsedContent = () => {
    if (isExpanded) return null;

    return isSOS ? (
      <>
        <div className="mt-2 flex flex-col border-b border-neutral-400 pb-3">
          <p className="text-xs font-semibold text-error-400">
            {fleet.detailSOS.description || "-"}
          </p>
          <div>
            <p className="text-xs text-neutral-600">
              Laporan Masuk :{" "}
              <span className="text-xs font-semibold text-neutral-900">
                10 Jan 2025 12:23 WIB
              </span>
            </p>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-0.5 text-sm">
          <DriverInfo fleet={fleet} />
          <LocationInfo fleet={fleet} />
        </div>
      </>
    ) : (
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-sm">
        <DriverInfo fleet={fleet} showLabel />
        <LocationInfo fleet={fleet} showLabel />
      </div>
    );
  };

  const renderExpandedContent = () => {
    if (!isExpanded) return null;

    return (
      <div className="space-y-1 pt-2 text-sm">
        <DriverAndPhoneSection fleet={fleet} />
        <LocationAndFleetSection fleet={fleet} />
        {(fleet.status === "ON_DUTY" ||
          fleet.status === "WAITING_LOADING_TIME") && (
          <OnDutyDetails fleet={fleet} />
        )}
        {(!fleet.driver?.name || !fleet.driver?.phoneNumber) && (
          <AssignDriverButton onClick={() => onOpenDriverModal(fleet)} />
        )}
        {fleet.needsResponseChange && (
          <NeedResponseButton onClick={() => onOpenDriverModal(fleet)} />
        )}
        {fleet.hasSOSAlert === true && (
          <SOSResponseButton onClick={() => onOpenDriverModal(fleet)} />
        )}
      </div>
    );
  };

  return (
    <div className={cardClasses}>
      <div
        className="cursor-pointer"
        onClick={() => onToggleExpand(fleet.fleetId)}
      >
        {renderHeader()}
        {renderCollapsedContent()}
      </div>
      {renderExpandedContent()}
    </div>
  );
}

// Sub-components
function TruckIcon({ status }) {
  return (
    <div className="flex h-8 w-8 items-center justify-center">
      <img
        src={`/icons/armada-truck/${getTruckIcon(status)}`}
        alt="Truck icon"
        className="h-full w-full object-contain"
      />
    </div>
  );
}

function ResponseChangeIndicator() {
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FFF9C1]">
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
    </div>
  );
}

function SOSIndicator() {
  return (
    <p className="rounded-md bg-[#EE4343] px-2 py-[2px] text-xs font-semibold text-white">
      SOS
    </p>
  );
}

function DriverAndPhoneSection({ fleet }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex items-start space-x-3">
        <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#461B02]" />
        <div>
          <label className="text-xs text-gray-500">Driver</label>
          <p className="text-xs font-semibold text-gray-900">
            {fleet.driver?.name || "-"}
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#461B02]" />
        <div>
          <label className="text-xs text-gray-500">No. HP Driver</label>
          <p className="text-xs font-semibold text-gray-900">
            {fleet.driver?.phoneNumber || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}

function LocationAndFleetSection({ fleet }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <LocationInfoExpanded fleet={fleet} />
      <FleetInfo fleet={fleet} />
    </div>
  );
}

function AssignDriverButton({ onClick }) {
  return (
    <div className="pt-2">
      <button
        className="w-full rounded-xl bg-[#FFC217] px-4 py-2 text-sm font-medium text-[#461B02] hover:bg-[#FFD54F]"
        onClick={onClick}
      >
        Pasangkan Driver
      </button>
    </div>
  );
}

function SOSResponseButton({ onClick }) {
  return (
    <div className="flex justify-between gap-2 pt-2">
      <Button
        variant="muattrans-primary-secondary"
        className="w-full"
        onClick={onClick}
      >
        Riwayat SOS
      </Button>
      <Button className="w-full" onClick={onClick}>
        Mengerti
      </Button>
    </div>
  );
}

function NeedResponseButton({ onClick }) {
  return (
    <div className="pt-2">
      <button
        className="w-full rounded-xl bg-[#FFC217] px-4 py-2 text-sm font-medium text-[#461B02] hover:bg-[#FFD54F]"
        onClick={onClick}
      >
        Respon Perubahan
      </button>
    </div>
  );
}

function OnDutyDetails({ fleet }) {
  return (
    <div className="mt-4 flex w-full flex-col gap-3 rounded-lg border-t border-x-muat-trans-400 bg-[#F8F8FB] px-3 py-3 pt-4">
      <div>
        <p className="mb-3 text-xs text-gray-600">No. Pesanan</p>
        <p className="text-xs font-semibold text-black">
          {fleet?.activeOrder?.orderCode || "-"}
        </p>
      </div>
      <div className="py-1">
        <p className="mb-2 text-xs text-gray-600">Lokasi Muat & Bongkar</p>
        <TimelineContainer>
          {fleet?.activeOrder?.pickupLocation && (
            <LocationTimelineItem
              location={fleet.activeOrder.pickupLocation}
              isLast={!fleet?.activeOrder?.dropoffLocation}
              index={0}
              activeIndex={0}
              label="Lokasi Muat"
            />
          )}
          {fleet?.activeOrder?.dropoffLocation && (
            <LocationTimelineItem
              location={fleet.activeOrder.dropoffLocation}
              isLast={true}
              index={1}
              activeIndex={0}
              label="Lokasi Bongkar"
            />
          )}
        </TimelineContainer>
      </div>

      <div className="flex items-center justify-between">
        {fleet.status === "ON_DUTY" && fleet.needsResponseChange === false && (
          <div className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            Proses Muat
          </div>
        )}
        {fleet.status === "WAITING_LOADING_TIME" &&
          fleet.needsResponseChange === false && (
            <div className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              Armada Dijadwalkan
            </div>
          )}
        {fleet.needsResponseChange && (
          <div className="flex rounded-lg bg-warning-100 px-3 py-1 text-xs font-medium text-warning-900">
            <AlertTriangle className="mr-2 h-3 w-3" />
            Perlu Respon Perubahan
          </div>
        )}
        <button className="text-xs text-blue-700 hover:underline">
          Lihat Detail
        </button>
      </div>
    </div>
  );
}

function LocationTimelineItem({ location, isLast, index, activeIndex, label }) {
  const displayText =
    location.district?.length > 38
      ? `${location.district.substring(0, 38)}...`
      : location.district || label;

  return (
    <NewTimelineItem
      variant="bullet"
      index={index}
      activeIndex={activeIndex}
      isLast={isLast}
      title={displayText}
      className="pb-2"
      appearance={{
        titleClassname:
          "text-xs font-bold text-neutral-900 line-clamp-1 break-all",
      }}
    />
  );
}

function DriverInfo({ fleet, showLabel = false }) {
  return (
    <div className="flex items-center space-x-2">
      <User className="h-4 w-4 flex-shrink-0 text-[#461B02]" />
      <div className="min-w-0">
        {showLabel && <label className="text-xs text-gray-500">Driver</label>}
        <div className="flex items-center">
          <InfoTooltip
            trigger={
              <p
                className={cn(
                  "truncate",
                  showLabel
                    ? "text-xs font-semibold text-gray-900"
                    : "text-xs font-semibold text-neutral-900"
                )}
              >
                {fleet.driver?.name || "-"}
              </p>
            }
          >
            {fleet.driver?.name || "-"}
          </InfoTooltip>
        </div>
      </div>
    </div>
  );
}

function LocationInfo({ fleet, showLabel = false }) {
  const locationText = fleet.lastLocation?.address
    ? `${fleet.lastLocation.address.district}, ${fleet.lastLocation.address.city}`
    : "Unknown";

  return (
    <div className="flex items-center space-x-2">
      <MapPin className="h-4 w-4 flex-shrink-0 text-[#461B02]" />
      <div className="min-w-0">
        {showLabel && (
          <label className="text-xs text-gray-500">Lokasi Terakhir</label>
        )}
        {showLabel ? (
          <div className="truncate text-xs font-semibold text-gray-900">
            {locationText}
          </div>
        ) : (
          <InfoTooltip
            trigger={
              <p className="truncate text-xs font-semibold text-neutral-900">
                {locationText}
              </p>
            }
          >
            {locationText}
          </InfoTooltip>
        )}
      </div>
    </div>
  );
}

function LocationInfoExpanded({ fleet }) {
  return (
    <div className="flex items-start space-x-3">
      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#461B02]" />
      <div>
        <label className="text-xs text-gray-500">Lokasi Terakhir</label>
        <p className="text-xs font-semibold text-gray-900">
          {fleet.lastLocation?.address?.district || "Unknown"}
        </p>
        <p className="text-xxs text-neutral-900">
          {fleet.lastLocation?.address?.city || "Unknown"}
        </p>
      </div>
    </div>
  );
}

function FleetInfo({ fleet }) {
  return (
    <div className="flex items-start space-x-3">
      <Truck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#461B02]" />
      <div>
        <label className="text-xs text-gray-500">Armada</label>
        <p className="font-semibold text-gray-900">
          {fleet.carrierType?.name || "-"}
        </p>
        <p className="text-xxs text-neutral-900">
          {fleet.truckType?.name || "-"}
        </p>
      </div>
    </div>
  );
}

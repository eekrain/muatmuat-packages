"use client";

import Link from "next/link";

import {
  AlertTriangle,
  ChevronDown,
  Clock3,
  MapPin,
  Phone,
  Truck,
  User,
} from "lucide-react";

import Button from "@/components/Button/Button";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";
import { cn } from "@/lib/utils";
import { getTruckIcon } from "@/lib/utils/armadaStatus";
import { formatDate } from "@/lib/utils/dateFormat";

// ----- Constants -----
const STATUS_STYLES = {
  SOS: {
    expanded: "border-error-400 bg-error-50",
    collapsed:
      "border-gray-200 bg-error-50 hover:border-error-400 hover:bg-[#FFE9ED]",
  },
  DEFAULT: {
    expanded: "border-[#FFC217] bg-[#FFFBEB]",
    collapsed:
      "border-gray-200 bg-white hover:border-[#FFC217] hover:bg-[#FFFBEB]",
  },
};

// ----- Small Components -----
const TruckIcon = ({ status }) => {
  const icon = getTruckIcon?.(status) || "default.png";
  return (
    <div className="flex h-8 w-8 items-center justify-center">
      <img
        src={`/icons/armada-truck/${icon}`}
        alt="Truck icon"
        className="h-full w-full object-contain"
        loading="lazy"
      />
    </div>
  );
};

const ResponseChangeIndicator = ({ isExpanded }) => (
  <InfoTooltip
    trigger={
      <div
        className={`group flex h-6 w-6 items-center justify-center rounded-lg bg-[#FFF9C1] ${isExpanded ? "bg-warning-800" : "group-hover:bg-warning-800"}`}
      >
        <AlertTriangle
          className={`h-4 w-4 ${isExpanded ? "text-white" : "text-yellow-500 group-hover:text-white"}`}
        />
      </div>
    }
  >
    <p className="text-center">
      Pesanan Perlu <br /> Respon Perubahan
    </p>
  </InfoTooltip>
);

const SOSIndicator = () => (
  <p className="rounded-md bg-[#EE4343] px-2 py-[2px] text-xs font-semibold text-white">
    SOS
  </p>
);

const SOSAlertHeader = ({ category, reportTime, showCategory = true }) => (
  <div className="mt-3 flex flex-col border-b border-neutral-400 pb-3">
    {showCategory && (
      <p className="mb-2 text-xs font-semibold text-error-400">
        {category || "-"}
      </p>
    )}
    <p className="flex items-center gap-2 text-xs text-neutral-600">
      <Clock3 className="h-4 w-3 text-muat-trans-secondary-900" />
      Laporan Masuk:{" "}
      <span className="font-semibold text-neutral-900">
        {reportTime ? formatDate(reportTime) : "-"}
      </span>
    </p>
  </div>
);

const InfoWithTooltip = ({
  icon: Icon,
  label,
  value,
  showLabel,
  className,
}) => (
  <div className="flex items-center space-x-2">
    <Icon className="h-4 w-4 flex-shrink-0 text-[#461B02]" />
    <div className="min-w-0">
      {showLabel && (
        <label className="text-xs font-medium text-gray-500">{label}</label>
      )}
      <InfoTooltip
        trigger={
          <p className={cn("truncate text-xs font-semibold", className)}>
            {value}
          </p>
        }
      >
        {value}
      </InfoTooltip>
    </div>
  </div>
);

const DriverInfo = ({ driverName, showLabel = false }) => (
  <InfoWithTooltip
    icon={User}
    label="Driver"
    value={driverName || "-"}
    showLabel={showLabel}
    className={showLabel ? "text-gray-900" : "text-neutral-900"}
  />
);

const LocationInfo = ({ locationText, showLabel = false }) => (
  <InfoWithTooltip
    icon={MapPin}
    label="Lokasi Terakhir"
    value={locationText || "Unknown"}
    showLabel={showLabel}
    className={showLabel ? "text-gray-900" : "text-neutral-900"}
  />
);

const LocationTimelineItem = ({
  location,
  isLast,
  index,
  activeIndex,
  label,
}) => {
  const district = location?.district || label;
  const display =
    district?.length > 38 ? `${district.substring(0, 38)}...` : district;

  return (
    <NewTimelineItem
      variant="bullet"
      index={index}
      activeIndex={activeIndex}
      isLast={isLast}
      title={display || label}
      className="pb-2"
      appearance={{
        titleClassname:
          "text-xs font-bold text-neutral-900 line-clamp-1 break-all",
      }}
    />
  );
};

// ----- Card Sections -----
const CardHeader = ({ isExpanded, isSOS, fleet, onToggleExpand }) => {
  const chevronClasses = cn(
    "h-5 w-5 text-gray-400 transition-transform",
    isExpanded && "rotate-180"
  );

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <TruckIcon status={fleet?.status} />
        <span className="text-sm font-bold text-gray-900">
          {fleet?.licensePlate || "-"}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {fleet?.needsResponseChange && (
          <ResponseChangeIndicator isExpanded={isExpanded} />
        )}
        {isSOS && <SOSIndicator />}
        <ChevronDown className={chevronClasses} />
      </div>
    </div>
  );
};

const DriverAndPhoneSection = ({ driverName, phone }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <DriverInfo driverName={driverName} showLabel />
    <InfoWithTooltip
      icon={Phone}
      label="No. HP Driver"
      value={phone}
      showLabel
      className="text-gray-900"
    />
  </div>
);

const LocationAndFleetSection = ({ fleet }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div>
      <LocationInfo
        locationText={fleet?.lastLocation?.address?.district}
        showLabel
      />
      <p className="ml-6 text-xxs font-semibold">
        {fleet?.lastLocation?.address?.city}
      </p>
    </div>
    <div>
      <InfoWithTooltip
        icon={Truck}
        label="Armada"
        value={fleet?.carrierType?.name || "-"}
        showLabel
        className="text-gray-900"
      />
      <p className="ml-6 text-xxs font-semibold">
        {fleet?.truckType?.name || "-"}
      </p>
    </div>
  </div>
);

const ActionButton = ({
  children,
  onClick,
  className,
  variant = "default",
}) => {
  const baseClasses = "w-full rounded-xl px-4 py-2 text-sm font-medium";
  const variantClasses = {
    default: "bg-[#FFC217] text-[#461B02] hover:bg-[#FFD54F]",
    sos: "bg-error-500 text-white hover:bg-error-600",
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], className)}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

const OnDutyDetails = ({ fleet }) => {
  const pickup = fleet?.activeOrder?.pickupLocation;
  const dropoff = fleet?.activeOrder?.dropoffLocation;
  const status = fleet?.status;
  const needsResponse = fleet?.needsResponseChange;

  const getStatusBadge = () => {
    if (needsResponse) {
      return (
        <div className="flex items-center rounded-lg bg-warning-100 px-3 py-1 text-xs font-medium text-warning-900">
          <AlertTriangle className="mr-2 h-3 w-3" />
          Perlu Respon Perubahan
        </div>
      );
    }

    if (status === "ON_DUTY") {
      return (
        <div className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          Proses Muat
        </div>
      );
    }

    if (status === "WAITING_LOADING_TIME") {
      return (
        <div className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          Armada Dijadwalkan
        </div>
      );
    }

    return null;
  };

  return (
    <div className="mt-3 flex w-full flex-col gap-3 rounded-lg bg-[#F8F8FB] px-3 py-3 pt-4">
      <div>
        <p className="mb-3 text-xs text-gray-600">No. Pesanan</p>
        <p className="text-xs font-semibold text-black">
          {fleet?.activeOrder?.orderCode || "-"}
        </p>
      </div>

      <div className="py-1">
        <p className="mb-2 text-xs text-gray-600">Lokasi Muat & Bongkar</p>
        <TimelineContainer>
          {pickup && (
            <LocationTimelineItem
              location={pickup}
              isLast={!dropoff}
              index={0}
              activeIndex={0}
              label="Lokasi Muat"
            />
          )}
          {dropoff && (
            <LocationTimelineItem
              location={dropoff}
              isLast
              index={1}
              activeIndex={0}
              label="Lokasi Bongkar"
            />
          )}
        </TimelineContainer>
      </div>

      <div className="flex items-center justify-between">
        {getStatusBadge()}
        <Link
          className="text-xs text-blue-700 hover:underline"
          type="button"
          href="/monitoring?tab=request"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
};

const SOSExpandedSection = ({ fleet }) => {
  const photos = fleet?.detailSOS?.photos || [];

  return (
    <div className="mt-1 flex flex-col">
      <p className="text-xs font-semibold text-error-400">
        {fleet?.detailSOS?.sosCategory || "-"}
      </p>
      {fleet?.detailSOS?.description && (
        <p className="mt-3 text-xs font-semibold text-neutral-900">
          {fleet.detailSOS.description}
        </p>
      )}

      {photos.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {photos.map((image, index) => (
            <LightboxProvider key={`${image}-${index}`} images={photos}>
              <LightboxPreview
                image={image}
                index={index}
                alt={`SOS Image ${index + 1}`}
                className="h-14 w-14 rounded-md object-cover"
              />
            </LightboxProvider>
          ))}
        </div>
      )}

      <SOSAlertHeader
        category={fleet?.detailSOS?.sosCategory}
        reportTime={fleet?.detailSOS?.reportAt}
        showCategory={false}
      />
    </div>
  );
};

// ----- Main Card Component -----
export default function CardFleet({
  fleet,
  isExpanded,
  onToggleExpand,
  onOpenDriverModal,
  onOpenResponseChangeModal,
  isSOS,
  className,
}) {
  const driverName = fleet?.driver?.name;
  const phone = fleet?.driver?.phoneNumber || "-";
  const locationText = fleet?.lastLocation?.address
    ? `${fleet.lastLocation.address.district || "-"}, ${fleet.lastLocation.address.city || "-"}`
    : "Unknown";

  const cardClasses = cn(
    "group overflow-hidden rounded-lg border p-3 transition-all duration-200",
    isSOS
      ? isExpanded
        ? STATUS_STYLES.SOS.expanded
        : STATUS_STYLES.SOS.collapsed
      : isExpanded
        ? STATUS_STYLES.DEFAULT.expanded
        : STATUS_STYLES.DEFAULT.collapsed,
    className
  );

  const CollapsedContent = () => (
    <>
      {isSOS && (
        <SOSAlertHeader
          category={fleet?.detailSOS?.sosCategory}
          reportTime={fleet?.detailSOS?.reportAt}
          showCategory={true}
        />
      )}
      <div
        className={cn(
          "mt-3 grid gap-x-2 gap-y-0.5 text-sm",
          isSOS ? "grid-cols-2" : "grid-cols-2"
        )}
      >
        <DriverInfo driverName={driverName} showLabel={!isSOS} />
        <LocationInfo locationText={locationText} showLabel={!isSOS} />
      </div>
    </>
  );

  const ExpandedContent = () => {
    const showOnDuty = ["ON_DUTY", "WAITING_LOADING_TIME"].includes(
      fleet?.status
    );
    const missingDriver = !fleet?.driver?.name || !fleet?.driver?.phoneNumber;

    return (
      <div className="space-y-[12px] pt-2 text-sm">
        {isSOS && <SOSExpandedSection fleet={fleet} />}
        <DriverAndPhoneSection driverName={driverName} phone={phone} />
        <LocationAndFleetSection fleet={fleet} />

        {showOnDuty && (
          <>
            {!isSOS && <div className="border-b border-neutral-400" />}
            <div className="mt-3">
              <OnDutyDetails fleet={fleet} />
            </div>
          </>
        )}

        {missingDriver && (
          <ActionButton onClick={() => onOpenDriverModal?.(fleet)}>
            Pasangkan Driver
          </ActionButton>
        )}

        {fleet?.needsResponseChange && (
          <ActionButton onClick={() => onOpenResponseChangeModal?.(fleet)}>
            Respon Perubahan
          </ActionButton>
        )}

        {isSOS && (
          <div className="flex justify-between gap-2 pt-2">
            <Button
              variant="muattrans-primary-secondary"
              className="w-full"
              onClick={() => onOpenDriverModal?.(fleet)}
            >
              Riwayat SOS
            </Button>
            <Button
              className="w-full"
              onClick={() => onOpenDriverModal?.(fleet)}
            >
              Mengerti
            </Button>
          </div>
        )}
      </div>
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      onToggleExpand?.(fleet?.fleetId);
    }
  };

  return (
    <div className={cardClasses}>
      <div
        className="cursor-pointer"
        onClick={() => onToggleExpand?.(fleet?.fleetId)}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <CardHeader isExpanded={isExpanded} isSOS={isSOS} fleet={fleet} />
        {!isExpanded && <CollapsedContent />}
      </div>
      {isExpanded && <ExpandedContent />}
    </div>
  );
}

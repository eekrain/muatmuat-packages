"use client";

import Link from "next/link";
import { useState } from "react";

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
import RespondChangeModal from "@/container/Shared/OrderModal/RespondChangeModal";
import { cn } from "@/lib/utils";
import { getTruckIcon } from "@/lib/utils/armadaStatus";
import { formatDate } from "@/lib/utils/dateFormat";
import phoneNumberFormat from "@/lib/utils/phoneNumberFormat";

import IconComponent from "../IconComponent/IconComponent";

// Card Style berdasarkan status
const STATUS_STYLES = {
  SOS: {
    NEW: {
      expanded: "border border-error-400 bg-error-50",
      collapsed:
        "border border-transparent bg-error-50 hover:border-error-400 hover:bg-[#FFE9ED]",
    },
    ACKNOWLEDGED: {
      expanded: "border border-[#FFC217] bg-[#FFFBEB]",
      collapsed:
        "border border-gray-200 bg-white hover:border-[#FFC217] hover:bg-[#FFFBEB]",
    },
  },
  DEFAULT: {
    expanded: "border border-[#FFC217] bg-[#FFFBEB]",
    collapsed:
      "border border-gray-200 bg-white hover:border-[#FFC217] hover:bg-[#FFFBEB]",
  },
};

// Komponen Ikon Truk
const TruckIcon = ({ status }) => {
  const truck = getTruckIcon?.(status);
  return (
    <div className="flex h-8 w-8 items-center justify-center">
      <img
        src={truck}
        alt="Truck icon"
        className="h-full w-full object-contain"
        loading="lazy"
      />
    </div>
  );
};

// Indikator Perlu Respon Perubahan
const ResponseChangeIndicator = ({ isExpanded }) => (
  <InfoTooltip
    trigger={
      <div
        className={cn(
          "group flex h-6 w-6 items-center justify-center rounded-lg bg-[#FFF9C1]",
          isExpanded ? "bg-warning-800" : "group-hover:bg-warning-800"
        )}
      >
        <AlertTriangle
          className={cn(
            "h-4 w-4",
            isExpanded ? "text-white" : "text-yellow-500 group-hover:text-white"
          )}
        />
      </div>
    }
  >
    <p className="text-center">
      Pesanan Perlu <br /> Respon Perubahan
    </p>
  </InfoTooltip>
);

// Indikator SOS
const SOSIndicator = () => (
  <div className="inline-flex h-6 w-10 items-center justify-center rounded-md bg-error-400 text-xs font-semibold text-error-50">
    SOS
  </div>
);

// Waktu Laporan SOS Masuk
const TimeReportIncome = ({ reportTime }) => (
  <div className="flex items-center gap-1 text-xs text-neutral-600">
    <Clock3 className="h-4 w-4 flex-shrink-0 text-muat-trans-secondary-900" />
    <span className="w-[95px] flex-shrink-0">Laporan Masuk:</span>
    <span className="font-semibold text-neutral-900">
      {reportTime ? formatDate(reportTime, "eeee, dd LLLL yyyy, HH:mm") : "-"}
    </span>
  </div>
);

// Waktu Laporan SOS Selesai
const TimeReportCompleted = ({ reportTime }) => (
  <div className="flex items-center gap-1 text-xs text-neutral-600">
    <IconComponent src={"/icons/monitoring/circle-check.svg"} />
    <span className="w-[95px] flex-shrink-0">Laporan Selesai:</span>
    <span className="font-semibold text-neutral-900">
      {reportTime ? formatDate(reportTime, "eeee, dd LLLL yyyy, HH:mm") : "-"}
    </span>
  </div>
);

// Kategori SOS
const SOSCategory = ({ category }) => (
  <p className="text-xs font-semibold text-error-400">{category || "-"}</p>
);

// Deskripsi SOS
const SOSDescription = ({ description }) => (
  <p className="text-xs font-semibold text-neutral-900">{description}</p>
);

// Header untuk Alert SOS (saat collapsed)
const SOSAlertHeader = ({
  category,
  showCategory = true,
  reportAt,
  completedAt,
  isExpanded,
}) => (
  <div
    className={cn(
      "mt-3 flex flex-col border-b border-neutral-400 pb-3",
      isExpanded ? "gap-3" : "gap-2"
    )}
  >
    {showCategory && <SOSCategory category={category} />}
    {reportAt && <TimeReportIncome reportTime={reportAt} />}
    {completedAt && <TimeReportCompleted reportTime={completedAt} />}
  </div>
);

// Komponen Info umum dengan Tooltip
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

// Info Driver
const DriverInfo = ({ driverName, showLabel = false }) => (
  <InfoWithTooltip
    icon={User}
    label="Driver"
    value={driverName || "-"}
    showLabel={showLabel}
    className={showLabel ? "text-gray-900" : "text-neutral-900"}
  />
);

// Info Lokasi
const LocationInfo = ({ locationText, showLabel = false }) => (
  <InfoWithTooltip
    icon={MapPin}
    label="Lokasi Terakhir"
    value={locationText || "Unknown"}
    showLabel={showLabel}
    className={showLabel ? "text-gray-900" : "text-neutral-900"}
  />
);

// Foto-Foto Laporan SOS
const SOSPhotos = ({ photos = [], className }) => {
  if (!photos || photos.length === 0) return null;

  return (
    <div
      className={cn("flex flex-wrap gap-2", className)}
      onClick={(e) => e.stopPropagation()}
      aria-label="Foto Laporan SOS"
    >
      {photos.map((image, index) => (
        <LightboxProvider
          key={`${image}-${index}`}
          images={photos}
          title="Foto Laporan SOS"
        >
          <LightboxPreview
            image={image}
            index={index}
            alt={`SOS Image ${index + 1}`}
            className="h-14 w-14 rounded-md object-cover"
            variant="thumbnail"
          />
        </LightboxProvider>
      ))}
    </div>
  );
};

// Item untuk Timeline Lokasi Muat/Bongkar
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

// Header Kartu
const CardHeader = ({ isExpanded, fleet, showSOSBadge }) => (
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
      {showSOSBadge && <SOSIndicator />}
      <ChevronDown
        className={cn(
          "h-5 w-5 text-gray-400 transition-transform",
          isExpanded && "rotate-180"
        )}
      />
    </div>
  </div>
);

const DriverAndPhoneSection = ({ driverName, phone }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <DriverInfo driverName={driverName} showLabel />
    <InfoWithTooltip
      icon={Phone}
      label="No. HP Driver"
      value={phone ? phoneNumberFormat(phone) : "-"}
      showLabel
      className="text-gray-900"
    />
  </div>
);

// Bagian Info Lokasi & Tipe Armada
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

// Detail saat status ON_DUTY
const OnDutyDetails = ({ fleet }) => {
  const pickup = fleet?.activeOrder?.pickupLocation;
  const dropoff = fleet?.activeOrder?.dropoffLocation;
  const status = fleet?.status;
  const needsResponse = fleet?.needsResponseChange;

  const getStatusBadge = () => {
    if (needsResponse) {
      return (
        <div className="flex items-center rounded-md bg-warning-100 p-2 text-xs font-semibold text-warning-900">
          <AlertTriangle className="mr-2 h-3 w-3" />
          Perlu Respon Perubahan
        </div>
      );
    }
    if (status === "ON_DUTY") {
      return (
        <div className="rounded-md bg-primary-50 p-2 text-xs font-semibold text-blue-700">
          Proses Muat
        </div>
      );
    }
    if (status === "WAITING_LOADING_TIME") {
      return (
        <div className="rounded-md bg-blue-100 p-2 text-xs font-semibold text-blue-700">
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
          href={`/monitoring/order/${fleet?.activeOrder?.orderId}`} // Contoh link dinamis
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
};

// Bagian detail SOS saat diekspansi
const SOSExpandedSection = ({ fleet }) => {
  const photos = fleet?.detailSOS?.photos || [];
  const category = fleet?.detailSOS?.sosCategory;
  const description = fleet?.detailSOS?.description;
  const reportAt = fleet?.detailSOS?.reportAt;
  const completedAt = fleet?.detailSOS?.completedAt;

  return (
    <div className="flex flex-col gap-y-3">
      <SOSCategory category={category} />
      {description && <SOSDescription description={description} />}
      <SOSPhotos photos={photos} />
      <div className="flex flex-col gap-3 border-b border-neutral-400 pb-3">
        {reportAt && <TimeReportIncome reportTime={reportAt} />}
        {completedAt && <TimeReportCompleted reportTime={completedAt} />}
      </div>
    </div>
  );
};

// ----- Komponen Utama Kartu -----
export default function CardFleet({
  fleet,
  isExpanded,
  onToggleExpand,
  onOpenDriverModal,
  onOpenRiwayatSOS,
  className,
  onAcknowledge,
}) {
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);

  const driverName = fleet?.driver?.name;
  const phone = fleet?.driver?.phoneNumber;
  const locationText = fleet?.lastLocation?.address
    ? `${fleet.lastLocation.address.district || "-"}, ${
        fleet.lastLocation.address.city || "-"
      }`
    : "Unknown";

  const sosStatus = fleet?.detailSOS?.sosStatus;
  const isSOSNew = sosStatus === "NEW";

  const getCardStyle = () => {
    const state = isExpanded ? "expanded" : "collapsed";
    if (fleet?.hasSOSAlert) {
      return STATUS_STYLES.SOS[sosStatus === "NEW" ? "NEW" : "ACKNOWLEDGED"][
        state
      ];
    }
    return STATUS_STYLES.DEFAULT[state];
  };

  const cardClasses = cn(
    "group overflow-hidden rounded-lg p-3 transition-all duration-200",
    getCardStyle(),
    className
  );

  const CollapsedContent = () => (
    <>
      {fleet?.hasSOSAlert && (
        <SOSAlertHeader
          category={fleet?.detailSOS?.sosCategory}
          reportAt={fleet?.detailSOS?.reportAt}
          completedAt={fleet?.detailSOS?.completedAt}
          showCategory={true}
          isExpanded={isExpanded}
        />
      )}
      <div className={cn("mt-3 grid grid-cols-2 gap-x-2 gap-y-0.5 text-sm")}>
        <DriverInfo driverName={driverName} showLabel={!isSOSNew} />
        <LocationInfo locationText={locationText} showLabel={!isSOSNew} />
      </div>
    </>
  );

  const ExpandedContent = () => {
    const showOnDuty = ["ON_DUTY", "WAITING_LOADING_TIME"].includes(
      fleet?.status
    );
    const missingDriver = !driverName || !phone;

    const handleOpenResponseModal = (e) => {
      e.stopPropagation(); // Prevents the card from collapsing when the button is clicked
      setIsResponseModalOpen(true);
    };

    // Generic handler for actions that need to pass the fleet data up
    const handleActionClick = (e, action) => {
      e.stopPropagation();
      if (action) action(fleet);
    };

    return (
      <div className="space-y-[12px] pt-2 text-sm">
        {fleet?.hasSOSAlert && <SOSExpandedSection fleet={fleet} />}
        <DriverAndPhoneSection driverName={driverName} phone={phone} />
        <LocationAndFleetSection fleet={fleet} />
        {showOnDuty && (
          <>
            <div className="border-b border-neutral-400" />
            <OnDutyDetails fleet={fleet} />
          </>
        )}
        {missingDriver && (
          <Button
            className="w-full"
            onClick={(e) => handleActionClick(e, onOpenDriverModal)}
          >
            Pasangkan Driver
          </Button>
        )}
        {fleet?.needsResponseChange && (
          <Button
            variant="muattrans-primary"
            className="w-full"
            onClick={handleOpenResponseModal}
          >
            Respon Perubahan
          </Button>
        )}

        {sosStatus === "NEW" ? (
          <div className="flex justify-between gap-2">
            <Button
              variant="muattrans-primary-secondary"
              onClick={(e) => handleActionClick(e, onOpenRiwayatSOS)}
              className="w-1/2"
            >
              Riwayat SOS
            </Button>
            <Button
              className="w-1/2"
              onClick={(e) => handleActionClick(e, onAcknowledge)}
            >
              Mengerti
            </Button>
          </div>
        ) : fleet?.hasSOSAlert ? (
          <button
            onClick={(e) => handleActionClick(e, onOpenRiwayatSOS)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#461B02] hover:border-[#FFC217] hover:bg-[#FFFBEB]"
          >
            Riwayat SOS
          </button>
        ) : null}
      </div>
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      onToggleExpand?.(fleet?.fleetId);
    }
  };

  const orderDataForModal = fleet?.activeOrder
    ? {
        ...fleet.activeOrder,
        id: fleet.activeOrder.orderId,
      }
    : null;

  return (
    <>
      <div className={cardClasses}>
        <div
          className="cursor-pointer"
          onClick={() => onToggleExpand?.(fleet?.fleetId)}
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-expanded={isExpanded}
        >
          <CardHeader
            isExpanded={isExpanded}
            fleet={fleet}
            showSOSBadge={isSOSNew}
          />
          {!isExpanded && <CollapsedContent />}
        </div>
        {isExpanded && <ExpandedContent />}
      </div>

      <RespondChangeModal
        isOpen={isResponseModalOpen}
        onClose={() => setIsResponseModalOpen(false)}
        orderData={orderDataForModal}
      />
    </>
  );
}

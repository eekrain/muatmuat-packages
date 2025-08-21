"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Popover/Popover";
import { useTranslation } from "@/hooks/use-translation";
import { StatusArmadaTypeEnum } from "@/lib/constants/Transporter/agendaArmada/agenda.enum";
import { formatDate } from "@/lib/utils/dateFormat";
import { getAgendaScheduleDetail } from "@/services/Transporter/agenda-armada-driver/getAgendaScheduleDetail";

// import { cn } from "@/lib/utils";

const getStatusColor = (status, sos) => {
  switch (status) {
    case StatusArmadaTypeEnum.DIJADWALKAN:
    case StatusArmadaTypeEnum.MENUNGGU_JAM_MUAT:
      return "text-warning-900";
    case StatusArmadaTypeEnum.BERTUGAS:
      return sos ? "text-error-400" : "text-primary-700";
    case StatusArmadaTypeEnum.PENGIRIMAN_SELESAI:
    case StatusArmadaTypeEnum.NON_AKTIF:
      return "text-neutral-900";
    default:
      return "text-neutral-900";
  }
};

const PopoverAgenda = ({ agendaData, status, hasSosIssue }) => {
  const { t } = useTranslation();
  const [showAllItems, setShowAllItems] = useState(false);
  const router = useRouter();

  // Show only first 3 items when collapsed, all items when expanded
  const visibleItems = showAllItems
    ? agendaData.cargo || []
    : (agendaData.cargo || []).slice(0, 3);
  const hiddenItems = showAllItems ? [] : (agendaData.cargo || []).slice(3);

  // Get the actual status value - check if it's already mapped or needs mapping
  const actualStatus = StatusArmadaTypeEnum[status] || status;
  const statusColor = getStatusColor(actualStatus, hasSosIssue);
  return (
    <div className="w-[395px] max-w-[395px] rounded-lg border border-neutral-200 bg-white font-sans text-xs shadow-md">
      <div className="p-3">
        <div className="space-y-3">
          <p className={`text-xs font-semibold ${statusColor}`}>
            {t(`PopoverAgenda.status.${actualStatus}`, {}, actualStatus)}{" "}
            {hasSosIssue && actualStatus === StatusArmadaTypeEnum.BERTUGAS && (
              <span className="inline-fle ml-1 h-5 w-10 items-center justify-center rounded-md bg-error-400 px-2 py-0.5 text-xs font-semibold text-white">
                {t("PopoverAgenda.sos", {}, "SOS")}
              </span>
            )}
          </p>
          {actualStatus !== StatusArmadaTypeEnum.NON_AKTIF && (
            <>
              <div className="space-y-2">
                {hasSosIssue &&
                  actualStatus === StatusArmadaTypeEnum.BERTUGAS && (
                    <div className="flex items-center gap-2 rounded-md bg-error-50 px-2 py-1 text-xxs font-semibold text-error-400">
                      <IconComponent
                        src="/icons/warning-red.svg"
                        alt="Warning Icon"
                        width={12}
                        height={12}
                      />
                      <span className="font-medium">
                        <span className="text-neutral-600">
                          {t("PopoverAgenda.reason", {}, "Alasan")} :
                        </span>{" "}
                        <span className="text-neutral-900">
                          {agendaData.issues?.sosMessage}
                        </span>
                      </span>
                    </div>
                  )}

                <div className="flex items-center gap-2 rounded-md bg-neutral-200 px-2 py-1 text-xxs font-semibold text-neutral-900">
                  <IconComponent
                    src="/icons/calendar16.svg"
                    alt="Calendar Icon"
                    width={12}
                    height={12}
                  />
                  <span className="font-medium text-neutral-900">
                    <span className="text-neutral-600">
                      {t("PopoverAgenda.loadingTime", {}, "Waktu Muat")} :
                    </span>{" "}
                    {formatDate(agendaData.schedule?.scheduledStartTime)}{" "}
                    <span className="text-neutral-600">
                      {t("PopoverAgenda.until", {}, "s/d")}
                    </span>{" "}
                    {formatDate(agendaData.schedule?.scheduledEndTime)}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-neutral-900">
                  {agendaData.orderCode}
                </p>
                <div className="flex items-center text-xxs font-medium text-neutral-900">
                  <IconComponent
                    src="/icons/box16.svg"
                    alt="Box Icon"
                    width={12}
                    height={12}
                    className="mr-2"
                  />
                  <p>
                    {visibleItems.map((item, idx) => (
                      <span key={idx}>
                        {item.name}{" "}
                        <span className="text-neutral-600">
                          ({item.quantity} {item.unit})
                        </span>
                        {idx < visibleItems.length - 1 ? ", " : ""}
                      </span>
                    ))}
                    {hiddenItems.length > 0 && (
                      <button
                        className="ml-1 font-medium text-primary-700"
                        onClick={() => setShowAllItems(true)}
                      >
                        +{hiddenItems.length}{" "}
                        {t("PopoverAgenda.others", {}, "lainnya")}
                      </button>
                    )}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <p className="font-semibold text-neutral-900">
              {agendaData.driver?.name}
            </p>
            <div className="flex items-center text-xxs font-medium text-neutral-900">
              <IconComponent
                src="/icons/verify-whatsapp.svg"
                alt="WhatsApp Icon"
                width={12}
                height={12}
                className="mr-2"
              />
              <p className="text-xxs font-medium text-neutral-900">
                {agendaData.driver?.phoneNumber}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-neutral-900">
              {agendaData.fleet?.truckTypeName}
            </p>
            <div className="flex items-center gap-2 text-nowrap text-xxs font-medium text-neutral-900">
              <IconComponent
                src="/icons/driver-plat.svg"
                alt="Truck Icon"
                width={16}
                height={16}
              />
              <span>{agendaData.fleet?.licensePlate}</span>
              <span className="text-neutral-600">•</span>
              <IconComponent
                src="/icons/location.svg"
                alt="Location Icon"
                width={16}
                height={16}
              />
              <span className="line-clamp-1">
                {agendaData.fleet?.currentLocation?.name}
              </span>
              <span className="text-nowrap text-neutral-600">
                {t("PopoverAgenda.estimated", {}, "est.")}{" "}
                {
                  agendaData.fleet?.currentLocation
                    ?.estimatedNextDestinationDistance
                }
                {t("PopoverAgenda.km", {}, "km")} (
                {
                  agendaData.fleet?.currentLocation
                    ?.estimatedNextDestinationTime
                }
                {t("PopoverAgenda.minutes", {}, "menit")})
              </span>
            </div>
          </div>
          {actualStatus !== StatusArmadaTypeEnum.NON_AKTIF && (
            <div className="space-y-1">
              <p className="font-semibold text-neutral-900">
                {t("PopoverAgenda.travelRoute", {}, "Rute Perjalanan")}
              </p>
              <div className="flex items-center justify-between text-xxs">
                <div className="flex min-w-[127.5px] items-center gap-2">
                  <div className="size-3 rounded-full border-4 border-muat-trans-primary-400 bg-[#461B02]" />
                  <div>
                    <p className="font-medium text-neutral-600">
                      {t("PopoverAgenda.pickupLocation", {}, "Lokasi Muat")}
                    </p>
                    <p className="line-clamp-1 font-semibold text-neutral-900">
                      {agendaData.route?.loadingName}
                    </p>
                  </div>
                </div>

                <div className="relative flex min-w-[116px] flex-1 items-center text-nowrap px-2 text-[8px]">
                  <div className="w-full border-t border-dashed border-neutral-400"></div>
                  <p className="absolute left-1/2 -translate-x-1/2 rounded-md border border-neutral-400 bg-white px-2 font-semibold text-neutral-900">
                    Est. {agendaData.route?.estimatedDistanceKm} km
                  </p>
                </div>

                <div className="flex min-w-[127.5px] items-center gap-2">
                  <div className="size-3 rounded-full border-4 border-[#461B02] bg-white" />

                  <div>
                    <p className="text-xxs font-medium text-neutral-500">
                      {t("PopoverAgenda.unloadLocation", {}, "Lokasi Bongkar")}
                    </p>
                    <p className="line-clamp-1 font-semibold text-neutral-900">
                      {agendaData.route?.unloadingName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-400"></div>

      <div className="flex justify-end gap-2 p-3">
        {actualStatus !== StatusArmadaTypeEnum.PENGIRIMAN_SELESAI && (
          <Button
            variant="muattrans-primary-secondary"
            className="h-8 w-[140px] text-nowrap"
            onClick={() => router.push(`/monitoring`)}
          >
            {t("PopoverAgenda.trackFleet", {}, "Lacak Armada")}
          </Button>
        )}
        {actualStatus !== StatusArmadaTypeEnum.NON_AKTIF && (
          <Button
            variant="muattrans-primary"
            className="h-8 w-28"
            onClick={() =>
              router.push(`/monitoring/${agendaData.id}/detail-pesanan`)
            }
          >
            {t("PopoverAgenda.detail", {}, "Detail")}
          </Button>
        )}
      </div>
    </div>
  );
};

// Transformation logic is now MOVED inside this file

// FIX 1: Component now accepts all the raw props it needs for the transformation
const InfoPopover = React.memo(({ data, status, hasSosIssue }) => {
  const { t } = useTranslation();
  const [agendaScheduleDetail, setAgendaScheduleDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const getAgendaDetail = async (driverId) => {
    if (!driverId) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getAgendaScheduleDetail({ driverId });
      setAgendaScheduleDetail(result.Data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (open && !isLoading) {
      // Fetch data when popover opens and we don't have data yet
      getAgendaDetail(data.id || "uuid");
    }
  };

  const displayData = agendaScheduleDetail || data;

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button>
          <IconComponent src="/icons/info16.svg" className="text-neutral-700" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-sm text-neutral-600">
              {t("PopoverAgenda.loading", {}, "Loading...")}
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-sm text-error-400">
              {t("PopoverAgenda.failedToLoad", {}, "Failed to load data")}
            </div>
          </div>
        ) : (
          <PopoverAgenda
            agendaData={displayData}
            status={status}
            hasSosIssue={hasSosIssue}
          />
        )}
      </PopoverContent>
    </Popover>
  );
});

InfoPopover.displayName = "InfoPopover";

export default InfoPopover;

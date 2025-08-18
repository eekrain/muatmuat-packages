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
import { StatusArmadaTypeEnum } from "@/lib/constants/agendaArmada/agenda.enum";

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

const statusMapping = {
  BERTUGAS: StatusArmadaTypeEnum.BERTUGAS,
  PENGIRIMAN_SELESAI: StatusArmadaTypeEnum.PENGIRIMAN_SELESAI,
  NON_AKTIF: StatusArmadaTypeEnum.NON_AKTIF,
  MENUNGGU_JAM_MUAT: StatusArmadaTypeEnum.MENUNGGU_JAM_MUAT,
  DIJADWALKAN: StatusArmadaTypeEnum.DIJADWALKAN,
};

const PopoverAgenda = ({ agendaData }) => {
  const { t } = useTranslation();
  const [showAllItems, setShowAllItems] = useState(false);
  const router = useRouter();

  // Show only first 3 items when collapsed, all items when expanded
  const visibleItems = showAllItems
    ? agendaData.items
    : agendaData.items.slice(0, 3);
  const hiddenItems = showAllItems ? [] : agendaData.items.slice(3);
  const statusColor = getStatusColor(agendaData.status, agendaData.SOS.active);
  return (
    <div className="w-[397px] max-w-[397px] rounded-lg border border-neutral-200 bg-white font-sans text-xs shadow-md">
      <div className="p-3">
        <div className="space-y-3">
          <p className={`text-xs font-semibold ${statusColor}`}>
            {agendaData.status}{" "}
            {agendaData.SOS.active &&
              agendaData.status === StatusArmadaTypeEnum.BERTUGAS && (
                <span className="inline-fle ml-1 h-5 w-10 items-center justify-center rounded-md bg-error-400 px-2 py-0.5 text-xs font-semibold text-white">
                  SOS
                </span>
              )}
          </p>
          {agendaData.status !== StatusArmadaTypeEnum.NON_AKTIF && (
            <>
              <div className="space-y-2">
                {agendaData.SOS.active &&
                  agendaData.status === StatusArmadaTypeEnum.BERTUGAS && (
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
                          {agendaData.SOS.reason}
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
                    {agendaData.startDate}{" "}
                    <span className="text-neutral-600">
                      {t("PopoverAgenda.until", {}, "s/d")}
                    </span>{" "}
                    {agendaData.endDate}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-neutral-900">
                  {agendaData.invoice}
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
                          ({item.weight})
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
            <p className="font-semibold text-neutral-900">{agendaData.name}</p>
            <div className="flex items-center text-xxs font-medium text-neutral-900">
              <IconComponent
                src="/icons/verify-whatsapp.svg"
                alt="Box Icon"
                width={12}
                height={12}
                className="mr-2"
              />
              <p className="text-xxs font-medium text-neutral-900">
                {agendaData.phone}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-neutral-900">
              {agendaData.vehicle}
            </p>
            <div className="flex items-center gap-2 text-nowrap text-xxs font-medium text-neutral-900">
              <IconComponent
                src="/icons/driver-plat.svg"
                alt="Truck Icon"
                width={16}
                height={16}
              />
              <span>{agendaData.licensePlate}</span>
              <span className="text-neutral-600">•</span>
              <IconComponent
                src="/icons/location.svg"
                alt="Truck Icon"
                width={16}
                height={16}
              />
              <span className="line-clamp-1">{agendaData.location}</span>
              <span className="text-nowrap text-neutral-600">
                {agendaData.estimatedDistance}
              </span>
            </div>
          </div>
          {agendaData.status !== StatusArmadaTypeEnum.NON_AKTIF && (
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
                      {agendaData.route.pickup.city}
                      {agendaData.route.pickup.district
                        ? `, ${agendaData.route.pickup.district}`
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="relative flex min-w-[116px] flex-1 items-center text-nowrap px-2 text-[8px]">
                  <div className="w-full border-t border-dashed border-neutral-400"></div>
                  <p className="absolute left-1/2 -translate-x-1/2 rounded-md border border-neutral-400 bg-white px-2 font-semibold text-neutral-900">
                    {agendaData.route.estimatedDistance}
                  </p>
                </div>

                <div className="flex min-w-[127.5px] items-center gap-2">
                  <div className="size-3 rounded-full border-4 border-[#461B02] bg-white" />

                  <div>
                    <p className="text-xxs font-medium text-neutral-500">
                      {t("PopoverAgenda.unloadLocation", {}, "Lokasi Bongkar")}
                    </p>
                    <p className="line-clamp-1 font-semibold text-neutral-900">
                      {agendaData.route.delivery.city}
                      {agendaData.route.delivery.district
                        ? `, ${agendaData.route.delivery.district}`
                        : ""}
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
        {agendaData.status !== StatusArmadaTypeEnum.PENGIRIMAN_SELESAI && (
          <Button
            variant="muattrans-primary-secondary"
            className="h-8 w-[140px] text-nowrap"
            onClick={() => router.push(`/monitoring`)}
          >
            {t("PopoverAgenda.trackFleet", {}, "Lacak Armada")}
          </Button>
        )}
        {agendaData.status !== StatusArmadaTypeEnum.NON_AKTIF && (
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

const transformToAgendaData = (data) => {
  return {
    id: "123",
    status: statusMapping[data.statusCode],
    startDate: "02 Jan 2025 11:00 WIB",
    endDate: "02 Jan 2025 15:00 WIB",
    invoice: "INV/MTR/120125/0002",
    SOS: {
      reason: "Muatan perlu dipindah",
      active: data.hasSosIssue || false,
    },
    items: [
      { name: "Semen", weight: "250 kg" },
      { name: "Paku", weight: "50 kg" },
      { name: "Cat Tembok", weight: "100 kg" },
      { name: "Pipa PVC", weight: "50 kg" },
      { name: "Keramik", weight: "50 kg" },
    ],
    name: data.driverName,
    phone: "0821208991231",
    vehicle: "Colt Diesel Engkel - Box",
    licensePlate: "L 9812 AX",
    location: data.currentLocation,
    estimatedDistance: data.estimation,
    route: {
      pickup: {
        city:
          data.dataMuat?.subtitle?.split(",")[0] ||
          data.dataMuat?.subtitle ||
          "Unknown Location",
        district: data.dataMuat?.subtitle?.split(",")[1]?.trim() || "",
      },
      delivery: {
        city:
          data.dataBongkar?.subtitle?.split(",")[0] ||
          data.dataBongkar?.subtitle ||
          "Unknown Location",
        district: data.dataBongkar?.subtitle?.split(",")[1]?.trim() || "",
      },
      estimatedDistance: `Est. ${data.distanceRemaining || 0} km`,
    },
  };
};

// FIX 1: Component now accepts all the raw props it needs for the transformation
const InfoPopover = React.memo(({ data }) => {
  // FIX 2: The useMemo hook is now INSIDE this component

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <IconComponent src="/icons/info16.svg" className="text-neutral-700" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <PopoverAgenda agendaData={transformToAgendaData(data)} />
      </PopoverContent>
    </Popover>
  );
});

InfoPopover.displayName = "InfoPopover";

export default InfoPopover;

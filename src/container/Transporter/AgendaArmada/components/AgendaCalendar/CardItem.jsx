import { useMemo } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Modal,
  ModalContent,
  ModalTitle,
  ModalTrigger,
} from "@/components/Modal/Modal";
import { StatusArmadaTypeEnum } from "@/lib/constants/Transporter/agendaArmada/agenda.enum";
import { cn } from "@/lib/utils";

import ChangeFleet from "./ChangeFleet";
import EditSchedule from "./EditSchedule";
import LocationPoint from "./LocationPoint";
import InfoPopover from "./PopoverAgenda";

const cardEstimationStyles = {
  BERTUGAS: "bg-primary-50",
  PENGIRIMAN_SELESAI: "bg-neutral-200",
  NON_AKTIF: "bg-neutral-100",
  MENUNGGU_JAM_MUAT: "bg-warning-100",
  DIJADWALKAN: "bg-warning-100",
  SOS: "bg-error-50",
};

const cardAdditionalStyles = {
  BERTUGAS: "bg-primary-100",
  PENGIRIMAN_SELESAI: "bg-neutral-200",
  NON_AKTIF: "bg-neutral-100",
  MENUNGGU_JAM_MUAT: "bg-warning-200",
  DIJADWALKAN: "bg-warning-200",
  SOS: "bg-error-100",
};

const cardBorderStyles = {
  BERTUGAS: "border-primary-700",
  PENGIRIMAN_SELESAI: "border-neutral-400",
  NON_AKTIF: "border-neutral-400",
  MENUNGGU_JAM_MUAT: "border-warning-900",
  DIJADWALKAN: "border-warning-900",
  SOS: "border-error-400",
};

const titleStyles = {
  BERTUGAS: "text-primary-700",
  PENGIRIMAN_SELESAI: "text-neutral-600",
  NON_AKTIF: "text-neutral-900",
  MENUNGGU_JAM_MUAT: "text-warning-900",
  DIJADWALKAN: "text-warning-900",
  SOS: "text-error-400",
};

const LIST_SHOW_ESTIMASI_WAKTU_BONGKAR = [
  "BERTUGAS",
  "MENUNGGU_JAM_MUAT",
  "DIJADWALKAN",
];

/**
 * @typedef {Object} Fleet
 * @property {string} licensePlate - License plate of the vehicle
 * @property {string} truckTypeName - Type of the truck
 * @property {Object} currentLocation - Current location details
 * @property {string} currentLocation.name - Current location name
 * @property {number} currentLocation.estimatedNextDestinationDistance - Distance to next destination
 * @property {number} currentLocation.estimatedNextDestinationTime - Time to next destination in minutes
 */

/**
 * @typedef {Object} Driver
 * @property {string} name - Driver name
 * @property {string} phoneNumber - Driver phone number
 */

/**
 * @typedef {Object} Route
 * @property {string} loadingName - Loading location name
 * @property {string} unloadingName - Unloading location name
 * @property {number} estimatedDistanceKm - Estimated distance in kilometers
 */

/**
 * @typedef {Object} Issues
 * @property {boolean} hasSosIssue - Whether there's a SOS issue
 * @property {string} sosMessage - SOS message if any
 * @property {boolean} hasUrgentIssue - Whether there's an urgent issue
 * @property {boolean} isConflicted - Whether the schedule is conflicted
 */

/**
 * @typedef {Object} CardItemProps
 * @property {string} id - Schedule ID
 * @property {string} orderCode - Order code
 * @property {"BERTUGAS" | "PENGIRIMAN_SELESAI" | "NON_AKTIF" | "MENUNGGU_JAM_MUAT" | "DIJADWALKAN"} agendaStatus - Status of the agenda
 * @property {Fleet} fleet - Fleet information
 * @property {Driver} driver - Driver information
 * @property {Route} route - Route information
 * @property {Issues} issues - Issues information
 * @property {number} [scheduled=2] - Number of scheduled time slots
 * @property {number} [additional=1] - Number of additional time slots
 * @property {number} [position=0] - Horizontal position offset for the card
 */

/**
 * CardItem component displays a schedule delivery card with driver information, locations, and timing details.
 * The card consists of two sections: a main section and an additional section for delivery time estimation.
 *
 * @param {CardItemProps} props - The component props
 * @returns {JSX.Element} A card component showing delivery schedule information
 */
export const CardItem = ({ item, cellWidth, viewType = "armada" }) => {
  const {
    agendaStatus = "BERTUGAS",
    position = 0,
    scheduled = 2,
    additional = 1,
    hasSosIssue = false,
    estimation = {},
    firstDestinationName = "",
    lastDestinationName = "",
    estimatedTotalDistanceKm = 0,
    isConflicted = false,
    driverName = "",
    licensePlate = "",
    truckType = "",
  } = item || {};

  const cellConfig = useMemo(() => {
    const total = scheduled + additional;
    let left = scheduled;
    let right = additional;

    if (total === 1) {
      right = 0.32;
      left = 1 - right;
    } else if (additional === 0 && total % 2 === 0) {
      left = total / 2;
      right = total / 2;
    } else if (additional === 0 && total % 2 !== 0) {
      left = (total + 1) / 2;
      right = (total - 1) / 2;
    }

    return { left, right, total };
  }, [additional, scheduled]);

  return (
    <div
      className={cn("absolute h-full overflow-hidden p-0.5")}
      style={{
        width: `${(scheduled + additional) * cellWidth - 1.5}px`,
        left: `${position * cellWidth}px`,
      }}
    >
      <div
        className={cn(
          "box-border flex h-full w-full overflow-hidden rounded-[4px] border",
          cardBorderStyles[agendaStatus],
          additional > 0
            ? cardAdditionalStyles[agendaStatus]
            : cardEstimationStyles[agendaStatus],
          hasSosIssue && cardBorderStyles.SOS,
          hasSosIssue && cardEstimationStyles.SOS,
          isConflicted && cardBorderStyles.SOS,
          isConflicted && cardEstimationStyles.SOS
        )}
      >
        <div
          className={cn(
            "flex flex-col justify-between rounded-l-[4px] p-2",
            cardEstimationStyles[agendaStatus],
            hasSosIssue && cardEstimationStyles.SOS,
            isConflicted && cardEstimationStyles.SOS,
            !lastDestinationName || cellConfig.total === 1
              ? "rounded-[4px]"
              : ""
          )}
          style={{
            width: `${cellConfig.total === 1 ? 1 * cellWidth : cellConfig.left * cellWidth}px`,
          }}
        >
          {isConflicted ? (
            <>
              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap text-xxs font-bold">
                <IconComponent
                  src="/icons/agenda/conflict-sirine.svg"
                  className="size-6"
                />
                <span>Jadwal Bermasalah</span>
              </div>
              <div className="absolute bottom-2.5 left-0 w-full px-2.5">
                <Modal>
                  <ModalTrigger asChild>
                    <Button
                      variant="muatparts-error-secondary"
                      className="w-full text-xxs font-semibold md:h-7"
                    >
                      Atur Ulang
                    </Button>
                  </ModalTrigger>
                  <ModalContent className="h-[565px] w-[908]">
                    <ModalTitle className="sr-only">Ubah Armada</ModalTitle>
                    <div className="relative flex h-[70px] justify-between overflow-hidden rounded-t-xl bg-muat-trans-primary-400">
                      <div>
                        <img
                          alt="svg header modal kiri"
                          src="/img/header-modal/header-kiri.svg"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="my-auto">
                        <img
                          alt="logo muatmuat header coklat"
                          src="/img/header-modal/muatmuat-brown.svg"
                        />
                      </div>
                      <div>
                        <img
                          alt="svg header modal kanan "
                          src="/img/header-modal/header-kanan.svg"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="p-6">
                      <ChangeFleet />
                    </div>
                  </ModalContent>
                </Modal>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs font-semibold",
                    hasSosIssue ? titleStyles.SOS : titleStyles[agendaStatus]
                  )}
                >
                  {StatusArmadaTypeEnum[agendaStatus]}
                </span>

                {hasSosIssue && (
                  <span className="rounded-md bg-error-400 px-2 py-1 text-xs font-semibold leading-none text-white">
                    SOS
                  </span>
                )}

                {isConflicted && (
                  <span className="rounded-md bg-warning-400 px-2 py-1 text-xs font-semibold leading-none text-white">
                    Konflik
                  </span>
                )}
                <InfoPopover data={item} />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xxs font-bold leading-none text-neutral-900">
                  {viewType === "armada"
                    ? driverName
                    : `${licensePlate} - ${truckType}`}
                </span>
                <div className="flex items-center gap-[4.5px]">
                  <IconComponent
                    src="/icons/marker-outline.svg"
                    className="size-3 text-muat-trans-secondary-900"
                  />

                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] font-medium leading-none text-neutral-900">
                      Lokasi Terkini
                    </span>

                    {estimation?.currentLocation && (
                      <div className="flex items-center gap-1">
                        <span className="line-clamp-1 break-all text-xxs font-semibold leading-none text-neutral-900">
                          {estimation?.currentLocation}
                        </span>
                        <span className="line-clamp-1 break-all pr-2 text-xxs font-medium leading-none text-neutral-600">
                          est. {estimation?.nextDistance}km (
                          {estimation?.nextTime}
                          menit)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="relative"
                style={{ width: `${cellConfig.total * cellWidth}px` }}
              >
                <div
                  className="flex items-center gap-4"
                  style={{
                    width: `${cellConfig.left * cellWidth - 16}px`,
                  }}
                >
                  <LocationPoint
                    type="muat"
                    title="Lokasi Muat"
                    subtitle={firstDestinationName}
                    className="basis-1/2"
                  />
                  <div className="relative basis-1/2">
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-nowrap rounded-full border border-neutral-400 bg-neutral-200 px-2 py-1 text-[8px] font-semibold leading-none text-neutral-900">
                      Est. {estimatedTotalDistanceKm} km
                    </span>
                    <hr className="w-full border-dashed border-neutral-400" />
                  </div>
                </div>

                {lastDestinationName && (
                  <LocationPoint
                    type="bongkar"
                    title="Lokasi Bongkar"
                    subtitle={lastDestinationName}
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{
                      width: `${cellConfig.right * cellWidth - 16}px`,
                      left: `${cellConfig.right >= 1 ? cellConfig.left * cellWidth : cellConfig.left * cellWidth - 8}px`,
                    }}
                  />
                )}
              </div>
            </>
          )}
        </div>

        {LIST_SHOW_ESTIMASI_WAKTU_BONGKAR.includes(agendaStatus) &&
          additional > 0 &&
          cellConfig.right >= 1 && (
            <div
              className="absolute top-1/2 -translate-y-1/2 text-center text-[8px] font-medium text-neutral-500"
              style={{
                width: `${cellConfig.right * cellWidth - 16}px`,
                left: `${cellConfig.left * cellWidth + 8}px`,
              }}
            >
              Estimasi Waktu Bongkar
            </div>
          )}

        {LIST_SHOW_ESTIMASI_WAKTU_BONGKAR.includes(agendaStatus) &&
          !isConflicted && (
            <Modal>
              <ModalTrigger asChild>
                <button className="absolute right-2 top-2 flex items-center gap-1 text-[8px] text-primary-700">
                  <span>Ubah</span>
                  <IconComponent
                    src="/icons/pencil-outline.svg"
                    width={12}
                    height={12}
                  />
                </button>
              </ModalTrigger>
              <ModalContent className="h-[413px] w-[908]">
                <ModalTitle className="sr-only">
                  Ubah Estimasi Waktu Bongkar
                </ModalTitle>
                <div className="relative flex h-[70px] justify-between overflow-hidden rounded-t-xl bg-muat-trans-primary-400">
                  <div>
                    <img
                      alt="svg header modal kiri"
                      src="/img/header-modal/header-kiri.svg"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="my-auto">
                    <img
                      alt="logo muatmuat header coklat"
                      src="/img/header-modal/muatmuat-brown.svg"
                    />
                  </div>
                  <div>
                    <img
                      alt="svg header modal kanan "
                      src="/img/header-modal/header-kanan.svg"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <EditSchedule
                    cardData={{
                      agendaStatus,
                      driverName,
                      estimation,
                      firstDestinationName,
                      lastDestinationName,
                      estimatedTotalDistanceKm,
                      scheduled,
                      additional,
                      position,
                      hasSosIssue,
                      cellWidth,
                      viewType,
                      truckType,
                    }}
                  />
                </div>
              </ModalContent>
            </Modal>
          )}
      </div>
    </div>
  );
};

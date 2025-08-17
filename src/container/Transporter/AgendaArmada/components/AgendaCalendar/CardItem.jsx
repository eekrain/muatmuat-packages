import { useMemo } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

import LocationPoint from "./LocationPoint";
import InfoPopover from "./PopoverAgenda";

// Map CardItem status to PopoverAgenda status
const statusMapping = {
  BERTUGAS: "Bertugas",
  PENGIRIMAN_SELESAI: "Pengiriman Selesai",
  NON_AKTIF: "Non Aktif",
  MENUNGGU_JAM_MUAT: "Menunggu Jam Muat",
  DIJADWALKAN: "Dijadwalkan",
};

// Transform CardItem data to PopoverAgenda format
const transformToAgendaData = (cardProps) => {
  return {
    status: statusMapping[cardProps.statusCode],
    startDate: "02 Jan 2025 11:00 WIB", // Default values - should come from props
    endDate: "02 Jan 2025 15:00 WIB",
    invoice: "INV/MTR/120125/0002",
    SOS: {
      reason: "Muatan perlu dipindah",
      active: cardProps.hasSosIssue || false,
    },
    items: [
      { name: "Semen", weight: "250 kg" },
      { name: "Paku", weight: "50 kg" },
      { name: "Cat Tembok", weight: "100 kg" },
      { name: "Pipa PVC", weight: "50 kg" },
      { name: "Keramik", weight: "50 kg" },
    ],
    name: cardProps.driverName,
    phone: "0821208991231",
    vehicle: "Colt Diesel Engkel - Box",
    licensePlate: "L 9812 AX",
    location: cardProps.currentLocation,
    estimatedDistance: cardProps.estimation,
    route: {
      pickup: {
        city:
          cardProps.dataMuat?.subtitle?.split(",")[0] ||
          cardProps.dataMuat?.subtitle ||
          "Unknown Location",
        district: cardProps.dataMuat?.subtitle?.split(",")[1]?.trim() || "",
      },
      delivery: {
        city:
          cardProps.dataBongkar?.subtitle?.split(",")[0] ||
          cardProps.dataBongkar?.subtitle ||
          "Unknown Location",
        district: cardProps.dataBongkar?.subtitle?.split(",")[1]?.trim() || "",
      },
      estimatedDistance: `Est. ${cardProps.distanceRemaining || 0} km`,
    },
  };
};

const TitleEnum = {
  BERTUGAS: "Bertugas",
  PENGIRIMAN_SELESAI: "Pengiriman Selesai",
  NON_AKTIF: "Non Aktif",
  MENUNGGU_JAM_MUAT: "Menunggu Jam Muat",
  DIJADWALKAN: "Dijadwalkan",
};

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
 * @typedef {Object} LocationData
 * @property {string} title - The title/label for the location (e.g., "Lokasi Muat", "Lokasi Bongkar")
 * @property {string} subtitle - The detailed location description (e.g., "Kota Surabaya, Kec. Tegalsari")
 */

/**
 * @typedef {Object} CardItemProps
 * @property {"BERTUGAS" | "PENGIRIMAN_SELESAI" | "NON_AKTIF" | "MENUNGGU_JAM_MUAT" | "DIJADWALKAN" | "sos"} [statusCode="BERTUGAS"] - Status code that determines the title displayed
 * @property {string} [driverName="Ahmad Maulana"] - Name of the driver assigned to this schedule
 * @property {string} [currentLocation="Rest Area KM 50"] - Current location of the driver/vehicle
 * @property {string} [estimation="est. 30km (1jam 30menit)"] - Estimated distance and time to destination
 * @property {number} [distanceRemaining=121] - Remaining distance in kilometers between pickup and delivery locations
 * @property {LocationData} [dataMuat] - Object containing pickup location information
 * @property {LocationData} [dataBongkar] - Object containing delivery location information
 * @property {number} [scheduled=2] - Number of scheduled time slots (affects the width of the main card section)
 * @property {number} [additional=1] - Number of additional time slots (affects the width of the additional card section)
 * @property {number} [position=0] - Horizontal position offset for the card (multiplied by cellWidthpx)
 * @property {boolean} [hasSosIssue=false] - Whether the card has a SOS issue
 * @property {Object} [agendaData=null] - Data object for the PopoverAgenda component
 */

/**
 * CardItem component displays a DIJADWALKAN delivery card with driver information, locations, and timing details.
 * The card consists of two sections: a main DIJADWALKAN section and an additional section for delivery time estimation.
 *
 * @param {CardItemProps} props - The component props
 * @returns {JSX.Element} A card component showing delivery schedule information
 */
export const CardItem = (props) => {
  const {
    statusCode = "BERTUGAS",
    driverName = "Ahmad Maulana",
    currentLocation = "Rest Area KM 50",
    estimation = "est. 30km (1jam 30menit)",
    distanceRemaining = 121,
    dataMuat = {
      title: "Lokasi Muat",
      subtitle: "Kota Surabaya, Kec. Tegalsari",
    },
    dataBongkar = {
      title: "Lokasi Bongkar",
      subtitle: "Kab. Malang, Kec. Singosari",
    },
    scheduled = 2,
    additional = 1,
    position = 0,
    hasSosIssue = false,
    cellWidth,
  } = props;

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
  console.log("🚀 ~ CardItem ~ additional:", additional);

  return (
    <div
      className={cn("absolute h-full overflow-hidden p-0.5")}
      style={{
        width: `${(scheduled + additional) * cellWidth - 1.5}px`,
        left: `${position * cellWidth}px`,
      }}
    >
      {/* FIX: Changed to a flex container */}
      <div
        className={cn(
          "box-border flex h-full w-full overflow-hidden rounded-[4px] border",
          hasSosIssue ? cardBorderStyles.SOS : cardBorderStyles[statusCode],
          hasSosIssue
            ? cardAdditionalStyles.SOS
            : additional > 0
              ? cardAdditionalStyles[statusCode]
              : cardEstimationStyles[statusCode]
        )}
      >
        <div
          className={cn(
            "flex flex-col justify-between rounded-l-[4px] p-2",
            hasSosIssue
              ? cardEstimationStyles.SOS
              : cardEstimationStyles[statusCode],
            !dataBongkar || cellConfig.total === 1 ? "rounded-[4px]" : ""
          )}
          style={{
            width: `${cellConfig.total === 1 ? 1 * cellWidth : cellConfig.left * cellWidth}px`,
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-xs font-semibold",
                hasSosIssue ? titleStyles.SOS : titleStyles[statusCode]
              )}
            >
              {TitleEnum[statusCode]}
            </span>

            {hasSosIssue && (
              <span className="rounded-md bg-error-400 px-2 py-1 text-xs font-semibold leading-none text-white">
                SOS
              </span>
            )}
            <InfoPopover data={props} />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xxs font-bold leading-none text-neutral-900">
              {driverName}
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

                <div className="flex items-center gap-1">
                  <span className="line-clamp-1 break-all text-xxs font-semibold leading-none text-neutral-900">
                    {currentLocation}
                  </span>
                  {estimation && (
                    <span className="line-clamp-1 break-all pr-2 text-xxs font-medium leading-none text-neutral-600">
                      {estimation}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {dataMuat && (
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
                  title={dataMuat.title}
                  subtitle={dataMuat.subtitle}
                  className="basis-1/2"
                />
                <div className="relative basis-1/2">
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-nowrap rounded-full border border-neutral-400 bg-neutral-200 px-2 py-1 text-[8px] font-semibold leading-none text-neutral-900">
                    Est. {distanceRemaining} km
                  </span>
                  <hr className="w-full border-dashed border-neutral-400" />
                </div>
              </div>

              {dataBongkar && (
                <LocationPoint
                  type="bongkar"
                  title={dataBongkar.title}
                  subtitle={dataBongkar.subtitle}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{
                    width: `${cellConfig.right * cellWidth - 16}px`,
                    left: `${cellConfig.right >= 1 ? cellConfig.left * cellWidth : cellConfig.left * cellWidth - 8}px`,
                  }}
                />
              )}
            </div>
          )}
        </div>

        {LIST_SHOW_ESTIMASI_WAKTU_BONGKAR.includes(statusCode) &&
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

        {LIST_SHOW_ESTIMASI_WAKTU_BONGKAR.includes(statusCode) && (
          <button
            onClick={() => alert("Handle Ubah Estimasi Waktu Bongkar")}
            className="absolute right-2 top-2 flex items-center gap-1 text-[8px] text-primary-700"
          >
            <span>Ubah</span>
            <IconComponent
              src="/icons/pencil-outline.svg"
              width={12}
              height={12}
            />
          </button>
        )}
      </div>
    </div>
  );
};

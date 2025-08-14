import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Popover/Popover";
import PopoverAgenda from "@/components/PopoverAgenda/PopoverAgenda";
import { cn } from "@/lib/utils";

import LocationPoint from "./LocationPoint";

// Map CardItem status to PopoverAgenda status
const statusMapping = {
  bertugas: "Bertugas",
  selesai: "Pengiriman Selesai",
  nonaktif: "Non Aktif",
  menunggu_jam_muat: "Menunggu Jam Muat",
  scheduled: "Dijadwalkan",
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
      active: false,
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
          cardProps.dataMuat.subtitle.split(",")[0] ||
          cardProps.dataMuat.subtitle,
        district: cardProps.dataMuat.subtitle.split(",")[1]?.trim() || "",
      },
      delivery: {
        city:
          cardProps.dataBongkar.subtitle.split(",")[0] ||
          cardProps.dataBongkar.subtitle,
        district: cardProps.dataBongkar.subtitle.split(",")[1]?.trim() || "",
      },
      estimatedDistance: `Est. ${cardProps.distanceRemaining} km`,
    },
  };
};

const TitleEnum = {
  bertugas: "Bertugas",
  selesai: "Pengiriman Selesai",
  nonaktif: "Non Aktif",
  menunggu_jam_muat: "Menunggu Jam Muat",
  scheduled: "Dijadwalkan",
};

const cardEstimationStyles = {
  bertugas: "bg-primary-50",
  selesai: "bg-neutral-200",
  nonaktif: "bg-neutral-100",
  menunggu_jam_muat: "bg-warning-100",
  scheduled: "bg-warning-100",
};

const cardAdditionalStyles = {
  bertugas: "bg-primary-100",
  selesai: "bg-neutral-200",
  nonaktif: "bg-neutral-100",
  menunggu_jam_muat: "bg-warning-200",
  scheduled: "bg-warning-100",
};

const cardBorderStyles = {
  bertugas: "border-primary-700",
  selesai: "border-neutral-400",
  nonaktif: "border-neutral-400",
  menunggu_jam_muat: "border-warning-900",
  scheduled: "border-warning-900",
};

const titleStyles = {
  bertugas: "text-primary-700",
  selesai: "text-neutral-600",
  nonaktif: "text-neutral-900",
  menunggu_jam_muat: "text-warning-900",
  scheduled: "text-warning-900",
};

const LIST_SHOW_UBAH_BUTTON = ["bertugas", "scheduled", "menunggu_jam_muat"];

/**
 * @typedef {Object} LocationData
 * @property {string} title - The title/label for the location (e.g., "Lokasi Muat", "Lokasi Bongkar")
 * @property {string} subtitle - The detailed location description (e.g., "Kota Surabaya, Kec. Tegalsari")
 */

/**
 * @typedef {Object} CardItemProps
 * @property {"bertugas" | "selesai" | "nonaktif" | "menunggu_jam_muat" | "scheduled"} [statusCode="bertugas"] - Status code that determines the title displayed
 * @property {string} [driverName="Ahmad Maulana"] - Name of the driver assigned to this schedule
 * @property {string} [currentLocation="Rest Area KM 50"] - Current location of the driver/vehicle
 * @property {string} [estimation="est. 30km (1jam 30menit)"] - Estimated distance and time to destination
 * @property {number} [distanceRemaining=121] - Remaining distance in kilometers between pickup and delivery locations
 * @property {LocationData} [dataMuat] - Object containing pickup location information
 * @property {LocationData} [dataBongkar] - Object containing delivery location information
 * @property {number} [scheduled=2] - Number of scheduled time slots (affects the width of the main card section)
 * @property {number} [additional=1] - Number of additional time slots (affects the width of the additional card section)
 * @property {number} [position=0] - Horizontal position offset for the card (multiplied by 205px)
 */

/**
 * CardItem component displays a scheduled delivery card with driver information, locations, and timing details.
 * The card consists of two sections: a main scheduled section and an additional section for delivery time estimation.
 *
 * @param {CardItemProps} props - The component props
 * @returns {JSX.Element} A card component showing delivery schedule information
 */
export const CardItem = ({
  statusCode = "bertugas",
  driverName = "Ahmad Maulana",
  currentLocation = "Rest Area KM 50",
  estimation = "est. 30km (1jam 30menit ke titik bongkar)",
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
}) => {
  const agendaData = transformToAgendaData({
    statusCode,
    driverName,
    currentLocation,
    estimation,
    distanceRemaining,
    dataMuat,
    dataBongkar,
  });

  return (
    <div
      className={cn(
        "absolute top-1/2 h-[105px] w-full -translate-y-1/2 translate-x-[1.5px] overflow-hidden rounded-lg border font-sans",
        cardBorderStyles[statusCode]
      )}
      style={{
        width: `${(scheduled + additional) * 205}px`,
        left: `${position * 205}px`,
      }}
    >
      <div
        className={cn(
          "absolute left-0 flex h-full flex-col justify-between bg-primary-50 p-2",
          cardEstimationStyles[statusCode]
        )}
        style={{ width: `${scheduled * 205}px` }}
      >
        <div className="flex items-center gap-2">
          <span
            className={cn("text-xs font-semibold", titleStyles[statusCode])}
          >
            {TitleEnum[statusCode]}
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <button>
                <IconComponent
                  src="/icons/info16.svg"
                  className="text-neutral-700"
                />
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <PopoverAgenda agendaData={agendaData} />
            </PopoverContent>
          </Popover>
        </div>

        <span className="text-xxs font-bold text-neutral-900">
          {driverName}
        </span>

        <div className="flex items-center gap-[4.5px]">
          <IconComponent
            src="/icons/marker-outline.svg"
            className="size-3 text-muat-trans-secondary-900"
          />

          <div className="flex flex-col">
            <span className="text-[8px] font-medium text-neutral-900">
              Lokasi Terkini
            </span>

            <div className="flex items-center gap-1">
              <span className="text-xxs font-semibold text-neutral-900">
                {currentLocation}
              </span>
              <span className="text-xxs font-medium text-neutral-600">
                {estimation}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LocationPoint
            type="muat"
            title={dataMuat.title}
            subtitle={dataMuat.subtitle}
          />
          <div className="relative basis-1/2">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-400 bg-neutral-200 px-2 py-1 text-[8px] font-semibold text-neutral-900">
              Est. {distanceRemaining} km
            </span>
            <hr className="w-full border-dashed border-neutral-400" />
          </div>
        </div>
      </div>

      <div
        className={cn(
          "absolute right-0 flex h-full flex-col justify-between bg-primary-100 p-2",
          cardAdditionalStyles[statusCode]
        )}
        style={{ width: `${additional * 205}px` }}
      >
        <div className="relative h-full w-full">
          {LIST_SHOW_UBAH_BUTTON.includes(statusCode) && (
            <button
              onClick={() => alert("Handle Ubah Estimasi Waktu Bongkar")}
              className="absolute right-0 top-0 flex items-baseline gap-1 text-[8px] text-primary-700"
            >
              <span>Ubah</span>
              <IconComponent
                src="/icons/pencil-outline.svg"
                width={10}
                height={10}
                className="mt-0.5"
              />
            </button>
          )}

          {statusCode === "bertugas" && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] font-medium text-neutral-500">
              Estimasi Waktu Bongkar
            </span>
          )}

          <LocationPoint
            type="bongkar"
            className="absolute bottom-0 left-0"
            title={dataBongkar.title}
            subtitle={dataBongkar.subtitle}
          />
        </div>
      </div>
    </div>
  );
};

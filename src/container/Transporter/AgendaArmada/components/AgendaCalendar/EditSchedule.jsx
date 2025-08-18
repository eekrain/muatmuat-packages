import { useMemo, useState } from "react";

import Button from "@/components/Button/Button";
import ButtonPlusMinus from "@/components/Form/ButtonPlusMinus";
import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

// --- Helper Components (Mocks for provided CardItem) ---
// These are simplified versions of components used by CardItem for demonstration purposes.

const LocationPoint = ({ type, title, subtitle, className, style }) => (
  <div className={cn("flex items-start gap-2", className)} style={style}>
    <div
      className={cn(
        "mt-1 h-3 w-3 flex-shrink-0 rounded-full",
        type === "muat"
          ? "border border-yellow-600 bg-yellow-400"
          : "box-content border-[3px] border-neutral-900 bg-white"
      )}
    />
    <div>
      <p className="text-[10px] leading-tight text-neutral-500">{title}</p>
      <p className="text-xs font-semibold leading-tight text-neutral-900">
        {subtitle}
      </p>
    </div>
  </div>
);

const InfoPopover = ({ data }) => {
  // In a real scenario, this would be a popover component.
  // For this implementation, it's just an icon.
  return (
    <IconComponent
      src="/icons/info-outline.svg"
      className="size-4 text-primary-700"
    />
  );
};

// --- CardItem Component (Adjusted as per request) ---

const statusMapping = {
  BERTUGAS: "Bertugas",
  PENGIRIMAN_SELESAI: "Pengiriman Selesai",
  NON_AKTIF: "Non Aktif",
  MENUNGGU_JAM_MUAT: "Menunggu Jam Muat",
  DIJADWALKAN: "Dijadwalkan",
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
    showEditButton = true, // Prop to control the "Ubah" button visibility
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
      </div>
    </div>
  );
};

// --- Main Component ---

const DATES = [
  "Jumat, 10",
  "Sabtu, 11",
  "Minggu, 12",
  "Senin, 13",
  "Selasa, 14",
];

const EditSchedule = () => {
  const [days, setDays] = useState(1);
  const scheduleContainerWidth = 860;
  const cellWidth = scheduleContainerWidth / DATES.length;

  return (
    <div className="space-y-7">
      <div className="flex flex-col items-center justify-center">
        <div className="text-lg font-bold text-neutral-900">Ubah Estimasi</div>
      </div>
      <div className="flex items-center gap-8 border-neutral-200">
        <div className="text-sm font-medium text-neutral-600">
          Estimasi Waktu Bongkar
        </div>
        <div className="flex items-center gap-2">
          {/* Assuming ButtonPlusMinus is a number input with steppers */}
          <ButtonPlusMinus value={days} onChange={setDays} />
          <span className="text-sm font-medium text-neutral-900">Hari</span>
        </div>
      </div>
      <div
        className="rounded-md border border-neutral-400"
        style={{ width: `${scheduleContainerWidth}px` }}
      >
        <div className="grid h-14 grid-cols-5 items-center border-b border-neutral-200 text-center">
          {DATES.map((date, index) => (
            <div
              key={date}
              className={`text-sm font-semibold text-neutral-900 ${
                index < DATES.length - 1 ? "border-r border-neutral-200" : ""
              }`}
            >
              {date}
            </div>
          ))}
        </div>

        <div className="relative h-[68px]">
          <CardItem
            cellWidth={cellWidth}
            statusCode="BERTUGAS"
            scheduled={1}
            additional={1}
            position={0}
            distanceRemaining={121}
            dataMuat={{
              title: "Lokasi Muat",
              subtitle: "Kota Surabaya, Kec. Tegalsari",
            }}
            dataBongkar={{
              title: "Lokasi Bongkar",
              subtitle: "Kab. Malang, Kec. Singosari",
            }}
            showEditButton={false} // Hide the recursive "Ubah" button
          />
        </div>
      </div>
      <div className="flex justify-center">
        <Button variant="warning" className="w-[120px]">
          Simpan
        </Button>
      </div>
    </div>
  );
};

export default EditSchedule;

import { useMemo } from "react";

import { StatusArmadaTypeEnum } from "@/lib/constants/agendaArmada/agenda.enum";
import { cn } from "@/lib/utils";

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

export const CardDetail = ({
  statusCode = "BERTUGAS",
  distanceRemaining = 0,
  firstDestinationName = "",
  lastDestinationName = "",
  scheduled = 1,
  additional = 0,
  position = 0,
  hasSosIssue = false,
  cellWidth,
}) => {
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
            !lastDestinationName || cellConfig.total === 1
              ? "rounded-[4px]"
              : ""
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
              {StatusArmadaTypeEnum[statusCode]}
            </span>

            {hasSosIssue && (
              <span className="rounded-md bg-error-400 px-2 py-1 text-xs font-semibold leading-none text-white">
                SOS
              </span>
            )}

            <InfoPopover
              data={{
                statusCode: "BERTUGAS",
                distanceRemaining: 121,
                firstDestinationName: "",
                lastDestinationName: "",
                scheduled: 2,
                additional: 0,
                position: 0,
                hasSosIssue: false,
                cellWidth,
              }}
            />
          </div>

          {firstDestinationName && (
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
                  title={"Lokasi Muat"}
                  isEdit={true}
                  subtitle={firstDestinationName}
                  className="basis-1/2"
                />
                <div className="relative basis-1/2">
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-nowrap rounded-full border border-neutral-400 bg-neutral-200 px-2 py-1 text-[8px] font-semibold leading-none text-neutral-900">
                    Est. {distanceRemaining} km
                  </span>
                  <hr className="w-full border-dashed border-neutral-400" />
                </div>
              </div>

              {lastDestinationName && (
                <LocationPoint
                  type="bongkar"
                  title={"Lokasi Bongkar"}
                  isEdit={true}
                  subtitle={lastDestinationName}
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

        {additional > 0 && (
          <div
            className="pt-1.5 text-center text-[10px] font-medium text-neutral-500"
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

export default CardDetail;

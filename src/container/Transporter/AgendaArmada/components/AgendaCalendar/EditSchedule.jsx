import { useEffect, useMemo, useState } from "react";

import Button from "@/components/Button/Button";
import ButtonPlusMinus from "@/components/Form/ButtonPlusMinus";
import IconComponent from "@/components/IconComponent/IconComponent";
// import { formatDate } from "@/lib/utils/dateFormat";

import { StatusArmadaTypeEnum } from "@/lib/constants/Transporter/agendaArmada/agenda.enum";
import { cn } from "@/lib/utils";

import CardDetail from "./CardDetail";
import LocationPoint from "./LocationPoint";
import InfoPopover from "./PopoverAgenda";
import { getDynamicDates } from "./getDynamicDates";
import { useDateNavigator } from "./use-date-navigator";

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

export const CardItem = (props) => {
  const {
    statusCode = "BERTUGAS",

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
    additional = 0,
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
              {StatusArmadaTypeEnum[statusCode]}
            </span>

            {hasSosIssue && (
              <span className="rounded-md bg-error-400 px-2 py-1 text-xs font-semibold leading-none text-white">
                SOS
              </span>
            )}

            <InfoPopover data={props} />
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
                  isEdit={true}
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
                  isEdit={true}
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

// --- Main Component ---

const EditSchedule = ({ cardData }) => {
  const { dateRange } = useDateNavigator();

  const [days, setDays] = useState(cardData?.additional || 0);

  const [dateOffset, setDateOffset] = useState(0);
  const scheduleContainerWidth = 860;
  const scheduledDays = cardData?.scheduled || 1;

  // Calculate dates based on dateRange.start and cardData.position
  const DATES = getDynamicDates(
    dateRange.start,
    cardData?.position || 0,
    dateOffset
  );
  const cellWidth = scheduleContainerWidth / DATES.length;

  // Calculate if there's overflow
  const totalDays = scheduledDays + days;
  const hasOverflow = totalDays > 5;
  const maxOffset = Math.max(0, totalDays - 5);
  const cardPosition = 0 - dateOffset; // Shift card left when dates shift right

  // Auto-follow the last estimate when days change
  useEffect(() => {
    if (hasOverflow) {
      // Set dateOffset to show the last estimate date
      setDateOffset(maxOffset);
    } else {
      // Reset to start when no overflow
      setDateOffset(0);
    }
  }, [days, hasOverflow, maxOffset]);

  // Navigation handlers
  const canNavigateLeft = dateOffset > 0;
  const canNavigateRight = dateOffset < maxOffset;

  const handleNavigateLeft = () => {
    if (canNavigateLeft) {
      setDateOffset(dateOffset - 1);
    }
  };

  const handleNavigateRight = () => {
    if (canNavigateRight) {
      setDateOffset(dateOffset + 1);
    }
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col items-center justify-center">
        <div className="font-bold text-neutral-900">Ubah Estimasi</div>
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
        className="relative overflow-hidden rounded-md border border-neutral-400"
        style={{ width: `${scheduleContainerWidth}px` }}
      >
        <div className="grid h-14 grid-cols-5 items-center border-b text-center">
          {DATES.map((date, index) => (
            <div
              key={date}
              className={`text-sm font-semibold text-neutral-900 ${
                index < DATES.length - 1 ? "border-neutral-200" : ""
              }`}
            >
              {date}
            </div>
          ))}
        </div>
        <div className="absolute top-3 flex w-full items-center justify-between gap-4 px-2">
          <div className="flex justify-start">
            {hasOverflow && (
              <button
                type="button"
                onClick={handleNavigateLeft}
                disabled={!canNavigateLeft}
                className="flex size-8 items-center justify-center rounded-full bg-white shadow-md disabled:cursor-not-allowed"
              >
                <IconComponent
                  src="/icons/chevron-left16-2.svg"
                  width={16}
                  height={16}
                />
              </button>
            )}
          </div>
          <div className="flex justify-end">
            {hasOverflow && (
              <button
                type="button"
                onClick={handleNavigateRight}
                disabled={!canNavigateRight}
                className="flex size-8 items-center justify-center rounded-full bg-white shadow-md disabled:cursor-not-allowed"
              >
                <IconComponent
                  src="/icons/chevron-right16-2.svg"
                  width={16}
                  height={16}
                />
              </button>
            )}
          </div>
        </div>

        <div className="relative grid h-[68px] grid-cols-5 overflow-visible border-r">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-r border-neutral-200"></div>
          ))}

          <CardDetail
            key={`card-${days}-${scheduledDays}`}
            cellWidth={cellWidth}
            statusCode={cardData?.agendaStatus}
            firstDestinationName={cardData?.firstDestinationName}
            lastDestinationName={cardData?.lastDestinationName}
            scheduled={cardData?.scheduled || 1}
            additional={days}
            position={cardPosition}
            distanceRemaining={cardData?.estimatedTotalDistanceKm}
            hasSosIssue={cardData?.hasSosIssue || false}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <Button className="w-[112px]">Simpan</Button>
      </div>
    </div>
  );
};

export default EditSchedule;

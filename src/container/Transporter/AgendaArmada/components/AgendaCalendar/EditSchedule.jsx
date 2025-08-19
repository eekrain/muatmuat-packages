import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import ButtonPlusMinus from "@/components/Form/ButtonPlusMinus";
import IconComponent from "@/components/IconComponent/IconComponent";

// import { formatDate } from "@/lib/utils/dateFormat";

import CardDetail from "./CardDetail";
import { getDynamicDates } from "./getDynamicDates";
import { useDateNavigator } from "./use-date-navigator";

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

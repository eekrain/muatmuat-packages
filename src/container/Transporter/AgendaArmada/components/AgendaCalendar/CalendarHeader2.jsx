import IconComponent from "@/components/IconComponent/IconComponent";

import { ButtonTab } from "./ButtonTab";
import { useAgendaNavigatorStore } from "./agendaNavigatorStore";
import { useDateNavigator } from "./use-date-navigator";

export const CalendarHeader2 = () => {
  const { viewType, setViewType, summary } = useAgendaNavigatorStore();
  const { displayedDates, handleNext, handlePrev } = useDateNavigator();

  const handleViewChange = async (newViewType) => {
    await setViewType(newViewType);
  };

  return (
    <div className="grid h-[56px] w-full grid-cols-[202px_1fr] border-b border-neutral-300 shadow-md">
      <div className="flex h-full items-center gap-2 px-3">
        <ButtonTab
          active={viewType === "armada"}
          onClick={() => handleViewChange("armada")}
        >
          Armada
        </ButtonTab>
        <ButtonTab
          active={viewType === "driver"}
          onClick={() => handleViewChange("driver")}
        >
          Driver
        </ButtonTab>
      </div>

      <div className="relative grid h-full grid-cols-5 items-center justify-center border-l border-neutral-300">
        {displayedDates?.map((item, index) => {
          // Get count and conflict status for this day from summary data
          const dayCount = summary?.countPerDay?.[index] || 0;
          const hasConflict = summary?.countConflictedPerDay?.[index] || false;

          return (
            <div
              key={item.fullDate}
              className="flex items-center justify-center gap-2 py-2 text-sm font-semibold"
            >
              {hasConflict && (
                <IconComponent
                  src="/icons/agenda/conflict-sirine.svg"
                  className="size-6"
                />
              )}
              <span>{`${item.day}, ${item.date}`}</span>
              <div className="flex items-center justify-center rounded-full border border-neutral-400 bg-neutral-200 px-2 py-[4px] text-xxs font-medium text-neutral-700">
                {dayCount}
              </div>
            </div>
          );
        })}

        <button
          onClick={handlePrev}
          className="absolute left-[11px] top-1/2 flex size-8 flex-none -translate-y-1/2 items-center justify-center rounded-full border border-neutral-300 bg-white shadow-sm hover:bg-neutral-100"
          aria-label="Previous dates"
        >
          <IconComponent
            src="/icons/agenda/chevron-left-sharp.svg"
            width={7}
            height={14}
            className="text-neutral-900"
          />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-[11px] top-1/2 flex size-8 flex-none -translate-y-1/2 items-center justify-center rounded-full border border-neutral-300 bg-white shadow-sm"
          aria-label="Next dates"
        >
          <IconComponent
            src="/icons/agenda/chevron-right-sharp.svg"
            width={7}
            height={14}
            className="text-neutral-900"
          />
        </button>
      </div>
    </div>
  );
};

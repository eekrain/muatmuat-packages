import { useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { ButtonTab } from "./ButtonTab";

// Mock data to represent the dates shown in the UI
const dateData = [
  { id: 1, day: "Jumat", date: 10, count: 3 },
  { id: 2, day: "Sabtu", date: 11, count: 4 },
  { id: 3, day: "Minggu", date: 12, count: 4 },
  { id: 4, day: "Senin", date: 13, count: 0 },
  { id: 5, day: "Selasa", date: 14, count: 2 },
];

export const CalendarHeader2 = () => {
  const [activeView, setActiveView] = useState("armada");

  return (
    <div className="grid h-[56px] w-full grid-cols-[202px_1fr] shadow-md">
      <div className="flex h-full items-center gap-2 border-r border-neutral-300 px-3">
        <ButtonTab
          active={activeView === "armada"}
          onClick={() => setActiveView("armada")}
        >
          Armada
        </ButtonTab>
        <ButtonTab
          active={activeView === "driver"}
          onClick={() => setActiveView("driver")}
        >
          Driver
        </ButtonTab>
      </div>

      {/* Date Scroller */}
      <div className="relative grid h-full grid-cols-5 items-center justify-center">
        {dateData.map((item) => {
          return (
            <div
              key={item.id}
              className="flex items-center justify-center gap-2 py-2 text-sm font-semibold"
            >
              <span>{`${item.day}, ${item.date}`}</span>
              {item.count > 0 && (
                <div className="flex items-center justify-center rounded-full border border-neutral-400 bg-neutral-200 px-2 py-[4px] text-xxs font-medium text-neutral-700">
                  {item.count}
                </div>
              )}
            </div>
          );
        })}

        <button
          onClick={() => {}}
          className="absolute left-[11px] top-1/2 flex size-8 flex-none -translate-y-1/2 items-center justify-center rounded-full border border-neutral-300 bg-white shadow-sm hover:bg-neutral-100"
          aria-label="Previous dates"
        >
          <ChevronLeft className="-ml-0.5 h-5 w-5 text-neutral-900" />
        </button>
        <button
          onClick={() => {}}
          className="absolute right-[11px] top-1/2 flex size-8 flex-none -translate-y-1/2 items-center justify-center rounded-full border border-neutral-300 bg-white shadow-sm"
          aria-label="Next dates"
        >
          <ChevronRight className="ml-0.5 h-5 w-5 text-neutral-900" />
        </button>
      </div>
    </div>
  );
};

import React from "react";

import { useClientWidth } from "@/hooks/use-client-width";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

import { AgendaRowItem } from "./AgendaRowItem";
import { CalendarHeader1 } from "./CalendarHeader1";
import { CalendarHeader2 } from "./CalendarHeader2";
import { useDateNavigator } from "./agenda-provider";

const DEBUG_PREFIX = "[AGENDA_DEBUG]";

export const AgendaCalendar = ({
  data = [],
  onLoadMore,
  isLoadingMore,
  isReachingEnd,
}) => {
  console.log(`${DEBUG_PREFIX} AgendaCalendar component rendering.`);
  return (
    <div className="w-full rounded-xl bg-white shadow-[0px_4px_11px_rgba(65,65,65,0.25)]">
      <CalendarHeader1 />
      <CalendarHeader2 />
      <Content
        data={data}
        onLoadMore={onLoadMore}
        isLoadingMore={isLoadingMore}
        isReachingEnd={isReachingEnd}
      />
    </div>
  );
};

export const Content = ({ data, onLoadMore, isLoadingMore, isReachingEnd }) => {
  const { currentDayIndex } = useDateNavigator();
  const { width: containerWidth, ref } = useClientWidth();

  const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "20px",
  });

  React.useEffect(() => {
    if (isIntersecting && !isLoadingMore && !isReachingEnd && onLoadMore) {
      onLoadMore();
    }
  }, [isIntersecting, isLoadingMore, isReachingEnd, onLoadMore]);

  const SIDEBAR_WIDTH = 202;
  const DAY_COLUMNS = 5;
  const cellWidth =
    containerWidth > SIDEBAR_WIDTH
      ? (containerWidth - SIDEBAR_WIDTH) / DAY_COLUMNS - 1
      : 0;

  return (
    <div className="h-[calc(100dvh-295px)] pr-0.5">
      <div ref={ref} className="relative h-full w-full">
        <div className="absolute inset-0 divide-y overflow-y-auto">
          {data.map((item, index) => (
            <AgendaRowItem key={index} armada={item} cellWidth={cellWidth} />
          ))}

          {!isReachingEnd && (
            <div ref={loadMoreRef} className="h-4 w-full">
              {isLoadingMore && (
                <div className="flex items-center justify-center py-4">
                  <div className="text-sm text-gray-500">Loading more...</div>
                </div>
              )}
            </div>
          )}
        </div>

        {currentDayIndex > 0 && (
          <>
            <div
              className="absolute top-0 -translate-x-1/2"
              style={{
                left:
                  SIDEBAR_WIDTH + (currentDayIndex * cellWidth + cellWidth / 2),
              }}
            >
              <svg
                width="30"
                height="6"
                viewBox="0 0 30 6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 0 0 L 6 0 L 12 3.75 Q 15 6 18 3.75 L 24 0 L 30 0 Z"
                  fill="#1E73DC"
                />
              </svg>
            </div>
            <div
              className="absolute top-0 h-px bg-primary-700"
              style={{
                width: cellWidth,
                left: SIDEBAR_WIDTH + currentDayIndex * cellWidth,
              }}
            />
            <div
              className="absolute top-0 h-full w-px -translate-x-1/2 bg-primary-700"
              style={{
                left:
                  SIDEBAR_WIDTH + currentDayIndex * cellWidth + cellWidth / 2,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

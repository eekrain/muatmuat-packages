import { memo, useCallback, useMemo } from "react";

import Button from "@/components/Button/Button";
import NestedDropdown from "@/components/Dropdown/NestedDropdown";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useGetAvailableSchedulePeriods } from "@/services/Transporter/agenda-armada-driver/getAvailableSchedulePeriods";

import { useDateNavigator } from "./agenda-provider";

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

// Memoized Period Dropdown Component
const PeriodDropdown = memo(({ availableMonths, onMonthClick }) => {
  const availableYears = useMemo(
    () => Object.keys(availableMonths),
    [availableMonths]
  );

  const getAvailableMonthsForYear = useCallback(
    (year) => {
      const monthNumbers = availableMonths[year] || [];
      return monthNumbers.map((monthNum) => months[monthNum - 1]);
    },
    [availableMonths]
  );

  const hasAvailablePeriods = availableYears.length > 0;

  return (
    <NestedDropdown.Root>
      <NestedDropdown.Trigger>
        <button
          type="button"
          className="text-[10px] font-semibold leading-tight text-primary-700 hover:text-primary-800 disabled:cursor-not-allowed disabled:text-gray-400"
          disabled={!hasAvailablePeriods}
          aria-label="Change period"
        >
          Ubah Periode
        </button>
      </NestedDropdown.Trigger>
      {hasAvailablePeriods && (
        <NestedDropdown.Content>
          <div className="flex flex-col gap-1">
            {availableYears.map((year) => {
              const availableMonthsForYear = getAvailableMonthsForYear(year);
              return (
                <NestedDropdown.Item
                  key={year}
                  subContent={
                    <NestedDropdown.SubContent>
                      {availableMonthsForYear.map((month) => (
                        <NestedDropdown.SubItem
                          key={month}
                          onClick={() => onMonthClick(year, month)}
                        >
                          {month}
                        </NestedDropdown.SubItem>
                      ))}
                    </NestedDropdown.SubContent>
                  }
                >
                  {year}
                </NestedDropdown.Item>
              );
            })}
          </div>
        </NestedDropdown.Content>
      )}
    </NestedDropdown.Root>
  );
});

PeriodDropdown.displayName = "PeriodDropdown";

// Memoized Search Section Component
const SearchSection = memo(() => (
  <div className="flex h-full items-center gap-3 p-3">
    <Input
      placeholder="Cari No. Polisi atau Nama Driver"
      icon={{ left: "/icons/search16.svg" }}
      appearance={{
        containerClassName: "w-[262px]",
      }}
    />
    <Input
      placeholder="Filter"
      icon={{ right: "/icons/filter16.svg" }}
      appearance={{
        containerClassName: "w-[104px]",
      }}
    />
  </div>
));

SearchSection.displayName = "SearchSection";

// Memoized Navigation Section Component
const NavigationSection = memo(
  ({
    displayMonthYear,
    handlePrevMonth,
    handleNextMonth,
    isCanPrevMonth,
    isCanNextMonth,
    availableMonths,
    onMonthClick,
  }) => (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-2 p-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous Month"
          className="flex h-5 w-5 items-center justify-center rounded hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handlePrevMonth}
          disabled={!isCanPrevMonth}
        >
          <IconComponent
            src="/icons/agenda/chevron-left-rounded.svg"
            width={7}
            height={12}
            className="text-neutral-900"
          />
        </button>
        <h2 className="text-center text-lg font-semibold text-neutral-900">
          {displayMonthYear}
        </h2>
        <button
          type="button"
          aria-label="Next Month"
          className="flex h-5 w-5 items-center justify-center rounded hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleNextMonth}
          disabled={!isCanNextMonth}
        >
          <IconComponent
            src="/icons/agenda/chevron-right-rounded.svg"
            width={7}
            height={12}
            className="text-neutral-900"
          />
        </button>
      </div>
      <PeriodDropdown
        availableMonths={availableMonths}
        onMonthClick={onMonthClick}
      />
    </div>
  )
);

NavigationSection.displayName = "NavigationSection";

// Memoized Today Button Component
const TodayButton = memo(({ isTodayNotInView, setDate, todayDate }) => (
  <div className="flex h-full w-[415px] items-center justify-end p-3">
    <Button
      className="text-xxs md:h-7"
      disabled={!isTodayNotInView}
      onClick={() => setDate(todayDate)}
      variant="muatparts-primary"
    >
      Kembali Ke Hari Ini
    </Button>
  </div>
));

TodayButton.displayName = "TodayButton";

export const CalendarHeader1 = memo(() => {
  const {
    isTodayNotInView,
    setDate,
    setMonth,
    displayMonthYear,
    handleNextMonth,
    handlePrevMonth,
    isCanNextMonth,
    isCanPrevMonth,
    todayDate,
  } = useDateNavigator();

  const { data: periodsData } = useGetAvailableSchedulePeriods();

  const handleMonthClick = useCallback(
    (year, month) => {
      const monthIndex = months.indexOf(month) + 1;
      setMonth(parseInt(year), monthIndex);
    },
    [setMonth]
  );

  const availableMonths = useMemo(
    () => periodsData?.Data?.availableMonths || {},
    [periodsData?.Data?.availableMonths]
  );

  return (
    <header className="flex h-14 w-full items-center border-b border-neutral-400">
      <SearchSection />
      <NavigationSection
        displayMonthYear={displayMonthYear}
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
        isCanPrevMonth={isCanPrevMonth}
        isCanNextMonth={isCanNextMonth}
        availableMonths={availableMonths}
        onMonthClick={handleMonthClick}
      />
      <TodayButton
        isTodayNotInView={isTodayNotInView}
        setDate={setDate}
        todayDate={todayDate}
      />
    </header>
  );
});

CalendarHeader1.displayName = "CalendarHeader1";

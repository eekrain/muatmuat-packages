import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";

/**
 * @name LacakArmadaHeader
 * @description Header component for the fleet tracking page, including search, filter, date navigation, and a 'today' button.
 * @returns {JSX.Element}
 */
export const CalendarHeader1 = () => {
  return (
    <header className="flex h-14 w-full items-center border-b border-neutral-400">
      {/* Left Section: Search and Filter */}
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

      {/* Center Section: Date Navigation */}
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-2 p-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous Month"
            className="flex h-5 w-5 items-center justify-center"
          >
            <IconComponent
              src="/icons/chevron-left-gray.svg"
              alt="Previous Month"
              className="h-full w-full"
            />
          </button>
          <h2 className="w-[110px] text-center text-lg font-semibold text-neutral-900">
            Januari 2025
          </h2>
          <button
            type="button"
            aria-label="Next Month"
            className="flex h-5 w-5 items-center justify-center"
          >
            <IconComponent
              src="/icons/chevron-right-gray.svg"
              alt="Next Month"
              className="h-full w-full"
            />
          </button>
        </div>
        <button
          type="button"
          className="text-[10px] font-semibold leading-tight text-primary-700"
        >
          Ubah Periode
        </button>
      </div>

      {/* Right Section: Today Button */}
      <div className="flex h-full w-[415px] items-center justify-end p-3">
        <button
          type="button"
          className="flex h-7 items-center rounded-2xl bg-neutral-200 px-3 py-1.5"
        >
          <span className="text-[10px] font-semibold text-neutral-600">
            Kembali Ke Hari Ini
          </span>
        </button>
      </div>
    </header>
  );
};

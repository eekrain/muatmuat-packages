import { useEffect, useRef, useState } from "react";

import { Plus } from "lucide-react";
import Calendar from "react-calendar";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import Input from "@/components/Input/Input";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { formatDateInput } from "@/lib/utils/dateFormat";

import "./Calendar.css";

/* ------------------------- Helpers & Constants ------------------------- */

// Normalisasi tanggal ke awal hari (agar perbandingan inklusif)
const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const MIN_DATE = startOfDay(new Date(2000, 0, 1));
const TODAY = startOfDay(new Date()); // <- hari ini inklusif

// YYYY-MM-DD
const toISO = (date) => {
  const d = startOfDay(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// untuk tampilan, mengikuti util yang sudah ada
const toDisplay = (date) =>
  formatDateInput(date, ["day", "month", "year"], false);

const addYears = (date, n) => {
  const d = startOfDay(date);
  d.setFullYear(d.getFullYear() + n);
  return startOfDay(d);
};
const clamp = (date, min, max) =>
  new Date(
    Math.min(
      Math.max(startOfDay(date).getTime(), startOfDay(min).getTime()),
      startOfDay(max).getTime()
    )
  );

// Parser fallback dari display ke ISO (jaga kompatibilitas jika ada string masuk)
const formatToISODate = (dateStr) => {
  if (!dateStr) return "";
  const dashParts = dateStr.split("-");
  if (dashParts.length === 3)
    return `${dashParts[2]}-${dashParts[1]}-${dashParts[0]}`;
  const slashParts = dateStr.split("/");
  if (slashParts.length === 3)
    return `${slashParts[2]}-${slashParts[1]}-${slashParts[0]}`;
  return dateStr;
};

/* ----------------------------- Component ------------------------------- */

const Period = ({
  options = [],
  recentSelections = [],
  onSelect,
  disable = false,
  value = null,
  width = "w-[202px]",
}) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(
    options[0] || { name: "Select an option", value: "" }
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isPeriode, setIsPeriode] = useState(false);

  // gunakan string untuk pesan error -> lebih fleksibel
  const [validate, setValidate] = useState({
    start_date: "",
    end_date: "",
  });

  // simpan display & ISO agar API gampang
  const [inputDateCustom, setInputDateCustom] = useState({
    status: null, // 'start_date' | 'end_date' | null
    start_date: "",
    end_date: "",
    start_iso: "",
    end_iso: "",
  });

  const dropdownRef = useRef(null);

  /* -------------------------- Initial & External -------------------------- */

  useEffect(() => {
    setSelected(options[0]);
  }, [JSON.stringify(options)]);

  // mengakomodasi kontrol dari parent
  useEffect(() => {
    if (value !== null) {
      if (typeof value === "string") {
        const matchingOption = options.find((opt) => opt.value === value);
        if (matchingOption) setSelected(matchingOption);
        else if (value === "")
          setSelected(options[0] || { name: "Select an option", value: "" });
      } else if (typeof value === "object") {
        setSelected(value);
      }
    }
  }, [value, options]);

  /* ------------------------------ Handlers ------------------------------- */

  const handleSelect = (option, range) => {
    if (range) {
      const formattedOption = {
        ...option,
        start_date: option?.start_date ?? inputDateCustom.start_date,
        end_date: option?.end_date ?? inputDateCustom.end_date,
        iso_start_date:
          option?.iso_start_date ??
          inputDateCustom.start_iso ??
          formatToISODate(inputDateCustom.start_date),
        iso_end_date:
          option?.iso_end_date ??
          inputDateCustom.end_iso ??
          formatToISODate(inputDateCustom.end_date),
        range: true,
      };
      setSelected(formattedOption);
      setIsOpen(false);
      onSelect && onSelect(formattedOption);
    } else {
      setSelected(option);
      setIsOpen(false);
      onSelect && onSelect(option);
    }
  };

  const resetValue = () => {
    setInputDateCustom({
      status: null,
      start_date: "",
      end_date: "",
      start_iso: "",
      end_iso: "",
    });
    setValidate({ start_date: "", end_date: "" });
  };

  useEffect(() => {
    if (isPeriode) resetValue();
  }, [isPeriode]);

  // click di luar menutup dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  /* -------------------------- Calendar Boundaries ------------------------- */

  // batas min/max kalender bergantung field aktif
  const calendarBounds = () => {
    if (inputDateCustom.status === "start_date") {
      const max = inputDateCustom.end_iso
        ? startOfDay(new Date(inputDateCustom.end_iso))
        : TODAY; // ≤ TODAY, tetap pilih hari ini
      return { min: MIN_DATE, max };
    }
    if (inputDateCustom.status === "end_date") {
      const start = inputDateCustom.start_iso
        ? startOfDay(new Date(inputDateCustom.start_iso))
        : MIN_DATE;
      const max = inputDateCustom.start_iso
        ? clamp(addYears(start, 1), MIN_DATE, TODAY) // maksimum 1 tahun dari start, tapi tidak melewati TODAY
        : TODAY;
      return { min: start, max };
    }
    return { min: MIN_DATE, max: TODAY };
  };

  // disable tanggal yang melanggar aturan rentang 1 tahun
  const tileDisabledByRange = ({ date }) => {
    const d = startOfDay(date);
    if (inputDateCustom.status === "end_date" && inputDateCustom.start_iso) {
      const start = startOfDay(new Date(inputDateCustom.start_iso));
      return d > clamp(addYears(start, 1), MIN_DATE, TODAY) || d < start;
    }
    if (inputDateCustom.status === "start_date" && inputDateCustom.end_iso) {
      const end = startOfDay(new Date(inputDateCustom.end_iso));
      return d > end || d < addYears(end, -1) || d < MIN_DATE;
    }
    const { min, max } = calendarBounds();
    return d < min || d > max;
  };

  // pilih tanggal dari kalender (auto-normalisasi end jika perlu)
  const handleCalendarChange = (date) => {
    const dd = startOfDay(date);
    const display = toDisplay(dd);
    const iso = toISO(dd);

    setValidate((v) => ({ ...v, [inputDateCustom.status]: "" }));

    if (inputDateCustom.status === "start_date") {
      let endISO = inputDateCustom.end_iso;
      if (endISO) {
        const start = startOfDay(new Date(iso));
        const maxEnd = clamp(addYears(start, 1), MIN_DATE, TODAY);
        if (startOfDay(new Date(endISO)) < start) endISO = iso;
        if (startOfDay(new Date(endISO)) > maxEnd) endISO = toISO(maxEnd);
      }
      setInputDateCustom((a) => ({
        ...a,
        start_date: display,
        start_iso: iso,
        end_date: endISO ? toDisplay(startOfDay(new Date(endISO))) : a.end_date,
        end_iso: endISO ?? a.end_iso,
        status: null,
      }));
    } else if (inputDateCustom.status === "end_date") {
      const startISO = inputDateCustom.start_iso || iso;
      const start = startOfDay(new Date(startISO));
      const minEnd = start;
      const maxEnd = clamp(addYears(start, 1), MIN_DATE, TODAY);
      const safeEnd = clamp(dd, minEnd, maxEnd);

      setInputDateCustom((a) => ({
        ...a,
        start_date: a.start_iso ? a.start_date : toDisplay(start),
        start_iso: a.start_iso || toISO(start),
        end_date: toDisplay(safeEnd),
        end_iso: toISO(safeEnd),
        status: null,
      }));
    }
  };

  /* -------------------------------- Render -------------------------------- */
  const formatShortWeekday = (locale, date) => {
    const weekdays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    return weekdays[date.getDay()];
  };
  // common props kalender (styling + locale + header)
  const calendarCommonProps = {
    locale: "id-ID",
    navigationLabel: ({ date }) =>
      date.toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
    showNeighboringMonth: false,
    className:
      "calendar-muattrans rounded-lg !border !border-neutral-300 !bg-white p-3 shadow-lg !w-[328px]",
    tileDisabled: tileDisabledByRange,
    formatShortWeekday: formatShortWeekday,
  };

  return (
    <div className={cn("relative text-neutral-900", width)} ref={dropdownRef}>
      <button
        disabled={disable}
        className={cn(
          "flex h-8 w-full items-center justify-between gap-x-2 rounded-lg border px-3 py-2",
          !disable
            ? "bg-neutral-50 text-neutral-900"
            : "cursor-not-allowed bg-neutral-200 text-neutral-600",
          isOpen ? "border-primary-700" : "border-neutral-600",
          "hover:border-primary-700"
        )}
        onClick={() => (!disable ? setIsOpen(!isOpen) : "")}
      >
        <span className="medium-xs truncate">
          {selected.name?.replace?.("(Default)", "")}
        </span>
        <IconComponent
          className={cn(
            "transition-transform duration-200 ease-in-out",
            isOpen && "rotate-180"
          )}
          src="/icons/chevron-down.svg"
        />
      </button>

      {isOpen && (
        <ul className="absolute z-20 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg">
          {options.map((option) => (
            <li
              key={option.value}
              className={cn(
                "cursor-pointer px-[10px] py-2 hover:bg-neutral-200",
                selected?.value === option?.value ? "semi-xs" : "medium-xs"
              )}
              onClick={() => handleSelect(option)}
            >
              <div className="flex w-full items-center justify-between">
                <span className="line-clamp-1">{option.name}</span>
                {selected?.value === option?.value && (
                  <IconComponent
                    className="icon-stroke-primary-700"
                    src="/icons/check16.svg"
                  />
                )}
              </div>
            </li>
          ))}
          <hr className="border-neutral-400" />
          <li
            className="cursor-pointer px-[10px] py-2 font-medium"
            onClick={() => setIsPeriode(true)}
          >
            <div className="flex w-full gap-2">
              <Plus width={15} height={15} className="text-primary-700" />
              <span className="medium-xs">
                {t("AppMuatpartsAnalisaProdukPilihPeriode")}
              </span>
            </div>
          </li>

          {recentSelections.length > 0 && (
            <>
              <hr className="border-gray-200" />
              <li className="medium-xs px-[10px] py-2 text-neutral-600">
                Terakhir Dicari
              </li>
              {recentSelections.map((option) => (
                <li
                  key={option.value}
                  className={cn(
                    "cursor-pointer px-[10px] py-2 hover:bg-neutral-200",
                    selected?.value === option?.value ? "semi-xs" : "medium-xs"
                  )}
                  onClick={() => handleSelect(option, true)}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="line-clamp-1">{option.name}</span>
                    {selected?.value === option?.value && (
                      <IconComponent
                        className="icon-stroke-primary-700"
                        src="/icons/check16.svg"
                      />
                    )}
                  </div>
                </li>
              ))}
            </>
          )}
        </ul>
      )}

      {/* Modal Pilih Periode */}
      <Modal open={isPeriode} onOpenChange={setIsPeriode} closeOnOutsideClick>
        <ModalContent type="muattrans" className="w-modal-small">
          <ModalHeader size="small" />
          <div className="flex flex-col items-center gap-6 px-4 py-7">
            <h3 className="bold-base text-center">
              {t("AppMuatpartsAnalisaProdukPilihPeriode")}
            </h3>

            <div className="relative flex items-start gap-2">
              {/* Periode Awal */}
              <div className="relative">
                <Input
                  value={inputDateCustom.start_date}
                  onClick={() =>
                    setInputDateCustom((a) => ({ ...a, status: "start_date" }))
                  }
                  onChange={() => {}}
                  classInput="w-full"
                  status={validate.start_date ? "error" : undefined}
                  className="!w-[136px] max-w-none"
                  placeholder={t("AppMuatpartsAnalisaProdukPeriodeAwal")}
                  icon={{
                    right: <IconComponent src={"/icons/calendar16.svg"} />,
                  }}
                  supportiveText={{ title: validate.start_date, desc: "" }}
                />

                {inputDateCustom.status === "start_date" && (
                  <div className="absolute left-0 top-10 z-30">
                    <Calendar
                      {...calendarCommonProps}
                      onChange={handleCalendarChange}
                      value={
                        inputDateCustom.start_iso
                          ? startOfDay(new Date(inputDateCustom.start_iso))
                          : undefined
                      }
                      minDate={calendarBounds().min}
                      maxDate={calendarBounds().max}
                    />
                  </div>
                )}
              </div>

              <span className="semi-xs mt-2 text-neutral-600">s/d</span>

              {/* Periode Akhir */}
              <div className="relative">
                <Input
                  value={inputDateCustom.end_date}
                  onClick={() =>
                    setInputDateCustom((a) => ({ ...a, status: "end_date" }))
                  }
                  onChange={() => {}}
                  classInput="w-full"
                  status={validate.end_date ? "error" : undefined}
                  className="!w-[136px] max-w-none"
                  placeholder={t("AppMuatpartsAnalisaProdukPeriodeAkhir")}
                  icon={{
                    right: <IconComponent src={"/icons/calendar16.svg"} />,
                  }}
                  supportiveText={{ title: validate.end_date, desc: "" }}
                />

                {inputDateCustom.status === "end_date" && (
                  <div className="absolute right-0 top-10 z-30">
                    <Calendar
                      {...calendarCommonProps}
                      onChange={handleCalendarChange}
                      value={
                        inputDateCustom.end_iso
                          ? startOfDay(new Date(inputDateCustom.end_iso))
                          : undefined
                      }
                      minDate={calendarBounds().min}
                      maxDate={calendarBounds().max}
                    />
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="muattrans-primary"
              className="!h-8 w-[112px]"
              onClick={() => {
                let hasError = false;

                if (!inputDateCustom.start_iso) {
                  setValidate((v) => ({
                    ...v,
                    start_date: "Periode awal harus diisi",
                  }));
                  hasError = true;
                }
                if (!inputDateCustom.end_iso) {
                  setValidate((v) => ({
                    ...v,
                    end_date: "Periode akhir harus diisi",
                  }));
                  hasError = true;
                }
                if (hasError) return;

                const start = startOfDay(new Date(inputDateCustom.start_iso));
                const end = startOfDay(new Date(inputDateCustom.end_iso));
                const maxEnd = clamp(addYears(start, 1), MIN_DATE, TODAY);

                if (end < start) {
                  setValidate((v) => ({
                    ...v,
                    end_date:
                      "Periode akhir tidak boleh lebih kecil dari periode awal",
                  }));
                  return;
                }
                if (end > maxEnd) {
                  setValidate((v) => ({
                    ...v,
                    end_date: "Rentang maksimal 1 tahun dari periode awal",
                  }));
                  return;
                }

                const customOption = {
                  name: `${inputDateCustom.start_date} - ${inputDateCustom.end_date}`,
                  value: `${inputDateCustom.start_date} - ${inputDateCustom.end_date}`,
                  start_date: inputDateCustom.start_date,
                  end_date: inputDateCustom.end_date,
                  iso_start_date: inputDateCustom.start_iso,
                  iso_end_date: inputDateCustom.end_iso,
                  range: true,
                };

                handleSelect(customOption, true);
                setIsPeriode(false);
              }}
            >
              {t("AppMuatpartsAnalisaProdukTerapkan")}
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Period;

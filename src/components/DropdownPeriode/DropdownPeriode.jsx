import { useEffect, useRef, useState } from "react";

import { Plus } from "lucide-react";
import Calendar from "react-calendar";

import { useLanguage } from "@/context/LanguageContext";
import { formatDateInput } from "@/libs/DateFormat";

import Button from "../Button/Button";
import IconComponent from "../IconComponent/IconComponent";
import Input from "../Input/Input";
import ModalComponent from "../Modals/ModalComponent";
import style from "./DropdownPeriode.module.scss";

const DropdownPeriode = ({
  options = [],
  recentSelections = [],
  onSelect,
  disable = false,
}) => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(
    options[0] || { name: "Select an option", value: "" }
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isPeriode, setIsPeriode] = useState(false);
  const [validate, setValidate] = useState({
    start_date: false,
    end_date: false,
  });
  const [inputDateCustom, setInputDateCustom] = useState({
    status: "",
    start_date: "",
    end_date: "",
  });
  const dropdownRef = useRef(null);

  const handleSelect = (option, range) => {
    if (range)
      setSelected({
        ...option,
        start_date: option?.start_date ?? inputDateCustom?.start_date,
        end_date: option?.end_date ?? inputDateCustom.end_date,
        range: true,
      });
    else setSelected(option);
    setIsOpen(false);
    if (onSelect) onSelect(option); // Callback for parent
  };

  //24. THP 2 - MOD001 - MP - 035 - QC Plan - Web - MuatParts - General - Daftar Pesanan LB - 0026
  const resetValue = () => {
    setInputDateCustom({
      status: "",
      start_date: "",
      end_date: "",
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  return (
    <div className={`${style.main} text-neutral-900`} ref={dropdownRef}>
      <ModalComponent
        setClose={() => {
          setInputDateCustom((a) => ({ ...a, status: "" }));
          setIsPeriode(false);
          resetValue();
        }}
        isOpen={isPeriode}
        full
      >
        <div className="flex flex-col items-center gap-6 px-4 py-7">
          <span className="bold-base">
            {t("AppMuatpartsAnalisaProdukPilihPeriode")}
          </span>
          <div className="relative flex items-center gap-2">
            {/* 24. THP 2 - MOD001 - MP - 035 - QC Plan - Web - MuatParts - General - Daftar Pesanan  LB - 0024 LB - 0026 */}
            <Input
              value={inputDateCustom?.start_date}
              focusEvent={() =>
                setInputDateCustom((a) => ({ ...a, status: "start_date" }))
              }
              classInput={"w-full"}
              status={validate?.start_date && "error"}
              classname={"!w-[136px] max-w-none"}
              placeholder={t("AppMuatpartsAnalisaProdukPeriodeAwal")}
              icon={{ right: <IconComponent src={"/icons/calendar.svg"} /> }}
              supportiveText={{
                title: validate?.start_date && "Periode awal harus diisi",
                desc: "",
              }}
            />
            <span className="semi-xs text-neutral-600">s/d</span>
            <Input
              value={inputDateCustom?.end_date}
              supportiveText={{
                title: validate?.end_date && "Periode akhir harus diisi",
                desc: "",
              }}
              status={validate?.end_date && "error"}
              focusEvent={() =>
                setInputDateCustom((a) => ({ ...a, status: "end_date" }))
              }
              classInput={"w-full"}
              classname={"!w-[136px] max-w-none"}
              placeholder={t("AppMuatpartsAnalisaProdukPeriodeAkhir")}
              icon={{ right: <IconComponent src={"/icons/calendar.svg"} /> }}
            />
            {inputDateCustom?.status && (
              <Calendar
                className={"absolute top-2 rounded-md"}
                onChange={(date) => {
                  setValidate((a) => ({
                    ...a,
                    [inputDateCustom.status]: false,
                  }));
                  setInputDateCustom((a) => ({
                    ...a,
                    [a.status]: formatDateInput(
                      date,
                      ["day", "month", "year"],
                      false
                    ),
                    status: "",
                  }));
                }}
              />
            )}
          </div>
          <Button
            Class="!h-8 w-[112px]"
            onClick={() => {
              let next = true;
              if (inputDateCustom.start_date == "") {
                setValidate((a) => ({ ...a, start_date: true }));
                next = false;
              }
              if (inputDateCustom.end_date == "") {
                setValidate((a) => ({ ...a, end_date: true }));
                next = false;
              }
              if (!next) return;
              handleSelect(
                {
                  name: `${inputDateCustom.start_date} - ${inputDateCustom.end_date}`,
                  value: `${inputDateCustom.start_date} - ${inputDateCustom.end_date}`,
                  start_date: inputDateCustom.start_date,
                  end_date: inputDateCustom.end_date,
                  range: true,
                },
                true
              );
              setIsPeriode(false);
            }}
          >
            {t("AppMuatpartsAnalisaProdukTerapkan")}
          </Button>
        </div>
      </ModalComponent>
      <button
        disabled={disable}
        className={`flex h-8 w-full items-center justify-between border ${!disable ? "bg-neutral-50 text-neutral-900" : "bg-neutral-200 text-neutral-600"} rounded-lg px-3 py-2 shadow-sm ${isOpen ? "border-primary-700" : "border-neutral-600"}`}
        onClick={() => (!disable ? setIsOpen(!isOpen) : "")}
      >
        <span className="medium-xs line-clamp-1 text-left">
          {selected.name.replace("(Default)", "")}
        </span>
        <IconComponent src={"/icons/calendar.svg"} />
      </button>

      {isOpen && (
        <ul className="absolute mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg">
          {options.map((option) => (
            <li
              key={option.value}
              className={`cursor-pointer px-[10px] py-2 hover:text-primary-700 ${selected?.value === option?.value ? "semi-xs" : "medium-xs"}`}
              onClick={() => handleSelect(option)}
            >
              <div className="flex w-full items-center justify-between">
                <span className="line-clamp-1">{option.name}</span>
                {selected?.value === option?.value && (
                  <IconComponent src={"/icons/check-circle.svg"} />
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
                  className={`cursor-pointer px-[10px] py-2 hover:text-primary-700 ${selected?.value === option?.value ? "semi-xs" : "medium-xs"}`}
                  onClick={() => handleSelect(option, true)}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="line-clamp-1">{option.name}</span>
                    {selected?.value === option?.value && (
                      <IconComponent src={"/icons/check-circle.svg"} />
                    )}
                  </div>
                </li>
              ))}
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default DropdownPeriode;

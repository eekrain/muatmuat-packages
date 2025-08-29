"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import PropTypes from "prop-types";
import DatePicker from "react-datepicker";

// LBM - Multibahasa Optimization

import { useTranslation } from "@/hooks/use-translation";

import Checkbox from "../Form/Checkbox";
import IconComponent from "../IconComponent/IconComponent";
import style from "./Dropdown.module.scss";

export const formatDateFE = (val) => {
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date(val).toLocaleDateString("en-GB", options);
};
export const formatDateAPI = (val) => {
  const d = new Date(val);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Dropdown = ({
  id,
  options: pilihan = [],
  optionsOther: pilihanLain = [],
  optionsOtherText = "",
  className,
  onSearchValue,
  onSelected = () => {},
  selectedIconElement,
  leftIconElement,
  placeholder = "Select value",
  searchPlaceholder = "Search...",
  showDropdown = false,
  isMultipleSelected = false,
  onCustom,
  textCustom,
  defaultValue,
  dateStartEnd,
  defaultShow = "",
  fixedPlaceholder,
  arrowColor = "default",
  disabled,
  onClickTextOther = () => {},
  onClick = () => {},
  isError = false,
  minWidth = false,
  position,
  listItemClassName,
}) => {
  const [errorMessage, setErrorMessage] = useState(false);

  const [isOpen, setIsOpen] = useState(showDropdown);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);
  const [optionsOther, setOptionsOther] = useState([]);
  // tanggal
  const [datepicker, setDatepicker] = useState(false);
  const [dateRange, setDateRange] = useState(dateStartEnd || [null, null]);
  const [startDate, endDate] = dateRange;

  const { t } = useTranslation();
  useEffect(() => {
    if (pilihan?.length) setOptions(pilihan);
  }, [pilihan]);
  useEffect(() => {
    if (pilihanLain?.length) setOptionsOther(pilihanLain);
  }, [pilihanLain]);
  useEffect(() => {
    setIsOpen(showDropdown);
  }, [onCustom]);
  useEffect(() => {
    setIsOpen(false);
  }, [datepicker]);

  useEffect(() => {
    if (dateRange[1] !== null) {
      onSelected(dateRange.map((item) => formatDateAPI(item)));
      setDatepicker(false);
      setIsOpen(false);
    }
  }, [dateRange]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setDatepicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (disabled || isError) return;
    setIsOpen(!isOpen);
    setErrorMessage(true);
  };
  const handleSelect = (option) => {
    if (selected.filter((item) => item.value === option.value).length) {
      if (isMultipleSelected) {
        const val = selected.filter((item) => item.value !== option.value);
        setSelected(val);
        onSelected(val);
      } else {
        setSelected([option]);
        onSelected([option]);
        setIsOpen(false);
        setSearch("");
      }
    } else {
      if (isMultipleSelected) {
        const val = selected.length ? [...selected, option] : [option];
        setSelected(val);
        onSelected(val);
      } else {
        setSelected([option]);
        onSelected([option]);
        setIsOpen(false);
        setSearch("");
      }
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    onSearchValue(e.target.value);
  };
  const searchBy = search
    ? [...options, ...optionsOther]?.filter((val) =>
        val.name?.toLowerCase().includes(search.toLowerCase())
      )
    : options?.filter((val) =>
        val.name?.toLowerCase().includes(search.toLowerCase())
      );
  useEffect(() => {
    if (Array.isArray(defaultValue)) setSelected(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    isError && setIsOpen(false);
  }, [isError]);
  const RenderDropDown = useMemo(() => {
    return (
      <ul className={`${style.listOptions} `}>
        {searchBy.map((val, index) => (
          <li
            className={`${style.list} select-none ${listItemClassName || ""}`}
            key={index}
            onClick={(e) => {
              if (!isMultipleSelected) {
                val.value === "tanggal"
                  ? setDatepicker(true)
                  : handleSelect({
                      value: val.value,
                      name: val.name,
                      title: val.title || "",
                    });
              } else {
                e.preventDefault();
                handleSelect({
                  value: val.value,
                  name: val.name,
                  title: val.title || "",
                });
              }
            }}
          >
            <div className="flex items-center gap-2">
              {isMultipleSelected && (
                <Checkbox
                  className={style.checkBox}
                  label=""
                  value={val.value}
                  checked={selected.filter((a) => a.value === val.value).length}
                />
              )}
              <span className={style.content}>
                {val?.title && (
                  <span className="font-[600] leading-[14px]">
                    {val?.title}
                  </span>
                )}
                <span className="line-clamp-2 font-[500]">{val?.name}</span>
              </span>
            </div>
            {!!selected.filter((a) => a.value === val.value).length &&
              !isMultipleSelected && (
                <span className="h-4 w-4">
                  <IconComponent src={"/icons/check-circle.svg"} />
                </span>
              )}
          </li>
        ))}
        {optionsOther.length && !search ? (
          <>
            <span
              onClick={onClickTextOther}
              className={`${style.list} hover:unset cursor-default select-none border-y border-neutral-400 ${listItemClassName || ""}`}
            >
              {optionsOtherText ? optionsOtherText : "Opsi Lainnya"}
            </span>
            {optionsOther?.map((val) => {
              return (
                <li
                  className={`${style.list} ter select-none ${listItemClassName || ""}`}
                  key={val.name}
                  onClick={(e) => {
                    if (!isMultipleSelected) {
                      val.value === "tanggal"
                        ? setDatepicker(true)
                        : handleSelect({
                            value: val.value,
                            name: val.name,
                            title: val.title || "",
                          });
                    } else {
                      e.preventDefault();
                      handleSelect({
                        value: val.value,
                        name: val.name,
                        title: val.title || "",
                      });
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    {isMultipleSelected && (
                      <Checkbox
                        className={style.checkBox}
                        label=""
                        value={val.value}
                        checked={
                          selected.filter((a) => a.value === val.value).length
                        }
                      />
                    )}
                    <span className={style.content}>
                      {val?.title && (
                        <span className="font-[600] leading-[14px]">
                          {val?.title}
                        </span>
                      )}
                      <span className="font-[500]">{val?.name}</span>
                    </span>
                  </div>
                </li>
              );
            })}
          </>
        ) : (
          ""
        )}
        {/* 25. 03 - QC Plan - Web - Pengecekan Ronda Muatparts - Tahap 2 - LB - 0701 */}
        {searchBy.length === 0 && (
          <li className="select-none p-2 text-center text-xs">
            {t("LabelfilterProdukDataTidakDitemukan")}
          </li>
        )}
      </ul>
    );
  }, [searchBy]);
  const labelName = fixedPlaceholder
    ? placeholder
    : selected
        ?.map((val) => {
          if (defaultShow) return val[defaultShow];
          if (val.title) return val.title;
          return val.name;
        })
        .join(", ");
  return (
    <>
      <div
        ref={dropdownRef}
        className={`${style.main} ${className} ${disabled ? style.disabled : ""} ${isError && "border !border-red-500"}`}
        onClick={onClick}
      >
        <button
          id={id}
          onClick={handleToggle}
          className={`${style.buttonPlace} ${!selected.length && "!text-neutral-600"} select-none`}
        >
          <div className="line-clamp-1 flex items-center gap-2">
            {leftIconElement && leftIconElement}
            {isMultipleSelected && selected.length && !fixedPlaceholder > 1 ? (
              <span className="flex gap-[2px]">
                {selected[0]?.title ? selected[0]?.title : selected[0]?.name}
                <span className="rounded-full bg-neutral-600 px-1 text-neutral-50">
                  {selected.length - 1}+
                </span>
              </span>
            ) : labelName?.length ? (
              <span className="line-clamp-1 w-full">{labelName}</span>
            ) : dateRange[1] !== null && !fixedPlaceholder ? (
              <span className="text-xs font-semibold text-neutral-600">{`${formatDateFE(dateRange[0])} - ${formatDateFE(dateRange[1])}`}</span>
            ) : (
              <span className="text-xs text-neutral-600">{placeholder}</span>
            )}
          </div>
          <span className="h-4 w-4">
            <IconComponent
              src={selectedIconElement ?? "/icons/chevron-down.svg"}
              color={arrowColor}
              className={`${style.chevron} ${isOpen ? style.chevronRotate : ""}`}
            />
          </span>
        </button>

        {isOpen && (
          <div
            className={`${style.listContainer} ${minWidth && "!w-[200px]"} ${position === "right" && "!left-auto !right-0"}`}
          >
            {onSearchValue && (
              <div className="flex h-[32px] items-center rounded border border-neutral-500 px-3 py-2">
                <IconComponent src={"/icons/search.svg"} />
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder={searchPlaceholder}
                  className={
                    "h-full w-full flex-1 rounded px-3 py-2 text-xs text-neutral-900 outline-none placeholder:text-neutral-700 focus:outline-none"
                  }
                />
                {search && (
                  <IconComponent
                    src={"/icons/silang.svg"}
                    onclick={(e) => setSearch("")}
                  />
                )}
              </div>
            )}
            {onCustom && (
              <div
                onClick={onCustom}
                className="flex w-full cursor-pointer items-center justify-start gap-2 border-b border-neutral-400 pb-3"
              >
                <IconComponent
                  src={"/icons/Plus.svg"}
                  width={14}
                  height={14}
                  className={style.customIcon}
                />
                <span className="text-xs text-neutral-900">{textCustom}</span>
              </div>
            )}
            {RenderDropDown}
          </div>
        )}
      </div>
      {datepicker && (
        <DatePicker
          // set value yang terpilih
          inline
          selectsRange={true}
          // withPortal
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setDateRange(update);
          }}
        />
      )}
    </>
  );
};

export default Dropdown;

Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,
  children: PropTypes.element,
  onSearchValue: PropTypes.func,
  selectedIconElement: PropTypes.element,
  leftIconElement: PropTypes.element,
  searchPlaceholder: PropTypes.string,
  showDropdown: PropTypes.bool,
  getShowIndicator: PropTypes.func,
  placeholder: PropTypes.string,
  onSelected: PropTypes.func,
  isNotEmpty: PropTypes.bool,
  isMultipleSelected: PropTypes.bool,
  onCustom: PropTypes.func,
  textCustom: PropTypes.string,
  defaultValue: PropTypes.shape(PropTypes.object),
  id: PropTypes.string,
  defaultShow: PropTypes.oneOf(["title", "name"]),
  fixedPlaceholder: PropTypes.bool,
  isError: PropTypes.bool,
  onClick: PropTypes.func,
  listItemClassName: PropTypes.string,
};

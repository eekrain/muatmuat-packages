import React from "react";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";

import { formatDateInput } from "@/lib/utils/dateFormat";

import Input from "../Form/Input";

const ModalPilihPeriode = ({
  open,
  onOpenChange,
  inputDateCustom,
  setInputDateCustom,
  validate,
  setValidate,
  onApply,
  buttonVariant,
  t,
  formatToISODate,
}) => {
  const [rangeError, setRangeError] = React.useState(false);

  React.useEffect(() => {
    if (!open) setRangeError(false);
  }, [open]);

  const onCalendarChange = (date) => {
    const status = inputDateCustom?.status;
    if (!status) return;

    const formatted = formatDateInput(date, ["day", "month", "year"], false);

    if (status === "start_date") {
      // reset end date when start date changed
      setInputDateCustom((a) => ({
        ...a,
        start_date: formatted,
        end_date: "",
        status: "",
      }));
      setValidate((a) => ({ ...a, start_date: false, end_date: false }));
      setRangeError(false);
      return;
    }

    if (status === "end_date") {
      // If start exists, ensure end >= start
      if (inputDateCustom?.start_date) {
        const isoStart = formatToISODate(inputDateCustom.start_date);
        const isoEnd = formatToISODate(formatted);
        if (isoEnd < isoStart) {
          setRangeError(true);
          setValidate((a) => ({ ...a, end_date: true }));
          return; // don't accept invalid end date
        }
      }

      setInputDateCustom((a) => ({ ...a, end_date: formatted, status: "" }));
      setValidate((a) => ({ ...a, end_date: false }));
      setRangeError(false);
    }
  };

  // compute minDate to disable dates earlier than start_date when picking end_date
  let minDate;
  if (inputDateCustom?.status === "end_date" && inputDateCustom?.start_date) {
    const iso = formatToISODate(inputDateCustom.start_date);
    if (iso) minDate = new Date(iso);
  }

  const handleApply = () => {
    let ok = true;
    if (!inputDateCustom.start_date) {
      setValidate((a) => ({ ...a, start_date: true }));
      ok = false;
    }
    if (!inputDateCustom.end_date) {
      setValidate((a) => ({ ...a, end_date: true }));
      ok = false;
    }
    if (!ok) return;

    const isoStart = formatToISODate(inputDateCustom.start_date);
    const isoEnd = formatToISODate(inputDateCustom.end_date);
    if (isoEnd < isoStart) {
      setRangeError(true);
      setValidate((a) => ({ ...a, end_date: true }));
      return;
    }

    const customOption = {
      name: `${inputDateCustom.start_date} - ${inputDateCustom.end_date}`,
      value: `${inputDateCustom.start_date} - ${inputDateCustom.end_date}`,
      start_date: inputDateCustom.start_date,
      end_date: inputDateCustom.end_date,
      iso_start_date: isoStart,
      iso_end_date: isoEnd,
      range: true,
    };

    onApply(customOption);
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} closeOnOutsideClick>
      <ModalContent type="muattrans" className="w-modal-small">
        <ModalHeader size="small" />
        <div className="flex flex-col items-center gap-6 px-4 py-7">
          <h3 className="bold-base text-center">
            {t("AppMuatpartsAnalisaProdukPilihPeriode")}
          </h3>

          <div className="flex flex-col gap-y-2">
            <div className="relative flex max-w-[306px] flex-wrap items-center gap-2">
              <Input
                value={inputDateCustom?.start_date}
                onClick={() =>
                  setInputDateCustom((a) => ({ ...a, status: "start_date" }))
                }
                onChange={() => {}}
                classInput={"w-full"}
                status={validate?.start_date && "error"}
                appearance={{
                  containerClassName: validate?.start_date
                    ? "border-error-400"
                    : "",
                }}
                className={"!w-[136px] max-w-none"}
                placeholder={t("AppMuatpartsAnalisaProdukPeriodeAwal")}
                icon={{
                  right: (
                    <IconComponent
                      src={"/icons/calendar16.svg"}
                      onClick={() => {
                        setInputDateCustom((a) => ({
                          ...a,
                          status: "start_date",
                        }));
                      }}
                    />
                  ),
                }}
              />

              <span className="semi-xs text-neutral-600">s/d</span>

              <Input
                value={inputDateCustom?.end_date}
                status={validate?.end_date && "error"}
                appearance={{
                  containerClassName: validate?.end_date
                    ? "border-error-400"
                    : "",
                }}
                onClick={() =>
                  setInputDateCustom((a) => ({ ...a, status: "end_date" }))
                }
                onChange={() => {}}
                classInput={"w-full"}
                className={"!w-[136px] max-w-none"}
                placeholder={t("AppMuatpartsAnalisaProdukPeriodeAkhir")}
                icon={{
                  right: (
                    <IconComponent
                      onClick={() => {
                        setInputDateCustom((a) => ({
                          ...a,
                          status: "end_date",
                        }));
                      }}
                      src={"/icons/calendar16.svg"}
                    />
                  ),
                }}
              />

              {inputDateCustom?.status && (
                <Calendar
                  className={"absolute top-2 rounded-md"}
                  onChange={onCalendarChange}
                  minDate={minDate}
                />
              )}

              <div className="min-w-[136px] text-xs font-medium text-error-400">
                {validate?.start_date && "Periode awal harus diisi"}
              </div>
              <div className="min-w-[18px]" />
              <div className="min-w-[136px] text-xs font-medium text-error-400">
                {validate?.end_date &&
                  (rangeError
                    ? "Periode akhir tidak boleh kurang dari awal"
                    : "Periode akhir harus diisi")}
              </div>
            </div>
          </div>

          <Button
            variant={buttonVariant}
            className="!h-8 w-[112px]"
            onClick={handleApply}
          >
            {t("AppMuatpartsAnalisaProdukTerapkan")}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ModalPilihPeriode;

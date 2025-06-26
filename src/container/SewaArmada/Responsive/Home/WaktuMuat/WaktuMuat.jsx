"use client";

import { useEffect, useState } from "react";

import { format } from "date-fns";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import DatetimePicker from "@/components/DatetimePicker/DatetimePicker";
import IconComponent from "@/components/IconComponent/IconComponent";
import RadioButton from "@/components/Radio/RadioButton";
import usePrevious from "@/hooks/use-previous";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

const WaktuMuatBottomsheet = () => {
  const dateFormat = "dd MMM yyyy HH:mm";

  // Use current date as minDate instead of getNowTimezone
  const minDate = new Date();

  const orderType = useSewaArmadaStore((state) => state.orderType);
  const loadTimeStart = useSewaArmadaStore(
    (state) => state.formValues.loadTimeStart
  );
  const loadTimeEnd = useSewaArmadaStore(
    (state) => state.formValues.loadTimeEnd
  );
  const showRangeOption = useSewaArmadaStore(
    (state) => state.formValues.showRangeOption
  );
  const { setField, setOrderType } = useSewaArmadaActions();
  const [isBottomsheetOpen, setIsBottomsheetOpen] = useState(false);
  const previousIsBottomsheetOpen = usePrevious(isBottomsheetOpen);
  const [bottomsheetFormValues, setBottomsheetFormValues] = useState({
    orderType: "",
    loadTimeStart: null,
    loadTimeEnd: null,
    showRangeOption: false,
  });
  const [bottomsheetFormErrors, setBottomsheetFormErrors] = useState({});

  useEffect(() => {
    if (isBottomsheetOpen && !previousIsBottomsheetOpen) {
      const data = {
        orderType,
        loadTimeStart,
        loadTimeEnd,
        showRangeOption,
      };
      setBottomsheetFormValues(data);
    }
  }, [
    isBottomsheetOpen,
    previousIsBottomsheetOpen,
    loadTimeStart,
    loadTimeEnd,
    showRangeOption,
    orderType,
  ]);

  const handleChangeBottomsheetFormValues = (field, value) => {
    if (field === "loadTimeStart" || field === "loadTimeEnd") {
      const newDate = new Date(value);
      newDate.setSeconds(0, 0);
      setBottomsheetFormValues((prevState) => ({
        ...prevState,
        [field]: newDate,
      }));
    } else {
      setBottomsheetFormValues((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!bottomsheetFormValues.loadTimeStart) {
      newErrors.loadTimeStart = "Tanggal & waktu muat wajib diisi";
    }
    if (
      bottomsheetFormValues.loadTimeStart &&
      bottomsheetFormValues.showRangeOption
    ) {
      const start = new Date(bottomsheetFormValues.loadTimeStart);
      const end = new Date(bottomsheetFormValues.loadTimeEnd);
      const diffMs = end - start;
      const diffHours = diffMs / (1000 * 60 * 60);
      const eightHoursMs = 8 * 60 * 60 * 1000;
      if (!bottomsheetFormValues.loadTimeEnd) {
        newErrors.loadTimeEnd = "Rentang waktu muat awal & akhir wajib diisi";
      } else if (diffHours < 1) {
        newErrors.loadTimeEnd = "Rentang waktu muat awal & akhir minimal 1 jam";
      } else if (diffMs > eightHoursMs) {
        newErrors.loadTimeEnd =
          "Rentang waktu muat awal & akhir maksimal 8 jam";
      }
    }
    setBottomsheetFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const omit = (obj, keyToOmit) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => key !== keyToOmit)
    );
  };

  const handleSubmit = () => {
    const valid = validateForm();
    if (!valid) return;
    Object.entries(omit(bottomsheetFormValues, "orderType")).forEach(
      ([key, value]) => {
        setField(key, value);
      }
    );
    setOrderType(bottomsheetFormValues.orderType);
    setIsBottomsheetOpen(false);
  };

  // Helper function to safely format dates
  const formatDate = (date) => {
    try {
      if (!date) return null;
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return null;
      return format(dateObj, dateFormat);
    } catch (e) {
      console.error("Error formatting date:", e);
      return null;
    }
  };

  return (
    <BottomSheet open={isBottomsheetOpen} onOpenChange={setIsBottomsheetOpen}>
      <div className="flex flex-col gap-y-3">
        <button
          className="flex h-8 w-full items-center gap-x-2 rounded-md border border-neutral-600 bg-neutral-50 px-3"
          onClick={() => setIsBottomsheetOpen(true)}
        >
          <IconComponent src="/icons/calendar16.svg" />
          <span className="text-[14px] font-semibold leading-[15.4px]">
            {loadTimeStart ? (
              <span className="text-neutral-900">{`${formatDate(loadTimeStart)} WIB`}</span>
            ) : (
              <span className="text-neutral-600">
                {"Pilih Tanggal & Waktu Muat"}
              </span>
            )}
          </span>
        </button>
        {showRangeOption ? (
          <>
            <span className="text-[12px] font-semibold leading-[13.2px] text-neutral-600">
              Sampai dengan
            </span>
            <button
              className="flex h-8 w-full items-center gap-x-2 rounded-md border border-neutral-600 bg-neutral-50 px-3"
              onClick={() => setIsBottomsheetOpen(true)}
            >
              <IconComponent src="/icons/calendar16.svg" />
              <span className="text-[14px] font-semibold leading-[15.4px]">
                {loadTimeEnd ? (
                  <span className="text-neutral-900">{`${formatDate(loadTimeEnd)} WIB`}</span>
                ) : (
                  <span className="text-neutral-600">
                    {"Pilih Tanggal & Waktu Muat"}
                  </span>
                )}
              </span>
            </button>
          </>
        ) : null}
      </div>
      <BottomSheetContent>
        <BottomSheetHeader>Tanggal & Waktu Muat</BottomSheetHeader>
        <div className="flex h-[380px] w-full flex-col gap-4 overflow-y-auto bg-white px-4 py-6">
          {/* Section Tipe Pengiriman */}
          <div className="flex flex-col gap-4">
            {/* Opsi Instan */}
            <div className="flex flex-col gap-y-3">
              <RadioButton
                name="orderType"
                value="INSTANT"
                checked={bottomsheetFormValues.orderType === "INSTANT"}
                onClick={(data) =>
                  handleChangeBottomsheetFormValues("orderType", data.value)
                }
                label="Instan"
              />
              <p className="pl-6 text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Pesan jasa angkut untuk penjemputan dan pengiriman segera atau
                di Hari+1.
              </p>
            </div>

            {/* Opsi Terjadwal */}
            <div className="flex flex-col gap-y-3">
              <RadioButton
                name="orderType"
                value="SCHEDULED"
                checked={bottomsheetFormValues.orderType === "SCHEDULED"}
                onClick={(data) =>
                  handleChangeBottomsheetFormValues("orderType", data.value)
                }
                label="Terjadwal"
              />
              <p className="pl-6 text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Pesan jasa angkut untuk penjemputan dan pengiriman di Hari+2
                sampai dengan Hari+30.
              </p>
            </div>
          </div>

          {/* Divider Line */}
          <div className="min-h-px w-full bg-neutral-400" />

          {/* Section Pemilihan Tanggal */}
          <div className="flex flex-col gap-y-3">
            {/* Field Tanggal Mulai */}
            <DatetimePicker
              datetimeValue={bottomsheetFormValues.loadTimeStart}
              onApply={(date) =>
                handleChangeBottomsheetFormValues("loadTimeStart", date)
              }
              placeholder="Pilih Tanggal & Waktu Muat"
              status={bottomsheetFormErrors.loadTimeStart ? "error" : null}
              className="w-full"
              minDate={minDate}
            />
            {bottomsheetFormErrors.loadTimeStart ? (
              <span className="text-[12px] font-medium leading-[13.2px] text-error-400">
                {bottomsheetFormErrors.loadTimeStart}
              </span>
            ) : null}

            {bottomsheetFormValues.showRangeOption ? (
              <>
                {/* Label "Sampai dengan" */}
                <span className="text-[12px] font-semibold leading-[13.2px] text-neutral-600">
                  Sampai dengan
                </span>

                {/* Field Tanggal Akhir */}
                <DatetimePicker
                  datetimeValue={bottomsheetFormValues.loadTimeEnd}
                  onApply={(date) =>
                    handleChangeBottomsheetFormValues("loadTimeEnd", date)
                  }
                  placeholder="Pilih Tanggal & Waktu Muat"
                  disabled={!bottomsheetFormValues.loadTimeStart}
                  status={bottomsheetFormErrors.loadTimeEnd ? "error" : null}
                  className="w-full"
                  minDate={bottomsheetFormValues.loadTimeStart || minDate}
                />
                {bottomsheetFormErrors.loadTimeEnd ? (
                  <span className="text-[12px] font-medium leading-[13.2px] text-error-400">
                    {bottomsheetFormErrors.loadTimeEnd}
                  </span>
                ) : null}
              </>
            ) : null}
          </div>

          {/* Section Rentang Waktu */}
          <div className="flex flex-col gap-y-3">
            <Checkbox
              label="Dengan Rentang Waktu"
              value="showRangeOption"
              checked={bottomsheetFormValues.showRangeOption}
              onChange={(e) =>
                handleChangeBottomsheetFormValues("showRangeOption", e.checked)
              }
            />
            <p className="pl-6 text-[12px] font-medium leading-[14.4px] text-neutral-600">
              Jika kamu memilih opsi ini, kamu dapat menentukan pukul mulai dan
              pukul akhir untuk penjemputan muatan.
            </p>
          </div>

          {/* Button Simpan */}
          <Button
            variant="muatparts-primary"
            className="h-10 max-w-full"
            onClick={handleSubmit}
          >
            Simpan
          </Button>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default WaktuMuatBottomsheet;

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
import { getNowTimezone } from "@/lib/utils/dateTime";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

const WaktuMuatBottomsheet = () => {
  const dateFormat = "dd MMM yyyy HH:mm";
  const timezone = {
    id: "Asia/Jakarta",
    offset: "+07:00",
  };
  const { formValues, orderType } = useSewaArmadaStore();
  const { setField, setOrderType } = useSewaArmadaActions();
  const [isBottomsheetOpen, setIsBottomsheetOpen] = useState(false);
  const previousIsBottomsheetOpen = usePrevious(isBottomsheetOpen);
  const [bottomsheetFormValues, setBottomsheetFormValues] = useState({
    orderType: "",
    startDate: null,
    endDate: null,
    showRangeOption: false,
  });
  const [bottomsheetFormErrors, setBottomsheetFormErrors] = useState({});

  useEffect(() => {
    if (isBottomsheetOpen && !previousIsBottomsheetOpen) {
      const data = {
        orderType,
        startDate: formValues.startDate,
        endDate: formValues.endDate,
        showRangeOption: formValues.showRangeOption,
      };
      setBottomsheetFormValues(data);
    }
  }, [
    isBottomsheetOpen,
    previousIsBottomsheetOpen,
    formValues.startDate,
    formValues.endDate,
    formValues.showRangeOption,
    orderType,
  ]);

  const handleChangeBottomsheetFormValues = (field, value) => {
    if (field === "startDate" || field === "endDate") {
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
    if (!bottomsheetFormValues.startDate) {
      newErrors.startDate = "Tanggal & waktu muat wajib diisi";
    }
    if (
      bottomsheetFormValues.startDate &&
      bottomsheetFormValues.showRangeOption
    ) {
      const start = new Date(bottomsheetFormValues.startDate);
      const end = new Date(bottomsheetFormValues.endDate);
      const diffMs = end - start;
      const diffHours = diffMs / (1000 * 60 * 60);
      const eightHoursMs = 8 * 60 * 60 * 1000;
      if (!bottomsheetFormValues.endDate) {
        newErrors.endDate = "Rentang waktu muat awal & akhir wajib diisi";
      } else if (diffHours < 1) {
        newErrors.endDate = "Rentang waktu muat awal & akhir minimal 1 jam";
      } else if (diffMs > eightHoursMs) {
        newErrors.endDate = "Rentang waktu muat awal & akhir maksimal 8 jam";
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
  return (
    <BottomSheet open={isBottomsheetOpen} onOpenChange={setIsBottomsheetOpen}>
      <div className="flex flex-col gap-y-3">
        <button
          className="flex h-8 w-full items-center gap-x-2 rounded-md border border-neutral-600 bg-neutral-50 px-3"
          onClick={() => setIsBottomsheetOpen(true)}
        >
          <IconComponent src="/icons/calendar16.svg" />
          <span className="text-[14px] font-semibold leading-[15.4px]">
            {formValues.startDate ? (
              <span className="text-neutral-900">{`${format(formValues.startDate, dateFormat)} WIB`}</span>
            ) : (
              <span className="text-neutral-600">
                {"Pilih Tanggal & Waktu Muat"}
              </span>
            )}
          </span>
        </button>
        {formValues.showRangeOption ? (
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
                {formValues.endDate ? (
                  <span className="text-neutral-900">{`${format(formValues.endDate, dateFormat)} WIB`}</span>
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
              datetimeValue={bottomsheetFormValues.startDate}
              onApply={(date) =>
                handleChangeBottomsheetFormValues("startDate", date)
              }
              placeholder="Pilih Tanggal & Waktu Muat"
              status={bottomsheetFormErrors.startDate ? "error" : null}
              className="w-full"
              minDate={getNowTimezone(timezone)}
            />
            {bottomsheetFormErrors.startDate ? (
              <span className="text-[12px] font-medium leading-[13.2px] text-error-400">
                {bottomsheetFormErrors.startDate}
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
                  datetimeValue={bottomsheetFormValues.endDate}
                  onApply={(date) =>
                    handleChangeBottomsheetFormValues("endDate", date)
                  }
                  placeholder="Pilih Tanggal & Waktu Muat"
                  disabled={!bottomsheetFormErrors.startDate}
                  status={bottomsheetFormErrors.endDate ? "error" : null}
                  className="w-full"
                  minDate={getNowTimezone(timezone)}
                />
                {bottomsheetFormErrors.endDate ? (
                  <span className="text-[12px] font-medium leading-[13.2px] text-error-400">
                    {bottomsheetFormErrors.endDate}
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

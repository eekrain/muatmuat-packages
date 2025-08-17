"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { format } from "date-fns";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/BottomSheet/BottomSheetUp";
import Button from "@/components/Button/Button";
import DatetimePicker from "@/components/DatetimePicker/DatetimePicker";
import Checkbox from "@/components/Form/Checkbox";
import IconComponent from "@/components/IconComponent/IconComponent";
import RadioButton from "@/components/Radio/RadioButton";
import { usePrevious } from "@/hooks/use-previous";
import { useTranslation } from "@/hooks/use-translation";
import { OrderTypeEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { cn } from "@/lib/utils";
import { useGetOrderSettingsTime } from "@/services/Shipper/sewaarmada/getOrderSettingsTime";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

const WaktuMuatBottomsheet = ({
  handleCheckLoggedIn,
  hasNotDepartedToPickup,
}) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
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

  // Ambil data setting waktu order dari API
  const { data: orderSettingsData, isLoading: isOrderSettingsLoading } =
    useGetOrderSettingsTime();

  const isDisabledWaktuMuat =
    isEditPage && !(orderType === "SCHEDULED" && hasNotDepartedToPickup);

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
  // console.log(
  //   orderSettingsData?.Data?.loadingTime?.minRangeHours,
  //   "orderSettingsData"
  // );
  const validateForm = () => {
    const newErrors = {};
    // Ambil setting dari API, fallback ke default jika belum ada
    const minRangeHours =
      orderSettingsData?.Data?.loadingTime?.minRangeHours ?? 1;
    const maxRangeHours =
      orderSettingsData?.Data?.loadingTime?.maxRangeHours ?? 8;
    const instantOrder = orderSettingsData?.Data?.instantOrder;
    const scheduledOrder = orderSettingsData?.Data?.scheduledOrder;
    const currentServerTimeStr = orderSettingsData?.Data?.currentServerTime;
    const orderType = bottomsheetFormValues.orderType;
    const now = currentServerTimeStr
      ? new Date(currentServerTimeStr)
      : new Date();

    if (!bottomsheetFormValues.loadTimeStart) {
      newErrors.loadTimeStart = t(
        "WaktuMuat.errorLoadTimeRequired",
        {},
        "Tanggal & waktu muat wajib diisi"
      );
    }

    // Validasi khusus untuk orderType INSTANT
    if (
      orderType === OrderTypeEnum.INSTANT &&
      instantOrder &&
      bottomsheetFormValues.loadTimeStart
    ) {
      const start = new Date(bottomsheetFormValues.loadTimeStart);
      const minStart = new Date(
        now.getTime() + (instantOrder.minHoursFromNow ?? 1) * 60 * 60 * 1000
      );
      const maxStart = new Date(
        now.getTime() + (instantOrder.maxDaysFromNow ?? 1) * 24 * 60 * 60 * 1000
      );
      console.log(start, minStart, maxStart, "start,minStart,maxStart");
      if (start < minStart) {
        newErrors.loadTimeStart = t(
          "WaktuMuat.errorInstantMinTime",
          { hours: instantOrder.minHoursFromNow },
          `Tanggal & waktu muat minimal ${instantOrder.minHoursFromNow} jam dari sekarang`
        );
      } else if (start > maxStart) {
        newErrors.loadTimeStart = t(
          "WaktuMuat.errorInstantMaxTime",
          { days: instantOrder.maxDaysFromNow },
          `Tanggal & waktu muat maksimal ${instantOrder.maxDaysFromNow} hari dari sekarang`
        );
      }
    }

    // Validasi khusus untuk orderType SCHEDULED
    if (
      orderType === OrderTypeEnum.SCHEDULED &&
      scheduledOrder &&
      bottomsheetFormValues.loadTimeStart
    ) {
      const start = new Date(bottomsheetFormValues.loadTimeStart);
      const minStart = new Date(
        now.getTime() +
          (scheduledOrder.minDaysFromNow ?? 2) * 24 * 60 * 60 * 1000
      );
      const maxStart = new Date(
        now.getTime() +
          (scheduledOrder.maxDaysFromNow ?? 30) * 24 * 60 * 60 * 1000
      );
      if (start < minStart) {
        newErrors.loadTimeStart = t(
          "WaktuMuat.errorScheduledMinTime",
          { days: scheduledOrder.minDaysFromNow },
          `Tanggal & waktu muat minimal ${scheduledOrder.minDaysFromNow} hari dari sekarang`
        );
      } else if (start > maxStart) {
        newErrors.loadTimeStart = t(
          "WaktuMuat.errorScheduledMaxTime",
          { days: scheduledOrder.maxDaysFromNow },
          `Tanggal & waktu muat maksimal ${scheduledOrder.maxDaysFromNow} hari dari sekarang`
        );
      }
    }
    if (
      bottomsheetFormValues.loadTimeStart &&
      bottomsheetFormValues.showRangeOption
    ) {
      const start = new Date(bottomsheetFormValues.loadTimeStart);
      const end = new Date(bottomsheetFormValues.loadTimeEnd);
      const diffMs = end - start;
      const diffHours = diffMs / (1000 * 60 * 60);
      if (!bottomsheetFormValues.loadTimeEnd) {
        newErrors.loadTimeEnd = t(
          "WaktuMuat.errorRangeRequired",
          {},
          "Rentang waktu muat awal & akhir wajib diisi"
        );
      } else if (diffHours < minRangeHours) {
        newErrors.loadTimeEnd = t(
          "WaktuMuat.errorRangeMinHours",
          { hours: minRangeHours },
          `Rentang waktu muat awal & akhir minimal ${minRangeHours} jam`
        );
      } else if (diffHours > maxRangeHours) {
        newErrors.loadTimeEnd = t(
          "WaktuMuat.errorRangeMaxHours",
          { hours: maxRangeHours },
          `Rentang waktu muat awal & akhir maksimal ${maxRangeHours} jam`
        );
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
    setField("hasUpdatedForm", true);
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
          disabled={isDisabledWaktuMuat}
          className={cn(
            "flex h-8 w-full items-center gap-x-2 rounded-md border border-neutral-600 bg-neutral-50 px-3",
            isDisabledWaktuMuat
              ? "cursor-not-allowed bg-neutral-200"
              : "cursor-pointer bg-neutral-50"
          )}
          onClick={() => {
            if (!handleCheckLoggedIn()) return;
            setIsBottomsheetOpen(true);
          }}
        >
          <IconComponent src="/icons/calendar16.svg" />
          <span className="text-sm font-semibold leading-[15.4px]">
            {loadTimeStart ? (
              <span className="text-neutral-900">{`${formatDate(loadTimeStart)} WIB`}</span>
            ) : (
              <span className="text-neutral-600">
                {t(
                  "WaktuMuat.selectDateTimePlaceholder",
                  {},
                  "Pilih Tanggal & Waktu Muat"
                )}
              </span>
            )}
          </span>
        </button>
        {showRangeOption ? (
          <>
            <span className="text-xs font-semibold leading-[13.2px] text-neutral-600">
              {t("WaktuMuat.untilLabel", {}, "Sampai dengan")}
            </span>
            <button
              disabled={isDisabledWaktuMuat}
              className={cn(
                "flex h-8 w-full items-center gap-x-2 rounded-md border border-neutral-600 bg-neutral-50 px-3",
                isDisabledWaktuMuat
                  ? "cursor-not-allowed bg-neutral-200"
                  : "cursor-pointer bg-neutral-50"
              )}
              onClick={() => {
                if (!handleCheckLoggedIn()) return;
                setIsBottomsheetOpen(true);
              }}
            >
              <IconComponent src="/icons/calendar16.svg" />
              <span className="text-sm font-semibold leading-[15.4px]">
                {loadTimeEnd ? (
                  <span className="text-neutral-900">{`${formatDate(loadTimeEnd)} WIB`}</span>
                ) : (
                  <span className="text-neutral-600">
                    {t(
                      "WaktuMuat.selectDateTimePlaceholder",
                      {},
                      "Pilih Tanggal & Waktu Muat"
                    )}
                  </span>
                )}
              </span>
            </button>
          </>
        ) : null}
      </div>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>
            {t("WaktuMuat.title", {}, "Tanggal & Waktu Muat")}
          </BottomSheetTitle>
        </BottomSheetHeader>
        <div className="flex w-full flex-col gap-4 overflow-y-auto bg-white px-4">
          {/* Section Tipe Pengiriman */}
          <div className="flex flex-col gap-4">
            {/* Opsi Instan */}
            <div className="flex flex-col gap-y-3">
              <RadioButton
                disabled={isEditPage}
                name="orderType"
                value={OrderTypeEnum.INSTANT}
                checked={
                  bottomsheetFormValues.orderType === OrderTypeEnum.INSTANT
                }
                onClick={(data) =>
                  handleChangeBottomsheetFormValues("orderType", data.value)
                }
                label={t("WaktuMuat.instantLabel", {}, "Instan")}
              />
              <p className="pl-6 text-xs font-medium leading-[14.4px] text-neutral-600">
                {t(
                  "WaktuMuat.instantDescription",
                  {},
                  "Pesan jasa angkut untuk penjemputan dan pengiriman segera atau di Hari+1."
                )}
              </p>
            </div>

            {/* Opsi Terjadwal */}
            <div className="flex flex-col gap-y-3">
              <RadioButton
                disabled={isEditPage}
                name="orderType"
                value={OrderTypeEnum.SCHEDULED}
                checked={
                  bottomsheetFormValues.orderType === OrderTypeEnum.SCHEDULED
                }
                onClick={(data) =>
                  handleChangeBottomsheetFormValues("orderType", data.value)
                }
                label={t("WaktuMuat.scheduledLabel", {}, "Terjadwal")}
              />
              <p className="pl-6 text-xs font-medium leading-[14.4px] text-neutral-600">
                {t(
                  "WaktuMuat.scheduledDescription",
                  {},
                  "Pesan jasa angkut untuk penjemputan dan pengiriman di Hari+2 sampai dengan Hari+30."
                )}
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
              placeholder={t(
                "WaktuMuat.selectDateTimePlaceholder",
                {},
                "Pilih Tanggal & Waktu Muat"
              )}
              status={bottomsheetFormErrors.loadTimeStart ? "error" : null}
              className="w-full"
              minDate={minDate}
            />
            {bottomsheetFormErrors.loadTimeStart ? (
              <span className="text-xs font-medium leading-[13.2px] text-error-400">
                {bottomsheetFormErrors.loadTimeStart}
              </span>
            ) : null}

            {bottomsheetFormValues.showRangeOption ? (
              <>
                {/* Label "Sampai dengan" */}
                <span className="text-xs font-semibold leading-[13.2px] text-neutral-600">
                  {t("WaktuMuat.untilLabel", {}, "Sampai dengan")}
                </span>

                {/* Field Tanggal Akhir */}
                <DatetimePicker
                  datetimeValue={bottomsheetFormValues.loadTimeEnd}
                  onApply={(date) =>
                    handleChangeBottomsheetFormValues("loadTimeEnd", date)
                  }
                  placeholder={t(
                    "WaktuMuat.selectDateTimePlaceholder",
                    {},
                    "Pilih Tanggal & Waktu Muat"
                  )}
                  disabled={!bottomsheetFormValues.loadTimeStart}
                  status={bottomsheetFormErrors.loadTimeEnd ? "error" : null}
                  className="w-full"
                  minDate={bottomsheetFormValues.loadTimeStart || minDate}
                />
                {bottomsheetFormErrors.loadTimeEnd ? (
                  <span className="text-xs font-medium leading-[13.2px] text-error-400">
                    {bottomsheetFormErrors.loadTimeEnd}
                  </span>
                ) : null}
              </>
            ) : null}
          </div>

          {/* Section Rentang Waktu */}
          <div className="flex flex-col gap-y-3">
            <Checkbox
              disabled={isEditPage}
              label={t(
                "WaktuMuat.withTimeRangeLabel",
                {},
                "Dengan Rentang Waktu"
              )}
              value="showRangeOption"
              checked={bottomsheetFormValues.showRangeOption}
              onChange={(e) =>
                handleChangeBottomsheetFormValues("showRangeOption", e.checked)
              }
            />
            <p className="pl-6 text-xs font-medium leading-[14.4px] text-neutral-600">
              {t(
                "WaktuMuat.timeRangeDescription",
                {},
                "Jika kamu memilih opsi ini, kamu dapat menentukan pukul mulai dan pukul akhir untuk penjemputan muatan."
              )}
            </p>
          </div>
        </div>
        <BottomSheetFooter>
          <Button
            variant="muatparts-primary"
            className="h-10 w-full"
            onClick={handleSubmit}
          >
            {t("WaktuMuat.saveButton", {}, "Simpan")}
          </Button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default WaktuMuatBottomsheet;

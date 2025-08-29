"use client";

import { usePathname } from "next/navigation";

import DatetimePicker from "@/components/DatetimePicker/DatetimePicker";
import Checkbox from "@/components/Form/Checkbox";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import { InfoTooltip } from "@/components/Form/InfoTooltip";

import { useTranslation } from "@/hooks/use-translation";

import {
  OrderStatusEnum,
  OrderTypeEnum,
} from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import { handleFirstTime } from "@/lib/utils/form";

import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

export const WaktuMuat = ({ orderStatus }) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
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
  const formErrors = useSewaArmadaStore((state) => state.formErrors);
  const { setField } = useSewaArmadaActions();

  const handleDateChange = (field, value) => {
    const newDate = new Date(value);
    newDate.setSeconds(0, 0);
    setField(field, newDate);
    if (!isEditPage) {
      setField("truckTypeId", null);
    } else {
      // 25. 18 - Web - LB - 0271
      setField("hasUpdatedForm", true);
    }
  };

  const hasNotDepartedToPickupStatuses = [
    OrderStatusEnum.PREPARE_FLEET,
    OrderStatusEnum.WAITING_PAYMENT_1,
    OrderStatusEnum.WAITING_PAYMENT_2,
    OrderStatusEnum.SCHEDULED_FLEET,
    OrderStatusEnum.CONFIRMED,
  ];

  const hasDepartedToPickup =
    !hasNotDepartedToPickupStatuses.includes(orderStatus);

  // Use current date for minimum date
  const minDate = new Date();

  return (
    <FormContainer>
      <FormLabel required>{t("WaktuMuat.title", {}, "Waktu Muat")}</FormLabel>
      <div className="flex flex-col gap-y-3.5">
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-x-2">
            <DatetimePicker
              disabled={
                isEditPage &&
                (orderType === OrderTypeEnum.INSTANT || hasDepartedToPickup)
              }
              disableDateOnly={!hasDepartedToPickup}
              datetimeValue={loadTimeStart}
              onApply={(date) =>
                handleFirstTime(() => handleDateChange("loadTimeStart", date))
              }
              placeholder={t(
                "WaktuMuat.datetimePlaceholder",
                {},
                "Pilih Tanggal & Waktu Muat"
              )}
              status={formErrors.loadTimeStart ? "error" : null}
              className="w-[271px]"
              minDate={isEditPage ? null : minDate}
            />
            {showRangeOption ? (
              <>
                <span className="text-xs font-medium leading-[14.4px]">
                  {t("WaktuMuat.rangeSeparator", {}, "s/d")}
                </span>
                <DatetimePicker
                  disableDateOnly={!hasDepartedToPickup}
                  datetimeValue={loadTimeEnd}
                  onApply={(date) =>
                    handleFirstTime(() => handleDateChange("loadTimeEnd", date))
                  }
                  placeholder={t(
                    "WaktuMuat.datetimePlaceholder",
                    {},
                    "Pilih Tanggal & Waktu Muat"
                  )}
                  disabled={
                    !loadTimeStart ||
                    (isEditPage &&
                      (orderType === OrderTypeEnum.INSTANT ||
                        hasDepartedToPickup))
                  }
                  status={formErrors.loadTimeEnd ? "error" : null}
                  className="w-[271px]"
                  minDate={isEditPage ? null : minDate}
                />
              </>
            ) : null}
          </div>
          {formErrors.loadTimeStart || formErrors.loadTimeEnd ? (
            <div className="flex items-center gap-x-[34px] text-xs font-medium leading-[14.4px] text-error-400">
              <div className="w-[271px]">{formErrors.loadTimeStart}</div>
              {showRangeOption ? (
                <div className="w-[271px]">{formErrors.loadTimeEnd}</div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex flex-row items-center gap-x-1">
          <Checkbox
            disabled={isEditPage}
            label={t("WaktuMuat.withTimeRange", {}, "Dengan Rentang Waktu")}
            value="rentang_waktu"
            checked={showRangeOption}
            onChange={({ checked }) =>
              handleFirstTime(() => {
                setField("showRangeOption", checked);
                setField("loadTimeEnd", null);
                setField("truckTypeId", null);
              })
            }
          />
          <InfoTooltip className="w-[336px]">
            {t(
              "WaktuMuat.rangeHelp",
              {},
              "Jika kamu memilih opsi ini, kamu dapat menentukan pukul mulai dan pukul akhir untuk penjemputan muatan."
            )}
          </InfoTooltip>
        </div>
      </div>
    </FormContainer>
  );
};

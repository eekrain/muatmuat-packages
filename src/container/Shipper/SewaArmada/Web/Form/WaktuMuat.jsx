"use client";

import { usePathname } from "next/navigation";

import DatetimePicker from "@/components/DatetimePicker/DatetimePicker";
import Checkbox from "@/components/Form/Checkbox";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import { handleFirstTime } from "@/lib/utils/form";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

export const WaktuMuat = () => {
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
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
    setField("truckTypeId", null);
  };

  // Use current date for minimum date
  const minDate = new Date();

  return (
    <FormContainer>
      <FormLabel required>Waktu Muat</FormLabel>
      <div className="flex flex-col gap-y-3.5">
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-x-2">
            <DatetimePicker
              datetimeValue={loadTimeStart}
              onApply={(date) =>
                handleFirstTime(() => handleDateChange("loadTimeStart", date))
              }
              placeholder="Pilih Tanggal & Waktu Muat"
              status={formErrors.loadTimeStart ? "error" : null}
              className="w-[271px]"
              minDate={minDate}
            />
            {showRangeOption ? (
              <>
                <span className="text-[12px] font-medium leading-[14.4px]">
                  s/d
                </span>
                <DatetimePicker
                  datetimeValue={loadTimeEnd}
                  onApply={(date) =>
                    handleFirstTime(() => handleDateChange("loadTimeEnd", date))
                  }
                  placeholder="Pilih Tanggal & Waktu Muat"
                  disabled={!loadTimeStart}
                  status={formErrors.loadTimeEnd ? "error" : null}
                  className="w-[271px]"
                  minDate={minDate}
                />
              </>
            ) : null}
          </div>
          {formErrors.loadTimeStart || formErrors.loadTimeEnd ? (
            <div className="flex items-center gap-x-[34px] text-[12px] font-medium leading-[14.4px] text-error-400">
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
            label="Dengan Rentang Waktu"
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
            Jika kamu memilih opsi ini, kamu dapat menentukan pukul mulai dan
            pukul akhir untuk penjemputan muatan.
          </InfoTooltip>
        </div>
      </div>
    </FormContainer>
  );
};

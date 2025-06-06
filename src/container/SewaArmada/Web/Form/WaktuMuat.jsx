"use client";

import Checkbox from "@/components/Checkbox/Checkbox";
import DatetimePicker from "@/components/DatetimePicker/DatetimePicker";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";
// import SWRHandler from "@/services/useSWRHook";
import { getNowTimezone } from "@/utils/dateTime";

const timezone = {
  id: "Asia/Jakarta",
  offset: "+07:00",
};

export const WaktuMuat = () => {
  const startDate = useSewaArmadaStore((state) => state.formValues.startDate);
  const endDate = useSewaArmadaStore((state) => state.formValues.endDate);
  const showRangeOption = useSewaArmadaStore(
    (state) => state.formValues.showRangeOption
  );
  const formErrors = useSewaArmadaStore((state) => state.formErrors);
  const { setField } = useSewaArmadaActions();

  const handleDateChange = (field, value) => {
    const newDate = new Date(value);
    newDate.setSeconds(0, 0);
    setField(field === "start" ? "startDate" : "endDate", newDate);
  };

  return (
    <FormContainer>
      <FormLabel required>Waktu Muat</FormLabel>
      <div className="flex flex-col gap-y-3.5">
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-x-2">
            <DatetimePicker
              datetimeValue={startDate}
              onApply={(date) => handleDateChange("start", date)}
              placeholder="Pilih Tanggal & Waktu Muat"
              status={formErrors.startDate ? "error" : null}
              className="w-[271px]"
              minDate={getNowTimezone(timezone)}
            />
            {showRangeOption ? (
              <>
                <span className="text-[12px] font-medium leading-[14.4px]">
                  s/d
                </span>
                <DatetimePicker
                  datetimeValue={endDate}
                  onApply={(date) => handleDateChange("end", date)}
                  placeholder="Pilih Tanggal & Waktu Muat"
                  disabled={!startDate}
                  status={formErrors.endDate ? "error" : null}
                  className="w-[271px]"
                  minDate={getNowTimezone(timezone)}
                />
              </>
            ) : null}
          </div>
          {formErrors.startDate || formErrors.endDate ? (
            <div className="flex items-center gap-x-[34px] text-[12px] font-medium leading-[14.4px] text-error-400">
              <div className="w-[271px]">{formErrors.startDate}</div>
              <div className="w-[271px]">{formErrors.endDate}</div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-row items-center gap-x-1">
          <Checkbox
            label="Dengan Rentang Waktu"
            value="rentang_waktu"
            checked={showRangeOption}
            onChange={(e) => setField("showRangeOption", e.checked)}
          />
          <InfoTooltip>
            Jika kamu memilih opsi ini, kamu dapat menentukan pukul mulai dan
            pukul akhir untuk penjemputan muatan.
          </InfoTooltip>
        </div>
      </div>
    </FormContainer>
  );
};

import { useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTrigger,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import DatetimePicker from "@/components/DatetimePicker/DatetimePicker";
import IconComponent from "@/components/IconComponent/IconComponent";
import RadioButton from "@/components/Radio/RadioButton";
import { useSewaArmadaStore } from "@/store/forms/sewaArmadaStore";
import { getNowTimezone } from "@/utils/dateTime";

const WaktuMuatBottomsheet = () => {
  const timezone = {
    id: "Asia/Jakarta",
    offset: "+07:00",
  };
  const { formValues, setField, orderType, setOrderType } =
    useSewaArmadaStore();
  const [formErrors, setFormErrors] = useState({});

  const handleDateChange = (field, value) => {
    const newDate = new Date(value);
    newDate.setSeconds(0, 0);
    setField(field === "start" ? "startDate" : "endDate", newDate);
  };

  const handleOrderTypeChange = (data) => {
    setOrderType(data.value);
  };

  const handleSubmit = () => {
    console.log("Form submitted:");
    // Handle form submission logic here
  };
  return (
    <BottomSheet>
      <BottomSheetTrigger className="flex h-8 w-full items-center gap-x-2 rounded-md border border-neutral-600 bg-neutral-50 px-3">
        <IconComponent src="/icons/calendar16.svg" />
        <span className="text-[14px] font-semibold leading-[15.4px] text-neutral-600">
          Pilih Tanggal & Waktu Muat
        </span>
      </BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader title="Tanggal & Waktu Muat"></BottomSheetHeader>
        <div className="flex h-[380px] w-full flex-col gap-4 overflow-y-auto bg-white px-4 py-6">
          {/* Section Tipe Pengiriman */}
          <div className="flex flex-col gap-4">
            {/* Opsi Instan */}
            <div className="flex flex-col gap-y-3">
              <RadioButton
                name="order_type"
                value="instan"
                checked={orderType === "instan"}
                onClick={handleOrderTypeChange}
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
                name="order_type"
                value="terjadwal"
                checked={orderType === "terjadwal"}
                onClick={handleOrderTypeChange}
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
              datetimeValue={formValues.startDate}
              onApply={(date) => handleDateChange("start", date)}
              placeholder="Pilih Tanggal & Waktu Muat"
              status={formErrors.startDate ? "error" : null}
              className="w-full"
              minDate={getNowTimezone(timezone)}
            />

            {formValues.showRangeOption ? (
              <>
                {/* Label "Sampai dengan" */}
                <span className="text-[12px] font-semibold leading-[13.2px] text-neutral-600">
                  Sampai dengan
                </span>

                {/* Field Tanggal Akhir */}
                <DatetimePicker
                  datetimeValue={formValues.endDate}
                  onApply={(date) => handleDateChange("end", date)}
                  placeholder="Pilih Tanggal & Waktu Muat"
                  disabled={!formValues.startDate}
                  status={formErrors.endDate ? "error" : null}
                  className="w-full"
                  minDate={getNowTimezone(timezone)}
                />
              </>
            ) : null}
          </div>

          {/* Section Rentang Waktu */}
          <div className="flex flex-col gap-y-3">
            <Checkbox
              label="Dengan Rentang Waktu"
              value="rentang_waktu"
              checked={formValues.showRangeOption}
              onChange={(e) => setField("showRangeOption", e.checked)}
            />
            <p className="pl-6 text-[12px] font-medium leading-[14.4px] text-neutral-600">
              Jika kamu memilih opsi ini, kamu dapat menentukan pukul mulai dan
              pukul akhir untuk penjemputan muatan.
            </p>
          </div>

          {/* Button Simpan */}
          <Button
            color="primary"
            className="h-10 max-w-full"
            onClick={handleSubmit}
            type="muatparts"
          >
            Simpan
          </Button>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default WaktuMuatBottomsheet;

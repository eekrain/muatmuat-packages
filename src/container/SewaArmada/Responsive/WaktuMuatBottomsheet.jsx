import { useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTrigger,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import IconComponent from "@/components/IconComponent/IconComponent";
import Input from "@/components/Input/Input";
import RadioButton from "@/components/Radio/RadioButton";

const WaktuMuatBottomsheet = () => {
  const [shippingType, setShippingType] = useState("instan");
  const [startDate, setStartDate] = useState("03 Okt 2024 18:00 WIB");
  const [endDate, setEndDate] = useState("04 Okt 2024 08:00 WIB");
  const [withTimeRange, setWithTimeRange] = useState(true);

  const handleShippingTypeChange = (data) => {
    setShippingType(data.value);
  };

  const handleTimeRangeChange = (data) => {
    setWithTimeRange(data.checked);
  };

  const handleSubmit = () => {
    const formData = {
      shippingType,
      startDate,
      endDate,
      withTimeRange,
    };
    console.log("Form submitted:", formData);
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
                name="shipping_type"
                value="instan"
                checked={shippingType === "instan"}
                onClick={handleShippingTypeChange}
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
                name="shipping_type"
                value="terjadwal"
                checked={shippingType === "terjadwal"}
                onClick={handleShippingTypeChange}
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
            <Input
              type="text"
              value={startDate}
              changeEvent={(e) => setStartDate(e.target.value)}
              icon={{ left: "/icons/calendar.svg" }}
              classInput="font-semibold text-[14px] text-neutral-900 cursor-pointer"
            />

            {/* Label "Sampai dengan" */}
            <span className="text-[12px] font-semibold leading-[13.2px] text-neutral-600">
              Sampai dengan
            </span>

            {/* Field Tanggal Akhir */}
            <Input
              type="text"
              value={endDate}
              changeEvent={(e) => setEndDate(e.target.value)}
              icon={{ left: "/icons/calendar.svg" }}
              classInput="font-semibold text-[14px] text-neutral-900 cursor-pointer"
            />
          </div>

          {/* Section Rentang Waktu */}
          <div className="flex flex-col gap-y-3">
            <Checkbox
              label="Dengan Rentang Waktu"
              checked={withTimeRange}
              onChange={handleTimeRangeChange}
              className="mb-0"
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

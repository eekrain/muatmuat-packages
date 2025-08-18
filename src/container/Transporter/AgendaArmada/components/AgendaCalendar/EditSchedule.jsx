import { useState } from "react";

import Button from "@/components/Button/Button";
import ButtonPlusMinus from "@/components/Form/ButtonPlusMinus";

const DATES = [
  "Jumat, 10",
  "Sabtu, 11",
  "Minggu, 12",
  "Senin, 13",
  "Selasa, 14",
];
const EditSchedule = () => {
  const [days, setDays] = useState(1);

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <div className="font-bold text-neutral-900">Ubah Estimasi</div>
      </div>
      <div className="flex items-center gap-8">
        <div className="text-xs font-medium text-neutral-600">
          Estimasi Waktu Bongkar
        </div>
        <div className="flex items-center gap-2">
          <ButtonPlusMinus />
          <span className="text-xs font-medium text-neutral-900">Hari</span>
        </div>
      </div>
      <div className="mt-6 w-[860px] rounded-md border border-neutral-400">
        <div className="grid h-14 grid-cols-5 items-center border-b border-neutral-200 text-center">
          {DATES.map((date, index) => (
            <div
              key={date}
              className={`text-sm font-semibold text-neutral-900`}
            >
              {date}
            </div>
          ))}
        </div>

        <div className="relative h-[68px] p-1"></div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="warning" className="w-[120px]">
          Simpan
        </Button>
      </div>
    </div>
  );
};

export default EditSchedule;

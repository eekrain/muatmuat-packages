import { useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import RadioButton from "@/components/Radio/RadioButton";
import { cn } from "@/lib/utils";

const PeriodDropdown = ({ isOpen, setIsOpen, options }) => {
  const [tempValue, setTempValue] = useState("");
  return (
    <BottomSheet open={isOpen} onOpenChange={setIsOpen}>
      <BottomSheetContent>
        <BottomSheetHeader>Pilih Periode</BottomSheetHeader>
        <div className="flex flex-col gap-y-4 px-4 py-6">
          {options.map((item, key) => (
            <div
              className={cn(
                "flex w-full items-center justify-between",
                options.length - 1 === key
                  ? ""
                  : "border-b border-b-neutral-400 pb-4"
              )}
              key={key}
            >
              <span className="text-sm font-semibold leading-[1.1] text-neutral-900">
                {item.name}
              </span>
              <RadioButton
                name={item.name}
                value={item.value}
                checked={tempValue === item.value}
                onClick={(data) => setTempValue(data.value)}
              />
            </div>
          ))}
          <Button
            className="h-10 max-w-full"
            variant="muatparts-primary"
            onClick={() => {}}
          >
            Terapkan
          </Button>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default PeriodDropdown;

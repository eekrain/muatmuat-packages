import Image from "next/image";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/BottomSheet/BottomSheetUp";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";

const BottomSheetPreviousDriver = ({ isOpen, setOpen }) => {
  return (
    <BottomSheet open={isOpen} onOpenChange={setOpen}>
      <BottomSheetTrigger asChild>
        <button
          type="button"
          className="w-full text-left text-sm font-semibold"
        >
          Lihat Driver Sebelumnya
        </button>
      </BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>Driver Sebelumnya</BottomSheetTitle>
        </BottomSheetHeader>
        <div className="flex flex-col gap-y-4 p-4 pt-0 text-neutral-900">
          <div className="flex items-center gap-x-3 rounded-xl border border-neutral-400 p-4">
            <Image src="/img/avatar2.png" width={40} height={40} alt="driver" />
            <div className="flex flex-col gap-y-3">
              <span className="text-base font-semibold leading-[1.1]">
                Noel Gallagher
              </span>
              <div className="flex items-center gap-x-1">
                <IconComponent
                  width={12}
                  height={12}
                  src="/icons/transporter12.svg"
                  className="text-neutral-900"
                />
                <span className="text-base font-semibold leading-[1.1]">
                  AE 666 LBA
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="muatparts-primary-secondary"
            onClick={() => {}}
            className="h-10 w-full"
          >
            Detail Status Driver
          </Button>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default BottomSheetPreviousDriver;

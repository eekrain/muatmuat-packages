import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/BottomSheet/BottomSheetUp";
import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

export const InfoBottomsheetDriverCharge = ({ className, title }) => {
  const drivers = [
    {
      name: "HENDRA",
      licensePlate: "B 1234 CD",
      startCharge: "06 Jun 2024 17:01 WIB",
    },
    {
      name: "Bagus Dharmawan",
      licensePlate: "AE 1232 CB",
      startCharge: "06 Jun 2024 17:05 WIB",
    },
    {
      name: "Ragil Poetra",
      licensePlate: "AE 1966 HG",
      startCharge: "06 Jun 2024 17:08 WIB",
    },
  ];

  return (
    <BottomSheet>
      <BottomSheetTrigger
        className={cn("block size-4 text-neutral-700", className)}
      >
        <IconComponent src="/icons/info16.svg" width={16} height={16} />
      </BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>{title}</BottomSheetTitle>
        </BottomSheetHeader>
        <div className="info-bottomsheet-content px-4 pb-6 text-neutral-900">
          <div className="flex flex-col gap-y-4">
            {drivers.map((driver, key) => (
              <div
                className={cn(
                  "flex flex-col gap-y-3",
                  drivers.length - 1 === key
                    ? ""
                    : "border-b border-b-neutral-400 pb-4"
                )}
                key={key}
              >
                <div className="flex flex-col gap-y-2">
                  <div className="text-sm font-semibold leading-[1.1]">
                    Driver : {driver.name}
                  </div>
                  <div className="flex items-center gap-x-1">
                    <IconComponent
                      src="/icons/transporter12.svg"
                      width={12}
                      height={12}
                    />
                    <span className="text-xs font-medium leading-[1.1]">
                      {driver.licensePlate}
                    </span>
                  </div>
                </div>
                <div className="text-xs font-medium leading-[1.1]">
                  {`Biaya Waktu Tunggu di Lokasi Muat 1 Berlaku Mulai ${driver.startCharge}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

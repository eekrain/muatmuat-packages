import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/Bottomsheet/BottomSheet";
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
        <div className="info-bottomsheet-content px-4 py-6 text-sm font-medium leading-[1.1]">
          <div>
            {drivers.map((driver, idx) => (
              <div
                key={driver.licensePlate + driver.name + idx}
                className="mb-4 last:mb-0"
              >
                <div className="mb-1 font-bold text-black">
                  Driver : {driver.name}
                </div>
                <div className="mb-1 flex items-center gap-1">
                  <IconComponent
                    src="/icons/transporter12.svg"
                    width={16}
                    height={16}
                  />
                  <span className="text-sm text-black">
                    {driver.licensePlate}
                  </span>
                </div>
                <div className="mb-1 text-sm text-black">
                  Biaya Waktu Tunggu di Lokasi Muat Berlaku Mulai
                </div>
                <div className="text-sm text-black">{driver.startCharge}</div>
                {idx !== drivers.length - 1 && (
                  <hr className="my-4 border-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

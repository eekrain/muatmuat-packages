import { useParams } from "next/navigation";

import { format } from "date-fns";
import { id } from "date-fns/locale/id";

import { useGetWaitingTime } from "@/services/Shipper/detailpesanan/getWaitingTime";

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
  const params = useParams();
  const { data: waitingTimeData } = useGetWaitingTime(params.orderId);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return format(date, "dd MMM yyyy HH:mm 'WIB'", { locale: id });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "";
    }
  };

  // Transform API data to match the component structure
  const drivers =
    waitingTimeData?.map((item) => ({
      name: item.name,
      licensePlate: item.licensePlate || "N/A",
      startCharge: formatDate(item.data?.[0]?.startDate),
    })) || [];

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

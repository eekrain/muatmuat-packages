import { useMemo } from "react";

import { Alert } from "@/components/Alert/Alert";
import { useTranslation } from "@/hooks/use-translation";
import { formatDate } from "@/lib/utils/dateFormat";

const CUSTOM = {
  MUAT: "Estimasi Tiba di Lokasi Muat {index}",
  BONGKAR: "Estimasi Tiba di Lokasi Bongkar {index}",
};

export const EstimatedArrival = ({ arrivalTime, driverStatus }) => {
  const { t } = useTranslation();
  const isShowEstimatedArrival = driverStatus?.startsWith("MENUJU_");
  const label = useMemo(() => {
    if (!driverStatus) return "";
    const index = driverStatus.split("_").slice(-1)[0];
    const label = driverStatus?.startsWith("MUAT")
      ? CUSTOM.MUAT
      : CUSTOM.BONGKAR;
    return label.replace("{index}", index || "");
  }, [driverStatus]);

  if (!isShowEstimatedArrival) return null;

  return (
    <Alert variant="warning" className="mb-2 h-[45px] p-3">
      <div className="flex w-full items-center justify-between">
        {/* Left Side: Icon + Label */}
        <p className="w-[100px] text-xs font-medium leading-[13.2px] text-neutral-900">
          {label}
        </p>

        {/* Right Side: Date/Time */}
        <p className="text-xs font-semibold leading-[13.2px] text-neutral-900">
          {formatDate(arrivalTime)}
        </p>
      </div>
    </Alert>
  );
};

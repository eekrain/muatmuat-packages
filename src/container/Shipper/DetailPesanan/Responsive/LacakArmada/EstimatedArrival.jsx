import { useMemo } from "react";

import { Alert } from "@/components/Alert/Alert";
import { useTranslation } from "@/hooks/use-translation";
import { DriverStatusLabel } from "@/lib/constants/detailpesanan/driver-status.enum";
import { formatDate } from "@/lib/utils/dateFormat";

export const EstimatedArrival = ({ arrivalTime, driverStatus }) => {
  const { t } = useTranslation();
  const isShowEstimatedArrival = driverStatus?.startsWith("MENUJU_");
  const label = useMemo(() => {
    // Driver status pasti bakalan "MENUJU_blabla"
    // Nah tinggal kita convert jadi "TIBA_blabla"
    const replaced = driverStatus?.replace("MENUJU_", "TIBA_");
    const index = parseInt(driverStatus?.split("_").slice(-1)[0]);
    // Tinggal panggil enum label
    // return `${t(DriverStatusLabel[replaced], { index: 1 })}`;
    return t(
      t(
        "LacakArmadaScreen.labelEstimasiTibaLokasi",
        {
          labelTiba: t(
            DriverStatusLabel[replaced],
            { index },
            "Tiba di Lokasi Bongkar 1"
          ),
        },
        "Estimasi Tiba di Lokasi Bongkar 1"
      )
    );
  }, [t, driverStatus]);

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

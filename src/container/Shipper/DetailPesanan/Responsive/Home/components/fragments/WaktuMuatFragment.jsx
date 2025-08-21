import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dateFormat";

export const WaktuMuatFragment = ({ dataRingkasanPesanan, className }) => {
  return (
    <div className={cn("mt-6 flex flex-col gap-3", className)}>
      <h3 className="text-sm font-semibold text-neutral-900">Waktu Muat</h3>
      <p className="text-xs font-semibold text-neutral-900">
        {formatDate(dataRingkasanPesanan?.loadTimeStart, { padDay: true })}
        {dataRingkasanPesanan?.loadTimeEnd
          ? ` s/d ${formatDate(dataRingkasanPesanan?.loadTimeEnd, { padDay: true })}`
          : ""}
      </p>
    </div>
  );
};

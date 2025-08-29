import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dateFormat";

export const WaktuMuatFragment = ({ dataRingkasanPesanan, className }) => {
  const { t } = useTranslation();

  const start = formatDate(dataRingkasanPesanan?.loadTimeStart, {
    padDay: true,
  });
  const end = dataRingkasanPesanan?.loadTimeEnd
    ? formatDate(dataRingkasanPesanan?.loadTimeEnd, { padDay: true })
    : null;

  return (
    <div className={cn("mt-6 flex flex-col gap-3", className)}>
      <h3 className="text-sm font-semibold text-neutral-900">
        {t("WaktuMuatFragment.title", {}, "Waktu Muat")}
      </h3>
      <p className="text-xs font-semibold text-neutral-900">
        {start}
        {end ? ` s/d ${end}` : ""}
      </p>
    </div>
  );
};

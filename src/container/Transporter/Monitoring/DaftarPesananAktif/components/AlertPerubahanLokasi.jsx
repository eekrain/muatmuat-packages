import { X } from "lucide-react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";

function AlertPerubahanLokasi({
  ordersWithChanges = [],
  isFiltered = false,
  onViewOrders,
  onBackToDefault,
  onClose,
  isVisible = true,
}) {
  const { t } = useTranslation();

  // Hide alert if explicitly set to not visible
  if (!isVisible) {
    return null;
  }

  // Hide alert if no orders with changes exist
  if (ordersWithChanges.length === 0) {
    return null;
  }

  const changeCount = ordersWithChanges.length;

  return (
    <div className="flex items-center justify-between gap-1 bg-secondary-100 px-4 py-2 text-xs">
      <div className="flex items-center gap-1">
        <IconComponent src={"/icons/warning16.svg"} className="h-4 w-4" />
        {t(
          "AlertPerubahanLokasi.changeMessage",
          { count: changeCount },
          `Terdapat perubahan lokasi muat dan jam muat pada ${changeCount} pesanan.`
        )}
        {!isFiltered ? (
          <button
            className="cursor-pointer font-medium text-primary-700"
            onClick={onViewOrders}
          >
            {t("AlertPerubahanLokasi.viewOrders", {}, "Lihat Pesanan")}
          </button>
        ) : (
          <button
            className="cursor-pointer font-medium text-primary-700"
            onClick={onBackToDefault}
          >
            {t("AlertPerubahanLokasi.backToDefault", {}, "Kembali Ke Default")}
          </button>
        )}
      </div>
      <button onClick={onClose}>
        <X className="h-[14px] w-[14px] text-primary-700" />
      </button>
    </div>
  );
}

export default AlertPerubahanLokasi;

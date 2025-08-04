import { useState } from "react";

import { ChevronUp } from "lucide-react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";
import { OrderStatusTitle } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { cn } from "@/lib/utils";

export const KeteranganStatusPesanan = ({ legendStatus }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useTranslation();

  if (!legendStatus?.stepperData?.length) return null;

  return (
    <div className="bg-white px-4 py-5">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-sm p-0 outline-none"
        aria-expanded={isOpen}
        aria-controls="collapsible-legends"
      >
        <h3 className="font-bold text-neutral-900">
          {t("titleOrderStatusInfo", {}, "Keterangan Status Pesanan")}
        </h3>
        <div className="flex-shrink-0">
          <ChevronUp
            className={cn(
              "h-4 w-4 text-gray-600 transition-transform duration-300 ease-in-out",
              isOpen ? "rotate-0" : "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        id="collapsible-legends"
        className={cn(
          "flex flex-col gap-3 overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[1000px] pt-3 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {legendStatus.stepperData.map((item) => (
          <div key={item.status} className="flex items-center gap-2">
            <div className="relative flex h-6 w-6 items-center justify-center rounded-full border border-[#FFC217] bg-[#FFC217] transition-all duration-300">
              <IconComponent
                src={item.icon}
                width={16}
                height={16}
                className="text-muat-trans-primary-900"
              />
            </div>
            <span className="text-xs font-semibold text-neutral-900">
              {t(OrderStatusTitle[item.status])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

import { usePathname } from "next/navigation";

import IconComponent from "@/components/IconComponent/IconComponent";
import { OrderTypeEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { cn } from "@/lib/utils";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

export const ServiceTypeSelect = () => {
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
  const orderType = useSewaArmadaStore((state) => state.orderType);
  const { setOrderType } = useSewaArmadaActions();

  return (
    <div className="flex justify-center gap-3">
      {/* Instan Card - Active */}
      <button
        className={cn(
          "flex h-[136px] w-[385px] cursor-pointer flex-col items-center justify-center gap-y-3 rounded-xl border border-neutral-400 bg-white p-6 hover:border-[#FFC217]",
          orderType === OrderTypeEnum.INSTANT
            ? isEditPage
              ? "cursor-not-allowed border-neutral-600 bg-neutral-200 hover:border-neutral-600 hover:bg-neutral-200"
              : "border-[#FFC217] bg-[#FFF5C6]"
            : isEditPage && "cursor-not-allowed hover:border-neutral-400"
        )}
        disabled={isEditPage}
        onClick={() => setOrderType(OrderTypeEnum.INSTANT)}
      >
        <div className="flex size-8 items-center justify-center">
          <IconComponent
            src="/icons/muattrans-instan.svg"
            width={32}
            height={32}
          />
        </div>
        <h3 className="text-sm font-semibold text-black">Instan</h3>
        <p className="max-w-[294px] text-center text-xs font-medium text-neutral-600">
          Pesan jasa angkut untuk penjemputan dan pengiriman segera atau di
          Hari+1.
        </p>
      </button>

      {/* Terjadwal Card - Inactive */}
      <button
        className={cn(
          "flex h-[136px] w-[385px] cursor-pointer flex-col items-center justify-center gap-y-3 rounded-xl border border-neutral-400 bg-white p-6 hover:border-[#FFC217]",
          orderType === OrderTypeEnum.SCHEDULED
            ? isEditPage
              ? "cursor-not-allowed border-neutral-600 bg-neutral-200 hover:border-neutral-600 hover:bg-neutral-200"
              : "border-[#FFC217] bg-[#FFF5C6]"
            : isEditPage && "cursor-not-allowed hover:border-neutral-400"
        )}
        disabled={isEditPage}
        onClick={() => setOrderType(OrderTypeEnum.SCHEDULED)}
      >
        <div className="flex size-8 items-center justify-center">
          <IconComponent
            src="/icons/muattrans-terjadwal32.svg"
            width={32}
            height={32}
          />
        </div>
        <h3 className="text-sm font-semibold text-black">Terjadwal</h3>
        <p className="max-w-[294px] text-center text-xs font-medium text-neutral-600">
          Pesan jasa angkut untuk penjemputan dan pengiriman di Hari+2 sampai
          dengan Hari+30.
        </p>
      </button>
    </div>
  );
};

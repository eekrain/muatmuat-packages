import Image from "next/image";

import { cn } from "@/lib/cn";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

export const ServiceTypeSelect = () => {
  const orderType = useSewaArmadaStore((state) => state.formValues.orderType);
  const { setField } = useSewaArmadaActions();

  return (
    <div className="flex justify-center gap-3">
      {/* Instan Card - Active */}
      <div
        className={cn(
          "flex h-[136px] w-[385px] cursor-pointer flex-col items-center justify-center gap-y-3 rounded-xl border border-neutral-400 bg-white p-6 hover:border-[#FFC217]",
          orderType === "instan" && "border-[#FFC217] bg-[#FFF5C6]"
        )}
        onClick={() => setField("orderType", "instan")}
      >
        <div className="relative h-8 w-8">
          <Image
            src="/icons/muattrans-instan.svg"
            alt="Instan"
            width={32}
            height={32}
          />
        </div>
        <h3 className="text-sm font-semibold text-black">Instan</h3>
        <p className="max-w-[294px] text-center text-xs font-medium text-neutral-600">
          Pesan jasa angkut untuk penjemputan dan pengiriman segera atau di
          Hari+1.
        </p>
      </div>

      {/* Terjadwal Card - Inactive */}
      <div
        className={cn(
          "flex h-[136px] w-[385px] cursor-pointer flex-col items-center justify-center gap-y-3 rounded-xl border border-neutral-400 bg-white p-6 hover:border-[#FFC217]",
          orderType === "terjadwal" && "border-[#FFC217] bg-[#FFF5C6]"
        )}
        onClick={() => setField("orderType", "terjadwal")}
      >
        <div className="relative h-8 w-8">
          <Image
            src="/icons/muattrans-terjadwal32.svg"
            alt="Terjadwal"
            width={32}
            height={32}
          />
        </div>
        <h3 className="text-sm font-semibold text-black">Terjadwal</h3>
        <p className="max-w-[294px] text-center text-xs font-medium text-neutral-600">
          Pesan jasa angkut untuk penjemputan dan pengiriman di Hari+2 sampai
          dengan Hari+30.
        </p>
      </div>
    </div>
  );
};

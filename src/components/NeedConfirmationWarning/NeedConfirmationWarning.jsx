import Link from "next/link";

import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

const NeedConfirmationWarning = ({ className }) => {
  return (
    <div
      className={cn(
        "mt-6 flex h-14 items-center gap-x-3 rounded-xl bg-secondary-100 px-6 py-4",
        className
      )}
    >
      <IconComponent
        className="icon-stroke-warning-900"
        src="/icons/warning24.svg"
        size="medium"
      />
      <div className="flex items-center gap-x-1 text-[12px] font-semibold leading-[14.4px] text-neutral-900">
        <span>Terdapat pesanan yang membutuhkan konfirmasi</span>
        <Link
          className="text-primary-700"
          href="/daftarpesanan/butuhkonfirmasianda"
        >
          Lihat Pesanan
        </Link>
      </div>
    </div>
  );
};

export default NeedConfirmationWarning;

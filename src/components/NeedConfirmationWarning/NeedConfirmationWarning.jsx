import Link from "next/link";

import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

const NeedConfirmationWarning = ({ className, breakdown }) => {
  if (
    breakdown.prepareFleetCount === 0 ||
    breakdown.paymentRepaymentCount === 0
  ) {
    return (
      <div
        className={cn(
          "mt-6 flex h-14 rounded-xl bg-secondary-100 px-6 py-4",
          className
        )}
      >
        {breakdown.prepareFleetCount > 0 ||
        breakdown.paymentRepaymentCount === 0 ? (
          <div className="flex items-center gap-x-3">
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
        ) : null}
        {breakdown.prepareFleetCount === 0 ||
        breakdown.paymentRepaymentCount > 0 ? (
          <div className="flex items-center gap-x-3">
            <IconComponent
              className="icon-stroke-warning-900"
              src="/icons/warning24.svg"
              size="medium"
            />
            <div className="flex items-center gap-x-1 text-[12px] font-semibold leading-[14.4px] text-neutral-900">
              <span>Terdapat pesanan yang menunggu pelunasan</span>
              <Link
                className="text-primary-700"
                href="/daftarpesanan/pesananmenunggupelunasan"
              >
                Lihat Pesanan
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mt-6 flex h-[92px] rounded-xl bg-secondary-100 px-6 py-4",
        className
      )}
    >
      <div className="flex w-full flex-col gap-y-3">
        <div className="flex items-center gap-x-2">
          <IconComponent
            className="icon-stroke-warning-900"
            src="/icons/warning24.svg"
            size="medium"
          />
          <span className="text-[12px] font-semibold leading-[14.4px] text-neutral-900">
            Pemberitahuan:
          </span>
        </div>
        <ul className="w-full list-disc pl-10 text-[12px] font-semibold leading-[14.4px] text-neutral-900">
          <li>
            <div className="flex items-center gap-x-1">
              <span>Terdapat pesanan yang menunggu pelunasan</span>
              <Link
                className="text-primary-700"
                href="/daftarpesanan/butuhkonfirmasianda"
              >
                Lihat Pesanan
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center gap-x-1">
              <span>Terdapat pesanan yang membutuhkan konfirmasi</span>
              <Link
                className="text-primary-700"
                href="/daftarpesanan/pesananmenunggupelunasan"
              >
                Lihat Pesanan
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NeedConfirmationWarning;

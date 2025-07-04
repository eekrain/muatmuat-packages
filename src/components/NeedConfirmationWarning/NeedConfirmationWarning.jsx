import Link from "next/link";

import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

const NeedConfirmationWarning = ({ className, settlementAlertInfo }) => {
  const { t } = useTranslation();
  const hasMultipleStatusPending =
    settlementAlertInfo.filter((item) => item.orderId.length > 0).length >= 2;
  const statusPendingIndex = settlementAlertInfo.findIndex(
    (item) => item.orderId.length > 0
  );
  const listPesananUrl = [
    "/daftarpesanan/pesananmenunggupembayaran",
    "/daftarpesanan/pesananmenunggupelunasan",
    "/daftarpesanan/butuhkonfirmasianda",
  ];

  if (hasMultipleStatusPending) {
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
            {settlementAlertInfo.map((item, key) => {
              if (item.orderId.length === 0) {
                return null;
              }
              return (
                <li key={key}>
                  <div className="flex items-center gap-x-1">
                    <span>{t(item.alertText)}</span>
                    <Link
                      className="text-primary-700"
                      href={
                        item.orderId.length === 1
                          ? `/daftarpesanan/detailpesanan/${item.orderId[0]}`
                          : listPesananUrl[key]
                      }
                    >
                      Lihat Pesanan
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mt-6 flex h-14 rounded-xl bg-secondary-100 px-6 py-4",
        className
      )}
    >
      <div className="flex items-center gap-x-3">
        <IconComponent
          className="icon-stroke-warning-900"
          src="/icons/warning24.svg"
          size="medium"
        />
        <div className="flex items-center gap-x-1 text-[12px] font-semibold leading-[14.4px] text-neutral-900">
          <span>{settlementAlertInfo[statusPendingIndex].alertText}</span>
          <Link
            className="text-primary-700"
            href={
              settlementAlertInfo[statusPendingIndex].orderId.length === 1
                ? `/daftarpesanan/detailpesanan/${settlementAlertInfo[statusPendingIndex].orderId[0]}`
                : listPesananUrl[statusPendingIndex]
            }
          >
            Lihat Pesanan
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NeedConfirmationWarning;

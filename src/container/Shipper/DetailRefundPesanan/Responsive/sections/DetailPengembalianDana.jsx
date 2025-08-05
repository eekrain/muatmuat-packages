import WaitingTimeBottomsheet from "@/components/BottomSheet/WaitingTimeBottomsheet";
import Section from "@/container/Shipper/DetailRefundPesanan/Responsive/sections/Section";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { cn } from "@/lib/utils";
import { idrFormat } from "@/lib/utils/formatters";

const DetailPengembalianDana = ({ breakdown, waitingTimeRaw }) => {
  const refundSummary = useShallowMemo(() => {
    if (!breakdown) return [];
    return [
      {
        content: [
          {
            title: "Biaya Pesan Jasa Angkut",
            children: [
              {
                label: "Nominal Pesan Jasa Angkut",
                price: breakdown ? idrFormat(breakdown.originalAmount) : "-",
              },
            ],
          },
          ...(waitingTimeRaw.length > 0
            ? [
                {
                  title: "Biaya Waktu Tunggu",
                  children: [
                    {
                      isWaitingTime: true,
                      label: "Nominal Waktu Tunggu (1 Driver)",
                      fee: breakdown
                        ? idrFormat(breakdown.waitingTimeFee)
                        : "-",
                    },
                  ],
                },
              ]
            : []),
          {
            title: "Biaya Administrasi",
            children: [
              {
                label: "Admin Pembatalan",
                fee: breakdown ? `-${idrFormat(breakdown.penaltyAmount)}` : "-",
              },
            ],
          },
        ],
      },
      {
        content: [
          {
            title: "Biaya Lainnya",
            children: [
              {
                label: "Admin Refund",
                fee: breakdown ? `-${idrFormat(breakdown.adminFee)}` : "-",
              },
            ],
          },
        ],
      },
    ];
  }, [breakdown]);

  return (
    <Section title="Detail Pengembalian Dana">
      {refundSummary.map((item, key) => (
        <div
          className={cn(
            "flex flex-col gap-y-6",
            refundSummary.length - 1 === key
              ? ""
              : "border-b-[1.5px] border-b-neutral-200 pb-6"
          )}
          key={key}
        >
          {item.content.map((item, key) => (
            <div className="flex flex-col gap-y-4" key={key}>
              <h4 className="text-sm font-semibold text-neutral-900">
                {item.title}
              </h4>
              {item.children.map((child, key) => {
                if (child?.isWaitingTime) {
                  return (
                    <div className="flex flex-col gap-y-2" key={key}>
                      <div className="flex justify-between gap-x-7 text-sm font-medium text-neutral-900">
                        <div className="max-w-[160px]">{child.label}</div>
                        <span
                          className={cn(
                            child?.fee ? "text-error-400" : "text-neutral-900"
                          )}
                        >
                          {child?.price || child?.fee}
                        </span>
                      </div>
                      <WaitingTimeBottomsheet waitingTimeRaw={waitingTimeRaw} />
                    </div>
                  );
                }
                return (
                  <div
                    className="flex items-center justify-between gap-x-7 text-sm font-medium text-neutral-900"
                    key={key}
                  >
                    <span>{child.label}</span>
                    <span
                      className={cn(
                        child?.fee ? "text-error-400" : "text-neutral-900"
                      )}
                    >
                      {child?.price || child?.fee}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
      <div className="flex items-center justify-between gap-x-7 text-sm font-semibold leading-[1.1] text-neutral-900">
        <span>Total Pengembalian Dana</span>
        <span className="">
          {breakdown ? idrFormat(breakdown.totalRefundAmount) : "-"}
        </span>
      </div>
    </Section>
  );
};

export default DetailPengembalianDana;

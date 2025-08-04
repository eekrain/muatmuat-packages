import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/Bottomsheet/BottomSheet";
import IconComponent from "@/components/IconComponent/IconComponent";
import Section from "@/container/Shipper/DetailRefundPesanan/Responsive/sections/Section";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dateFormat";
import { idrFormat } from "@/lib/utils/formatters";

const WaitingTimeBottomsheet = ({ waitingTimeRaw }) => {
  // Calculate total from all drivers' data
  const totalAmount = useShallowMemo(
    () =>
      waitingTimeRaw
        .flatMap((item) => item.data)
        .map((item) => item.totalPrice),
    [waitingTimeRaw]
  );
  return (
    <BottomSheet>
      <BottomSheetTrigger className="w-fit text-sm font-semibold leading-[1.1] text-primary-700">
        Lihat Detail Waktu Tunggu
      </BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>Detail Waktu Tunggu</BottomSheetTitle>
        </BottomSheetHeader>
        <div className="flex flex-col gap-y-6 px-4 pb-6">
          <div className="flex h-[38px] items-center gap-x-2.5 rounded-md bg-warning-100 px-3">
            <div className="size-5">
              <IconComponent
                className="text-secondary-400"
                src="/icons/warning20.svg"
                width={20}
                height={20}
              />
            </div>
            <span className="text-xs font-medium text-neutral-900">
              FREE untuk 12 jam awal dan dikenakan biaya waktu tunggu lebih dari
              12 jam
            </span>
          </div>
          <div className="flex flex-col gap-y-6">
            {waitingTimeRaw.map((item, key) => (
              <div className="flex flex-col gap-y-4" key={key}>
                <div className="flex flex-col gap-y-6">
                  {item.data.map((child, index) => (
                    <div
                      className={cn(
                        "flex flex-col gap-y-3 border-b border-b-neutral-400",
                        waitingTimeRaw.length - 1 === key &&
                          item.data.length - 1 === index
                          ? "pb-6"
                          : "pb-4"
                      )}
                      key={index}
                    >
                      <span className="text-sm font-semibold leading-[1.1] text-neutral-900">{`Driver : ${item.name}`}</span>
                      <div className="flex flex-col gap-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold leading-[1.1] text-neutral-900">
                          <span>{child.detail}</span>
                          <span>{idrFormat(child.totalPrice)}</span>
                        </div>
                      </div>
                      <span className="text-xs font-medium leading-[1.1] text-neutral-600">
                        {`${formatDate(child.startDate)} s/d ${formatDate(child.endDate)}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm font-semibold leading-[1.1] text-neutral-900">
              <h4>Total</h4>
              <span>{idrFormat(totalAmount)}</span>
            </div>
          </div>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

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

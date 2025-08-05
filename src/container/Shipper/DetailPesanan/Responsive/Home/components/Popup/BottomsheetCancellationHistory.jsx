import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/BottomSheet/BottomSheetUp";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dateFormat";

const BottomsheetCancellationHistory = ({ cancellationHistory }) => {
  const cancellationHistoryMapped = useShallowMemo(
    () => [
      {
        title: "Dibatalkan Oleh",
        value: cancellationHistory.cancelledBy,
      },
      {
        title: "Tanggal Pembatalan",
        value: formatDate(cancellationHistory.cancelledAt),
      },
      {
        title: "Alasan Pembatalan",
        value:
          cancellationHistory.reason.additionalInfo ||
          cancellationHistory.reason.reasonName,
      },
    ],
    [cancellationHistory]
  );
  return (
    <BottomSheet>
      <BottomSheetTrigger className="flex w-full items-center justify-between border-b border-b-neutral-400 pb-4">
        <span className="text-xs font-semibold leading-[1.1] text-primary-700">
          Lihat Alasan Pembatalan
        </span>
        <IconComponent src="/icons/chevron-right.svg" />
      </BottomSheetTrigger>
      <BottomSheetContent>
        {/* Header */}
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>Alasan Pembatalan</BottomSheetTitle>
        </BottomSheetHeader>
        <div className="flex flex-col gap-y-5 px-4 pb-6">
          {cancellationHistoryMapped.map((item, key) => (
            <div
              className={cn(
                "flex flex-col gap-y-4 font-semibold leading-[1.1] text-neutral-900",
                cancellationHistoryMapped.length - 1 === key
                  ? ""
                  : "border-b border-b-neutral-400 pb-5"
              )}
              key={key}
            >
              <h4 className="text-sm">{item.title}</h4>
              <span className="text-xs">{item.value}</span>
            </div>
          ))}
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default BottomsheetCancellationHistory;

import Image from "next/image";

export const VoucherAppliedCard = ({
  selectedVoucher,
  onOpenVoucherSelection,
}) => {
  if (!selectedVoucher) {
    return null;
  }

  return (
    <div className="flex w-full flex-col rounded bg-primary-50">
      <div
        className="flex cursor-pointer items-center justify-between rounded-lg bg-blue-50 p-3 transition-colors hover:bg-blue-100"
        onClick={onOpenVoucherSelection}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
            ✓
          </div>
          <span className="text-xs font-medium text-blue-900">
            1 Voucher Terpakai
          </span>
        </div>
        <Image
          src="/icons/right-arrow-voucher.png"
          width={18}
          height={18}
          alt="right-arrow"
        />
      </div>
    </div>
  );
};

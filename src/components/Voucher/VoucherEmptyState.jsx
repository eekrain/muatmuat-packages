import Image from "next/image";

const VoucherEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {/* This SVG is a more accurate representation based on the image provided earlier. */}
      <Image
        src="/icons/NotFoundVoucher.png"
        alt="Voucher"
        width={151}
        height={122}
      />
      <p className="text-[16px] font-medium text-neutral-600">
        Belum Ada Voucher
      </p>
    </div>
  );
};

export default VoucherEmptyState;

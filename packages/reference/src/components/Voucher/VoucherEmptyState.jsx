import Image from "next/image";

import { useTranslation } from "@/hooks/use-translation";

const VoucherEmptyState = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {/* This SVG is a more accurate representation based on the image provided earlier. */}
      <Image
        src="/icons/NotFoundVoucher.png"
        alt="Voucher"
        width={151}
        height={122}
      />
      <p className="text-base font-medium text-neutral-600">
        {t("VoucherEmptyState.titleNoVouchers", {}, "Belum Ada Voucher")}
      </p>
    </div>
  );
};

export default VoucherEmptyState;

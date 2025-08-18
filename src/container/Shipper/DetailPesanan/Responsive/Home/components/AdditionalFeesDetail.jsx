import BiayaOverloadMuatanBottomsheet from "@/components/BottomSheet/BiayaOverloadMuatanBottomsheet";
import WaitingTimeBottomsheet from "@/components/BottomSheet/WaitingTimeBottomsheet";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { idrFormat } from "@/lib/utils/formatters";

/**
 * Komponen utama yang menampilkan detail biaya tambahan.
 * Menggunakan BottomSheet untuk menampilkan detail waktu tunggu.
 */
const AdditionalFeesDetail = ({ priceCharge, waitingTimeRaw }) => {
  const { t } = useTranslation();

  // Jika tidak ada biaya tambahan, jangan tampilkan komponen
  if (
    !priceCharge ||
    (!priceCharge.waitingFee?.totalAmount &&
      !priceCharge.adminFee &&
      !priceCharge.overloadFee?.totalAmount)
  ) {
    return null;
  }

  const hasWaitingFee = priceCharge.waitingFee?.totalAmount > 0;
  const hasAdminFee = priceCharge.adminFee > 0;
  const hasOverloadFee = priceCharge.overloadFee?.totalAmount > 0;

  return (
    <div className="flex flex-col gap-y-6 bg-neutral-50 px-4 py-5">
      <h2 className="text-sm font-bold leading-[1.1] text-neutral-900">
        {t("AdditionalFeesDetail.title", {}, "Detail Tambahan Biaya")}
      </h2>

      <div
        className={cn(
          "flex flex-col gap-y-6",
          (hasWaitingFee || hasOverloadFee) && hasAdminFee
            ? "border-b border-b-neutral-400 pb-6"
            : ""
        )}
      >
        {/* Bagian Biaya Waktu Tunggu */}
        {hasWaitingFee && (
          <div className="flex flex-col gap-y-4">
            <p className="text-sm font-semibold text-neutral-900">
              {t(
                "AdditionalFeesDetail.waitingFeeTitle",
                {},
                "Biaya Waktu Tunggu"
              )}
            </p>
            <div className="flex items-start justify-between gap-x-[67px]">
              <div className="flex flex-col gap-y-2">
                {/* gk tau knp ada yg 1x24 jamnya ada yg ga. misteri?? */}
                {/* di informasi biaya tunggu gini */}
                {/* di reimbursement gini */}
                {/* {`Nominal Waktu Tunggu (1x24 Jam) - ${priceCharge.waitingFee.totalDriver || 0} Driver`} */}
                <span
                  className="text-xs font-medium text-neutral-900"
                  dangerouslySetInnerHTML={{
                    __html: `
                    ${t("AdditionalFeesDetail.waitingFeeNominal", {}, "Nominal Waktu Tunggu")}
                    <br />(${priceCharge.waitingFee.totalDriver || 0} ${t("AdditionalFeesDetail.driver", {}, "Driver")})
                  `,
                  }}
                />
                {/* BottomSheet untuk detail waktu tunggu */}
                <WaitingTimeBottomsheet waitingTimeData={waitingTimeRaw} />
              </div>
              <span className="text-xs font-medium text-neutral-900">
                {idrFormat(priceCharge.waitingFee.totalAmount)}
              </span>
            </div>
          </div>
        )}

        {/* Bagian Biaya Kelebihan Muatan */}
        {hasOverloadFee && (
          <div className={`flex flex-col gap-y-4`}>
            <p className="text-sm font-semibold text-neutral-900">
              {t(
                "AdditionalFeesDetail.overloadFeeTitle",
                {},
                "Biaya Overload Muatan"
              )}
            </p>
            <div className="flex items-start justify-between gap-x-[67px] text-xs font-medium text-neutral-900">
              <div className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-2">
                  <span>
                    {t(
                      "AdditionalFeesDetail.overloadFeeNominal",
                      {},
                      "Nominal Overload Muatan"
                    )}
                  </span>
                  <span>
                    {`(${priceCharge.overloadFee.totalWeight} ${priceCharge.overloadFee.weightUnit})`}
                  </span>
                </div>
                {/* BottomSheet overload muatan */}
                <BiayaOverloadMuatanBottomsheet />
              </div>
              <span className="text-sm font-semibold text-neutral-900">
                {idrFormat(priceCharge.overloadFee.totalAmount)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bagian Biaya Lainnya */}
      {hasAdminFee && (
        <div className="flex flex-col gap-y-4">
          <p className="text-sm font-semibold text-neutral-900">
            {t("AdditionalFeesDetail.otherFeesTitle", {}, "Biaya Lainnya")}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-600">
              {t("AdditionalFeesDetail.adminService", {}, "Admin Layanan")}
            </span>
            <span className="text-sm font-medium text-neutral-900">
              {idrFormat(priceCharge.adminFee)}
            </span>
          </div>
        </div>
      )}

      {/* Total Biaya Tambahan */}
      {/* {priceCharge.totalCharge > 0 && (
        <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
          <span className="text-sm font-bold text-neutral-900">
            Total Biaya Tambahan
          </span>
          <span className="text-sm font-bold text-neutral-900">
            {idrFormat(priceCharge.totalCharge)}
          </span>
        </div>
      )} */}

      {/* Status Pembayaran */}
      {/* {priceCharge.totalCharge > 0 && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-neutral-800">Status Pembayaran</span>
          <span
            className={`text-sm font-semibold ${
              priceCharge.isPaid ? "text-success-700" : "text-error-700"
            }`}
          >
            {priceCharge.isPaid ? "Sudah Dibayar" : "Belum Dibayar"}
          </span>
        </div>
      )} */}
    </div>
  );
};

export default AdditionalFeesDetail;

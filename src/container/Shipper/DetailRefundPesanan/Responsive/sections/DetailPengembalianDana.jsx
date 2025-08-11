import WaitingTimeBottomsheet from "@/components/BottomSheet/WaitingTimeBottomsheet";
import CardPayment from "@/components/Card/CardPayment";
import { useTranslation } from "@/hooks/use-translation";
import { idrFormat } from "@/lib/utils/formatters";

const DetailPengembalianDana = ({ breakdown, waitingTimeData }) => {
  const { t } = useTranslation();
  return (
    <CardPayment.Root className="h-auto w-full rounded-none p-0 shadow-none">
      <div className="flex flex-col gap-6 px-4 py-5">
        <h1 className="text-sm font-semibold text-neutral-900">
          {t(
            "DetailPengembalianDana.titleRefundDetails",
            {},
            "Detail Pengembalian Dana"
          )}
        </h1>

        <div className="flex flex-col gap-6">
          <CardPayment.Section
            className="gap-4"
            title={t(
              "DetailPengembalianDana.titleShippingServiceFee",
              {},
              "Biaya Pesan Jasa Angkut"
            )}
          >
            <CardPayment.LineItem
              label={t(
                "DetailPengembalianDana.labelShippingServiceAmount",
                {},
                "Nominal Pesan Jasa Angkut"
              )}
              value={breakdown ? idrFormat(breakdown.originalAmount) : "-"}
              labelClassName="font-medium"
              valueClassName="font-medium"
            />
          </CardPayment.Section>
          {waitingTimeData?.length > 0 && (
            <CardPayment.Section
              className="gap-4"
              title={t(
                "DetailPengembalianDana.titleWaitingTimeFee",
                {},
                "Biaya Waktu Tunggu"
              )}
            >
              <CardPayment.LineItem
                label={"Nominal Waktu Tunggu (2x24 Jam)<br/>- 1 Driver"}
                value={
                  breakdown ? `-${idrFormat(breakdown.waitingTimeFee)}` : "-"
                }
                variant="danger"
                labelClassName="font-medium !text-neutral-900"
                valueClassName="font-medium"
              >
                <WaitingTimeBottomsheet waitingTimeData={waitingTimeData} />
              </CardPayment.LineItem>
            </CardPayment.Section>
          )}
          <CardPayment.Section
            className="gap-4"
            title={t(
              "DetailPengembalianDana.titleAdminFee",
              {},
              "Biaya Administrasi"
            )}
          >
            <CardPayment.LineItem
              label={t(
                "DetailPengembalianDana.labelCancellationAdmin",
                {},
                "Admin Pembatalan"
              )}
              value={breakdown ? `-${idrFormat(breakdown.penaltyAmount)}` : "-"}
              valueClassName="font-medium !text-[#F71717]"
              labelClassName="font-medium"
            />
          </CardPayment.Section>
        </div>

        <hr className="border-t-[1.5px] border-[#F1F1F1]" />

        <div className="flex flex-col gap-6">
          <CardPayment.Section
            className="gap-4"
            title={t(
              "DetailPengembalianDana.titleOtherFees",
              {},
              "Biaya Lainnya"
            )}
          >
            <CardPayment.LineItem
              label={t(
                "DetailPengembalianDana.labelRefundAdmin",
                {},
                "Admin Refund"
              )}
              value={breakdown ? `-${idrFormat(breakdown.adminFee)}` : "-"}
              valueClassName="font-medium !text-[#F71717]"
              labelClassName="font-medium"
            />
          </CardPayment.Section>

          <CardPayment.Total
            label={t(
              "DetailPengembalianDana.labelTotalRefund",
              {},
              "Total Pengembalian Dana"
            )}
            value={breakdown ? idrFormat(breakdown.totalRefundAmount) : "-"}
            className="!text-sm !font-semibold"
          />
        </div>
      </div>
    </CardPayment.Root>
  );
};

export default DetailPengembalianDana;

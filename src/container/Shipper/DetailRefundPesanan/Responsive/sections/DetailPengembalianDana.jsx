import WaitingTimeBottomsheet from "@/components/BottomSheet/WaitingTimeBottomsheet";
import CardPayment from "@/components/Card/CardPayment";
import { idrFormat } from "@/lib/utils/formatters";

const DetailPengembalianDana = ({ breakdown, waitingTimeData }) => {
  return (
    <CardPayment.Root className="h-auto w-full rounded-none p-0 shadow-none">
      <div className="flex flex-col gap-6 px-4 py-5">
        <h1 className="text-sm font-semibold text-neutral-900">
          Detail Pengembalian Dana
        </h1>

        <div className="flex flex-col gap-6">
          <CardPayment.Section
            className="gap-4"
            title="Biaya Pesan Jasa Angkut"
          >
            <CardPayment.LineItem
              label="Nominal Pesan Jasa Angkut"
              value={breakdown ? idrFormat(breakdown.originalAmount) : "-"}
              labelClassName="font-medium"
              valueClassName="font-medium"
            />
          </CardPayment.Section>
          {waitingTimeData?.length > 0 && (
            <CardPayment.Section className="gap-4" title="Biaya Waktu Tunggu">
              <CardPayment.LineItem
                label="Nominal Waktu Tunggu<br/>(1 Driver)"
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
          <CardPayment.Section className="gap-4" title="Biaya Administrasi">
            <CardPayment.LineItem
              label="Admin Pembatalan"
              value={breakdown ? `-${idrFormat(breakdown.penaltyAmount)}` : "-"}
              valueClassName="font-medium !text-[#F71717]"
              labelClassName="font-medium"
            />
          </CardPayment.Section>
        </div>

        <hr className="border-t-[1.5px] border-[#F1F1F1]" />

        <div className="flex flex-col gap-6">
          <CardPayment.Section className="gap-4" title="Biaya Lainnya">
            <CardPayment.LineItem
              label="Admin Refund"
              value={breakdown ? `-${idrFormat(breakdown.adminFee)}` : "-"}
              valueClassName="font-medium !text-[#F71717]"
              labelClassName="font-medium"
            />
          </CardPayment.Section>

          <CardPayment.Total
            label="Total Pengembalian Dana"
            value={breakdown ? idrFormat(breakdown.totalRefundAmount) : "-"}
            className="!text-sm !font-semibold"
          />
        </div>
      </div>
    </CardPayment.Root>
  );
};

export default DetailPengembalianDana;

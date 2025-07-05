import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import CardPayment from "@/components/Card/CardPayment";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useCountdown } from "@/hooks/use-countdown";
import { PaymentMethodTitle } from "@/lib/constants/detailpesanan/payment.enum";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils/dateFormat";
import { idrFormat } from "@/lib/utils/formatters";

export const RingkasanPembayaranPending = ({ dataRingkasanPembayaran }) => {
  const { countdown } = useCountdown({
    endingDate: dataRingkasanPembayaran?.expiredAt,
    isNeedCountdown: true,
  });

  const handleCopyVA = () => {
    navigator.clipboard.writeText(dataRingkasanPembayaran?.vaNumber);
    toast.success("Berhasil menyalin Nomor Virtual Account");
  };

  return (
    <CardPayment.Root className="w-full">
      <CardPayment.Content className="pb-6 pt-6" noScroll>
        <div className="flex h-[92px] items-start justify-between rounded-xl bg-warning-100 px-4 py-6">
          <div className="text-xs font-medium leading-[1.2]">
            <div className="text-[16px] font-bold text-secondary-900">
              Bayar Sebelum
            </div>
            <span className="mt-3 block font-medium text-neutral-900">
              {formatDate(dataRingkasanPembayaran?.expiredAt)}
            </span>
          </div>

          <BadgeStatusPesanan
            variant="error"
            icon={{ iconLeft: "/icons/clock.svg" }}
            className={"w-fit"}
          >
            {countdown}
          </BadgeStatusPesanan>
        </div>

        <div className="text-xs font-medium leading-[1.2]">
          <div className="mb-2 text-neutral-600">Opsi Pembayaran</div>

          <div className="w-full">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-900">
                Bank{" "}
                {PaymentMethodTitle[dataRingkasanPembayaran?.paymentMethod]}
              </span>

              <IconComponent
                src={`/icons/payment/${dataRingkasanPembayaran?.paymentMethod}.svg`}
                width={16}
                height={16}
                className="bg-white"
              />
            </div>
          </div>
        </div>

        <div className="text-xs font-medium leading-[1.2]">
          <div className="mb-2 text-neutral-600">Nomor Virtual Account</div>

          <div className="flex items-center justify-between">
            <div className="font-bold text-neutral-900">
              {dataRingkasanPembayaran?.vaNumber}
            </div>

            <button
              onClick={handleCopyVA}
              className="flex items-center gap-1 font-semibold text-primary-700"
            >
              <span className="-mb-[2px]">Salin</span>

              <IconComponent src={"/icons/salin.svg"} width={16} height={16} />
            </button>
          </div>
        </div>

        <div className="text-xs font-medium leading-[1.2]">
          <div className="mb-2 text-neutral-600">Total Tagihan</div>

          <div className="font-bold text-neutral-900">
            {idrFormat(dataRingkasanPembayaran?.totalPrice)}
          </div>
        </div>
      </CardPayment.Content>
    </CardPayment.Root>
  );
};

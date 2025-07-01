import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
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
    <div className="flex w-full flex-col gap-6 overflow-hidden rounded-xl bg-white px-6 py-5 shadow-md">
      <div className="flex h-[92px] items-start justify-between rounded-xl bg-warning-100 px-4 py-6">
        <div>
          <div className="text-base font-bold leading-[1.2] text-secondary-900">
            Bayar Sebelum
          </div>
          <span className="text-xs leading-[1.1] text-neutral-900">
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

      <div className="w-full">
        <div className="mb-2 text-xs leading-[1.2] text-neutral-600">
          Opsi Pembayaran
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold leading-[1.2] text-neutral-900">
              Bank {PaymentMethodTitle[dataRingkasanPembayaran?.paymentMethod]}
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

      <div className="w-full">
        <span className="mb-2 text-xs leading-[1.2] text-neutral-600">
          Nomor Virtual Account
        </span>

        <div className="w-full">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold leading-[1.2] text-neutral-900">
              {dataRingkasanPembayaran?.vaNumber}
            </div>

            <button
              onClick={handleCopyVA}
              className="flex items-center gap-1 text-[12px] font-semibold leading-[14.4px] text-primary-700"
            >
              <span className="-mb-[2px]">Salin</span>

              <IconComponent src={"/icons/salin.svg"} width={16} height={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full shadow-[0px_4px_11px_0px_#41414140]">
        <div className="mb-2 text-xs leading-[1.2] text-neutral-600">
          Total Tagihan
        </div>

        <div className="text-xs font-bold leading-[1.2] text-neutral-900">
          {idrFormat(dataRingkasanPembayaran?.totalPrice)}
        </div>
      </div>
    </div>
  );
};

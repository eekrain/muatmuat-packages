import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import CardPayment from "@/components/Card/CardPayment";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useCountdown } from "@/hooks/use-countdown";
import { PaymentMethodTitle } from "@/lib/constants/detailpesanan/payment.enum";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils/dateFormat";
import { idrFormat } from "@/lib/utils/formatters";

import { PaymentInstruction } from "../PaymentInstruction/PaymentInstruction";

export const RingkasanPembayaranPendingPayment = ({
  dataRingkasanPembayaran,
}) => {
  const { countdown } = useCountdown({
    endingDate: dataRingkasanPembayaran?.expiredAt,
    isNeedCountdown: true,
  });

  const handleCopyVA = () => {
    navigator.clipboard.writeText(dataRingkasanPembayaran?.vaNumber);
    toast.success("Berhasil menyalin Nomor Virtual Account");
  };

  return (
    <>
      <CardPayment.Root className="w-full">
        <CardPayment.Body>
          <div className="flex items-start justify-between rounded-xl bg-warning-100 px-4 py-6">
            <div className="text-xs font-medium leading-[1.2]">
              <div className="text-base font-bold text-secondary-900">
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

          <CardPayment.Section title="Opsi Pembayaran">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900">
                Bank{" "}
                {PaymentMethodTitle[dataRingkasanPembayaran?.paymentMethod]}
              </span>
              <IconComponent
                src={`/icons/payment/${dataRingkasanPembayaran?.paymentMethod}.svg`}
                width={16}
                height={16}
                className="bg-white"
                alt={`${PaymentMethodTitle[dataRingkasanPembayaran?.paymentMethod]} logo`}
              />
            </div>
          </CardPayment.Section>

          <CardPayment.Section title="Nomor Virtual Account">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-neutral-900">
                {dataRingkasanPembayaran?.vaNumber}
              </div>
              <button
                onClick={handleCopyVA}
                className="flex items-center gap-1 text-xs font-semibold text-primary-700"
              >
                <span>Salin</span>
                <IconComponent
                  src={"/icons/salin.svg"}
                  width={16}
                  height={16}
                  alt="Salin"
                />
              </button>
            </div>
          </CardPayment.Section>

          <CardPayment.Section title="Total Tagihan">
            <div className="text-xs font-bold text-neutral-900">
              {idrFormat(dataRingkasanPembayaran?.totalPrice)}
            </div>
          </CardPayment.Section>
        </CardPayment.Body>
      </CardPayment.Root>

      <PaymentInstruction />
    </>
  );
};

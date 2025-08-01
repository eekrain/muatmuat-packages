import { useEffect, useState } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import CardPayment from "@/components/Card/CardPayment";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useCountdown } from "@/hooks/use-countdown";
import { useSWRMutateHook } from "@/hooks/use-swr";
import { PaymentMethodTitle } from "@/lib/constants/detailpesanan/payment.enum";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils/dateFormat";
import { idrFormat } from "@/lib/utils/formatters";

import { PaymentInstruction } from "../PaymentInstruction/PaymentInstruction";

export const RingkasanPembayaranPendingPayment = ({
  dataRingkasanPembayaran,
}) => {
  const { countdown } = useCountdown({
    endingDate: dataRingkasanPembayaran?.paymentDueDateTime,
    isNeedCountdown: true,
  });
  const [hasAutoCanceled, setHasAutoCanceled] = useState(false);

  const { trigger: triggerAutoCancel, isMutating: isAutoCanceling } =
    useSWRMutateHook(
      dataRingkasanPembayaran?.orderId
        ? `/v1/orders/${dataRingkasanPembayaran.orderId}/auto-cancel-process`
        : null,
      "POST"
    );

  useEffect(() => {
    if (
      countdown === "00:00:00" &&
      !hasAutoCanceled &&
      dataRingkasanPembayaran?.orderId
    ) {
      setHasAutoCanceled(true);
      triggerAutoCancel({
        cancelType: "AUTO_CANCEL_NO_FLEET",
        loadTimeStart: dataRingkasanPembayaran.loadTimeStart,
        autoCancelTriggeredAt: new Date().toISOString(),
        reasonId: "550e8400-e29b-41d4-a716-446655440250",
        hasActivePopup: false,
      })
        .then(() => toast.success("Pesanan dibatalkan otomatis."))
        .catch(() => toast.error("Gagal auto-cancel pesanan."));
    }
  }, [countdown, hasAutoCanceled, dataRingkasanPembayaran, triggerAutoCancel]);

  const handleCopyVA = () => {
    if (dataRingkasanPembayaran?.vaNumber) {
      navigator.clipboard.writeText(dataRingkasanPembayaran.vaNumber);
      toast.success("Berhasil menyalin Nomor Virtual Account");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <CardPayment.Root className="w-[338px]">
        <CardPayment.Body className="md:m-0 md:px-5 md:py-6">
          <div className="flex flex-col gap-6">
            {/* Payment Deadline Alert */}
            <div className="flex flex-col items-start gap-3 rounded-xl bg-warning-100 px-4 py-6">
              <div className="flex w-full items-center justify-between">
                <h2 className="text-base font-bold text-secondary-900">
                  Bayar Sebelum
                </h2>
                <BadgeStatusPesanan
                  variant="error"
                  icon={{ iconLeft: "/icons/clock.svg" }}
                  className="w-fit bg-error-50 px-2 py-1"
                >
                  <span className="font-semibold text-error-400">
                    {countdown}
                  </span>
                </BadgeStatusPesanan>
              </div>
              <span className="text-sm font-semibold text-neutral-900">
                {formatDate(
                  dataRingkasanPembayaran?.paymentDueDateTime,
                  "dd LLL yyyy HH:mm 'WIB'"
                )}
              </span>
            </div>

            {/* Payment Details */}
            <div className="flex flex-col gap-6">
              <CardPayment.Section title="Opsi Pembayaran" className="gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">
                    Bank{" "}
                    {/* {PaymentMethodTitle[
                      dataRingkasanPembayaran?.paymentMethod
                    ] ?? "BCA"}{" "} */}
                    {dataRingkasanPembayaran.paymentMethod || "BCA"}
                  </span>
                  <IconComponent
                    src={`/icons/payment/${dataRingkasanPembayaran?.paymentMethod ?? "bca"}.svg`}
                    width={24}
                    height={24}
                    alt={`${PaymentMethodTitle[dataRingkasanPembayaran?.paymentMethod] ?? "BCA"} logo`}
                  />
                </div>
              </CardPayment.Section>

              <CardPayment.Section
                title="Nomor Virtual Account"
                className="gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">
                    {dataRingkasanPembayaran?.vaNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyVA}
                    className="flex items-center gap-1 text-xs font-semibold text-primary-700"
                  >
                    <span>Salin</span>
                    <IconComponent
                      src="/icons/salin.svg"
                      width={20}
                      height={20}
                      alt="Salin"
                    />
                  </button>
                </div>
              </CardPayment.Section>

              <CardPayment.Section title="Total Tagihan" className="gap-2">
                <span className="text-xs font-bold text-neutral-900">
                  {idrFormat(dataRingkasanPembayaran?.totalPrice)}
                </span>
              </CardPayment.Section>
            </div>
          </div>
        </CardPayment.Body>
      </CardPayment.Root>

      <PaymentInstruction />
    </div>
  );
};

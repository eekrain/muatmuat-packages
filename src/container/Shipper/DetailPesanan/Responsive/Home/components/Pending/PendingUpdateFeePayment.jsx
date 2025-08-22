import IconComponent from "@/components/IconComponent/IconComponent";
import { useCountdown } from "@/hooks/use-countdown";
import { useTranslation } from "@/hooks/use-translation";

const PendingUpdateFeePayment = ({ paymentDueDateTime }) => {
  const { t } = useTranslation();

  const { countdown } = useCountdown({
    endingDate: paymentDueDateTime,
    isNeedCountdown: true,
  });

  return (
    <div className="flex w-full flex-col items-center justify-center bg-warning-50 px-4 py-6">
      <div className="flex flex-col items-center justify-center gap-3 self-stretch">
        {/* Icon */}
        <div className="relative h-[72px] w-[72px]">
          <IconComponent
            src="/icons/loader-truck/responsive-circle-static.svg"
            alt={t(
              "PendingUpdateFeePayment.altFleetFound",
              {},
              "Armada ditemukan"
            )}
            width={72}
            height={72}
            className="absolute"
          />
          <IconComponent
            src="/icons/loader-truck/responsive-truck-checked.svg"
            alt={t(
              "PendingUpdateFeePayment.altFleetFound",
              {},
              "Armada ditemukan"
            )}
            width={36}
            height={36}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        {/* Text */}
        <div className="flex flex-col items-center justify-center gap-3 self-stretch">
          <p className="w-[250px] text-center text-sm font-semibold leading-tight text-neutral-900">
            {t(
              "PendingUpdateFeePayment.messageOrderChangeSaved",
              {},
              "Informasi perubahan pesanan telah berhasil kami simpan."
            )}
          </p>
          <p className="self-stretch text-center text-xs font-medium leading-tight text-neutral-600">
            {(() => {
              const full = t(
                "PendingUpdateFeePayment.messagePaymentReminderFull",
                { countdown },
                "Mohon lakukan pembayaran dalam waktu {countdown} Perubahan secara otomatis dibatalkan, apabila melewati batas waktu yang ditentukan."
              );
              // render countdown bold by splitting on countdown value
              const parts = full.split(String(countdown));
              if (parts.length === 1) return full;
              return (
                <>
                  {parts[0]}
                  <span className="font-bold text-neutral-900">
                    {String(countdown)}
                  </span>
                  {parts[1]}
                </>
              );
            })()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingUpdateFeePayment;

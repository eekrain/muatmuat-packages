import IconComponent from "@/components/IconComponent/IconComponent";
import { useCountdown } from "@/hooks/use-countdown";

export const PendingPaymentAlert = ({ paymentDueDateTime }) => {
  const { countdown } = useCountdown({
    endingDate: paymentDueDateTime,
    isNeedCountdown: true,
    withHours: true,
  });
  return (
    <div className="flex w-full flex-col items-center justify-center bg-warning-50 px-4 py-6">
      <div className="flex flex-col items-center justify-center gap-3 self-stretch">
        {/* Icon */}
        <div className="relative h-[72px] w-[72px]">
          <IconComponent
            src="/icons/loader-truck/responsive-circle-static.svg"
            alt="Armada ditemukan"
            width={72}
            height={72}
            className="absolute"
          />
          <IconComponent
            src="/icons/loader-truck/responsive-truck-checked.svg"
            alt="Armada ditemukan"
            width={36}
            height={36}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        {/* Text */}
        <div className="flex flex-col items-center justify-center gap-3 self-stretch">
          <p className="w-[250px] text-center text-sm font-semibold leading-tight text-neutral-900">
            Armada yang sesuai dengan pesanan kamu telah ditemukan.
          </p>
          <p className="self-stretch text-center text-xs font-medium leading-tight text-neutral-600">
            Mohon lakukan pembayaran dalam waktu{" "}
            <span className="font-bold text-neutral-900">{countdown}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

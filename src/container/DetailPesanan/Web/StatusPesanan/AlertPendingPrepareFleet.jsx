import IconComponent from "@/components/IconComponent/IconComponent";
import { useCountdown } from "@/hooks/use-countdown";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

export const AlertPendingPrepareFleet = ({ orderStatus, expiredAt }) => {
  const isShowAlert =
    orderStatus === OrderStatusEnum.PREPARE_FLEET ||
    orderStatus === OrderStatusEnum.WAITING_PAYMENT_1;

  const { countdown } = useCountdown({
    endingDate: expiredAt,
    isNeedCountdown:
      orderStatus === OrderStatusEnum.WAITING_PAYMENT_1 ||
      orderStatus === OrderStatusEnum.WAITING_PAYMENT_2,
  });

  if (!isShowAlert) return null;

  return (
    <div className="flex items-center gap-8 rounded-2xl bg-muat-trans-primary-50 px-8 py-4">
      <div className="relative size-[72px]">
        <IconComponent
          src={"/icons/loader-truck-spinner.svg"}
          width={72}
          height={72}
          className="absolute left-0 top-0 animate-spin"
        />
        <IconComponent
          src={"/icons/loader-truck-icon.svg"}
          width={32}
          height={32}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="flex flex-col gap-y-3">
        <h3 className="text-lg font-semibold leading-[1.2] text-neutral-900">
          {orderStatus === OrderStatusEnum.WAITING_PAYMENT_1
            ? "Armada yang sesuai dengan pesanan kamu telah ditemukan"
            : "Sedang mempersiapkan armada yang sesuai untuk pesanan kamu"}
        </h3>
        <p className="text-sm font-medium leading-[1.2] text-neutral-900">
          {orderStatus === OrderStatusEnum.WAITING_PAYMENT_1
            ? "Mohon lakukan pembayaran dalam waktu "
            : "Terimakasih atas kesabaran kamu."}

          {orderStatus === OrderStatusEnum.WAITING_PAYMENT_1 && (
            <span className="font-bold"> {countdown}</span>
          )}
        </p>
      </div>
    </div>
  );
};

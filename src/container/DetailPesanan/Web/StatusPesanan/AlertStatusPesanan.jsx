import { useEffect, useRef, useState } from "react";

import { differenceInSeconds } from "date-fns";

import IconComponent from "@/components/IconComponent/IconComponent";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

export const AlertStatusPesanan = ({ orderStatus, paymentDueDateTime }) => {
  const [countdown, setCountdown] = useState("");
  const intervalRef = useRef();

  useEffect(() => {
    if (orderStatus === OrderStatusEnum.PENDING_PAYMENT && paymentDueDateTime) {
      const updateCountdown = () => {
        const now = new Date();
        const dueDate = new Date(paymentDueDateTime);
        const diffInSeconds = differenceInSeconds(dueDate, now);

        if (diffInSeconds <= 0) {
          setCountdown("00:00");
          clearInterval(intervalRef.current);
          return;
        }

        const hours = Math.floor(diffInSeconds / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        const seconds = diffInSeconds % 60;

        if (hours > 0) {
          setCountdown(
            `${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
          );
        } else {
          setCountdown(
            `${minutes.toString().padStart(2, "0")}:${seconds
              .toString()
              .padStart(2, "0")}`
          );
        }
      };

      updateCountdown();
      intervalRef.current = setInterval(updateCountdown, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [orderStatus, paymentDueDateTime]);

  const isShowAlert =
    orderStatus === OrderStatusEnum.SEARCHING_FLEET ||
    orderStatus === OrderStatusEnum.PENDING_PAYMENT;

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
          {orderStatus === OrderStatusEnum.PENDING_PAYMENT
            ? "Armada yang sesuai dengan pesanan kamu telah ditemukan"
            : "Sedang mempersiapkan armada yang sesuai untuk pesanan kamu"}
        </h3>
        <p className="text-sm font-medium leading-[1.2] text-neutral-900">
          {orderStatus === OrderStatusEnum.PENDING_PAYMENT
            ? "Mohon lakukan pembayaran dalam waktu "
            : "Terimakasih atas kesabaran kamu."}

          {orderStatus === OrderStatusEnum.PENDING_PAYMENT && (
            <span className="font-bold"> {countdown}</span>
          )}
        </p>
      </div>
    </div>
  );
};

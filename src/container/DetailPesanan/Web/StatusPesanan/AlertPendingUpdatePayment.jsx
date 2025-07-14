import IconComponent from "@/components/IconComponent/IconComponent";
import { useCountdown } from "@/hooks/use-countdown";

export const AlertPendingUpdatePayment = ({ expiredAt }) => {
  const { countdown } = useCountdown({
    endingDate: expiredAt,
    isNeedCountdown: true,
  });

  return (
    <div className="flex flex-col items-center gap-3 bg-muat-trans-primary-50 px-8 py-4 md:flex-row md:gap-8 md:rounded-2xl">
      <div className="relative size-[72px]">
        <IconComponent
          src={"/icons/loader-truck-static.svg"}
          width={72}
          height={72}
          className="absolute left-0 top-0"
        />
        <IconComponent
          src={"/icons/loader-truck-check.svg"}
          width={32}
          height={32}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="flex flex-col">
        <h3 className="text-center text-sm font-semibold leading-[1.2] text-neutral-900 md:text-start md:text-lg">
          Informasi perubahan pesanan telah berhasil kami simpan.
        </h3>
        <p className="text-xs font-medium leading-none text-neutral-600 md:text-sm md:text-neutral-900">
          Mohon lakukan pembayaran dalam waktu
          <span className="font-bold text-neutral-900"> {countdown}</span>
          <br />
          Perubahan secara otomatis dibatalkan, apabila melewati batas waktu
          yang ditentukan.
        </p>
      </div>
    </div>
  );
};

import IconComponent from "@/components/IconComponent/IconComponent";

export const AlertPendingPrepareFleet = ({}) => {
  return (
    <div className="flex flex-col items-center gap-3 bg-muat-trans-primary-50 px-8 py-4 md:flex-row md:gap-8 md:rounded-2xl">
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
        <h3 className="text-center text-sm font-semibold leading-[1.2] text-neutral-900 md:text-start md:text-lg">
          Sedang mempersiapkan armada yang sesuai untuk pesanan kamu
        </h3>
        <p className="text-xs font-medium leading-[1.2] text-neutral-600 md:text-sm md:text-neutral-900">
          Terimakasih atas kesabaran kamu.
        </p>
      </div>
    </div>
  );
};

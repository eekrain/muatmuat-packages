import IconComponent from "@/components/IconComponent/IconComponent";

const AlertWaitFleetSearch = () => {
  return (
    <div className="flex h-14 items-center gap-x-2 rounded-md bg-secondary-100 px-6 py-4">
      <IconComponent
        className="icon-stroke-warning-900"
        src="/icons/warning24.svg"
        size="medium"
      />

      <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
        Mohon konfirmasi pesanan ini dikarenakan kami membutuhkan waktu lebih
        lama untuk mempersiapkan armada.
      </span>
    </div>
  );
};

export default AlertWaitFleetSearch;

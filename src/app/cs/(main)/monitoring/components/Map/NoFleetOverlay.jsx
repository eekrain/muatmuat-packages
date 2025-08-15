import Image from "next/image";

export const NoFleetOverlay = () => {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
      <div className="flex w-[456px] flex-col items-center gap-4 rounded-xl bg-white p-6 shadow-[0px_4px_24px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-[76px] w-[100px]">
            <Image
              src="/img/monitoring-first-timer.png"
              alt="Add Fleet"
              width={100}
              height={76}
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <h2 className="text-center text-base font-semibold leading-[120%] text-neutral-600">
            Daftar Armada Masih Kosong
          </h2>

          <p className="text-center text-xs font-medium leading-[120%] text-neutral-600">
            Belum ada Transporter yang menambahkan armada
          </p>
        </div>
      </div>
    </div>
  );
};

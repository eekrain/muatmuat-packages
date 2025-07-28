export const BrandSection = () => {
  return (
    <div className="my-2 flex h-[61px] w-full items-center justify-between gap-[29px] bg-white px-4 py-3">
      <div className="flex-1">
        <h2 className="text-base font-semibold leading-[17.6px] text-[#461B02]">
          Ayo kirim muatan kamu dengan muatrans!
        </h2>
      </div>
      <div className="flex w-[123px] flex-col items-end gap-1">
        <img src="/icons/muattrans.svg" alt="muatrans" className="h-4 w-20" />
        <p className="text-right text-xxs font-semibold leading-[10px] text-[#461B02]">
          Cargo Land Transportation Company
        </p>
      </div>
    </div>
  );
};

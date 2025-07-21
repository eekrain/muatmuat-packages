import ImageComponent from "../ImageComponent/ImageComponent";

export const HalalLogistik = () => {
  return (
    <div className="flex h-10 w-full items-center rounded-xl bg-[#F7EAFD] px-4">
      <div className="flex items-center gap-3">
        <ImageComponent
          src="/icons/halal.svg"
          width={18}
          height={24}
          alt="Halal Indonesia"
        />
        <span className="text-center text-xs font-semibold leading-[14.4px] text-[#652672]">
          Menggunakan Layanan Halal Logistik
        </span>
      </div>
    </div>
  );
};

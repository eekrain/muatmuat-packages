import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";

const SelectedTruck = ({
  title,
  src,
  cost,
  capacity,
  dimension,
  onSelectImage,
}) => {
  const details = [
    {
      iconSrc: "/icons/truck16.svg",
      title: "Harga per Unit : ",
      value: cost,
    },
    {
      iconSrc: "/icons/estimasi-kapasitas16.svg",
      title: "Estimasi Kapasitas : ",
      value: capacity,
    },
    {
      iconSrc: "/icons/kapasitas16.svg",
      title: "Estimasi Dimensi (p x l x t) : ",
      value: dimension,
    },
  ];
  return (
    <div className="flex gap-x-4">
      <div className="relative size-[96px] overflow-hidden rounded-xl border border-neutral-400">
        <ImageComponent className="w-full" src={src} width={100} height={100} />
        <button
          className="absolute right-2 top-2 flex size-[20px] items-center justify-center rounded-3xl bg-neutral-50"
          onClick={() => onSelectImage(src)}
        >
          <IconComponent src="/icons/zoom12.svg" width={12} height={12} />
        </button>
      </div>
      <div className="flex w-[348px]">
        <div className="flex flex-col gap-y-3">
          <span className={"text-[12px] font-bold leading-[14.4px]"}>
            {title}
          </span>
          <span className={"text-[14px] font-semibold leading-[15.4px]"}>
            Rp200.000
          </span>
          <div className="flex flex-col gap-y-2">
            {details.map((detail, key) => (
              <div className="flex items-center gap-x-2" key={key}>
                <IconComponent src={detail.iconSrc} />
                <span className="text-[10px] font-medium leading-[13px]">
                  {`${detail.title}${detail.value}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedTruck;

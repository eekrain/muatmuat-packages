import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lighbox";

export const SelectedTruck = ({
  image,
  description,
  name,
  price,
  maxWeight,
  weightUnit,
  dimensions,
}) => {
  // Format capacity and dimensions from API data
  const capacity =
    maxWeight && weightUnit ? `${maxWeight} ${weightUnit}` : "N/A";
  const dimension = dimensions
    ? `${dimensions.length} x ${dimensions.width} x ${dimensions.height} ${dimensions.dimensionUnit}`
    : "N/A";

  const details = [
    // {
    //   iconSrc: "/icons/truck16.svg",
    //   title: "Harga per Unit : ",
    //   value: formattedPrice,
    // },
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
    <div className="flex gap-x-4 text-neutral-900">
      <LightboxProvider image={image} title="Jenis Truk">
        <LightboxPreview
          image={image}
          alt="Jenis Truk"
          className="size-[96px] overflow-hidden rounded-md object-cover"
          withZoom={true}
        />
      </LightboxProvider>
      <div className="flex flex-col gap-y-3">
        <span className={"text-[12px] font-bold leading-[14.4px]"}>
          {`${description} - ${name}`}
        </span>
        <span className={"text-[14px] font-semibold leading-[15.4px]"}>
          {`Rp${price.toLocaleString("id-ID")}`}
        </span>
        <div className="flex flex-col gap-y-2">
          {details.map((detail, key) => (
            <div className="flex items-center gap-x-2" key={key}>
              <IconComponent
                className="icon-fill-muat-trans-secondary-900"
                src={detail.iconSrc}
              />
              <span className="text-[12px] font-medium leading-[14.4px]">
                {detail.title}
                <span className="font-semibold">{detail.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

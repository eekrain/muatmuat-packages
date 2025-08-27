import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";

import { useTranslation } from "@/hooks/use-translation";

export const SelectedTruck = ({
  image,
  carrierName,
  truckName,
  price,
  maxWeight,
  weightUnit,
  dimensions,
}) => {
  const { t } = useTranslation();
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
      title: t("SelectedTruck.capacityLabel", {}, "Estimasi Kapasitas : "),
      value: capacity,
    },
    {
      iconSrc: "/icons/kapasitas16.svg",
      title: t(
        "SelectedTruck.dimensionLabel",
        {},
        "Estimasi Dimensi (p x l x t) : "
      ),
      value: dimension,
    },
  ];

  return (
    <div className="flex gap-x-4 text-neutral-900">
      <LightboxProvider
        image={image}
        title={t("SelectedTruck.truckType", {}, "Jenis Truk")}
      >
        <LightboxPreview
          image={image}
          alt={t("SelectedTruck.truckTypeAlt", {}, "Jenis Truk")}
          className="size-[96px] overflow-hidden rounded-md object-cover"
        />
      </LightboxProvider>
      <div className="flex flex-col gap-y-3">
        <span className={"text-xs font-bold leading-[14.4px]"}>
          {`${carrierName} - ${truckName}`}
        </span>
        <span className={"text-sm font-semibold leading-[15.4px]"}>
          {`Rp${price.toLocaleString("id-ID")}`}
        </span>
        <div className="flex flex-col gap-y-2">
          {details.map((detail, key) => (
            <div className="flex items-center gap-x-2" key={key}>
              <IconComponent
                className="icon-fill-muat-trans-secondary-900"
                src={detail.iconSrc}
              />
              <span className="text-xs font-medium leading-[14.4px]">
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

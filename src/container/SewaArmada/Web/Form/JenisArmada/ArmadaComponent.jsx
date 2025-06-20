import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lighbox";

// Warning Badge Component
export const WarningBadge = ({ message }) => {
  return (
    <div className="flex h-[38px] w-[424px] items-center gap-x-1 rounded-lg bg-warning-100 px-2">
      <IconComponent src="/icons/warning14.svg" width={14} height={14} />
      <span className="flex-1 text-[12px] font-semibold leading-[14.4px] text-neutral-900">
        {message}
      </span>
    </div>
  );
};

// Section Header Component
export const SectionHeader = ({ recommended, type }) => {
  const recommendedTitles = {
    carrier: "Rekomendasi Carrier Sesuai Muatan",
    truck: "Rekomendasi Truk Sesuai Muatan",
  };
  const recommendedTitle = recommendedTitles[type] || recommendedTitles.carrier;

  const tooltipContents = {
    carrier:
      "Berikut adalah rekomendasi carrier berdasarkan informasi muatan yang kamu isi",
    truck:
      "Berikut adalah rekomendasi truk berdasarkan berat dan dimensi muatan yang kamu isikan dan diurutkan dari yang termurah.",
  };
  const tooltipContent = tooltipContents[type] || tooltipContents.carrier;

  return (
    <div className="flex h-6 w-[424px] items-center gap-x-1">
      <span className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
        {recommended ? recommendedTitle : "Tidak Direkomendasikan"}
      </span>
      {recommended && <InfoTooltip>{tooltipContent}</InfoTooltip>}
    </div>
  );
};

// Carrier Item Component
export const CarrierItem = ({ image, name, onClick }) => {
  return (
    <div
      className={
        "flex h-[92px] w-[424px] cursor-pointer items-center gap-x-2 border-b border-neutral-400 py-3 transition-colors hover:bg-neutral-100"
      }
      onClick={() => onClick()}
    >
      {/* Nanti dihapus aja button nya */}
      <button onClick={(e) => e.stopPropagation()}>
        <LightboxProvider image={image} title="Jenis Carrier">
          <LightboxPreview
            image={image}
            alt="Jenis Carrier"
            className="size-[68px] overflow-hidden rounded-md object-cover"
            withZoom={true}
          />
        </LightboxProvider>
      </button>
      <span
        className={"text-[12px] font-bold leading-[14.4px] text-neutral-900"}
      >
        {name}
      </span>
    </div>
  );
};

export const TruckItem = ({
  image,
  description,
  name,
  price,
  maxWeight,
  weightUnit,
  dimensions,
  onClick,
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
    <div
      className={
        "flex h-[138px] w-[424px] cursor-pointer flex-row items-center border-b border-neutral-400 py-3 text-neutral-900 transition-colors hover:bg-neutral-100"
      }
      onClick={() => onClick()}
    >
      <div className="flex gap-x-2">
        {/* Nanti dihapus aja button nya */}
        <button onClick={(e) => e.stopPropagation()}>
          <LightboxProvider image={image} title="Jenis Carrier">
            <LightboxPreview
              image={image}
              alt="Jenis Carrier"
              className="size-[68px] overflow-hidden rounded-md object-cover"
              withZoom={true}
            />
          </LightboxProvider>
        </button>

        <div className="flex w-[348px]">
          <div className="flex flex-col gap-y-3">
            <div className="flex flex-col">
              <span className={"text-[12px] font-bold leading-[14.4px]"}>
                {`${description} - ${name}`}
              </span>
            </div>
            <span className={"text-[14px] font-semibold leading-[15.4px]"}>
              {`Rp${price.toLocaleString("id-ID")}`}
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
    </div>
  );
};

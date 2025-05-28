import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";

const ArmadaOption = ({ title, description, iconType, onClick }) => {
  // Icon path based on type
  const iconPath =
    iconType === "instant"
      ? "/icons/muattrans-instan.svg"
      : "/icons/muattrans-terjadwal32.svg";

  return (
    <div
      className="flex h-[136px] w-[369px] cursor-pointer flex-col items-center justify-center rounded-xl border border-neutral-400 bg-white p-6"
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-3">
        <IconComponent src={iconPath} width={32} height={32} />

        <div className="flex flex-col items-center gap-3">
          <h3 className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
            {title}
          </h3>

          <p className="w-[294px] text-center text-[12px] font-medium leading-[14.4px] text-neutral-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const FirstTimer = ({ setRentalType }) => {
  return (
    <div className="">
      <div className="flex w-[814px] flex-col items-center rounded-xl bg-white p-8 shadow-md">
        <div className="mb-4">
          <ImageComponent
            src="/img/welcome-illustration.png"
            width={100}
            height={76}
          />
        </div>
        <div className="mb-6 flex flex-col items-center gap-6">
          <h1 className="text-center text-[16px] font-semibold leading-[19px] text-neutral-900">
            Ayo kirim muatan Anda dengan muatrans!
          </h1>

          <p className="w-[313px] text-center text-[12px] font-medium leading-[14.4px] text-neutral-600">
            Pesan truk kapan saja dan di mana saja dengan mudah. Serta lacak
            kiriman secara real-time untuk memastikan keamanan pengiriman dan
            dapatkan rekomendasi truk sesuai muatan agar lebih efisien!
          </p>
        </div>

        <div className="flex w-full justify-center gap-3">
          <ArmadaOption
            title="Instan"
            description="Pesan jasa angkut untuk penjemputan dan pengiriman segera atau di Hari+1."
            iconType="instant"
            onClick={() => setRentalType("instan")}
          />

          <ArmadaOption
            title="Terjadwal"
            description="Pesan jasa angkut untuk penjemputan dan pengiriman di Hari+2 sampai dengan Hari+30."
            iconType="scheduled"
            onClick={() => setRentalType("terjadwal")}
          />
        </div>
      </div>
    </div>
  );
};

export default FirstTimer;

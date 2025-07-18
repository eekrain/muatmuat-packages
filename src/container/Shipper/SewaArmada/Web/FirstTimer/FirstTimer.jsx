import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { ArmadaOption } from "@/container/Shipper/SewaArmada/Web/FirstTimer/ArmadaOption";
import { useSaveUserPreferences } from "@/services/Shipper/sewaarmada/userPreferences";
import { useSewaArmadaActions } from "@/store/Shipper/forms/sewaArmadaStore";

export const FirstTimer = () => {
  const { setOrderType } = useSewaArmadaActions();
  const { trigger: savePreferences } = useSaveUserPreferences();

  const handleClickArmadaOption = async (type) => {
    try {
      // Set order type first
      setOrderType(type);

      // Save user preferences to not show popup again
      await savePreferences({
        dontShowAgain: true,
      });
    } catch (error) {
      console.error("Error saving user preferences:", error);
      // Even if saving preferences fails, still set the order type
      setOrderType(type);
    }
  };

  return (
    <div className="flex w-[814px] flex-col items-center rounded-xl bg-white p-8 shadow-md">
      <div className="mb-4 flex flex-col items-center gap-3">
        <ImageComponent
          src="/img/welcome-illustration.png"
          width={100}
          height={76}
        />
        <h1 className="text-center text-base font-semibold leading-[1] text-neutral-900">
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
          onClick={() => handleClickArmadaOption("INSTANT")}
        />

        <ArmadaOption
          title="Terjadwal"
          description="Pesan jasa angkut untuk penjemputan dan pengiriman di Hari+2 sampai dengan Hari+30."
          iconType="scheduled"
          onClick={() => handleClickArmadaOption("SCHEDULED")}
        />
      </div>
    </div>
  );
};

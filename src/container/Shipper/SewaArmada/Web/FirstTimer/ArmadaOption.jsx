import IconComponent from "@/components/IconComponent/IconComponent";
import { OrderTypeEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

export const ArmadaOption = ({ title, description, iconType, onClick }) => {
  // Icon path based on type
  const iconPath =
    iconType === OrderTypeEnum.INSTANT
      ? "/icons/muattrans-instan.svg"
      : "/icons/muattrans-terjadwal32.svg";

  return (
    <div
      className="flex h-[136px] w-[369px] cursor-pointer flex-col items-center justify-center rounded-xl border border-neutral-400 bg-white p-6 transition-colors duration-500 hover:border-[#FFC217]"
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-3">
        <IconComponent src={iconPath} width={32} height={32} />

        <div className="flex flex-col items-center gap-3">
          <h3 className="text-sm font-semibold leading-[16.8px] text-neutral-900">
            {title}
          </h3>

          <p className="w-[294px] text-center text-xs font-medium leading-[14.4px] text-neutral-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

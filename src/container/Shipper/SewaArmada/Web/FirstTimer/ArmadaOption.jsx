import IconComponent from "@/components/IconComponent/IconComponent";

export const ArmadaOption = ({ title, description, iconType, onClick }) => {
  // Icon path based on type
  const iconPath =
    iconType === "instant"
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
          <h3 className="leading-[16.8px] text-sm font-semibold text-neutral-900">
            {title}
          </h3>

          <p className="leading-[14.4px] w-[294px] text-center text-xs font-medium text-neutral-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

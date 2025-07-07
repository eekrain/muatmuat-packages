import IconComponent from "../IconComponent/IconComponent";

export const AvatarDriver = ({ name, image, licensePlate }) => {
  return (
    <div className="flex items-center gap-2">
      <img src={image} alt={name} className="h-10 w-10 rounded-full" />

      <div className="flex flex-1 flex-col justify-between">
        <p className="text-base font-semibold md:text-sm md:font-bold">
          {name}
        </p>

        <div className="-mb-1 flex items-center gap-[2.5px]">
          <IconComponent
            src="/icons/transporter16.svg"
            className="mb-[2px] text-muat-trans-secondary-900"
            width={12}
            height={12}
          />

          <span className="text-xs font-medium md:text-[10px]">
            {licensePlate}
          </span>
        </div>
      </div>
    </div>
  );
};

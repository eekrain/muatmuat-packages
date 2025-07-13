import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";

export const AvatarDriver = ({
  name,
  image,
  licensePlate,
  className,
  appearance = {
    containerClassName: "",
    photoClassName: "",
    nameClassName: "",
    licensePlateClassName: "",
  },
  withIcon = true,
}) => {
  return (
    <div className={cn("flex items-center gap-2 text-neutral-900", className)}>
      <img
        src={image}
        alt={name}
        className={cn("h-10 w-10 rounded-full", appearance.photoClassName)}
      />

      <div
        className={cn(
          "flex flex-1 flex-col justify-between",
          appearance.containerClassName
        )}
      >
        <p
          className={cn(
            "text-base font-semibold md:text-sm md:font-bold",
            appearance.nameClassName
          )}
        >
          {name}
        </p>

        <div className="flex items-center gap-[2.5px]">
          {withIcon && (
            <IconComponent
              src="/icons/transporter16.svg"
              className="mb-[2px] text-muat-trans-secondary-900"
              width={12}
              height={12}
            />
          )}

          <span
            className={cn(
              "text-xs font-medium md:text-[10px]",
              appearance.licensePlateClassName
            )}
          >
            {licensePlate}
          </span>
        </div>
      </div>
    </div>
  );
};

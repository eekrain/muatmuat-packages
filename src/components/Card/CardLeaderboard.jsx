import PropTypes from "prop-types";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import BadgeLeaderboard from "@/components/Badge/BadgeLeaderboard";
import IconComponent from "@/components/IconComponent/IconComponent";

import { cn } from "@/lib/utils";

const CardLeaderboard = ({
  variant,
  subVariant, // New prop to control the default variant's content
  rank,
  avatarSrc,
  title,
  shipmentCount,
  profit, // New prop for the monetary value
  badgeClassname,
  infoClassname,
  ratingClassname,
  subInfoClassname,
  rating,
  className,
  iconSrc,
  type,
  value,
  additionalType, // New prop for the second line's label
  additionalValue, // New prop for the second line's value
}) => {
  return (
    <div
      className={cn(
        "flex h-[52px] w-[248px] items-center border-b border-neutral-300 py-3 last:border-none",
        className
      )}
    >
      {/* Column 1: Avatar or Icon */}
      <div className="relative mb-[14px] flex-shrink-0">
        {variant === "default" ? (
          <AvatarDriver withIcon={false} image={avatarSrc} />
        ) : (
          <IconComponent
            src={iconSrc || "https://picsum.photos/200/300"}
            alt="leaderboard icon"
            width={40}
            height={40}
          />
        )}
        <div className={cn("absolute -bottom-1 right-2", badgeClassname)}>
          <BadgeLeaderboard rank={rank} />
        </div>
      </div>

      {/* Column 2: Info */}
      <div
        className={cn(
          "mb-[14px] flex flex-1 flex-col justify-center gap-y-1 overflow-hidden",
          infoClassname
        )}
      >
        <h3 className="truncate text-sm font-semibold text-neutral-900">
          {title}
        </h3>

        {/* --- MODIFICATION START --- */}
        {variant === "default" ? (
          // Conditionally render based on the 'subVariant' prop
          subVariant === "detailedShipment" ? (
            // New variant that matches the image
            <div className="flex flex-row items-center gap-x-2">
              <IconComponent
                src="/icons/dashboard/delivery-truck.svg"
                alt="truck"
                width={16}
                height={16}
              />
              <div className="flex flex-col">
                <span className="pb-[1px] text-xxs font-medium leading-tight text-neutral-600">
                  Pesanan Selesai :
                </span>
                <span className="text-xs font-medium leading-tight text-neutral-900">
                  {shipmentCount}
                  <span className="px-1 text-xs font-medium text-neutral-900">{`(Rp${(profit || 0).toLocaleString("id-ID")})`}</span>
                </span>
              </div>
            </div>
          ) : (
            // Original 'shipment' display
            <div className="flex flex-row items-center gap-x-2">
              <IconComponent
                src="/icons/dashboard/delivery-truck.svg"
                alt="truck"
                width={16}
                height={16}
              />
              <span className="text-xs font-semibold text-neutral-900">
                {shipmentCount}{" "}
                <span className="text-xxs font-medium text-neutral-600">
                  Pengiriman
                </span>
              </span>
            </div>
          )
        ) : (
          <div className={cn("flex flex-col gap-y-1", subInfoClassname)}>
            {/* Original Line */}
            <div className="leading-tight">
              <span className="text-xxs font-medium text-neutral-600">
                {type} :{" "}
              </span>
              <span className="text-xs font-semibold text-neutral-900">
                {value}
              </span>
            </div>

            {/* Conditionally Rendered Additional Line */}
            {additionalType && additionalValue && (
              <div className="leading-tight">
                <span className="text-xxs font-medium text-neutral-600">
                  {additionalType} :{" "}
                </span>
                <span className="text-xs font-semibold text-neutral-900">
                  {additionalValue}
                </span>
              </div>
            )}
          </div>
          // --- MODIFICATION END ---
        )}
      </div>

      {/* Column 3: Rating (Default variant only) */}
      {variant === "default" && rating > 0 && (
        <div
          className={cn(
            "mb-[14px] ml-auto flex flex-shrink-0 items-center gap-x-1 self-end",
            ratingClassname
          )}
        >
          <IconComponent
            src="/icons/star16.svg"
            alt="Rating"
            className="text-warning-700"
            width={16}
            height={16}
          />
          <p className="text-xs font-semibold text-neutral-900">
            <span className="text-xs font-bold">{rating}</span>
            <span className="text-xxs font-medium text-neutral-600">/5</span>
          </p>
        </div>
      )}
    </div>
  );
};

CardLeaderboard.propTypes = {
  variant: PropTypes.oneOf(["default", "alternate"]),
  subVariant: PropTypes.oneOf(["shipment", "detailedShipment"]), // Updated prop type
  rank: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  avatarSrc: PropTypes.string,
  title: PropTypes.string.isRequired,
  shipmentCount: PropTypes.number,
  profit: PropTypes.string, // New prop for currency string
  rating: PropTypes.number,
  iconSrc: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  badgeClassname: PropTypes.string,
  infoClassname: PropTypes.string,
};

CardLeaderboard.defaultProps = {
  variant: "default",
  subVariant: "shipment", // 'shipment' remains the default behavior
  className: "",
  avatarSrc: "",
  shipmentCount: 0,
  profit: "Rp0",
  rating: 0,
  iconSrc: "",
  type: "",
  value: "",
  badgeClassname: "",
  infoClassname: "",
};

export default CardLeaderboard;

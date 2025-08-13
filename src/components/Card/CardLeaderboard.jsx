import PropTypes from "prop-types";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import BadgeLeaderboard from "@/components/Badge/BadgeLeaderboard";
import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

const CardLeaderboard = ({
  variant,
  rank,
  avatarSrc,
  title,
  shipmentCount,
  badgeClassname,
  rating,
  className,
  iconSrc,
  type,
  value,
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
      <div className="mb-[14px] flex flex-1 flex-col justify-center gap-y-3 overflow-hidden">
        <h3 className="truncate text-sm font-semibold text-neutral-900">
          {title}
        </h3>
        {variant === "default" ? (
          <div className="flex flex-row gap-x-2">
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
        ) : (
          <span className="text-xxs font-medium text-neutral-600">
            {type}
            {" : "}
            <span className="flex-row text-xs font-semibold text-neutral-900">
              {value}
            </span>
          </span>
        )}
      </div>

      {/* Column 3: Rating (Default variant only) */}
      {variant === "default" && (
        <div className="mb-[14px] flex flex-shrink-0 items-center gap-x-2 pt-[28px]">
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
  rank: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  avatarSrc: PropTypes.string,
  title: PropTypes.string.isRequired,
  shipmentCount: PropTypes.number,
  rating: PropTypes.number,
  iconSrc: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
};

CardLeaderboard.defaultProps = {
  variant: "default",
  className: "",
  avatarSrc: "",
  shipmentCount: 0,
  rating: 0,
  iconSrc: "https://picsum.photos/200/300",
  type: "",
  value: "",
};

export default CardLeaderboard;

"use client";

import { InfoTooltip } from "@/components/Form/InfoTooltip";

import { cn } from "@/lib/utils";

const TruncatedAddress = ({
  text,
  maxLength = 50,
  className,
  truncate = false,
}) => {
  if (!truncate || !text || text.length <= maxLength) {
    return <span className={className}>{text}</span>;
  }

  const truncatedText = `${text.substring(0, maxLength)}...`;

  return (
    <InfoTooltip
      trigger={
        <span className={className} style={{ cursor: "pointer" }}>
          {truncatedText}
        </span>
      }
      side="top"
      align="start"
      className="max-w-[336px]"
      sideOffset={2}
    >
      {text}
    </InfoTooltip>
  );
};

const MuatBongkarStepper = ({
  pickupLocations = [],
  dropoffLocations = [],
  className,
  appearance = {
    titleClassName: "text-xs font-medium text-gray-900",
  },
  truncate = false,
  maxLength = 50,
}) => {
  // Build locations array from pickupLocations and dropoffLocations
  const locations = [];

  // Add pickup locations (detected by pickupLocations key in response)
  if (pickupLocations && pickupLocations.length > 0) {
    pickupLocations.forEach((pickup) => {
      locations.push({
        title: pickup.fullAddress || pickup,
        type: "pickup",
      });
    });
  }

  // Add dropoff locations (detected by dropoffLocations key in response)
  if (dropoffLocations && dropoffLocations.length > 0) {
    dropoffLocations.forEach((dropoff) => {
      locations.push({
        title: dropoff.fullAddress || dropoff,
        type: "dropoff",
      });
    });
  }

  if (locations.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {locations.map((location, index) => (
        <div
          key={index}
          className="relative grid grid-cols-[16px_1fr] items-center gap-x-2 pb-3 last:pb-0"
        >
          {/* Bullet with custom colors */}
          <div className="relative flex justify-center">
            {/* Dashed line connector */}
            {index < locations.length - 1 && (
              <div className="absolute left-1/2 top-4 h-6 w-px -translate-x-1/2 border-l-2 border-dashed border-neutral-400" />
            )}
            {/* Bullet */}
            <div
              className={cn(
                "relative flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full",
                location.type === "pickup"
                  ? "bg-muat-trans-primary-400"
                  : "bg-muat-trans-secondary-900"
              )}
            >
              <div
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  location.type === "pickup"
                    ? "bg-muat-trans-secondary-900"
                    : "bg-neutral-50"
                )}
              />
            </div>
          </div>
          {/* Location text with conditional truncation and tooltip */}
          <TruncatedAddress
            text={location.title}
            maxLength={maxLength}
            truncate={truncate}
            className={cn(
              "text-xs font-medium text-gray-900",
              appearance.titleClassName
            )}
          />
        </div>
      ))}
    </div>
  );
};

export default MuatBongkarStepper;

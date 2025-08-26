import { memo, useState } from "react";

import { cn } from "@/lib/utils";

const isDebugMode = false; // Set to true for debugging purposes

// Badge style classes
const badgeClasses = {
  base: "flex flex-col items-center px-1 py-1",
  licensePlate: "gap-1 bg-muat-trans-secondary-700",
  sos: "gap-1 bg-error-400 justify-center",
  warning: "gap-0.5 bg-warning-100 justify-center",
  text: "text-[8px] font-bold leading-[130%] text-white line-clamp-1 break-all",
};

const TruckMarker = memo(({ marker, showLicensePlate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasAlerts =
    marker.fleet?.hasSOSAlert || marker.fleet?.needsResponseChange;

  const rotation = marker.rotation || 0;

  // Position label at 2 o'clock relative to center (red circle)
  // 2 o'clock = 60 degrees from top (12 o'clock)
  const angleInDegrees = -60; // Negative because CSS rotation is clockwise
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  const radius = 50; // Distance from center

  // Calculate x,y position for 2 o'clock
  const labelX = radius * Math.sin(-angleInRadians);
  const labelY = radius * Math.cos(-angleInRadians);

  return (
    <>
      {/* Rotating truck container */}
      <div
        className="pointer-events-auto relative origin-center cursor-pointer"
        style={{
          transform: `rotate(${rotation}deg)`,
          willChange: "transform",
          backfaceVisibility: "hidden",
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
        onClick={() => marker.onClick?.(marker)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={marker.icon}
          alt={marker.title}
          width={12}
          height={42}
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backfaceVisibility: "hidden",
          }}
        />
        {/* Debug: Red circle at center */}
        {isDebugMode && (
          <div
            className="absolute h-3 w-3 rounded-full bg-red-500"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </div>

      {/* Label positioned at 2 o'clock from center - outside rotation */}
      {(showLicensePlate || hasAlerts || isHovered) && (
        <div
          className="pointer-events-auto absolute flex flex-row items-stretch"
          style={{
            top: "50%",
            left: "50%",
            marginLeft: `${labelX}px`,
            marginTop: `${-labelY}px`,
            transform: "translate(-50%, -50%)",
            backfaceVisibility: "hidden",
          }}
        >
          {/* License Plate Badge - Show if toggle is ON OR if there are alerts OR on hover */}
          {(showLicensePlate || hasAlerts || isHovered) && (
            <div
              className={cn(
                badgeClasses.base,
                badgeClasses.licensePlate,
                badgeClasses.text,
                hasAlerts ? "rounded-l" : "rounded",
                "pointer-events-auto flex-1"
              )}
            >
              <span className={cn(badgeClasses.text, "whitespace-nowrap")}>
                {marker.fleet?.licensePlate || marker.title}
              </span>
              <p className="text-neutral-200">
                {marker.fleet?.transporterName}
              </p>
            </div>
          )}

          {/* SOS Badge */}
          {marker.fleet?.hasSOSAlert && (
            <div
              className={cn(
                badgeClasses.base,
                badgeClasses.sos,
                badgeClasses.text,
                marker.fleet?.needsResponseChange ? "" : "rounded-r",
                "pointer-events-auto flex items-center"
              )}
            >
              <span className={badgeClasses.text}>SOS</span>
            </div>
          )}

          {/* Warning Badge for needsResponseChange */}
          {marker.fleet?.needsResponseChange && (
            <div
              className={cn(
                badgeClasses.base,
                badgeClasses.warning,
                "rounded-r",
                "pointer-events-auto"
              )}
            >
              <img
                src="/icons/warning16.svg"
                alt="Warning"
                className="h-3 w-3"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
});

TruckMarker.displayName = "TruckMarker";
export default TruckMarker;

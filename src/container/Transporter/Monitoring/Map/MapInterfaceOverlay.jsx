import { useEffect, useState } from "react";

import { ChevronRight } from "lucide-react";

import Button from "@/components/Button/Button";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

import { FilterPopover } from "./components/FilterPopover";
import { LegendButton } from "./components/LegendButton";
import { SearchWithSuggestions } from "./components/SearchWithSuggestions";

export const MapInterfaceOverlay = ({
  onZoomIn,
  onZoomOut,
  onClickDaftarArmada,
  onClickSOS,
  onApplyFilter,
  fleetCounts,
  hideTopNavigation = false,
  onSearch,
  onToggleFullscreen,
  isFullscreen = false,
  showLicensePlate = true,
  onToggleLicensePlate,
  onCenter,
  hasMapInteraction = false,
  hasData = true,
}) => {
  const [sosCount] = useState(2);
  const [centerButtonClicked, setCenterButtonClicked] =
    useState(!hasMapInteraction);

  useEffect(() => {
    // Reset center button state when map interaction changes
    if (hasMapInteraction) {
      setCenterButtonClicked(false);
    }
  }, [hasMapInteraction]);

  const handleCenterClick = () => {
    // Immediately set center button as clicked
    setCenterButtonClicked(true);
    onCenter();
  };

  const handleZoomIn = () => {
    setCenterButtonClicked(false);
    onZoomIn();
  };

  const handleZoomOut = () => {
    setCenterButtonClicked(false);
    onZoomOut();
  };

  const mapControls = [
    {
      icon: isFullscreen
        ? "/icons/monitoring/min-screen.svg"
        : "/icons/monitoring/full-screen.svg",
      tooltip: isFullscreen ? "Kecilkan" : "Besarkan",
      onClick: onToggleFullscreen,
    },
    {
      icon: "/icons/monitoring/center.svg",
      tooltip: "Pusatkan",
      onClick: handleCenterClick,
    },
    {
      icon: "/icons/monitoring/plus.svg",
      tooltip: "Zoom In",
      onClick: handleZoomIn,
    },
    {
      icon: "/icons/monitoring/minus.svg",
      tooltip: "Zoom Out",
      onClick: handleZoomOut,
    },
  ];

  return (
    <>
      {/* Data Not Found Message */}
      {!hasData && (
        <div className="absolute left-1/2 top-40 z-30 flex h-[52px] w-[300px] -translate-x-1/2 transform items-center justify-center rounded-md border border-neutral-400 bg-white px-[10px] py-[22px] shadow-[0px_4px_11px_rgba(65,65,65,0.25)]">
          <span className="text-center text-xs font-medium text-black">
            Data Tidak Ditemukan
          </span>
        </div>
      )}

      {/* Top Navigation Bar Overlay */}
      {!hideTopNavigation && (
        <div className="absolute left-0 right-0 top-0 z-20 flex items-center gap-3 p-4">
          {/* Daftar Armada Button */}
          <Button
            variant="muattrans-primary"
            iconRight={<ChevronRight size={16} />}
            onClick={onClickDaftarArmada}
          >
            Daftar Armada
          </Button>

          {/* Search Input with Suggestions */}
          <SearchWithSuggestions
            placeholder="Cari No. Polisi / Nama Driver"
            onSearch={onSearch}
            containerClassName="max-w-[300px] flex-1"
            inputClassName="w-full"
          />

          {/* Filter Button */}
          <FilterPopover
            onApplyFilter={onApplyFilter}
            fleetCounts={fleetCounts}
          />

          {/* SOS Button */}
          <Button
            variant="muattrans-error-secondary"
            iconLeft={
              <IconComponent
                src="/icons/monitoring/sos.svg"
                className="size-4"
              />
            }
            onClick={onClickSOS}
          >
            SOS ({sosCount})
          </Button>
        </div>
      )}

      {/* Right Side Map Controls */}
      <div
        className={cn(
          "absolute right-4 z-20 -translate-y-1/2 transform",
          isFullscreen ? "top-[210px]" : "top-[104px]"
        )}
      >
        <div className="flex flex-col gap-2">
          {/* Legend button with tooltip and popover */}
          <LegendButton />

          {/* Main map controls */}
          <div className="h-[136px] w-8 rounded-xl bg-white shadow-lg">
            <div className="flex h-full flex-col justify-center gap-2">
              {mapControls.map((control, index) => (
                <InfoTooltip
                  key={`${index}-${isFullscreen}`}
                  trigger={
                    <button
                      onClick={control.onClick}
                      className="mx-auto rounded-xl transition-colors"
                    >
                      <IconComponent
                        src={control.icon}
                        className={cn(
                          "size-6",
                          control.icon === "/icons/monitoring/center.svg"
                            ? centerButtonClicked
                              ? "text-primary-700"
                              : "text-muat-trans-secondary-900"
                            : ""
                        )}
                      />
                    </button>
                  }
                  side="left"
                >
                  {control.tooltip}
                </InfoTooltip>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Right Toggle Control */}
      <div className="absolute bottom-4 right-4 z-20 rounded-2xl bg-white p-2 shadow-lg">
        <div className="flex items-center gap-2">
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={showLicensePlate}
              onChange={(e) => onToggleLicensePlate?.(e.target.checked)}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-neutral-800 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-700 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
          </label>
          <span className="text-xs font-medium">No. Polisi</span>
        </div>
      </div>
    </>
  );
};

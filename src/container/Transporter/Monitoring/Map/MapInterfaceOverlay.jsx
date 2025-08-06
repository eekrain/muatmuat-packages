import { useState } from "react";

import { ChevronRight } from "lucide-react";

import Button from "@/components/Button/Button";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";

export const MapInterfaceOverlay = ({
  onZoomIn,
  onZoomOut,
  onClickDaftarArmada,
  hideTopNavigation = false,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [showLicensePlate, setShowLicensePlate] = useState(true);
  const [sosCount] = useState(2);

  return (
    <>
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

          {/* Search Input */}
          <div className="max-w-[300px] flex-1">
            <Input
              type="text"
              placeholder="Cari No. Polisi / Nama Driver"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              icon={{
                left: (
                  <IconComponent
                    src="/icons/monitoring/search.svg"
                    className="size-4"
                  />
                ),
              }}
            />
          </div>

          {/* Filter Button */}
          <Button
            variant="muattrans-primary-secondary"
            iconLeft={
              <IconComponent
                src="/icons/monitoring/filter.svg"
                className="size-4"
              />
            }
          >
            Filter
          </Button>

          {/* SOS Button */}
          <Button
            variant="muattrans-error-secondary"
            iconLeft={
              <IconComponent
                src="/icons/monitoring/sos.svg"
                className="size-4"
              />
            }
          >
            SOS ({sosCount})
          </Button>
        </div>
      )}

      {/* Right Side Map Controls */}
      <div className="absolute right-4 top-[104px] z-20 -translate-y-1/2 transform">
        <div className="flex flex-col gap-2">
          {/* Info button - separate container at top */}
          <button className="h-8 w-8 place-content-center rounded-xl bg-muat-trans-secondary-900 shadow-lg">
            <IconComponent
              src="/icons/monitoring/info.svg"
              className="mx-auto size-6"
            />
          </button>

          {/* Main map controls */}
          <div className="h-[136px] w-8 rounded-xl bg-white shadow-lg">
            <div className="flex h-full flex-col justify-center gap-2">
              {/* Expand/Collapse button */}
              <button className="mx-auto rounded-xl transition-colors hover:bg-gray-100">
                <IconComponent
                  src="/icons/monitoring/full-screen.svg"
                  className="size-6"
                />
              </button>

              {/* Crosshair/Target button */}
              <button className="mx-auto rounded-xl transition-colors hover:bg-gray-100">
                <IconComponent
                  src="/icons/monitoring/center.svg"
                  className="size-6"
                />
              </button>

              {/* Plus button */}
              <button
                onClick={onZoomIn}
                className="mx-auto rounded-xl transition-colors hover:bg-gray-100"
              >
                <IconComponent
                  src="/icons/monitoring/plus.svg"
                  className="size-6"
                />
              </button>

              {/* Minus button */}
              <button
                onClick={onZoomOut}
                className="mx-auto rounded-xl transition-colors hover:bg-gray-100"
              >
                <IconComponent
                  src="/icons/monitoring/minus.svg"
                  className="size-6"
                />
              </button>
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
              onChange={(e) => setShowLicensePlate(e.target.checked)}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
          </label>
          <span className="text-xs font-medium">No. Polisi</span>
        </div>
      </div>
    </>
  );
};

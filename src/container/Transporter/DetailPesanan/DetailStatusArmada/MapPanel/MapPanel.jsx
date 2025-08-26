import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// import { MapWithPath } from "@/components/MapContainer/MapWithPath";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import { MapMonitoring } from "@/container/Shared/Map/MapMonitoring";
import { LegendButton } from "@/container/Shared/Map/components/LegendButton";

export const MapPanel = ({ fleetMapData }) => {
  const params = useParams();
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [showLicensePlate, setShowLicensePlate] = useState(false);
  const [mapZoom, setMapZoom] = useState(13);
  const [mapCenter, setMapCenter] = useState(null);

  useEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.clientHeight);
    }
  }, [containerRef]);

  useEffect(() => {
    if (fleetMapData[0]?.locationPolyline?.[0]) {
      setMapCenter(fleetMapData[0].locationPolyline[0]);
    }
  }, [fleetMapData[0]]);

  const handleZoomIn = () => {
    setMapZoom((prev) => Math.min(prev + 1, 20));
  };

  const handleZoomOut = () => {
    setMapZoom((prev) => Math.max(prev - 1, 1));
  };

  const handleCenter = () => {
    if (fleetMapData[0]?.locationPolyline?.[0]) {
      setMapCenter(fleetMapData[0].locationPolyline[0]);
      setMapZoom(13);
    }
  };

  const mapControls = [
    {
      icon: "/icons/pusatkan-blue.svg",
      tooltip: "Pusatkan",
      onClick: handleCenter,
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
    <div
      ref={containerRef}
      className="relative h-[596px] w-full flex-1 overflow-hidden rounded-r-[20px]"
    >
      {fleetMapData[0] && height > 0 && (
        <MapMonitoring
          apiKey="AIzaSyDw_9D9-4zTechHn1wMEILZqiBv51Q7jHU"
          locationMarkers={fleetMapData[0].locationMarkers}
          locationPolyline={fleetMapData[0].locationPolyline}
          encodedTruckPolyline={fleetMapData[0].encodedTruckPolyline}
          center={mapCenter || fleetMapData[0]?.locationPolyline?.[0]}
          zoom={mapZoom}
          mapContainerStyle={{
            width: "100%",
            height: height,
          }}
          showLicensePlate={showLicensePlate}
          truckSize={{ width: 32, height: 112 }}
          onMapCenterChange={setMapCenter}
          onMapZoom={setMapZoom}
          showTruck={false}
        />
      )}

      {/* Top Right Controls */}
      <div className="absolute bottom-[180px] right-6 z-20 -translate-y-1/2 transform">
        <div className="flex flex-col">
          {/* Main map controls */}
          <div className="flex h-[35px] w-[35px] items-center justify-center rounded-[13px] bg-muat-trans-secondary-900 shadow-lg">
            <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white">
              <LegendButton />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 right-6 z-20 -translate-y-1/2 transform">
        <div className="flex flex-col gap-2">
          {/* Main map controls */}
          <div className="h-[102px] w-8 rounded-xl bg-white shadow-lg">
            <div className="flex h-full flex-col justify-center gap-2">
              {mapControls.map((control, index) => (
                <InfoTooltip
                  key={index}
                  trigger={
                    <button
                      onClick={control.onClick}
                      className="mx-auto rounded-xl transition-colors"
                    >
                      <IconComponent
                        src={control.icon}
                        className={`size-6 ${
                          control.tooltip === "Pusatkan"
                            ? "text-primary-700"
                            : "text-muat-trans-secondary-900"
                        }`}
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
      <div className="absolute bottom-6 right-8 z-20 rounded-2xl bg-white p-2 shadow-lg">
        <div className="flex items-center gap-2">
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={showLicensePlate}
              onChange={(e) => setShowLicensePlate(e.target.checked)}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-neutral-800 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-700 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
          </label>
          <span className="text-xs font-medium">No. Polisi</span>
        </div>
      </div>
    </div>
  );
};

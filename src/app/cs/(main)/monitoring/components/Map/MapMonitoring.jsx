"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { GoogleMap, OverlayViewF, useLoadScript } from "@react-google-maps/api";

import { cn } from "@/lib/utils";

const isDebugMode = false; // Set to true for debugging purposes

const defaultMapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: -6.2, lng: 106.816666 }; // Default to Jakarta
const defaultZoom = 13;
const defaultMapOptions = {
  disableDefaultUI: false,
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  cameraControl: false,
  fullscreenControl: false,
};

// Badge style classes
const badgeClasses = {
  base: "flex flex-col items-center px-1 py-1",
  licensePlate: "gap-1 bg-muat-trans-secondary-700",
  sos: "gap-1 bg-error-400 justify-center",
  warning: "gap-0.5 bg-warning-100 justify-center",
  text: "text-[8px] font-bold leading-[130%] text-white line-clamp-1 break-all",
};

// Truck Marker Component - Memoized to prevent unnecessary re-renders
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
                PT Truk Jaya Abadi Selalu Selamanya
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

export const MapMonitoring = ({
  apiKey = "AIzaSyDw_9D9-4zTechHn1wMEILZqiBv51Q7jHU",
  mapContainerStyle = defaultMapContainerStyle,
  center = defaultCenter,
  zoom = defaultZoom,
  locationMarkers = [],
  mapOptions = {},
  showLicensePlate = true,
  onMapDrag,
  onMapZoom,
  onMapCenterChange,
}) => {
  // All hooks must be called in the same order every render
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ["places", "geometry"],
  });

  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  // Process markers for rendering
  const processedMarkers = useMemo(() => {
    if (!isLoaded || !window.google) return locationMarkers;
    return locationMarkers;
  }, [locationMarkers, isLoaded]);

  const combinedMapOptions = useMemo(
    () => ({
      ...defaultMapOptions,
      ...mapOptions,
    }),
    [mapOptions]
  );

  // Memoize pixel position offset function to prevent re-creation on every render
  const getPixelPositionOffset = useMemo(
    () => (width, height) => ({
      x: -(width / 2),
      y: -(height / 2),
    }),
    []
  );

  // Handle map load
  const onMapLoad = useCallback((mapInstance) => {
    mapRef.current = mapInstance;
    setMap(mapInstance);
  }, []);

  // Update map center and zoom when props change
  useEffect(() => {
    if (map) {
      if (center) {
        const currentCenter = map.getCenter();
        // Only pan if center actually changed
        if (
          !currentCenter ||
          Math.abs(currentCenter.lat() - center.lat) > 0.0001 ||
          Math.abs(currentCenter.lng() - center.lng) > 0.0001
        ) {
          map.panTo(center);
        }
      }
      if (zoom) {
        const currentZoom = map.getZoom();
        // Only change zoom if it actually changed
        if (currentZoom !== zoom) {
          map.setZoom(zoom);
        }
      }
    }
  }, [map, center, zoom]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (map && onMapCenterChange) {
      const newCenter = map.getCenter();
      onMapCenterChange({ lat: newCenter.lat(), lng: newCenter.lng() });
    }
    if (onMapDrag) {
      onMapDrag();
    }
  }, [onMapDrag, onMapCenterChange, map]);

  // Handle zoom change
  const handleZoomChanged = useCallback(() => {
    if (onMapZoom && map) {
      const currentZoom = map.getZoom();
      onMapZoom(currentZoom);
    }
  }, [onMapZoom, map]);

  if (loadError) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-red-300 bg-red-50">
        <div className="text-center">
          <p className="mb-2 text-red-600">Error loading Google Maps</p>
          <p className="text-sm text-red-500">{loadError.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span className="text-gray-700">Loading maps...</span>
        </div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100">
        <div className="text-center">
          <p className="mb-2 text-gray-600">Google Maps API Key Required</p>
          <p className="text-sm text-gray-500">
            Please provide a valid Google Maps API key
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        options={combinedMapOptions}
        onLoad={onMapLoad}
        onDragEnd={handleDragEnd}
        onZoomChanged={handleZoomChanged}
      >
        {/* Render truck markers with rotation using OverlayViewF */}
        {processedMarkers.map((marker) => (
          <OverlayViewF
            key={marker.title}
            position={marker.position}
            mapPaneName="floatPane"
            getPixelPositionOffset={getPixelPositionOffset}
          >
            <TruckMarker marker={marker} showLicensePlate={showLicensePlate} />
          </OverlayViewF>
        ))}
      </GoogleMap>
    </div>
  );
};

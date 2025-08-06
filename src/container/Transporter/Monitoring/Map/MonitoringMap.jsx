"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  GoogleMap,
  Marker,
  OverlayView,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";

// Default configurations
const defaultMapContainerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: -6.2, lng: 106.816666 }; // Jakarta
const defaultZoom = 12;
const defaultMapOptions = {
  disableDefaultUI: false,
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  cameraControl: false,
  fullscreenControl: false,
};

// Route styling options
const defaultRouteOptions = {
  strokeColor: "#3B82F6",
  strokeOpacity: 0.8,
  strokeWeight: 4,
};

const activeRouteOptions = {
  strokeColor: "#10B981",
  strokeOpacity: 1,
  strokeWeight: 5,
};

// Calculate bearing between two points for rotation
const calculateBearing = (start, end) => {
  const startLat = start.lat * (Math.PI / 180);
  const startLng = start.lng * (Math.PI / 180);
  const endLat = end.lat * (Math.PI / 180);
  const endLng = end.lng * (Math.PI / 180);

  const dLng = endLng - startLng;
  const y = Math.sin(dLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

  const bearing = Math.atan2(y, x) * (180 / Math.PI);
  return (bearing + 360) % 360;
};

/**
 * MonitoringMap Component for Transporter Monitoring
 * @param {Object} props
 * @param {string} props.apiKey - Google Maps API key
 * @param {Object} props.mapContainerStyle - Container styles
 * @param {Object} props.center - Map center {lat, lng}
 * @param {number} props.zoom - Map zoom level
 * @param {Array} props.fleetMarkers - Fleet vehicle markers
 * @param {Array} props.routes - Array of route objects with polylines
 * @param {string} props.selectedFleetId - Currently selected fleet ID
 * @param {string} props.selectedRouteId - Currently selected route ID
 * @param {Function} props.onFleetClick - Handler for fleet marker clicks
 * @param {Function} props.onRouteClick - Handler for route clicks
 * @param {Function} props.onMapClick - Handler for map clicks
 * @param {Object} props.mapOptions - Additional map options
 * @param {boolean} props.showFleetLabels - Show labels on fleet markers
 * @param {boolean} props.showRoutes - Show route polylines
 * @param {boolean} props.showSOSAlerts - Highlight SOS alerts
 */
export const MonitoringMap = ({
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    "AIzaSyDw_9D9-4zTechHn1wMEILZqiBv51Q7jHU",
  mapContainerStyle = defaultMapContainerStyle,
  center = defaultCenter,
  zoom = defaultZoom,
  fleetMarkers = [],
  routes = [],
  selectedFleetId = null,
  selectedRouteId = null,
  onFleetClick = () => {},
  onRouteClick = () => {},
  onMapClick = () => {},
  mapOptions = {},
  showFleetLabels = true,
  showRoutes = true,
  showSOSAlerts = true,
}) => {
  const [mapInstance, setMapInstance] = useState(null);
  const [hoveredFleetId, setHoveredFleetId] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const hoverTimeoutRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ["places", "geometry"],
  });

  // Process fleet markers with icons and status
  const processedFleetMarkers = useMemo(() => {
    if (!isLoaded || !window.google) return [];

    return fleetMarkers.map((fleet) => {
      let iconUrl = "/icons/marker-truck.svg";
      let scaledSize = new window.google.maps.Size(40, 40);

      // Customize icons based on fleet status
      if (fleet.hasSOSAlert && showSOSAlerts) {
        iconUrl = "/icons/marker-truck.svg";
        scaledSize = new window.google.maps.Size(50, 50);
      } else if (fleet.status === "BUSY") {
        iconUrl = "/icons/marker-truck.svg";
      } else if (fleet.status === "IDLE") {
        iconUrl = "/icons/marker-truck.svg";
      }

      // Highlight selected fleet
      if (fleet.id === selectedFleetId) {
        scaledSize = new window.google.maps.Size(55, 55);
      }

      return {
        ...fleet,
        icon: {
          url: iconUrl,
          scaledSize,
          anchor: new window.google.maps.Point(
            scaledSize.width / 2,
            scaledSize.height / 2
          ),
        },
      };
    });
  }, [fleetMarkers, isLoaded, selectedFleetId, showSOSAlerts]);

  // Decode route polylines
  const decodedRoutes = useMemo(() => {
    if (!isLoaded || !window.google?.maps?.geometry || !showRoutes) return [];

    return routes.map((route) => {
      let path = [];

      // Handle encoded polyline
      if (route.encodedPolyline) {
        try {
          path = window.google.maps.geometry.encoding.decodePath(
            route.encodedPolyline
          );
        } catch (error) {
          console.error("Failed to decode polyline:", error);
        }
      }
      // Handle array of lat/lng
      else if (route.path && Array.isArray(route.path)) {
        path = route.path;
      }

      return {
        ...route,
        decodedPath: path,
        isActive: route.id === selectedRouteId,
      };
    });
  }, [routes, isLoaded, selectedRouteId, showRoutes]);

  // Calculate fleet rotation based on movement
  const fleetRotations = useMemo(() => {
    const rotations = {};

    processedFleetMarkers.forEach((fleet) => {
      if (fleet.previousPosition && fleet.position) {
        rotations[fleet.id] = calculateBearing(
          fleet.previousPosition,
          fleet.position
        );
      } else {
        rotations[fleet.id] = fleet.heading || 0;
      }
    });

    return rotations;
  }, [processedFleetMarkers]);

  // Handle map load
  const handleMapLoad = useCallback((map) => {
    setMapInstance(map);
  }, []);

  // Update zoom when prop changes
  useEffect(() => {
    if (mapInstance && zoom !== currentZoom) {
      mapInstance.setZoom(zoom);
      setCurrentZoom(zoom);
    }
  }, [zoom, mapInstance, currentZoom]);

  // Cleanup hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Auto-fit bounds only on initial load
  useEffect(() => {
    if (!mapInstance || !window.google || fleetMarkers.length === 0) return;

    // Only auto-fit on first load (when zoom hasn't been manually changed)
    if (currentZoom === defaultZoom) {
      const bounds = new window.google.maps.LatLngBounds();

      fleetMarkers.forEach((fleet) => {
        bounds.extend(fleet.position);
      });

      // Add route points to bounds
      decodedRoutes.forEach((route) => {
        route.decodedPath.forEach((point) => {
          bounds.extend(point);
        });
      });

      mapInstance.fitBounds(bounds, { padding: 50 });
    }
  }, [mapInstance]); // Only run on map instance change

  // Combined map options
  const combinedMapOptions = useMemo(
    () => ({
      ...defaultMapOptions,
      ...mapOptions,
    }),
    [mapOptions]
  );

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span className="text-gray-700">Loading maps...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="flex h-full items-center justify-center bg-red-50">
        <div className="text-center">
          <p className="mb-2 text-red-600">Error loading Google Maps</p>
          <p className="text-sm text-red-500">{loadError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={currentZoom}
      options={combinedMapOptions}
      onLoad={handleMapLoad}
      onClick={onMapClick}
    >
      {/* Render route polylines */}
      {decodedRoutes.map((route) => (
        <Polyline
          key={route.id}
          path={route.decodedPath}
          options={route.isActive ? activeRouteOptions : defaultRouteOptions}
          onClick={() => onRouteClick(route)}
        />
      ))}

      {/* Render fleet markers */}
      {processedFleetMarkers.map((fleet) => (
        <div key={fleet.id}>
          {/* Fleet vehicle marker */}
          <OverlayView
            position={fleet.position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={(width, height) => ({
              x: -(width / 2),
              y: -(height / 2),
            })}
          >
            <div
              className="relative cursor-pointer transition-transform hover:scale-110"
              style={{
                transform: `rotate(${fleetRotations[fleet.id] || 0}deg)`,
                transformOrigin: "center center",
              }}
              onClick={() => onFleetClick(fleet)}
              onMouseEnter={() => {
                if (hoverTimeoutRef.current) {
                  clearTimeout(hoverTimeoutRef.current);
                }
                setHoveredFleetId(fleet.id);
              }}
              onMouseLeave={() => {
                if (hoverTimeoutRef.current) {
                  clearTimeout(hoverTimeoutRef.current);
                }
                hoverTimeoutRef.current = setTimeout(() => {
                  setHoveredFleetId(null);
                }, 100);
              }}
            >
              <img
                src={fleet.icon.url}
                alt={fleet.licensePlate || "Fleet"}
                width={fleet.icon.scaledSize.width}
                height={fleet.icon.scaledSize.height}
                style={{ objectFit: "contain" }}
              />

              {/* SOS Alert Animation */}
              {fleet.hasSOSAlert && showSOSAlerts && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute h-full w-full animate-ping rounded-full bg-red-500 opacity-30" />
                  <div className="animation-delay-200 absolute h-3/4 w-3/4 animate-ping rounded-full bg-red-500 opacity-20" />
                </div>
              )}
            </div>
          </OverlayView>

          {/* Fleet label */}
          {showFleetLabels &&
            (hoveredFleetId === fleet.id || selectedFleetId === fleet.id) && (
              <OverlayView
                position={fleet.position}
                mapPaneName={OverlayView.OVERLAY_LAYER}
                getPixelPositionOffset={() => ({
                  x: 0,
                  y: -45,
                })}
              >
                <div
                  className="rounded-lg bg-gray-900 px-3 py-2 text-white shadow-lg"
                  style={{ pointerEvents: "none" }}
                >
                  <div className="text-xs font-semibold">
                    {fleet.licensePlate}
                  </div>
                  <div className="text-xs text-gray-300">
                    {fleet.driverName || "No Driver"}
                  </div>
                  {fleet.status && (
                    <div className="mt-1">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                          fleet.status === "BUSY"
                            ? "bg-yellow-500 text-yellow-900"
                            : fleet.status === "IDLE"
                              ? "bg-green-500 text-green-900"
                              : "bg-gray-500 text-gray-900"
                        }`}
                      >
                        {fleet.status}
                      </span>
                    </div>
                  )}
                </div>
              </OverlayView>
            )}
        </div>
      ))}

      {/* Pickup/Dropoff markers for selected route */}
      {selectedRouteId &&
        decodedRoutes.find((r) => r.id === selectedRouteId) && (
          <>
            {decodedRoutes
              .find((r) => r.id === selectedRouteId)
              .pickupDropoffMarkers?.map((marker, index) => (
                <Marker
                  key={`${selectedRouteId}-${index}`}
                  position={marker.position}
                  icon={{
                    url: marker.icon,
                    scaledSize: new window.google.maps.Size(35, 45),
                    anchor: new window.google.maps.Point(17.5, 45),
                  }}
                  label={marker.label}
                />
              ))}
          </>
        )}
    </GoogleMap>
  );
};

export default MonitoringMap;

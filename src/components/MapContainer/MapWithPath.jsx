"use client";

import { useEffect, useMemo } from "react";

import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";

// Remove unused imports and code
const defaultMapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: -7.2575, lng: 112.7521 }; // Default to Surabaya
const defaultZoom = 13;
const defaultPathOptions = {
  strokeColor: "#FF6B35",
  strokeOpacity: 1,
  strokeWeight: 4,
};
const defaultMapOptions = {
  disableDefaultUI: false,
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  cameraControl: false,
  fullscreenControl: false,
};

// Label styles
const createLabelStyle = () => ({
  className: "marker-label",
  color: "white",
  background: "black",
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: "bold",
  marginBottom: "8px",
});

// Function to calculate bearing between two points
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

  let bearing = Math.atan2(y, x) * (180 / Math.PI);
  return (bearing + 360) % 360; // Normalize to 0-360 degrees
};

export const MapWithPath = ({
  apiKey = "AIzaSyDw_9D9-4zTechHn1wMEILZqiBv51Q7jHU",
  mapContainerStyle = defaultMapContainerStyle,
  center = defaultCenter,
  zoom = defaultZoom,
  waypoints = [], // Regular waypoints for connecting locations
  truckWaypoints = [], // Separate truck waypoints from backend
  markers = [],
  pathOptions = defaultPathOptions,
  truckPathOptions = {
    // Separate styling for truck path
    strokeColor: "#4CAF50",
    strokeOpacity: 0.8,
    strokeWeight: 3,
    strokeDashArray: "10,5", // Dashed line to differentiate
  },
  mapOptions = {},
  showTruck = true,
  truckIcon = "/icons/truck-icon.svg", // Path to truck icon
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ["places", "geometry"],
  });

  // Calculate truck position and rotation based on truck waypoints
  const truckMarker = useMemo(() => {
    if (!truckWaypoints || truckWaypoints.length < 2 || !showTruck) return null;

    const lastPoint = truckWaypoints[truckWaypoints.length - 1];
    const secondLastPoint = truckWaypoints[truckWaypoints.length - 2];

    // Calculate bearing from second last to last point
    const bearing = calculateBearing(secondLastPoint, lastPoint);

    return {
      position: lastPoint,
      rotation: bearing,
    };
  }, [truckWaypoints, showTruck]);

  // Process markers with proper icons when Google Maps is loaded
  const processedMarkers = useMemo(() => {
    if (!isLoaded || !window.google) return markers;
    return markers.map((marker) => ({
      ...marker,
      icon: {
        url: process.env.NEXT_PUBLIC_ASSET_REVERSE + marker.icon,

        scaledSize: new window.google.maps.Size(45, 58),
        anchor: new window.google.maps.Point(22.5, 48), // Center bottom of the marker
      },
    }));
  }, [markers, isLoaded]);

  // Process truck marker with rotation
  const processedTruckMarker = useMemo(() => {
    if (!isLoaded || !window.google || !truckMarker) return null;

    return {
      position: truckMarker.position,
      icon: {
        url: process.env.NEXT_PUBLIC_ASSET_REVERSE + truckIcon,
        scaledSize: new window.google.maps.Size(60, 60),
        anchor: new window.google.maps.Point(30, 30), // Center of the truck icon
        rotation: truckMarker.rotation,
      },
    };
  }, [truckMarker, truckIcon, isLoaded]);

  // Add styles for marker labels
  useEffect(() => {
    // Add CSS for marker labels
    const style = document.createElement("style");
    style.textContent = `
      .marker-label {
        position: relative;
        background: black;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        white-space: nowrap;
        transform: translateY(-38px);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const combinedMapOptions = useMemo(
    () => ({
      ...defaultMapOptions,
      ...mapOptions,
    }),
    [mapOptions]
  );

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
      >
        {/* Render path between waypoints (location connections) */}
        {waypoints.length >= 2 && (
          <Polyline path={waypoints} options={pathOptions} />
        )}

        {/* Render truck path (separate from location connections) */}
        {truckWaypoints.length >= 2 && (
          <Polyline path={truckWaypoints} options={truckPathOptions} />
        )}

        {/* Render custom markers */}
        {processedMarkers.map((marker, index) => (
          <Marker
            key={marker.id || index}
            position={marker.position}
            icon={marker.icon}
            onClick={() => marker.onClick?.(marker)}
            label={{
              text: marker.title,
              ...createLabelStyle(),
            }}
          />
        ))}

        {/* Render truck marker at the end of the path */}
        {processedTruckMarker && (
          <Marker
            position={processedTruckMarker.position}
            icon={processedTruckMarker.icon}
            zIndex={1000} // Ensure truck appears on top
          />
        )}
      </GoogleMap>
    </div>
  );
};

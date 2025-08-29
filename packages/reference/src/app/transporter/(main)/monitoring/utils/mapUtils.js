// Function to calculate bounds and zoom level for all fleet vehicles
export const calculateMapBounds = (markers) => {
  if (!markers || markers.length === 0) {
    return {
      center: { lat: -6.2, lng: 106.816666 }, // Default Jakarta
      zoom: 12,
    };
  }

  if (markers.length === 1) {
    return {
      center: markers[0].position,
      zoom: 15, // Closer zoom for single vehicle
    };
  }

  // Calculate bounds
  let minLat = markers[0].position.lat;
  let maxLat = markers[0].position.lat;
  let minLng = markers[0].position.lng;
  let maxLng = markers[0].position.lng;

  markers.forEach((marker) => {
    minLat = Math.min(minLat, marker.position.lat);
    maxLat = Math.max(maxLat, marker.position.lat);
    minLng = Math.min(minLng, marker.position.lng);
    maxLng = Math.max(maxLng, marker.position.lng);
  });

  // Calculate center - geographic midpoint of all fleet positions
  const center = {
    lat: (minLat + maxLat) / 2,
    lng: (minLng + maxLng) / 2,
  };

  // Calculate zoom level based on bounds
  const latDiff = maxLat - minLat;
  const lngDiff = maxLng - minLng;
  const maxDiff = Math.max(latDiff, lngDiff);

  // Comprehensive zoom levels for better granularity
  let zoom = 12; // Default zoom

  // Define zoom levels with finer ranges
  const zoomLevels = [
    { maxDiff: 0.001, zoom: 18 }, // Single building
    { maxDiff: 0.003, zoom: 17 }, // Few buildings
    { maxDiff: 0.005, zoom: 16 }, // Street level
    { maxDiff: 0.01, zoom: 15 }, // Neighborhood
    { maxDiff: 0.02, zoom: 14 }, // Small district
    { maxDiff: 0.04, zoom: 13 }, // District
    { maxDiff: 0.08, zoom: 12 }, // Multiple districts
    { maxDiff: 0.15, zoom: 11 }, // City (Surabaya spread)
    { maxDiff: 0.3, zoom: 10 }, // Greater city area
    { maxDiff: 0.6, zoom: 9 }, // Metropolitan area
    { maxDiff: 1.2, zoom: 8 }, // Between close cities
    { maxDiff: 2.5, zoom: 8 }, // Regional (100-200km)
    { maxDiff: 4, zoom: 8 }, // Cilacap-Surabaya (~3.7°)
    { maxDiff: 6, zoom: 7 }, // Inter-province
    { maxDiff: 10, zoom: 6 }, // Jakarta-Surabaya (~6°)
    { maxDiff: 15, zoom: 5 }, // Half country
    { maxDiff: 25, zoom: 5 }, // Most of Indonesia
    { maxDiff: 35, zoom: 4 }, // Jakarta-Papua
    { maxDiff: 50, zoom: 4 }, // Entire Indonesia
    { maxDiff: Infinity, zoom: 3 }, // Continental view
  ];

  // Find appropriate zoom level
  for (const level of zoomLevels) {
    if (maxDiff < level.maxDiff) {
      zoom = level.zoom;
      break;
    }
  }

  return { center, zoom };
};

// Convert fleet locations to map markers
export const convertFleetToMarkers = (fleetData, handleTruckClick) => {
  if (!fleetData?.fleets) return [];

  return fleetData.fleets.map((fleet) => {
    let icon = "/img/monitoring/truck/gray.png"; // Default

    // Map operational status to truck icon colors
    switch (fleet.operationalStatus) {
      case "ON_DUTY":
        icon = "/img/monitoring/truck/blue.png";
        break;
      case "READY_FOR_ORDER":
        icon = "/img/monitoring/truck/green.png";
        break;
      case "NOT_PAIRED":
        icon = "/img/monitoring/truck/gray.png";
        break;
      case "WAITING_LOADING_TIME":
        icon = "/img/monitoring/truck/yellow.png";
        break;
      case "INACTIVE":
        icon = "/img/monitoring/truck/red.png";
        break;
      default:
        icon = "/img/monitoring/truck/gray.png";
    }

    return {
      position: { lat: fleet.latitude, lng: fleet.longitude },
      title: `${fleet.licensePlate} - ${fleet.driverName}`,
      icon: icon,
      rotation: fleet.heading || 0, // Pass heading as rotation
      fleet: fleet, // Keep fleet data for additional info
      onClick: handleTruckClick, // Add click handler
    };
  });
};

// Apply filters to fleet markers
export const applyFiltersToMarkers = (markers, filters) => {
  return markers.filter((marker) => {
    // If no filters selected, show all
    if (
      filters.selectedTruckFilters.length === 0 &&
      filters.selectedOrderFilters.length === 0
    ) {
      return true;
    }

    // Check truck status filter
    if (filters.selectedTruckFilters.length > 0) {
      if (
        !filters.selectedTruckFilters.includes(marker.fleet.operationalStatus)
      ) {
        return false;
      }
    }

    // Check order status filter (if needed)
    if (filters.selectedOrderFilters.length > 0) {
      // Add logic for order status filtering if applicable
      if (filters.selectedOrderFilters.includes("NEEDS_RESPONSE")) {
        // This would need to be implemented based on your actual data structure
        // return marker.fleet.hasOrderNeedsResponse || false;
      }
    }

    return true;
  });
};

// Calculate fleet counts for filter popover
export const calculateFleetCounts = (markers) => {
  return markers.reduce((acc, marker) => {
    const status = marker.fleet.operationalStatus;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
};

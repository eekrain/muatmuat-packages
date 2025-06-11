import { MapWithPath } from "@/components/MapContainer/MapWithPath";

// Example usage component
const MapExample = () => {
  // Example waypoints for connecting locations (optional - can be empty)
  const exampleWaypoints = [
    { lat: -7.2504, lng: 112.7344 }, // Lokasi Bongkar 1
    { lat: -7.2601, lng: 112.7589 }, // Lokasi Muat 2
    { lat: -7.2445, lng: 112.7723 }, // Lokasi Muat 1
  ];

  // Separate truck waypoints from backend - completely independent path
  const truckWaypoints = [
    { lat: -7.248, lng: 112.73 }, // Truck starting point
    { lat: -7.2495, lng: 112.735 }, // Truck waypoint 1
    { lat: -7.251, lng: 112.742 }, // Truck waypoint 2
    { lat: -7.253, lng: 112.748 }, // Truck waypoint 3
    { lat: -7.256, lng: 112.754 }, // Truck waypoint 4
    { lat: -7.258, lng: 112.76 }, // Truck waypoint 5
    { lat: -7.259, lng: 112.765 }, // Truck waypoint 6
    { lat: -7.257, lng: 112.77 }, // Truck waypoint 7
    { lat: -7.252, lng: 112.775 }, // Truck waypoint 8
    { lat: -7.246, lng: 112.772 }, // Truck current position (end)
  ];

  const exampleMarkers = React.useMemo(
    () => [
      {
        id: "muat1",
        position: { lat: -7.2445, lng: 112.7723 },
        title: "Lokasi Muat 1",
        icon: "/icons/marker-lokasi-muat.svg",
      },
      {
        id: "muat2",
        position: { lat: -7.2601, lng: 112.7589 },
        title: "Lokasi Muat 2",
        icon: "/icons/marker-lokasi-muat.svg",
      },
      {
        id: "bongkar1",
        position: { lat: -7.2504, lng: 112.7344 },
        title: "Lokasi Bongkar 1",
        icon: "/icons/marker-lokasi-bongkar.svg",
      },
    ],
    []
  );

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Truck Route Map Component</h1>

      <div className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Example Usage:</h2>
        <MapWithPath
          apiKey="AIzaSyDw_9D9-4zTechHn1wMEILZqiBv51Q7jHU"
          waypoints={exampleWaypoints} // Location connection waypoints
          truckWaypoints={truckWaypoints} // Separate truck path from backend
          markers={exampleMarkers}
          center={{ lat: -7.2575, lng: 112.7521 }}
          zoom={13}
          pathOptions={{
            strokeColor: "#FF6B35", // Orange for location connections
            strokeOpacity: 1,
            strokeWeight: 4,
          }}
          truckPathOptions={{
            strokeColor: "#4CAF50", // Green for truck path
            strokeOpacity: 0.8,
            strokeWeight: 3,
          }}
          mapContainerStyle={{ width: "100%", height: "500px" }}
          showTruck={true}
          truckIcon="/icons/marker-truck.svg"
        />
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="mb-2 font-semibold">Component Props:</h3>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>
            <strong>apiKey</strong>: Your Google Maps API key (required)
          </li>
          <li>
            <strong>waypoints</strong>: Array of {"{ lat, lng }"} objects for
            location connections (optional)
          </li>
          <li>
            <strong>truckWaypoints</strong>: Array of {"{ lat, lng }"} objects
            for the truck&apos;s actual path from backend
          </li>
          <li>
            <strong>markers</strong>: Array of marker objects with position,
            title, icon, etc.
          </li>
          <li>
            <strong>center</strong>: Map center position
          </li>
          <li>
            <strong>zoom</strong>: Initial zoom level
          </li>
          <li>
            <strong>pathOptions</strong>: Styling options for location
            connection lines
          </li>
          <li>
            <strong>truckPathOptions</strong>: Styling options for truck route
            line
          </li>
          <li>
            <strong>mapContainerStyle</strong>: CSS styling for map container
          </li>
          <li>
            <strong>showTruck</strong>: Boolean to show/hide truck icon
            (default: true)
          </li>
          <li>
            <strong>truckIcon</strong>: Path to truck icon SVG file
          </li>
        </ul>
      </div>

      <div className="mt-4 rounded-lg bg-blue-50 p-4">
        <h3 className="mb-2 font-semibold text-blue-800">Truck Features:</h3>
        <ul className="space-y-1 text-sm text-blue-700">
          <li>
            • <strong>Independent Truck Path:</strong> Truck waypoints are
            completely separate from location markers
          </li>
          <li>
            • <strong>Backend Integration:</strong> truckWaypoints prop accepts
            raw GPS data from your backend
          </li>
          <li>
            • <strong>Dual Path Rendering:</strong> Shows both location
            connections (orange) and truck path (green)
          </li>
          <li>
            • <strong>Smart Truck Positioning:</strong> Truck icon positioned at
            the last waypoint
          </li>
          <li>
            • <strong>Automatic Rotation:</strong> Truck rotates based on
            direction of travel
          </li>
          <li>
            • <strong>Visual Differentiation:</strong> Different colors and
            styles for each path type
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MapExample;

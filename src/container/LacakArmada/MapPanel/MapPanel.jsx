import { MapWithPath } from "@/components/MapContainer/MapWithPath";

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

const exampleMarkers = [
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
];

export const MapPanel = ({}) => {
  return (
    <div className="relative flex-1 bg-gray-100">
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
        mapContainerStyle={{
          width: "100%",
          height: "calc(100vh - 60px)",
        }}
        showTruck={true}
        truckIcon="/icons/marker-truck.svg"
      />
    </div>
  );
};

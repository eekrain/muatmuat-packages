import { MapWithPath } from "@/components/MapContainer/MapWithPath";
import { useGetTrackingLocations } from "@/services/lacak-armada/getTrackingLocations";

export const MapPanel = ({}) => {
  const { data } = useGetTrackingLocations({
    orderId: "123",
    driverId: "456",
  });

  return (
    <div className="relative flex-1 bg-gray-100">
      {data && (
        <MapWithPath
          apiKey="AIzaSyDw_9D9-4zTechHn1wMEILZqiBv51Q7jHU"
          locationMarkers={data.locationMarkers}
          locationPolyline={data.locationPolyline} // Location connection waypoints
          encodedTruckPolyline={data.encodedTruckPolyline}
          center={data.locationPolyline[0]}
          zoom={13}
          mapContainerStyle={{
            width: "100%",
            height: "calc(100vh - 60px)",
          }}
          showTruck={true}
          truckIcon="/icons/marker-truck.svg"
        />
      )}
    </div>
  );
};

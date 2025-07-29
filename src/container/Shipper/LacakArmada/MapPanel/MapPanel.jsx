import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { MapWithPath } from "@/components/MapContainer/MapWithPath";
import { useGetTrackingLocations } from "@/services/Shipper/lacak-armada/getTrackingLocations";

export const MapPanel = () => {
  const params = useParams();
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);
  const { data: dataTracking } = useGetTrackingLocations(
    params.orderId,
    params.driverId
  );

  useEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.clientHeight);
    }
  }, [containerRef]);
  return (
    <div ref={containerRef} className="relative flex-1 bg-gray-100">
      {dataTracking && height > 0 && (
        <MapWithPath
          apiKey="AIzaSyDw_9D9-4zTechHn1wMEILZqiBv51Q7jHU"
          locationMarkers={dataTracking.locationMarkers}
          locationPolyline={dataTracking.locationPolyline} // Location connection waypoints
          encodedTruckPolyline={dataTracking.encodedTruckPolyline}
          center={dataTracking.locationPolyline[0]}
          zoom={13}
          mapContainerStyle={{
            width: "100%",
            height: height,
          }}
          showTruck={true}
          truckIcon="/icons/marker-truck.svg"
        />
      )}
    </div>
  );
};

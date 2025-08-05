"use client";

import { MapWithPath } from "@/components/MapContainer/MapWithPath";
import { NoFleetOverlay } from "@/components/monitoring/NoFleetOverlay";
import { useGetFleetCount } from "@/services/Transporter/monitoring/getFleetCount";

const Page = () => {
  const { data: fleetData, isLoading } = useGetFleetCount();
  const hasFleet = fleetData?.hasFleet || false;

  return (
    <div className="relative h-screen">
      <div className="h-full">
        <div className="relative h-[298px] w-[811px]">
          <MapWithPath
            mapContainerStyle={{
              height: 298,
              width: 811,
            }}
          />
          {!isLoading && !hasFleet && <NoFleetOverlay />}
        </div>
      </div>
    </div>
  );
};
export default Page;

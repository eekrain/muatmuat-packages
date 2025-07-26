"use client";

import { useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import { MapWithPath } from "@/components/MapContainer/MapWithPath";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { useGetTrackingLocations } from "@/services/Shipper/lacak-armada/getTrackingLocations";

import DriverCard from "./components/DriverCard";
import { MarkerLegends } from "./components/MarkerLegends";

const FleetTrackScreen = ({ dataStatusPesanan }) => {
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();

  const { driverId, orderId } = params;

  const [isOpenBottomsheet, setIsOpenBottomsheet] = useState(false);

  const { data } = useGetTrackingLocations({
    orderId,
    driverId,
  });

  return (
    <FormResponsiveLayout
      title={{
        label: "Lacak Armada",
      }}
      withMenu={{
        onClickInfo: () => setIsOpenBottomsheet(true),
      }}
      onClickBackButton={() => navigation.pop()}
    >
      <div className="mb-16 bg-neutral-200">
        <DriverCard data={dataStatusPesanan.driverStatus} />

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
              height: "calc(100vh - 184px)",
            }}
            showTruck={true}
            truckIcon="/icons/marker-truck.svg"
          />
        )}
      </div>

      <BottomSheet open={isOpenBottomsheet} onOpenChange={setIsOpenBottomsheet}>
        <BottomSheetContent>
          <BottomSheetHeader>Keterangan</BottomSheetHeader>

          {data && <MarkerLegends legends={data.locationMarkers} />}
        </BottomSheetContent>
      </BottomSheet>

      <ResponsiveFooter className="flex gap-3">
        <Button
          variant="muatparts-primary-secondary"
          className="h-10 flex-1 p-0"
          onClick={() => navigation.push("/detail-driver-status")}
          type="button"
        >
          Detail Status Driver
        </Button>
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};
export default FleetTrackScreen;

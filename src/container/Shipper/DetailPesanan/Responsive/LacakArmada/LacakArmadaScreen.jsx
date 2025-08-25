"use client";

import { useState } from "react";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/BottomSheet/BottomSheetUp";
import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import { MapWithPath } from "@/components/MapContainer/MapWithPath";
import { useTranslation } from "@/hooks/use-translation";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { useGetTrackingLocations } from "@/services/Shipper/lacak-armada/getTrackingLocations";

import { DriverInfo } from "../Home/components/DriverInfoSlider";
import { EstimatedArrival } from "./EstimatedArrival";
import { MarkerLegends } from "./components/MarkerLegends";

const LacakArmadaScreen = ({ dataStatusPesanan }) => {
  const { t } = useTranslation();
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();

  const { driverId, orderId } = params;

  const [isOpenBottomsheet, setIsOpenBottomsheet] = useState(false);

  const { data } = useGetTrackingLocations(orderId, driverId);

  const driver = dataStatusPesanan?.driverStatus.find(
    (d) => d.driverId === driverId
  );

  return (
    <FormResponsiveLayout
      title={{
        label: t("LacakArmadaScreen.titleLacakArmada", {}, "Lacak Armada"),
      }}
      withMenu={{
        onClickInfo: () => setIsOpenBottomsheet(true),
      }}
      onClickBackButton={() => navigation.pop()}
    >
      <EstimatedArrival
        driverStatus={driver?.driverStatus}
        arrivalTime={new Date().toISOString()}
      />

      <div className="mb-16 bg-neutral-200">
        {driver && (
          <DriverInfo.Root className="flex flex-col gap-4 px-4 py-5">
            <DriverInfo.Header
              orderStatus={driver.orderStatus}
              driverStatus={driver.driverStatus}
              withMenu={false}
            />
            <DriverInfo.Avatar driver={driver} />
          </DriverInfo.Root>
        )}

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
            pathOptions={{
              strokeWeight: 3,
            }}
            truckPathOptions={{
              strokeWeight: 3,
            }}
          />
        )}
      </div>

      <BottomSheet open={isOpenBottomsheet} onOpenChange={setIsOpenBottomsheet}>
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetClose />
            <BottomSheetTitle>Keterangan</BottomSheetTitle>
          </BottomSheetHeader>

          {data && (
            <MarkerLegends
              legends={[
                {
                  icon: "/icons/marker-lokasi-muat.svg",
                  title: "Lokasi Muat",
                },
                {
                  icon: "/icons/marker-lokasi-bongkar.svg",
                  title: "Lokasi Bongkar",
                },
              ]}
            />
          )}
        </BottomSheetContent>
      </BottomSheet>

      <ResponsiveFooter className="flex gap-3">
        <Button
          variant="muatparts-primary-secondary"
          className="h-10 flex-1 p-0"
          onClick={() =>
            navigation.push("/DetailStatusDriverScreen", {
              driverId,
              orderId,
            })
          }
          type="button"
        >
          {t(
            "LacakArmadaScreen.buttonDetailStatusDriver",
            {},
            "Detail Status Driver"
          )}
        </Button>
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};
export default LacakArmadaScreen;

"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ChevronLeft } from "lucide-react";

import { calculateMapBounds } from "@/app/transporter/(main)/monitoring/utils/mapUtils";
import Button from "@/components/Button/Button";
import { MapMonitoring } from "@/container/Shared/Map/MapMonitoring";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

import { MapInterfaceOverlay } from "../../../monitoring/components/Map/MapInterfaceOverlay";
import LacakArmadaSidebar from "./components/LacakArmadaSidebar";

const LacakArmadaPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const { orderId } = params;

  const [trackingData, setTrackingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const [mapState, setMapState] = useState({
    center: { lat: -6.2, lng: 106.816666 },
    zoom: 12,
    autoFitBounds: true,
    hasMapInteraction: false,
    showLicensePlate: true,
  });

  useEffect(() => {
    if (orderId) {
      const fetchTrackingData = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(
            `/api/v1/cs/orders/${orderId}/fleet/tracking`
          );
          const result = await res.json();

          if (result.Message?.Code === 200) {
            const adaptedData = adaptFleetTrackingData(result.Data);
            setTrackingData(adaptedData);
          } else {
            console.error("Fleet tracking error:", result.Message?.Text);
          }
        } catch (error) {
          console.error("Failed to fetch tracking data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTrackingData();
    }
  }, [orderId]);

  const adaptFleetTrackingData = (fleetData) => {
    if (!fleetData?.fleetTracking?.length) return null;

    const vehicles = [];
    const pickupLocations = [
      { lat: -7.287, lng: 112.739, label: "Lokasi Muat" },
    ];
    const dropoffLocations = [
      { lat: -7.275, lng: 112.631, label: "Lokasi Bongkar" },
    ];

    fleetData.fleetTracking.forEach((transporter) => {
      transporter.fleets?.forEach((fleet) => {
        vehicles.push({
          id: fleet.fleetId,
          licensePlate: fleet.licensePlate,
          driverName: fleet.driverInfo?.driverName || "Unknown Driver",
          status: getStatusDisplayName(fleet.orderStatus),
          statusVariant: "primary",
          icon: "/img/monitoring/truck/blue.png",
          position: getVehiclePosition(fleet.fleetId),
          heading: 45,
          transporterName: transporter.companyName,
          timeline: {
            statusDefinitions:
              fleet.stepStatus?.map((step) => ({
                mappedOrderStatus: step.orderStatus,
                date: new Date().toISOString(),
                children: [
                  {
                    statusCode: step.orderStatus,
                    statusName: step.statusName,
                    date: new Date().toISOString(),
                    requiresPhoto: false,
                  },
                ],
              })) || [],
          },
        });
      });
    });

    return {
      orderCode: orderId,
      vehicles,
      pickupLocations,
      dropoffLocations,
      routePolyline: "encoded_polyline_string_here",
    };
  };

  const getStatusDisplayName = (status) => {
    const statusMap = {
      LOADING: "Proses Muat",
      UNLOADING: "Proses Bongkar",
      SCHEDULED_FLEET: "Pesanan Terkonfirmasi",
      COMPLETED: "Selesai",
    };
    return statusMap[status] || status;
  };

  const getVehiclePosition = (fleetId) => {
    const positions = [
      { lat: -7.2891, lng: 112.7351 },
      { lat: -7.2952, lng: 112.7588 },
      { lat: -7.28, lng: 112.74 },
    ];
    return positions[Math.floor(Math.random() * positions.length)];
  };

  const mapMarkers = useMemo(() => {
    if (!trackingData) return [];
    const vehicleMarkers = trackingData.vehicles.map((vehicle) => ({
      position: vehicle.position,
      title: vehicle.licensePlate,
      icon: vehicle.icon,
      rotation: vehicle.heading,
      fleet: {
        licensePlate: vehicle.licensePlate,
        driverName: vehicle.driverName,
      },
    }));
    const pickupMarkers = trackingData.pickupLocations.map((loc) => ({
      position: { lat: loc.lat, lng: loc.lng },
      title: loc.label,
      icon: "/icons/marker-lokasi-muat.svg",
    }));
    const dropoffMarkers = trackingData.dropoffLocations.map((loc) => ({
      position: { lat: loc.lat, lng: loc.lng },
      title: loc.label,
      icon: "/icons/marker-lokasi-bongkar.svg",
    }));
    return [...vehicleMarkers, ...pickupMarkers, ...dropoffMarkers];
  }, [trackingData]);

  const calculatedBounds = useMemo(
    () => calculateMapBounds(mapMarkers),
    [mapMarkers]
  );

  useEffect(() => {
    if (trackingData && calculatedBounds.center) {
      setMapState((prev) => ({
        ...prev,
        ...calculatedBounds,
        autoFitBounds: true,
      }));
    }
  }, [trackingData, calculatedBounds]);
  const handleMapDrag = () =>
    setMapState((prev) => ({
      ...prev,
      autoFitBounds: false,
      hasMapInteraction: true,
    }));
  const handleMapZoomChange = (newZoom) =>
    setMapState((prev) => ({
      ...prev,
      zoom: newZoom,
      autoFitBounds: false,
      hasMapInteraction: true,
    }));
  const handleMapCenterChange = (newCenter) =>
    setMapState((prev) => ({ ...prev, center: newCenter }));
  const handleResetZoom = () =>
    setMapState((prev) => ({
      ...prev,
      ...calculatedBounds,
      autoFitBounds: true,
      hasMapInteraction: false,
    }));
  const handleZoomIn = () =>
    setMapState((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom + 1, 20),
      autoFitBounds: false,
      hasMapInteraction: true,
    }));
  const handleZoomOut = () =>
    setMapState((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom - 1, 1),
      autoFitBounds: false,
      hasMapInteraction: true,
    }));

  return (
    <div className="relative flex h-[calc(100vh-92px)] w-full overflow-hidden">
      <div className="relative !m-6 flex-1 rounded-2xl">
        <MapMonitoring
          locationMarkers={mapMarkers}
          center={
            mapState.autoFitBounds ? calculatedBounds.center : mapState.center
          }
          zoom={mapState.autoFitBounds ? calculatedBounds.zoom : mapState.zoom}
          onMapDrag={handleMapDrag}
          onMapZoom={handleMapZoomChange}
          onMapCenterChange={handleMapCenterChange}
          showLicensePlate={mapState.showLicensePlate}
          mapContainerStyle={{
            width: isSidebarVisible ? "100%" : "97vw",
            height: "calc(100vh - 135px)",
            borderRadius: "24px",
            transition: "width 300ms ease-in-out",
          }}
          truckSize={{ width: 12, height: 42 }}
        />
        <MapInterfaceOverlay
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onCenter={handleResetZoom}
          hasMapInteraction={mapState.hasMapInteraction}
          showLicensePlate={mapState.showLicensePlate}
          onToggleLicensePlate={() =>
            setMapState((prev) => ({
              ...prev,
              showLicensePlate: !prev.showLicensePlate,
            }))
          }
          hideTopNavigation={true}
        />
        <Button
          variant="muattrans-primary"
          onClick={() => router.push("/daftar-pesanan")}
          className="absolute left-6 top-6 z-30"
          iconLeft={<ChevronLeft size={20} />}
        >
          {t("lacakArmada.backButton", {}, "Kembali")}
        </Button>
      </div>
      <div
        className={cn(
          "!mt-6 h-[96.5%] w-[420px] flex-shrink-0 rounded-l-[24px] bg-white shadow-lg transition-transform duration-300 ease-in-out",
          isSidebarVisible
            ? "translate-x-0"
            : "absolute right-0 translate-x-full"
        )}
      >
        <LacakArmadaSidebar
          onClose={() => setIsSidebarVisible(false)}
          vehicles={trackingData?.vehicles || []}
          isLoading={isLoading}
        />
      </div>
      {!isSidebarVisible && (
        <button
          onClick={() => setIsSidebarVisible(true)}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-l-md bg-white p-2 shadow-lg transition hover:bg-neutral-100"
          title={t("lacakArmada.openSidebar", {}, "Buka Panel Lacak Armada")}
        >
          <ChevronLeft className="h-6 w-6 text-neutral-700" />
        </button>
      )}
    </div>
  );
};

export default LacakArmadaPage;

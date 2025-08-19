"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { calculateMapBounds } from "@/app/transporter/(main)/monitoring/utils/mapUtils";
import { MapInterfaceOverlay } from "@/container/Shared/Map/MapInterfaceOverlay";
import { MapMonitoring } from "@/container/Shared/Map/MapMonitoring";
import LacakArmada from "@/container/Transporter/Monitoring/LacakArmada/LacakArmada";
import { cn } from "@/lib/utils";
import { useGetFleetLocations } from "@/services/Transporter/monitoring/getFleetLocations";

// Opsi: samakan lebar panel kiri dengan DaftarArmada (350px)
const LEFT_PANEL_WIDTH = 350;

export default function LihatPosisiArmada() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId"); // datang dari tombol "Lacak Armada"

  // Ambil lokasi armada (sama seperti di page monitoring)
  const { data: fleetLocationsData, isLoading } = useGetFleetLocations();

  // State peta minimalis (cukup center/zoom/autoFit agar ringan)
  const [mapState, setMapState] = useState({
    center: null,
    zoom: null,
    autoFitBounds: true,
  });

  // Bentuk markers sesuai pola di page monitoring (warna icon by status)
  const allFleetMarkers = useMemo(() => {
    const fleets = fleetLocationsData?.fleets ?? [];
    return fleets.map((fleet) => {
      let icon = "/img/monitoring/truck/gray.png";
      switch (fleet.operationalStatus) {
        case "ON_DUTY":
          icon = "/img/monitoring/truck/blue.png";
          break;
        case "READY_FOR_ORDER":
          icon = "/img/monitoring/truck/green.png";
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
        icon,
        rotation: fleet.heading || 0,
        fleet,
        // klik pin = fokus ke pin & non-aktifkan autoFit
        onClick: () => {
          setMapState((prev) => ({
            ...prev,
            autoFitBounds: false,
            center: { lat: fleet.latitude, lng: fleet.longitude },
            zoom: 16,
          }));
        },
      };
    });
  }, [fleetLocationsData]);

  // (Opsional) filter marker untuk order tertentu bila datanya tersedia
  // NOTE: sesuaikan field relasi armada->order di datamu (mis: fleet.activeOrderId)
  const markers = useMemo(() => {
    if (!orderId) return allFleetMarkers;
    return allFleetMarkers.filter((m) => {
      const activeOrderId =
        m?.fleet?.activeOrder?.id || m?.fleet?.activeOrderId || null;
      return !activeOrderId || activeOrderId === orderId;
    });
  }, [allFleetMarkers, orderId]);

  // Hitung center/zoom agar map rapi
  const bounds = calculateMapBounds(markers);
  const mapCenter = mapState.autoFitBounds
    ? bounds.center
    : mapState.center || bounds.center;
  const mapZoom = mapState.autoFitBounds
    ? bounds.zoom
    : mapState.zoom || bounds.zoom;

  const handleResetZoom = () => {
    setMapState({
      center: bounds.center,
      zoom: bounds.zoom,
      autoFitBounds: true,
    });
  };

  const handleZoomIn = () => {
    setMapState((prev) => ({
      ...prev,
      autoFitBounds: false,
      zoom: Math.min((prev.zoom || bounds.zoom) + 1, 20),
    }));
  };

  const handleZoomOut = () => {
    setMapState((prev) => ({
      ...prev,
      autoFitBounds: false,
      zoom: Math.max((prev.zoom || bounds.zoom) - 1, 1),
    }));
  };

  return (
    <div
      className={cn(
        "relative left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] h-[calc(100vh-92px)] w-screen overflow-hidden px-6"
      )}
    >
      {/* Map container */}
      <div className="relative h-full rounded-[20px] bg-white shadow-muat">
        {/* Map */}
        <MapMonitoring
          locationMarkers={markers}
          center={mapCenter}
          zoom={mapZoom}
          onMapZoom={(z) =>
            setMapState((p) => ({ ...p, autoFitBounds: false, zoom: z }))
          }
          onMapCenterChange={(c) =>
            setMapState((p) => ({ ...p, autoFitBounds: false, center: c }))
          }
          mapContainerStyle={{
            height: "100%",
            // sisakan ruang untuk panel kiri
            width: `calc(100% - ${LEFT_PANEL_WIDTH}px)`,
            marginLeft: `${LEFT_PANEL_WIDTH}px`,
            transition:
              "width 300ms ease-in-out, margin-left 300ms ease-in-out",
          }}
        />

        {/* Overlay kontrol peta (zoom, center, dll) */}
        {!isLoading && (
          <MapInterfaceOverlay
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onCenter={handleResetZoom}
            // Sembunyikan tombol pembuka DaftarArmada karena panel kiri sudah dipakai untuk "Lacak Armada"
            onClickDaftarArmada={undefined}
            hideTopNavigation={true}
            fleetCounts={{}}
            isFullscreen={false}
            onToggleFullscreen={() => {}}
            showLicensePlate={false}
            onToggleLicensePlate={() => {}}
            onApplyFilter={() => {}}
            hasMapInteraction={!mapState.autoFitBounds}
            onSearch={() => {}}
            activeFilters={{ truck: [], order: [] }}
            showPilihArmada={false}
          />
        )}

        {/* LEFT PANEL: tampilkan daftar "Lacak Armada" (card layout sama seperti komponen aslinya) */}
        <aside
          className={cn(
            "absolute left-0 top-0 z-20 h-full rounded-r-xl bg-white shadow-muat"
          )}
          style={{ width: LEFT_PANEL_WIDTH }}
        >
          <LacakArmada
            orderId={orderId}
            onClose={() => {
              // tutup = kembali ke halaman sebelumnya
              router.back();
            }}
          />
        </aside>
      </div>
    </div>
  );
}

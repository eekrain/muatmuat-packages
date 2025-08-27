"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { getFleetDetailedInfo } from "@/services/Transporter/daftar-pesanan/detail-status-armada/getFleetDetailedInfo";

import { useLoadingAction } from "@/store/Shared/loadingStore";

import { LeftPanel } from "./LeftPanel/LeftPanel";
import { MapPanel } from "./MapPanel/MapPanel";

const DetailStatusArmada = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { setIsGlobalLoading } = useLoadingAction();
  const [isLoading, setIsLoading] = useState(true);
  const [dataDriverTimeline, setDataDriverTimeline] = useState(null);
  const [fleetMapData, setFleetMapData] = useState(null);
  const [normalizedDriversData, setNormalizedDriversData] = useState({
    drivers: [],
  });
  useEffect(() => {
    const fetchFleetData = async () => {
      setIsLoading(true);

      try {
        const fleetIdsParam = searchParams.get("fleetIds");

        if (fleetIdsParam) {
          const fleetIds = fleetIdsParam.split(",");

          // Fetch fleet data for each fleet ID
          const fleetDataPromises = fleetIds.map((fleetId) =>
            getFleetDetailedInfo(fleetId, params.uuid)
          );

          const fleetDataResults = await Promise.all(fleetDataPromises);

          // Extract normalized driver data and map data
          const validDriverData = fleetDataResults
            .filter((response) => response && response.driverData)
            .map((response) => response.driverData);

          const validMapData = fleetDataResults
            .filter((response) => response && response.mapData)
            .map((response) => response.mapData);

          // Combine all drivers from different fleets
          const allDrivers = validDriverData
            .filter((data) => data && data.drivers && data.drivers.length > 0)
            .flatMap((data) => data.drivers);

          // Set normalized data
          if (allDrivers.length > 0) {
            const normalizedDriversData = {
              drivers: allDrivers,
            };
            setNormalizedDriversData(normalizedDriversData);

            // Set the first driver as the selected driver for timeline
            setDataDriverTimeline(allDrivers[0]);
          }

          // Set map data
          if (validMapData.length > 0) {
            setFleetMapData(validMapData);
          }
        }
      } catch (error) {
        // Handle error silently or show user-friendly message
      } finally {
        setIsLoading(false);
      }
    };

    fetchFleetData();
  }, [searchParams, params.uuid]);

  useEffect(() => {
    setIsGlobalLoading(isLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
  return (
    <>
      <div className="mx-auto grid h-[calc(100dvh-92px)] grid-cols-[480px_1fr] overflow-hidden">
        <LeftPanel
          dataDriverTimeline={dataDriverTimeline}
          allDriversData={normalizedDriversData}
        />
        {fleetMapData && <MapPanel fleetMapData={fleetMapData} />}
      </div>
    </>
  );
};

export default DetailStatusArmada;

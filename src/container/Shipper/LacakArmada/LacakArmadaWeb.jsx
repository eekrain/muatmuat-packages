"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

import { isDev } from "@/lib/constants/is-dev";
import { useGetDriverStatusTimeline } from "@/services/Shipper/lacak-armada/getDriverStatusTimeline";
import { useLoadingAction } from "@/store/Shared/loadingStore";

import { LeftPanel } from "./LeftPanel/LeftPanel";
import { MapPanel } from "./MapPanel/MapPanel";

const LacakArmadaWeb = () => {
  const params = useParams();
  const { setIsGlobalLoading } = useLoadingAction();
  const { data: dataDriverTimeline, isLoading } = useGetDriverStatusTimeline(
    params.orderId,
    params.driverId
  );

  useEffect(() => {
    setIsGlobalLoading(isLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <>
      <div className="mx-auto grid h-[calc(100dvh-92px)] max-w-[1280px] grid-cols-[480px_1fr]">
        <LeftPanel dataDriverTimeline={dataDriverTimeline} />
        <MapPanel />
      </div>

      {isDev && <pre>{JSON.stringify(dataDriverTimeline, null, 2)}</pre>}
    </>
  );
};

export default LacakArmadaWeb;

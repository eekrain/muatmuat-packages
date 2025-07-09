"use client";

import { useEffect } from "react";

import { isDev } from "@/lib/constants/is-dev";
import { useGetDriverStatusTimeline } from "@/services/lacak-armada/getDriverStatusTimeline";
import { useLoadingAction } from "@/store/loadingStore";

import { LeftPanel } from "./LeftPanel/LeftPanel";
import { MapPanel } from "./MapPanel/MapPanel";

const LacakArmadaWeb = () => {
  const { setIsGlobalLoading } = useLoadingAction();
  const { data: dataDriverStatus, isLoading } = useGetDriverStatusTimeline({
    orderId: "123",
    driverId: "456",
  });
  useEffect(() => {
    setIsGlobalLoading(isLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <>
      <div className="grid h-[calc(100dvh-92px)] grid-cols-[480px_1fr]">
        <LeftPanel dataDriverStatus={dataDriverStatus} />
        <MapPanel />
      </div>

      {isDev && <pre>{JSON.stringify(dataDriverStatus, null, 2)}</pre>}
    </>
  );
};

export default LacakArmadaWeb;

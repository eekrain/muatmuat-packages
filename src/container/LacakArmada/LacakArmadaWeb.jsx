import { useGetDriverStatusTimeline } from "@/services/detailpesanan/getDriverStatusTimeline";

import { LeftPanel } from "./LeftPanel/LeftPanel";
import { MapPanel } from "./MapPanel/MapPanel";

const LacakArmadaWeb = () => {
  const { data: driverStatusTimeline } = useGetDriverStatusTimeline({
    orderId: "123",
    driverId: "456",
  });
  return (
    <>
      <div className="grid h-[calc(100vh-60px)] grid-cols-[480px_1fr]">
        <LeftPanel driverStatusTimeline={driverStatusTimeline} />
        <MapPanel />
      </div>
      <pre>{JSON.stringify(driverStatusTimeline, null, 2)}</pre>
    </>
  );
};

export default LacakArmadaWeb;

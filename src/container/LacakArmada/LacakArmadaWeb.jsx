import { useGetDriverStatusTimeline } from "@/services/lacak-armada/getDriverStatusTimeline";

import { LeftPanel } from "./LeftPanel/LeftPanel";
import { MapPanel } from "./MapPanel/MapPanel";

const LacakArmadaWeb = () => {
  const { data: dataDriverStatus } = useGetDriverStatusTimeline({
    orderId: "123",
    driverId: "456",
  });
  return (
    <>
      <div className="grid h-[calc(100vh-60px)] grid-cols-[480px_1fr]">
        <LeftPanel dataDriverStatus={dataDriverStatus} />
        <MapPanel />
      </div>
      <pre>{JSON.stringify(dataDriverStatus, null, 2)}</pre>
    </>
  );
};

export default LacakArmadaWeb;

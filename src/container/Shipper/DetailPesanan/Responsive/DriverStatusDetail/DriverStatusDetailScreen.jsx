import { DriverTimeline } from "@/components/Timeline/DriverTimeline";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { useGetDriverStatusTimeline } from "@/services/Shipper/lacak-armada/getDriverStatusTimeline";

import DriverCard from "../FleetTrack/components/DriverCard";

const DriverStatusDetailScreen = ({ dataStatusPesanan }) => {
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();
  const { orderId, driverId } = params;

  const { data } = useGetDriverStatusTimeline({
    orderId,
    driverId,
  });

  return (
    <FormResponsiveLayout
      title={{
        label: "Detail Status Driver",
      }}
      onClickBackButton={() => navigation.pop()}
    >
      <div className="mb-16 space-y-2 bg-neutral-200">
        <DriverCard data={dataStatusPesanan?.driverStatus} />
        <div className="bg-white px-4 py-5">
          <DriverTimeline
            dataDriverStatus={data}
            onClickProof={() => navigation.push("/proof-photo")}
          />
        </div>
      </div>
    </FormResponsiveLayout>
  );
};
export default DriverStatusDetailScreen;

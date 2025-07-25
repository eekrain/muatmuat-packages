import { DriverTimeline } from "@/components/Timeline/DriverTimeline";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { useGetDriverStatusTimeline } from "@/services/Shipper/lacak-armada/getDriverStatusTimeline";

import DriverCard from "../FleetTrack/components/DriverCard";

const DriverStatusDetailScreen = () => {
  const navigation = useResponsiveNavigation();

  const { data } = useGetDriverStatusTimeline({
    orderId: "12345", // Replace with actual order ID
    driverId: "67890", // Replace with actual driver ID
  });

  return (
    <FormResponsiveLayout
      title={{
        label: "Detail Status Driver",
      }}
      onClickBackButton={() => navigation.pop()}
    >
      <div className="mb-16 space-y-2 bg-neutral-200">
        <DriverCard />
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

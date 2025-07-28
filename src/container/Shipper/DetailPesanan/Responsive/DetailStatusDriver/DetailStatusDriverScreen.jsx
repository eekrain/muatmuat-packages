import { DriverTimeline } from "@/components/Timeline/DriverTimeline";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { useGetDriverStatusTimeline } from "@/services/Shipper/lacak-armada/getDriverStatusTimeline";

import DriverInfoSlider from "../Home/components/DriverInfoSlider";

const DetailStatusDriverScreen = ({ dataStatusPesanan }) => {
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();
  const { orderId, driverId } = params;

  const { data } = useGetDriverStatusTimeline({
    orderId,
    driverId,
  });

  const defaultIndex = dataStatusPesanan?.driverStatus.findIndex(
    (d) => d.driverId === driverId
  );
  console.log(
    "🚀 ~ DetailStatusDriverScreen ~ dataStatusPesanan?.driverStatus:",
    dataStatusPesanan?.driverStatus
  );

  return (
    <FormResponsiveLayout
      title={{
        label: "Detail Status Driver",
      }}
      onClickBackButton={() => navigation.pop()}
    >
      <div className="mb-16 w-full space-y-2 bg-neutral-200">
        {defaultIndex !== -1 && (
          <DriverInfoSlider
            driverStatus={dataStatusPesanan?.driverStatus}
            orderId={orderId}
            defaultIndex={defaultIndex}
          />
        )}
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

export default DetailStatusDriverScreen;

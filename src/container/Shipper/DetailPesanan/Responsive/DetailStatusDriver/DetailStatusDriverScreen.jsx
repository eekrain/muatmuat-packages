import { DriverTimeline } from "@/components/Timeline/DriverTimeline";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { isDev } from "@/lib/constants/is-dev";
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

  const { data: dataTimeline } = useGetDriverStatusTimeline(orderId, driverId);

  const defaultIndex = dataStatusPesanan?.driverStatus.findIndex(
    (d) => d.driverId === driverId
  );

  return (
    <FormResponsiveLayout
      title={{
        label: "Detail Status Driver",
      }}
      onClickBackButton={() => navigation.pop()}
    >
      <div className="mb-16 w-full space-y-2 bg-neutral-200">
        {defaultIndex !== -1 && dataStatusPesanan?.driverStatus.length > 1 && (
          <DriverInfoSlider
            driverStatus={dataStatusPesanan?.driverStatus}
            orderId={orderId}
            defaultIndex={defaultIndex}
            withActions={false}
          />
        )}
        <div className="bg-white px-4 py-5">
          <DriverTimeline
            dataTimeline={dataTimeline}
            onClickProof={(driverStatusItem) =>
              navigation.push("/proof-photo", { driverStatusItem })
            }
            withMenu={false}
          />
        </div>

        {isDev && <pre>{JSON.stringify(dataTimeline, null, 2)}</pre>}
      </div>
    </FormResponsiveLayout>
  );
};

export default DetailStatusDriverScreen;

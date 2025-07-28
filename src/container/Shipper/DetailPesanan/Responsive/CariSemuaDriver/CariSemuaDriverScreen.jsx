import { useMemo } from "react";

import DataNotFound from "@/components/DataNotFound/DataNotFound";
import SearchBarResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/SearchBarResponsiveLayout";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { useGetDriverStatusTimeline } from "@/services/Shipper/lacak-armada/getDriverStatusTimeline";
import { useResponsiveSearchStore } from "@/store/Shipper/zustand/responsiveSearchStore";

import { DriverInfo } from "../Home/components/DriverInfoSlider";
import { OrderCode, OrderStatus } from "../Home/components/OrderInfo";

const CariSemuaDriverScreen = ({ dataStatusPesanan }) => {
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();
  const searchValue = useResponsiveSearchStore((state) => state.searchValue);

  const { orderId, driverId } = params;

  const { data } = useGetDriverStatusTimeline({
    orderId,
    driverId,
  });

  const filteredDriver = useMemo(() => {
    const drivers = dataStatusPesanan?.driverStatus;
    if (!drivers) return [];
    if (!searchValue) return drivers;
    return drivers?.filter((driver) =>
      driver?.name?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [dataStatusPesanan?.driverStatus, searchValue]);

  return (
    <SearchBarResponsiveLayout
      title={{
        label: "Detail Status Driver",
      }}
      onClickBackButton={() => navigation.pop()}
    >
      <div className="mb-16 flex h-full flex-col">
        <div className="space-y-4 bg-neutral-50 px-4 py-5">
          <OrderCode dataStatusPesanan={dataStatusPesanan} />
          <OrderStatus dataStatusPesanan={dataStatusPesanan} />
        </div>

        {!filteredDriver?.length ? (
          <DataNotFound
            className="h-full flex-1 gap-y-5"
            textClass="text-[#868686] leading-[19.2px] w-[197px]"
            title="Keyword Tidak Ditemukan"
            width={142}
            height={122}
            type="search"
          />
        ) : (
          filteredDriver?.map((driver, index) => (
            <div key={index} className="w-full flex-shrink-0 bg-neutral-50 p-5">
              <div className="flex w-full flex-col items-start gap-4">
                <DriverInfo.Header
                  status={driver.driverStatusTitle}
                  onMenuClick={() => alert(`Menu for ${driver.name}`)}
                />
                <DriverInfo.Body driver={driver} />
                <DriverInfo.Footer
                  onContact={() => alert(`Contacting ${driver.name}`)}
                  onTrack={() => alert(`Tracking ${driver.name}`)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* {isDev && <pre>{JSON.stringify(filteredDriver, null, 2)}</pre>} */}
    </SearchBarResponsiveLayout>
  );
};
export default CariSemuaDriverScreen;

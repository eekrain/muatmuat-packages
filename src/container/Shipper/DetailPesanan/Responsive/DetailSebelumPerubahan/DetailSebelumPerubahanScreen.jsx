import { useParams } from "next/navigation";

import IconComponent from "@/components/IconComponent/IconComponent";
import ResponsiveSection from "@/components/Section/ResponsiveSection";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { cn } from "@/lib/utils";
import { formatLoadTime } from "@/lib/utils/dateFormat";
import { useGetOrderChangeHistory } from "@/services/Shipper/detailpesanan/getOrderChangeHistory";

const LoadTimeSection = ({ schedule }) => {
  return (
    <ResponsiveSection
      appearance={{ titleClassname: "text-base font-bold" }}
      title="Waktu Muat"
    >
      <span className="text-xs font-medium leading-[1.1]">
        {formatLoadTime(schedule?.loadTimeStart, schedule?.loadTimeEnd, {
          showOneLine: true,
          shortenSameDay: false,
        })}
      </span>
    </ResponsiveSection>
  );
};

const LocationPicDetailSection = ({ type, locations }) => {
  const headers = {
    muat: "Detail PIC Lokasi Muat",
    bongkar: "Detail PIC Lokasi Bongkar",
  };
  const titles = {
    muat: "Lokasi Muat",
    bongkar: "Lokasi Bongkar",
  };
  return (
    <ResponsiveSection
      appearance={{ titleClassname: "text-base font-bold" }}
      title={headers[type]}
    >
      {locations?.map((location, key) => {
        const locationItems = [
          {
            icon: "/icons/lokasi20.svg",
            value: location.fullAddress,
          },
          {
            icon: "/icons/topik-amandemen20.svg",
            value: location.detailAddress,
          },
          {
            icon: "/icons/profile20.svg",
            value: location.picName,
          },
          {
            icon: "/icons/call20.svg",
            value: location.picPhoneNumber,
          },
        ];
        return (
          <div
            className={cn(
              "flex flex-col gap-y-4",
              locations?.length - 1 === key
                ? ""
                : "border-b border-neutral-400 pb-6"
            )}
            key={key}
          >
            <h3 className="text-sm font-semibold leading-[1.1]">
              {`${titles[type]}${locations.length > 1 ? ` ${key + 1}` : ""}`}
            </h3>
            {locationItems.map((item, itemKey) => (
              <div className={cn("flex items-center gap-x-2")} key={itemKey}>
                <div className="flex size-5 items-center">
                  <IconComponent
                    className="text-muat-trans-secondary-900"
                    src={item.icon}
                    width={20}
                    height={20}
                  />
                </div>
                <span className="text-xs font-medium leading-[1.1]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        );
      })}
    </ResponsiveSection>
  );
};

const DetailSebelumPerubahanScreen = () => {
  const params = useParams();
  const { data: orderChangeHistory } = useGetOrderChangeHistory(params.orderId);
  console.log("orderChangeHistory", orderChangeHistory);
  return (
    <FormResponsiveLayout
      title={{
        label: "Detail Sebelum Perubahan",
      }}
    >
      <div className="flex flex-col gap-y-2 bg-neutral-200">
        <LoadTimeSection schedule={orderChangeHistory?.schedule} />
        <LocationPicDetailSection
          type="muat"
          locations={orderChangeHistory?.pickupLocations}
        />
        <LocationPicDetailSection
          type="bongkar"
          locations={orderChangeHistory?.dropoffLocations}
        />
      </div>
    </FormResponsiveLayout>
  );
};

export default DetailSebelumPerubahanScreen;

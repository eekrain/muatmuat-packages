import { Fragment } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { TabsContent } from "@/components/Tabs/Tabs";
import { useTranslation } from "@/hooks/use-translation";

// Reusable component for displaying location information
const InfoItem = ({ icon, children }) => (
  <div className="flex items-center gap-2 self-stretch">
    <IconComponent
      src={icon}
      width={20}
      height={20}
      className="flex-shrink-0 text-muat-trans-secondary-900"
    />
    <p className="flex-1 text-xs font-medium text-neutral-900">{children}</p>
  </div>
);

// Reusable component for displaying a section of locations
const LocationSection = ({ title, locations, locationType }) => (
  <div className="bg-neutral-50 px-4 py-5">
    <h1 className="mb-4 text-sm font-bold">{title}</h1>{" "}
    <div className="flex flex-col items-start gap-6 self-stretch">
      {locations.map((location, index) => (
        <Fragment key={`${locationType}-${index}`}>
          <div className="flex flex-col items-start gap-4 self-stretch">
            <h2 className="self-stretch text-sm font-semibold leading-tight text-neutral-900">
              {locationType}{" "}
              {locations.length > 1 ? ` ${location.sequence}` : ""}
            </h2>
            <div className="flex flex-col items-start gap-4 self-stretch">
              <InfoItem icon="/icons/marker-outline.svg">
                {location.fullAddress}
              </InfoItem>
              <InfoItem icon="/icons/note16.svg">
                {location.detailAddress}
              </InfoItem>
              <InfoItem icon="/icons/profile16.svg">
                {location.picName}
              </InfoItem>
              <InfoItem icon="/icons/phone16.svg">
                {location.picPhoneNumber}
              </InfoItem>
            </div>
          </div>

          {index < locations.length - 1 && (
            <hr className="w-full self-stretch border-t border-neutral-400" />
          )}
        </Fragment>
      ))}
      {/* {locations.map((location, index) => (
        <div
          key={`${locationType}-${index}`}
          className={cn("flex flex-col gap-4", index === 0 ? "pb-5" : "pt-5")}
        >
          <h2 className="mb-3 text-sm font-semibold">
            {locationType} {locations.length > 1 ? ` ${location.sequence}` : ""}
          </h2>

          <LocationInfo
            icon="/icons/marker-outline.svg"
            text={location.fullAddress}
          />
          <LocationInfo
            icon="/icons/note16.svg"
            text={location.detailAddress}
          />
          <LocationInfo icon="/icons/profile16.svg" text={location.picName} />
          <LocationInfo
            icon="/icons/phone16.svg"
            text={location.picPhoneNumber}
          />
        </div>
      ))} */}
    </div>
  </div>
);

export const TabContentDetailPIC = ({ dataDetailPIC }) => {
  const { t } = useTranslation();
  return (
    <TabsContent value="detail-pic" className="space-y-2 bg-neutral-200">
      <LocationSection
        title={t(
          "TabContentDetailPIC.loadingPICPickup",
          {},
          "Detail PIC Lokasi Muat"
        )}
        locations={dataDetailPIC?.muat || []}
        locationType={t(
          "TabContentDetailPIC.pickupLocation",
          {},
          "Lokasi Muat"
        )}
      />
      <LocationSection
        title={t(
          "TabContentDetailPIC.loadingPICDropoff",
          {},
          "Detail PIC Lokasi Bongkar"
        )}
        locations={dataDetailPIC?.bongkar || []}
        locationType={t(
          "TabContentDetailPIC.dropoffLocation",
          {},
          "Lokasi Bongkar"
        )}
      />
    </TabsContent>
  );
};

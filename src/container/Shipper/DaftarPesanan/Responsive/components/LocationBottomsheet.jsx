import { Fragment } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import {
  TimelineContainer,
  TimelineContentAddress,
  TimelineItem,
} from "@/components/Timeline";

const LocationBottomsheet = ({
  isOpen,
  setOpen,
  locationType,
  selectedLocations,
}) => {
  const locationLabels = {
    muat: "Lokasi Muat",
    bongkar: "Lokasi Bongkar",
  };
  const locationLabel = locationLabels[locationType] || "";
  return (
    <BottomSheet open={isOpen} onOpenChange={setOpen}>
      <BottomSheetContent>
        <BottomSheetHeader>{locationLabel}</BottomSheetHeader>
        <div className="w-full px-4 py-6">
          <TimelineContainer>
            {selectedLocations?.map((item, key) => (
              <Fragment key={key}>
                <TimelineItem
                  variant={
                    locationType === "muat" ? "number-muat" : "number-bongkar"
                  }
                  totalLength={selectedLocations.length}
                  index={key}
                  activeIndex={0}
                >
                  <TimelineContentAddress
                    title={item.fullAddress}
                    className={`whitespace-normal leading-[1.1] ${
                      key === selectedLocations?.length - 1 ? "pb-0" : ""
                    }`}
                  />
                </TimelineItem>
              </Fragment>
            ))}
          </TimelineContainer>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default LocationBottomsheet;

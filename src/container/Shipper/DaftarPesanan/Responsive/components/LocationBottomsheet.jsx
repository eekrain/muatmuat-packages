import { Fragment } from "react";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/Bottomsheet/BottomSheet";
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
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>{locationLabel}</BottomSheetTitle>
        </BottomSheetHeader>
        <div className="w-full px-4 pb-6">
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

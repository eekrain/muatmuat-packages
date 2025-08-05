import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/BottomSheet/BottomSheetUp";
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";

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
            {selectedLocations?.map((item, key) => {
              return (
                <NewTimelineItem
                  key={key}
                  variant={
                    locationType === "muat" ? "number-muat" : "number-bongkar"
                  }
                  totalLength={selectedLocations.length}
                  index={key}
                  activeIndex={0}
                  title={item.fullAddress}
                  isLast={key === selectedLocations.length - 1}
                />
              );
            })}
          </TimelineContainer>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default LocationBottomsheet;

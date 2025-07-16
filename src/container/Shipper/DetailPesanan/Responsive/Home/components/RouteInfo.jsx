import {
  BottomSheet,
  BottomSheetContent,
} from "@/components/Bottomsheet/Bottomsheet";
import { HalalLogistik } from "@/components/HalalLogistik/HalalLogistik";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  TimelineContainer,
  TimelineContentWithButtonDate,
  TimelineItem,
} from "@/components/Timeline";
import { dataCollapsed } from "@/container/Shipper/Example/Web/mockdata";

export const RouteInfo = () => {
  const muatan = [
    {
      name: "Furniture Kayu",
      weight: "500 kg",
    },
    {
      name: "Elektronik Rumah Tangga",
      weight: "300 kg",
    },
  ];

  const MuatanList = () => {
    return muatan.map((item, index) => (
      <div key={index} className="flex items-center gap-2">
        <IconComponent src="/icons/box16.svg" />
        <span className="text-sm font-medium">{item.name}</span>
        <span className="text-sm text-neutral-500">({item.weight})</span>
      </div>
    ));
  };

  return (
    <>
      <div className="divide-y-neutral-200 space-y-1 divide-y rounded-lg bg-white px-4 py-5 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Rute</h3>
            <p className="text-xs font-medium">Estimasi 178 km</p>
          </div>
          <TimelineContainer>
            {dataCollapsed.map((item, index) => (
              <TimelineItem
                key={index}
                variant="bullet"
                totalLength={dataCollapsed.length}
                index={index}
                activeIndex={0}
              >
                <TimelineContentWithButtonDate
                  title={item.title}
                  withButton={item.withButton}
                />
              </TimelineItem>
            ))}
          </TimelineContainer>
        </div>
        <div className="flex flex-col gap-4 pt-6">
          <h3 className="text-sm font-semibold">Informasi Muatan</h3>
          <HalalLogistik />
          <MuatanList />
        </div>
      </div>

      <BottomSheet>
        <BottomSheetContent>Halo</BottomSheetContent>
      </BottomSheet>
    </>
  );
};

import {
  TimelineContainer,
  TimelineContentWithButtonDate,
  TimelineItem,
} from "@/components/Timeline";
import { dataCollapsed } from "@/container/Example/Web/mockdata";

const RouteInfo = () => {
  return (
    <div className="divide-y-neutral-200 divide-y rounded-lg bg-white px-4 py-5 shadow-sm">
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
                withButton={{
                  label: "Lihat Bukti Muat Barang & POD",
                  onClick: () => alert("Lihat Bukti Muat Barang & POD"),
                }}
              />
            </TimelineItem>
          ))}
        </TimelineContainer>
      </div>

      <div className="">
        <h3 className="text-sm font-semibold">Informasi Muatan</h3>
      </div>
    </div>
  );
};

export default RouteInfo;

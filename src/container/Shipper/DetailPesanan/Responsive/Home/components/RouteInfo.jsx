import { useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTrigger,
} from "@/components/Bottomsheet/Bottomsheet";
import { HalalLogistik } from "@/components/HalalLogistik/HalalLogistik";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  TimelineContainer,
  TimelineContentAddress,
  TimelineItem,
} from "@/components/Timeline";

const RouteLocationItem = ({ item, index, total, type }) => (
  <TimelineItem
    key={index}
    variant={type === "muat" ? "number-muat" : "number-bongkar"}
    totalLength={total}
    index={index}
  >
    <TimelineContentAddress title={item.fullAddress} />
  </TimelineItem>
);

export const RouteInfo = ({ dataDetailPesanan }) => {
  const [bottomSheetTitle, setBottomSheetTitle] = useState("");
  const [bottomSheetData, setBottomSheetData] = useState([]);

  const muat = dataDetailPesanan?.route?.muat ?? [];
  const bongkar = dataDetailPesanan?.route?.bongkar ?? [];

  const handleShowMore = (type, data) => {
    setBottomSheetTitle(type === "muat" ? "Lokasi Muat" : "Lokasi Bongkar");
    setBottomSheetData(data);
  };

  return (
    <BottomSheet>
      <div className="divide-y-neutral-200 space-y-1 divide-y rounded-lg bg-white px-4 py-5 shadow-sm">
        <div className="flex flex-col gap-4 pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Rute</h3>
            {dataDetailPesanan?.estimatedDistance && (
              <p className="text-xs font-medium">
                Estimasi {dataDetailPesanan.estimatedDistance} km
              </p>
            )}
          </div>
          <TimelineContainer>
            {muat.length > 0 && (
              <TimelineItem
                variant="bullet"
                index={0}
                totalLength={muat.length + bongkar.length}
                activeIndex={0}
              >
                <div>
                  <TimelineContentAddress
                    className={muat.length > 1 ? "pb-0" : ""}
                    title={muat[0].fullAddress}
                  />
                  {muat.length > 1 && (
                    <BottomSheetTrigger>
                      <button
                        onClick={() => handleShowMore("muat", muat)}
                        className="pb-5 text-xs font-medium text-blue-500"
                      >
                        Lihat Lokasi Muat Lainnya
                      </button>
                    </BottomSheetTrigger>
                  )}
                </div>
              </TimelineItem>
            )}
            {bongkar.length > 0 && (
              <TimelineItem
                variant="bullet"
                index={muat.length}
                totalLength={muat.length + bongkar.length}
                activeIndex={0}
              >
                <div>
                  <TimelineContentAddress
                    className={bongkar.length > 1 ? "pb-0" : ""}
                    title={bongkar[0].fullAddress}
                  />
                  {bongkar.length > 1 && (
                    <BottomSheetTrigger>
                      <button
                        onClick={() => handleShowMore("bongkar", bongkar)}
                        className="text-xs font-medium text-blue-500"
                      >
                        Lihat Lokasi Bongkar Lainnya
                      </button>
                    </BottomSheetTrigger>
                  )}
                </div>
              </TimelineItem>
            )}
          </TimelineContainer>
        </div>
        <div className="flex flex-col gap-4 pt-6">
          <h3 className="text-sm font-semibold">Informasi Muatan</h3>
          {dataDetailPesanan?.isHalalLogistics && <HalalLogistik />}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <IconComponent src="/icons/box16.svg" />
              <span className="text-sm font-medium">
                {dataDetailPesanan?.cargoDescription}
              </span>
            </div>
          </div>
        </div>
      </div>

      <BottomSheetContent>
        <BottomSheetHeader>{bottomSheetTitle}</BottomSheetHeader>
        <div className="p-4">
          <TimelineContainer>
            {bottomSheetData.map((item, index) => (
              <RouteLocationItem
                key={index}
                item={item}
                type={bottomSheetTitle === "Lokasi Muat" ? "muat" : "bongkar"}
                index={index}
                total={bottomSheetData.length}
              />
            ))}
          </TimelineContainer>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

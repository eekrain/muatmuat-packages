import { useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import { HalalLogistik } from "@/components/HalalLogistik/HalalLogistik";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  TimelineContainer,
  TimelineContentWithButtonDate,
  TimelineItem,
} from "@/components/Timeline";

const RouteLocationItem = ({ item, index, total, type }) => (
  <TimelineItem
    key={index}
    variant={type === "muat" ? "number-muat" : "number-bongkar"}
    totalLength={total}
    index={index}
  >
    <TimelineContentWithButtonDate title={item.fullAddress} />
  </TimelineItem>
);

export const RouteInfo = ({ dataDetailPesanan }) => {
  console.log("🚀 ~ RouteInfo ~ dataDetailPesanan:", dataDetailPesanan);
  const [bottomSheetTitle, setBottomSheetTitle] = useState("");
  const [bottomSheetData, setBottomSheetData] = useState([]);

  const muat = dataDetailPesanan?.route?.muat ?? [];
  const bongkar = dataDetailPesanan?.route?.bongkar ?? [];

  const handleShowMore = (type, data) => {
    setBottomSheetTitle(type === "muat" ? "Lokasi Muat" : "Lokasi Bongkar");
    setBottomSheetData(data);
  };

  return (
    <>
      <div className="rounded-lg bg-white px-4 py-5 shadow-sm">
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
                totalLength={2}
                index={0}
                activeIndex={0}
              >
                <TimelineContentWithButtonDate
                  title={muat[0].fullAddress}
                  withButton={
                    muat.length > 1
                      ? {
                          label: "Lihat Lokasi Muat Lainnya",
                          onClick: () => handleShowMore("muat", muat),
                        }
                      : undefined
                  }
                />
              </TimelineItem>
            )}
            {bongkar.length > 0 && (
              <TimelineItem
                variant="bullet"
                totalLength={2}
                index={1}
                activeIndex={0}
              >
                <TimelineContentWithButtonDate
                  className="pb-0"
                  title={bongkar[0].fullAddress}
                  withButton={
                    bongkar.length > 1
                      ? {
                          label: "Lihat Lokasi Bongkar Lainnya",
                          onClick: () => handleShowMore("bongkar", bongkar),
                        }
                      : undefined
                  }
                />
              </TimelineItem>
            )}
          </TimelineContainer>
        </div>
        <div className="flex flex-col gap-4 pt-6">
          <h3 className="text-sm font-semibold">Informasi Muatan</h3>
          {dataDetailPesanan?.isHalalLogistics && <HalalLogistik />}
          {dataDetailPesanan?.cargos?.map((cargo) => (
            <div key={cargo.cargoId} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <IconComponent src="/icons/box16.svg" />
                <span className="mt-0.5 text-xs font-medium">
                  {cargo.name}{" "}
                  <span className="text-neutral-600">
                    ({cargo.weight} {cargo.weightUnit})
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomSheet
        open={bottomSheetData.length > 0}
        onOpenChange={(open) => {
          if (!open) setBottomSheetData([]);
        }}
      >
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
    </>
  );
};

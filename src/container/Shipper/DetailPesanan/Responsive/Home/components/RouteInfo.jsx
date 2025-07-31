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

export const RouteInfo = ({ dataDetailPesanan }) => {
  const [mode, setMode] = useState("");
  const [bottomSheetData, setBottomSheetData] = useState([]);

  const muat = dataDetailPesanan?.route?.muat ?? [];
  const bongkar = dataDetailPesanan?.route?.bongkar ?? [];

  const handleShowMore = (type, data) => {
    setMode(type === "muat" ? "Lokasi Muat" : "Lokasi Bongkar");
    setBottomSheetData(data);
  };

  return (
    <>
      <div className="bg-white px-4 py-5 shadow-sm">
        <div className="flex flex-col gap-4">
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
                  appearance={{ titleClassname: "text-xs" }}
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
                  appearance={{ titleClassname: "text-xs" }}
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

        <hr className="my-6" />

        <div className="flex flex-col gap-4">
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
          <BottomSheetHeader>
            {mode === "muat" ? "Lokasi Muat" : "Lokasi Bongkar"}
          </BottomSheetHeader>
          <div className="p-4">
            <TimelineContainer>
              {bottomSheetData.map((item, index) => (
                <TimelineItem
                  key={index}
                  variant={mode === "muat" ? "number-muat" : "number-bongkar"}
                  totalLength={bottomSheetData.length}
                  index={index}
                >
                  <TimelineContentWithButtonDate title={item.fullAddress} />
                </TimelineItem>
              ))}
            </TimelineContainer>
          </div>
        </BottomSheetContent>
      </BottomSheet>
    </>
  );
};

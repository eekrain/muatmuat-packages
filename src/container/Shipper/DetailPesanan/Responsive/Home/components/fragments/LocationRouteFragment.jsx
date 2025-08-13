import { useState } from "react";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/BottomSheet/BottomSheetUp";
import { ButtonMini } from "@/components/Button/ButtonMini";
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";

export const LocationRouteFragment = ({ dataRingkasanPesanan }) => {
  const [mode, setMode] = useState("");
  const [bottomSheetData, setBottomSheetData] = useState([]);

  const muat = dataRingkasanPesanan?.route?.muat ?? [];
  const bongkar = dataRingkasanPesanan?.route?.bongkar ?? [];

  const handleShowMore = (type, data) => {
    setMode(type === "muat" ? "Lokasi Muat" : "Lokasi Bongkar");
    setBottomSheetData(data);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Rute</h3>
          {dataRingkasanPesanan?.estimatedDistance && (
            <p className="text-xs font-medium">
              Estimasi {dataRingkasanPesanan.estimatedDistance} km
            </p>
          )}
        </div>
        <TimelineContainer>
          {muat.length > 0 && (
            <NewTimelineItem
              variant="bullet"
              index={0}
              activeIndex={0}
              title={muat[0].fullAddress}
              isLast={false}
              appearance={{ titleClassname: "text-xs mt-[1.25px]" }}
              buttonDetail={
                muat.length > 1 ? (
                  <ButtonMini
                    className="mt-1"
                    onClick={() => handleShowMore("muat", muat)}
                  >
                    Lihat Lokasi Muat Lainnya
                  </ButtonMini>
                ) : null
              }
            />
          )}
          {bongkar.length > 0 && (
            <NewTimelineItem
              variant="bullet"
              index={1}
              activeIndex={0}
              title={bongkar[0].fullAddress}
              isLast={true}
              appearance={{ titleClassname: "text-xs mt-[1.25px]" }}
              buttonDetail={
                bongkar.length > 1 ? (
                  <ButtonMini
                    className="mt-1"
                    onClick={() => handleShowMore("bongkar", bongkar)}
                  >
                    Lihat Lokasi Bongkar Lainnya
                  </ButtonMini>
                ) : null
              }
            />
          )}
        </TimelineContainer>
      </div>

      <BottomSheet
        open={bottomSheetData.length > 0}
        onOpenChange={(open) => {
          if (!open) setBottomSheetData([]);
        }}
      >
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetClose />
            <BottomSheetTitle>
              {mode === "muat" ? "Lokasi Muat" : "Lokasi Bongkar"}
            </BottomSheetTitle>
          </BottomSheetHeader>
          <div className="px-4">
            <TimelineContainer>
              {bottomSheetData.map((item, index) => (
                <NewTimelineItem
                  key={index}
                  variant={mode === "muat" ? "number-muat" : "number-bongkar"}
                  totalLength={bottomSheetData.length}
                  index={index}
                  title={item.fullAddress}
                  isLast={index === bottomSheetData.length - 1}
                  appearance={{ titleClassname: "text-xs" }}
                />
              ))}
            </TimelineContainer>
          </div>
        </BottomSheetContent>
      </BottomSheet>
    </>
  );
};

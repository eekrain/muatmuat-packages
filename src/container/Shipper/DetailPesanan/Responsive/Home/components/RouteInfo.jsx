import { useState } from "react";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/Bottomsheet/BottomSheet";
import { ButtonMini } from "@/components/Button/ButtonMini";
import { HalalLogistik } from "@/components/HalalLogistik/HalalLogistik";
import IconComponent from "@/components/IconComponent/IconComponent";
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";

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
              <NewTimelineItem
                variant="bullet"
                index={0}
                activeIndex={0}
                title={muat[0].fullAddress}
                isLast={false}
                appearance={{ titleClassname: "text-xs" }}
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
                appearance={{ titleClassname: "text-xs" }}
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

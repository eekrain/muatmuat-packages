import React, { useMemo, useState } from "react";

import { Alert } from "@/components/Alert/Alert";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import IconComponent from "@/components/IconComponent/IconComponent";
import Input from "@/components/Input/Input";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { formatNumberWithComma, idrFormat } from "@/lib/utils/formatters";

// --- Child Components (Adapted from JenisTruckScreen) ---

const TruckSpecItem = ({ iconSrc, label, children }) => (
  <div className="flex items-start gap-2">
    <IconComponent
      src={iconSrc}
      className="size-6 shrink-0 text-amber-900"
      alt={`${label} icon`}
    />
    <div className="flex flex-col gap-x-2">
      <span className="text-xs font-semibold leading-[1.1] text-neutral-900">
        {label}
      </span>
      <span className="text-xs font-bold leading-[1.1] text-neutral-900">
        {children}
      </span>
    </div>
  </div>
);

const TruckCard = ({ truck, onClick }) => {
  const handleCardClick = (e) => {
    e.stopPropagation();
    onClick(truck);
  };

  const dimensions = truck.dimensions || {};

  return (
    <div
      className="flex w-full cursor-pointer items-start gap-3"
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick(e)}
      role="button"
      tabIndex={0}
    >
      <LightboxProvider image={truck.image} title={truck.name}>
        <LightboxPreview image={truck.image} alt={truck.name} />
      </LightboxProvider>
      <div className="flex flex-1 flex-col gap-y-3">
        <div className="flex flex-col gap-y-3">
          <div className="flex h-7 items-center">
            <h3 className="text-sm font-bold leading-[1.1] text-neutral-900">
              {truck.name}
            </h3>
          </div>
          <p className="text-sm font-semibold leading-[1.1] text-neutral-900">
            {idrFormat(truck.calculatedPrice)}
          </p>
        </div>
        <div className="flex flex-col gap-y-3">
          <TruckSpecItem
            iconSrc="/icons/jenis-truck/scale.svg"
            label="Estimasi Kapasitas"
          >
            {formatNumberWithComma(truck.maxWeight)} {truck.weightUnit}
          </TruckSpecItem>
          <TruckSpecItem
            iconSrc="/icons/jenis-truck/dimension.svg"
            label="Estimasi Dimensi (p x l x t)"
          >
            {`${formatNumberWithComma(
              dimensions.length
            )} x ${formatNumberWithComma(
              dimensions.width
            )} x ${formatNumberWithComma(dimensions.height)} ${
              dimensions.dimensionUnit
            }`}
          </TruckSpecItem>
        </div>
      </div>
    </div>
  );
};

const TruckList = ({ trucks, onTruckClick, withDividerOnLastItem = true }) => (
  <div className="flex flex-col gap-y-4">
    {trucks.map((truck, index) => (
      <React.Fragment key={truck.truckTypeId}>
        <TruckCard truck={truck} onClick={onTruckClick} />
        {withDividerOnLastItem ? (
          <hr className="border-neutral-400" />
        ) : index < trucks.length - 1 ? (
          <hr className="border-neutral-400" />
        ) : null}
      </React.Fragment>
    ))}
  </div>
);

// --- Main Bottom Sheet Component ---

export const JenisTrukBottomSheet = ({
  open,
  onOpenChange,
  trucks,
  onSelectTruck,
  showTopAlert = true,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const { allTrucks, recommendedTrucks, nonRecommendedTrucks } = useMemo(
    () => ({
      allTrucks: [
        ...(trucks?.recommendedTrucks || []),
        ...(trucks?.nonRecommendedTrucks || []),
      ],
      recommendedTrucks: trucks?.recommendedTrucks || [],
      nonRecommendedTrucks: trucks?.nonRecommendedTrucks || [],
    }),
    [trucks]
  );

  const filteredTrucks = useMemo(() => {
    if (!searchValue) return [];
    return allTrucks.filter((truck) =>
      truck.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, allTrucks]);

  const handleTruckSelection = (truck) => {
    if (onSelectTruck) {
      onSelectTruck(truck);
    }
    // You would typically close the bottomsheet here, which can be done
    // by managing the `open` state in the parent component.
    console.log("Selected Truck:", truck);
  };

  const renderContent = () => {
    if (searchValue) {
      return filteredTrucks.length > 0 ? (
        <TruckList
          trucks={filteredTrucks}
          onTruckClick={handleTruckSelection}
          withDividerOnLastItem={false}
        />
      ) : (
        <DataNotFound
          className="h-full gap-y-5"
          type="search"
          title="Keyword Tidak Ditemukan"
        />
      );
    }

    return (
      <>
        {recommendedTrucks.length > 0 && (
          <section className="flex flex-col gap-y-4">
            <h2 className="text-sm font-bold text-neutral-900">
              Rekomendasi Truk Sesuai Muatan
            </h2>
            <TruckList
              trucks={recommendedTrucks}
              onTruckClick={handleTruckSelection}
            />
          </section>
        )}
        {nonRecommendedTrucks.length > 0 && (
          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-bold text-neutral-900">
                Tidak Direkomendasikan
              </h2>
              <Alert variant="warning" className="">
                Pilihan truk di bawah ini berisiko kelebihan muatan atau tidak
                sesuai dengan informasi muatan
              </Alert>
            </div>
            <TruckList
              trucks={nonRecommendedTrucks}
              onTruckClick={handleTruckSelection}
            />
          </section>
        )}
      </>
    );
  };

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent className="h-[600px]">
        <BottomSheetHeader>Pilih Jenis Truk</BottomSheetHeader>

        <div className="flex flex-col gap-y-6 px-4 pb-6 pt-7">
          <div className="flex flex-col gap-y-3">
            {showTopAlert && (
              <Alert className="h-[50px] py-0 leading-[1.1]" variant="warning">
                Berat / dimensi muatan melebihi kapasitas truk yang telah
                dipilih. Mohon pilih truk dengan kapasitas yang sesuai.
              </Alert>
            )}
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Cari Jenis Truk"
              icon={{
                left: "/icons/search16.svg",
                right: searchValue ? (
                  <IconComponent
                    src="/icons/silang.svg"
                    onClick={() => setSearchValue("")}
                  />
                ) : null,
              }}
            />
          </div>

          <div className="flex h-[234px] flex-col gap-y-4 overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

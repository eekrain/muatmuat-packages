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
    <div className="flex flex-col">
      <span className="text-xs font-semibold leading-tight text-black">
        {label}
      </span>
      <span className="text-xs font-bold leading-tight text-black">
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
      <div className="flex flex-1 flex-col gap-3">
        <div>
          <h3 className="text-sm font-bold text-black">{truck.name}</h3>
          <p className="mt-1 text-sm font-semibold text-black">
            {idrFormat(truck.calculatedPrice)}
          </p>
        </div>
        <div className="flex flex-col gap-3">
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
          <hr className="border-neutral-300" />
        ) : index < trucks.length - 1 ? (
          <hr className="border-neutral-300" />
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
        <div className="px-4 py-5">
          <TruckList
            trucks={filteredTrucks}
            onTruckClick={handleTruckSelection}
            withDividerOnLastItem={false}
          />
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <DataNotFound type="search" title="Keyword Tidak Ditemukan" />
        </div>
      );
    }

    return (
      <>
        {recommendedTrucks.length > 0 && (
          <section className="flex flex-col gap-y-4 px-4">
            <h2 className="text-sm font-bold text-black">
              Rekomendasi Truk Sesuai Muatan
            </h2>
            <TruckList
              trucks={recommendedTrucks}
              onTruckClick={handleTruckSelection}
            />
          </section>
        )}
        {nonRecommendedTrucks.length > 0 && (
          <section className="mt-4 flex flex-col gap-3 px-4">
            <h2 className="text-sm font-bold text-black">
              Tidak Direkomendasikan
            </h2>
            <Alert variant="warning" className="">
              Pilihan truk di bawah ini berisiko kelebihan muatan atau tidak
              sesuai dengan informasi muatan
            </Alert>
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
      <BottomSheetContent>
        <BottomSheetHeader>Pilih Jenis Truk</BottomSheetHeader>

        <div className="mt-7 flex h-[480px] h-full flex-col">
          <div className="flex flex-col gap-3 px-4 pb-4">
            {showTopAlert && (
              <Alert variant="warning">
                Berat / dimensi muatan melebihi kapasitas truk yang telah
                dipilih. Mohon pilih truk dengan kapasitas yang sesuai.
              </Alert>
            )}
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Cari Jenis Truk"
              leftIcon={
                <IconComponent
                  src="/icons/search.svg"
                  className="text-neutral-500"
                  alt="Search Icon"
                />
              }
            />
          </div>

          <div className="flex-1 overflow-y-auto">{renderContent()}</div>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

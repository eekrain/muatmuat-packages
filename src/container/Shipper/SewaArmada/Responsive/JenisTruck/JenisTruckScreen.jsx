import React, { useMemo } from "react";

import { Alert } from "@/components/Alert/Alert";
import { InfoBottomsheet } from "@/components/Form/InfoBottomsheet";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import SearchBarResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/SearchBarResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { cn } from "@/lib/utils";
import { idrFormat } from "@/lib/utils/formatters";
import { useSewaArmadaActions } from "@/store/Shipper/forms/sewaArmadaStore";
import { useResponsiveSearchStore } from "@/store/Shipper/zustand/responsiveSearchStore";

const JenisTruckScreen = ({ trucks }) => {
  const searchValue = useResponsiveSearchStore((s) => s.searchValue);
  const navigation = useResponsiveNavigation();

  // Filtering logic
  const filtered = useMemo(() => {
    if (!searchValue) return trucks;
    const filterFn = (truck) =>
      truck.name.toLowerCase().includes(searchValue.toLowerCase());
    return {
      recommendedTrucks: trucks.recommendedTrucks.filter(filterFn),
      nonRecommendedTrucks: trucks.nonRecommendedTrucks.filter(filterFn),
    };
  }, [searchValue, trucks]);

  const hasFilteredResults =
    searchValue &&
    (filtered.recommendedTrucks.length > 0 ||
      filtered.nonRecommendedTrucks.length > 0);

  const { setField } = useSewaArmadaActions();
  const handleClick = (truck) => {
    setField("truckTypeId", truck.truckTypeId);
    navigation.popTo("/");
  };

  return (
    <SearchBarResponsiveLayout
      placeholder="Cari Jenis Truck"
      className={cn(Boolean(searchValue) && hasFilteredResults && "bg-white")}
    >
      {Boolean(searchValue) ? (
        <div className="p-5">
          <div className="flex flex-col gap-3">
            {filtered.recommendedTrucks.concat(filtered.nonRecommendedTrucks)
              .length > 0 ? (
              filtered.recommendedTrucks
                .concat(filtered.nonRecommendedTrucks)
                .map((truck, index, arr) => (
                  <React.Fragment key={truck.truckTypeId}>
                    <TruckCard
                      truck={truck}
                      onClick={() => handleClick(truck)}
                    />
                    {index < arr.length - 1 && (
                      <hr className="border-neutral-400" />
                    )}
                  </React.Fragment>
                ))
            ) : (
              <div className="py-4 text-center text-sm text-neutral-500">
                Tidak ada truk yang cocok.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1">
          {/* Recommended Section */}
          <div className="flex flex-col gap-6 bg-white px-4 py-5">
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-1">
                  <h2 className="text-[14px] font-bold leading-[15.4px] text-black">
                    Rekomendasi Truk Sesuai Muatan
                  </h2>
                  <InfoBottomsheet title="Rekomendasi Truk ">
                    Berikut adalah rekomendasi truk berdasarkan berat dan
                    dimensi muatan yang kamu isikan dan diurutkan dari yang
                    termurah.
                  </InfoBottomsheet>
                </div>
              </div>

              {/* Recommended Trucks List */}
              <div className="flex flex-col gap-3">
                {trucks.recommendedTrucks.map((truck) => (
                  <TruckCard
                    key={truck.truckTypeId}
                    truck={truck}
                    onClick={() => handleClick(truck)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Gap */}
          <div className="h-2 bg-neutral-200"></div>

          {/* Non-Recommended Section */}
          <div className="flex flex-col gap-6 bg-white p-5">
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col gap-4">
                <h2 className="text-[14px] font-bold leading-[15.4px] text-black">
                  Tidak Direkomendasikan
                </h2>
                <Alert variant="warning">
                  Pilihan truk di bawah ini berisiko kelebihan muatan atau tidak
                  sesuai dengan informasi muatan
                </Alert>
              </div>

              {/* Non-Recommended Trucks List */}
              <div className="flex flex-col gap-3">
                {trucks.nonRecommendedTrucks.map((truck, index, arr) => (
                  <React.Fragment key={truck.truckTypeId}>
                    <TruckCard
                      truck={truck}
                      onClick={() => handleClick(truck)}
                    />
                    {index < arr.length - 1 && (
                      <div className="h-px w-full bg-neutral-400"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </SearchBarResponsiveLayout>
  );
};

export default JenisTruckScreen;

const TruckCard = ({ truck, onClick = () => {} }) => (
  <div
    className="flex w-full cursor-pointer items-start gap-3"
    onClick={(e) => {
      e.stopPropagation();
      onClick(truck);
    }}
  >
    {/* Truck Image */}
    <LightboxProvider
      className="size-[68px]"
      title={truck.name}
      image={truck.image}
    >
      <LightboxPreview
        className="object-contain"
        image={truck.image}
        alt={truck.name}
      />
    </LightboxProvider>

    {/* Truck Details */}
    <div className="flex flex-1 flex-col gap-3">
      {/* Title and Price */}
      <div className="flex flex-col gap-3">
        <h3 className="block text-[14px] font-bold leading-[15.4px] text-black">
          {truck.name}
        </h3>
        <p className="text-[14px] font-semibold leading-[15.4px] text-black">
          {idrFormat(truck.price)}
        </p>
      </div>

      {/* Specifications */}
      <div className="flex flex-col gap-3">
        {/* Capacity */}
        <div className="flex items-center gap-2">
          <IconComponent
            src="/icons/jenis-truck/scale.svg"
            className="size-6 text-amber-900"
          />
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold leading-[13.2px] text-black">
              Estimasi Kapasitas
            </span>
            <span className="text-[12px] font-bold leading-[13.2px] text-black">
              {truck.maxWeight} {truck.weightUnit}
            </span>
          </div>
        </div>

        {/* Dimensions */}
        <div className="flex items-center gap-2">
          <IconComponent
            src="/icons/jenis-truck/dimension.svg"
            className="size-6 text-amber-900"
          />
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold leading-[13.2px] text-black">
              Estimasi Dimensi (p x l x t)
            </span>
            <span className="text-[12px] font-bold leading-[13.2px] text-black">
              {truck.dimensions.length} {truck.dimensions.dimensionUnit} x{" "}
              {truck.dimensions.width} {truck.dimensions.dimensionUnit} x{" "}
              {truck.dimensions.height} {truck.dimensions.dimensionUnit}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

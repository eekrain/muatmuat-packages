import React, { useEffect, useMemo } from "react";

import { Alert } from "@/components/Alert/Alert";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
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

const JenisTruckScreen = ({ trucks, handleFetchTrucks }) => {
  const searchValue = useResponsiveSearchStore((s) => s.searchValue);
  const navigation = useResponsiveNavigation();

  // Filtering logic
  const filteredTrucks = useMemo(() => {
    if (!trucks?.recommendedTrucks || !trucks?.nonRecommendedTrucks) return [];

    const mergedTrucks = [
      ...trucks.recommendedTrucks,
      ...trucks.nonRecommendedTrucks,
    ];

    return mergedTrucks.filter((truck) =>
      truck.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, trucks]);

  const { setField } = useSewaArmadaActions();
  const handleClick = (truck) => {
    setField("truckTypeId", truck.truckTypeId);
    navigation.popTo("/");
  };

  useEffect(() => {
    handleFetchTrucks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SearchBarResponsiveLayout
      placeholder="Cari Jenis Truck"
      className={cn(
        Boolean(searchValue) && filteredTrucks.length > 0 && "bg-white"
      )}
    >
      {Boolean(searchValue) && filteredTrucks.length === 0 ? (
        <div className="grid h-full items-center justify-center">
          <DataNotFound
            className="gap-y-3.5"
            textClass="leading-[14px] !text-sm"
            title={
              <>
                Keyword
                <br />
                Tidak Ditemukan
              </>
            }
            width={127}
            height={109}
          />
        </div>
      ) : Boolean(searchValue) && filteredTrucks.length > 0 ? (
        <div className="p-5">
          <div className="flex flex-col gap-3">
            {filteredTrucks.map((truck, index) => (
              <React.Fragment key={truck.truckTypeId}>
                <TruckCard truck={truck} onClick={() => handleClick(truck)} />
                {index < filteredTrucks.length - 1 && (
                  <hr className="border-neutral-400" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : trucks?.recommendedTrucks?.length > 0 ||
        trucks?.nonRecommendedTrucks?.length > 0 ? (
        <div className="grid grid-cols-1">
          {/* Recommended Section */}
          <div className="flex flex-col gap-6 bg-white px-4 py-5">
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-1">
                  <h2 className="text-sm font-bold leading-[15.4px] text-black">
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
                {trucks?.recommendedTrucks.map((truck) => (
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
                <h2 className="text-sm font-bold leading-[15.4px] text-black">
                  Tidak Direkomendasikan
                </h2>
                <Alert variant="warning">
                  Pilihan truk di bawah ini berisiko kelebihan muatan atau tidak
                  sesuai dengan informasi muatan
                </Alert>
              </div>

              {/* Non-Recommended Trucks List */}
              <div className="flex flex-col gap-3">
                {trucks?.nonRecommendedTrucks.map((truck, index, arr) => (
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
      ) : (
        <div className="flex h-full flex-col">
          <Alert variant="warning" className="h-[52px] pl-3 pr-6">
            Untuk sementara kami belum menyediakan truk yang sesuai dengan
            informasi berat dan dimensi muatan yang kamu isikan.
          </Alert>
          <DataNotFound
            className="flex-1 gap-y-3"
            textClass="leading-[14px] !text-sm"
            title={"Tidak ada rekomendasi truk"}
            width={127}
            height={109}
          />
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
        <h3 className="block text-sm font-bold leading-[15.4px] text-black">
          {truck.name}
        </h3>
        <p className="text-sm font-semibold leading-[15.4px] text-black">
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
            <span className="text-xs font-semibold leading-[13.2px] text-black">
              Estimasi Kapasitas
            </span>
            <span className="text-xs font-bold leading-[13.2px] text-black">
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
            <span className="text-xs font-semibold leading-[13.2px] text-black">
              Estimasi Dimensi (p x l x t)
            </span>
            <span className="text-xs font-bold leading-[13.2px] text-black">
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

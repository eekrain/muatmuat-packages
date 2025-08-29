import React, { useEffect, useMemo } from "react";

import { Alert } from "@/components/Alert/Alert";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { InfoBottomsheet } from "@/components/Form/InfoBottomsheet";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";

import { useSWRMutateHook } from "@/hooks/use-swr";

import { isDev } from "@/lib/constants/is-dev";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { cn } from "@/lib/utils";
import { formatNumberWithComma, idrFormat } from "@/lib/utils/formatters";

import SearchBarResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/SearchBarResponsiveLayout";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";
import { useResponsiveSearchStore } from "@/store/Shipper/zustand/responsiveSearchStore";

// --- Child Components for UI Clarity ---

/**
 * @description Renders a single specification item for a truck, like capacity or dimensions.
 */
const TruckSpecItem = ({ iconSrc, label, children }) => (
  <div className="flex items-center gap-2">
    <IconComponent
      src={iconSrc}
      className="size-6 shrink-0 text-amber-900"
      alt={`${label} icon`}
    />
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold leading-tight text-black">
        {label}
      </span>
      <span className="text-xs font-bold leading-tight text-black">
        {children}
      </span>
    </div>
  </div>
);

/**
 * @description Displays a single truck's information in a card format.
 */
const TruckCard = ({ truck, onClick, orderType }) => {
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
        <LightboxPreview
          image={truck.image}
          alt={truck.name}
          className="size-[68px] shrink-0 object-contain"
        />
      </LightboxProvider>

      <div className="flex flex-1 flex-col gap-3">
        <div>
          <h3 className="text-sm font-bold text-black">
            {truck.name}{" "}
            {orderType === "SCHEDULED" && (
              <span className="font-semibold">({truck.unit} Unit)</span>
            )}
          </h3>
          <p className="mt-3 text-sm font-semibold text-black">
            {idrFormat(truck.calculatedPrice)}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {orderType === "SCHEDULED" && (
            <TruckSpecItem
              iconSrc="/icons/jenis-truck/truck-price.svg"
              label="Harga per unit"
            >
              {idrFormat(truck.basePrice)}
            </TruckSpecItem>
          )}
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
            {`${formatNumberWithComma(dimensions.length)} x ${formatNumberWithComma(dimensions.width)} x ${formatNumberWithComma(dimensions.height)} ${dimensions.dimensionUnit}`}
          </TruckSpecItem>
        </div>
      </div>
    </div>
  );
};

/**
 * @description Renders a list of trucks, handling mapping and separators.
 */
const TruckList = ({ trucks, onTruckClick, orderType }) => (
  <div className="flex flex-col gap-3">
    {trucks.map((truck, index) => (
      <React.Fragment key={truck.truckTypeId}>
        <TruckCard truck={truck} onClick={onTruckClick} orderType={orderType} />
        {index < trucks.length - 1 && <hr className="border-neutral-400" />}
      </React.Fragment>
    ))}
  </div>
);

/**
 * @description Displays when a search returns no results.
 */
const NoSearchResults = () => (
  <div className="grid h-full items-center justify-center">
    <DataNotFound
      className="gap-y-3.5"
      textClass="leading-tight !text-sm"
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
);

/**
 * @description Displays when no trucks are available at all from the API.
 */
const NoTrucksAvailable = () => (
  <div className="flex h-full flex-col">
    <Alert variant="warning" className="h-[52px] pl-3 pr-5">
      Untuk sementara kami belum menyediakan truk yang sesuai dengan informasi
      berat dan dimensi muatan yang kamu isikan.
    </Alert>
    <DataNotFound
      className="flex-1 gap-y-3"
      textClass="leading-tight !text-sm"
      title="Tidak ada rekomendasi truk"
      width={94}
      height={76}
      type="data"
    />
  </div>
);

/**
 * @description Displays the default view with recommended and non-recommended truck lists.
 */
const DefaultTruckDisplay = ({
  recommendedTrucks,
  nonRecommendedTrucks,
  onTruckClick,
  orderType,
}) => (
  <div className="grid grid-cols-1">
    {/* Recommended Section */}
    {recommendedTrucks?.length > 0 && (
      <section className="flex flex-col gap-6 bg-white px-4 py-5">
        <div className="flex items-center gap-1">
          <h2 className="text-sm font-bold text-black">
            Rekomendasi Truk Sesuai Muatan
          </h2>
          <InfoBottomsheet title="Rekomendasi Truk ">
            Berikut adalah rekomendasi truk berdasarkan berat dan dimensi muatan
            yang kamu isikan dan diurutkan dari yang termurah.
          </InfoBottomsheet>
        </div>
        <TruckList
          trucks={recommendedTrucks}
          onTruckClick={onTruckClick}
          orderType={orderType}
        />
      </section>
    )}

    {/* Separator */}
    {recommendedTrucks?.length > 0 && nonRecommendedTrucks?.length > 0 && (
      <div className="h-2 bg-neutral-200" />
    )}

    {/* Non-Recommended Section */}
    {nonRecommendedTrucks?.length > 0 && (
      <section className="flex flex-col bg-white p-5">
        <h2 className="mb-4 text-sm font-bold text-black">
          Tidak Direkomendasikan
        </h2>
        <Alert variant="warning" className="mb-6">
          Pilihan truk di bawah ini berisiko kelebihan muatan atau tidak sesuai
          dengan informasi muatan
        </Alert>
        <TruckList
          trucks={nonRecommendedTrucks}
          onTruckClick={onTruckClick}
          orderType={orderType}
        />
      </section>
    )}
  </div>
);

// --- Main Screen Component ---

const JenisTruckScreen = ({ trucks, handleFetchTrucks }) => {
  const searchValue = useResponsiveSearchStore((s) => s.searchValue);
  const navigation = useResponsiveNavigation();
  const orderType = useSewaArmadaStore((s) => s.orderType);
  const { setField } = useSewaArmadaActions();

  // Get location data from store for distance calculation
  const { lokasiMuat, lokasiBongkar } = useSewaArmadaStore((s) => s.formValues);

  // Setup SWR mutation hook for distance calculation
  const { trigger: calculateDistance } = useSWRMutateHook(
    "v1/orders/calculate-distance"
  );

  useEffect(() => {
    handleFetchTrucks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleTruckSelection = async (truck) => {
    try {
      // Set the selected truck
      setField("truckTypeId", truck.truckTypeId);

      // Calculate distance if we have both pickup and dropoff locations
      if (lokasiMuat.length > 0 && lokasiBongkar.length > 0) {
        console.log("🚀 Calculating distance for truck selection:", truck.name);

        const requestPayload = {
          origin: lokasiMuat.map((item) => ({
            lat: item?.dataLokasi?.coordinates?.latitude || 0,
            long: item?.dataLokasi?.coordinates?.longitude || 0,
          })),
          destination: lokasiBongkar.map((item) => ({
            lat: item?.dataLokasi?.coordinates?.latitude || 0,
            long: item?.dataLokasi?.coordinates?.longitude || 0,
          })),
        };

        console.log("📍 Distance calculation payload:", requestPayload);

        const response = await calculateDistance(requestPayload);

        if (response?.Data) {
          const { estimatedDistance, distanceUnit } = response.Data;
          console.log("✅ Distance calculated:", {
            estimatedDistance,
            distanceUnit,
          });

          // Update the store with calculated distance
          setField("distance", estimatedDistance);
          setField("distanceUnit", distanceUnit);
        }
      } else {
        console.log("⚠️ Cannot calculate distance: missing location data", {
          lokasiMuatCount: lokasiMuat.length,
          lokasiBongkarCount: lokasiBongkar.length,
        });
      }

      // Navigate back to the main screen
      navigation.popTo("/");
    } catch (error) {
      console.error("❌ Error calculating distance:", error);
      // Still navigate back even if distance calculation fails
      navigation.popTo("/");
    }
  };

  const renderContent = () => {
    const isSearching = Boolean(searchValue);

    if (isSearching) {
      if (filteredTrucks.length > 0) {
        return (
          <div className="bg-white p-5">
            <TruckList
              trucks={filteredTrucks}
              onTruckClick={handleTruckSelection}
              orderType={orderType}
            />
          </div>
        );
      }
      return <NoSearchResults />;
    }

    if (allTrucks.length > 0) {
      return (
        <DefaultTruckDisplay
          recommendedTrucks={recommendedTrucks}
          nonRecommendedTrucks={nonRecommendedTrucks}
          onTruckClick={handleTruckSelection}
          orderType={orderType}
        />
      );
    }

    return <NoTrucksAvailable />;
  };

  return (
    <SearchBarResponsiveLayout
      placeholder="Cari Jenis Truck"
      className={cn(
        Boolean(searchValue) && filteredTrucks.length > 0 && "bg-white"
      )}
    >
      {renderContent()}
      {isDev && (
        <div className="max-w-screen overflow-hidden">
          <pre>{JSON.stringify(trucks, null, 2)}</pre>
        </div>
      )}
    </SearchBarResponsiveLayout>
  );
};

export default JenisTruckScreen;

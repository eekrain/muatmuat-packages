import { useEffect } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { ModalPostalCodeResponsive } from "@/components/LocationManagement/Responsive/ModalPostalCodeResponsive";
import { useLocation } from "@/hooks/use-location";
import SearchBarResponsiveLayout from "@/layout/ResponsiveLayout/SearchBarResponsiveLayout";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
  useResponsiveSearch,
} from "@/lib/responsive-navigation";
import { useLocationFormStore } from "@/store/forms/locationFormStore";

import { RecentTransactionItem } from "./RecentTransactionItem";
import { SavedLocationItem } from "./SavedLocationItem";
import { SearchResultItem } from "./SearchResultItem";

const recentSearches = [
  {
    Title: "Jl. Embong Malang 28B, Kedungdoro",
  },
  {
    Title: "Jl. Embong Jombang 12A, Kedungdoro",
  },
  {
    Title: "Jl. Embong Magetan 8C, Kedungdoro",
  },
];

export const PencarianLokasi = () => {
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();
  console.log("🚀 ~ PencarianLokasi ~ params:", params);
  const { searchValue } = useResponsiveSearch();

  const { setField, setLocationPartial } = useLocationFormStore();

  const {
    locationAutoCompleteResult,
    onSelectAutoComplete,
    userSavedLocations,
    searchLocationAutoComplete,
    setSearchLocationAutoComplete,
    isModalPostalCodeOpen,
    setIsModalPostalCodeOpen,
    searchLocationByPostalCode,
    setSearchLocationByPostalCode,
    postalCodeAutoCompleteResult,
    onSelectPostalCode,
    handleGetCurrentLocation,
  } = useLocation({
    onAddressSelected: setLocationPartial,
    setPICName: (name) => {
      setField("namaPIC", name);
    },
    setNoHPPIC: (noHPPIC) => {
      setField("noHPPIC", noHPPIC);
    },
    setLocationPartial,
  });

  const handleToUserSavedLocationManagement = () => {
    navigation.push("/PencarianLokasiTersimpan");
  };

  const getCurrentLocation = () => {
    handleGetCurrentLocation().then((dataLokasi) => {
      console.log("🚀 ~ handleGetCurrentLocation ~ dataLokasi:", dataLokasi);
      setLocationPartial({
        coordinates: dataLokasi.coordinates,
        location: dataLokasi.location,
      });
      navigation.push("/PinPointMap", { ...params, dataLokasi });
    });
  };

  useEffect(() => {
    setSearchLocationAutoComplete(searchValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <SearchBarResponsiveLayout placeholder="Cari Lokasi Muat">
      <div className="grid gap-5 px-4 py-5">
        {locationAutoCompleteResult && searchLocationAutoComplete ? (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-neutral-700">
              Hasil Pencarian
            </h3>

            <div className="flex flex-col gap-3">
              {locationAutoCompleteResult.map((location, index) => (
                <SearchResultItem
                  key={location.ID}
                  location={location}
                  onClick={() => {
                    console.log("🚀 ~ TambahLokasi ~ location:", location);
                    onSelectAutoComplete(location);
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={getCurrentLocation}
              className="] flex w-full items-center gap-3 font-medium text-[#176CF7]"
            >
              <IconComponent
                src="/icons/marker-target-outline.svg"
                width={24}
                height={24}
                className="-mt-[2px]"
              />
              <h2 className="text-sm font-semibold text-primary-700">
                Pilih Lokasi
              </h2>
            </button>

            {/* Divider */}
            <div className="h-px w-full bg-neutral-400"></div>

            {/* Recent Searches Section */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-neutral-700">
                Pencarian Terakhir
              </h3>

              <div className="flex flex-col gap-3">
                {recentSearches.map((location, index) => (
                  <SearchResultItem
                    key={index}
                    location={location}
                    onClick={() => alert("not implemented")}
                    withBookmark={{
                      onClick: () => alert("not implemented"),
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-neutral-400"></div>

            {/* Location Management Section */}
            {userSavedLocations.length > 0 ? (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-neutral-700">
                  Manajemen Lokasi
                </h3>

                <div className="flex flex-col gap-3">
                  {userSavedLocations.slice(0, 3).map((location, index) => (
                    <SavedLocationItem
                      key={index}
                      location={location}
                      onClick={() => alert("coba")}
                      withEdit={{
                        onClick: (e) => {
                          e.stopPropagation();
                          alert("not implemented");
                        },
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={handleToUserSavedLocationManagement}
                  className="text-right text-xs font-semibold text-primary-700 hover:underline"
                >
                  Lihat Manajemen Lokasi
                </button>
              </div>
            ) : null}

            {/* Divider */}
            <div className="h-px w-full bg-neutral-400"></div>

            {/* Recent Transactions Section */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-neutral-700">
                Transaksi Terakhir
              </h3>

              <div className="flex flex-col gap-3">
                {recentSearches.map((location, index) => (
                  <RecentTransactionItem
                    key={index}
                    location={location}
                    onClick={() => alert("not implemented")}
                    withBookmark={{
                      onClick: () => alert("not implemented"),
                    }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        <ModalPostalCodeResponsive
          open={isModalPostalCodeOpen}
          searchValue={searchLocationByPostalCode}
          setSearchValue={setSearchLocationByPostalCode}
          options={postalCodeAutoCompleteResult}
          onSelectPostalCode={onSelectPostalCode}
          onOpenChange={setIsModalPostalCodeOpen}
        />
      </div>
    </SearchBarResponsiveLayout>
  );
};

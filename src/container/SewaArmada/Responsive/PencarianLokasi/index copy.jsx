import { useEffect, useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { ModalPostalCodeResponsive } from "@/components/LocationManagement/Responsive/ModalPostalCodeResponsive";
import { useLocationStore } from "@/hooks/use-location";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import SearchBarResponsiveLayout from "@/layout/ResponsiveLayout/SearchBarResponsiveLayout";
import { normalizeUserSavedLocation } from "@/lib/normalizers";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
  useResponsiveSearch,
} from "@/lib/responsive-navigation";
import { useLocationFormStore } from "@/store/forms/locationFormStore";

import { SavedLocationItem } from "./SavedLocationItem";
import { SearchResultItem } from "./SearchResultItem";

const recentSearches = [
  {
    ID: "ChIJW5-5T4ZXei4RxLXmYcbntow",
    Title:
      "Jogokaryan, Gang Parang Klithik, Mantrijeron, Kota Yogyakarta, Daerah Istimewa Yogyakarta, Indonesia",
    Lev: 1,
  },
  {
    ID: "ChIJXxTge35Xei4R0EgHwHkxCUM",
    Title:
      "Kampung Ramadhan Jogokariyan, Jalan Masjid Jogokariyan, Mantrijeron, Kota Yogyakarta, Daerah Istimewa Yogyakarta, Indonesia",
    Lev: 1,
  },
  {
    ID: "ChIJBU1uFwhXei4RFdOldI3Uopw",
    Title:
      "JOGOKARYAN MJ 3, Pandes, Panggungharjo, Kabupaten Bantul, Daerah Istimewa Yogyakarta, Indonesia",
    Lev: 1,
  },
];

export const PencarianLokasi = () => {
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();
  const { searchValue } = useResponsiveSearch();

  const dataLokasi = useLocationFormStore(
    (state) => state.formValues.dataLokasi
  );
  const setField = useLocationFormStore((state) => state.setField);
  const setLocationPartial = useLocationFormStore(
    (state) => state.setLocationPartial
  );

  const {
    locationAutoCompleteResult,
    onSelectSearchResult,
    isLoadingAutoComplete,
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
  } = useLocationStore({
    onAddressSelected: setLocationPartial,
    setPICName: (name) => {
      setField("namaPIC", name);
    },
    setNoHPPIC: (noHPPIC) => {
      setField("noHPPIC", noHPPIC);
    },
    setLocationPartial,
  });

  useEffect(() => {
    // Sync up search value from search bar
    setSearchLocationAutoComplete(searchValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

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

  // ======================================================================================================

  const [isManualInputPostalCode, setIsManualInputPostalCode] = useState(false);

  const handleLocationSearchSelected = (location) => {
    onSelectSearchResult(location).then((result) => {
      console.log("🚀 ~ onSelectSearchResult ~ result:", result);
      // If there is data district, then push to the form lokasi bongkar muat
      // If there is no data district, wait for the user to input the postal code
      if (result.district) {
        navigation.push("/FormLokasiBongkarMuat", {
          ...params,
        });
      } else {
        setIsManualInputPostalCode(true);
      }
    });
  };

  useShallowCompareEffect(() => {
    // This is for handling the case when the location from the search result does not have data district
    // It will show a modal to input the postal code
    // Then after the data district is obtained, it will push to the form lokasi bongkar muat
    if (dataLokasi && isManualInputPostalCode) {
      navigation.push("/FormLokasiBongkarMuat", {
        ...params,
      });
    }
  }, [dataLokasi, isManualInputPostalCode]);

  // ======================================================================================================

  const handleAddToSavedLocation = (location) => {
    console.log("🚀 ~ handleAddToSavedLocation ~ location:", location);
    onSelectSearchResult(location, false, false).then((result) => {
      console.log("🚀 ~ onSelectSearchResult ~ result:", result);
      // If there is data district, then push to the form simpan lokasi
      // If there is no data district, wait for the user to input the postal code
      // if (result.district) {
      //   navigation.push("/FormSimpanLokasi", {
      //     ...params,
      //   });
      // } else {
      //   setIsManualInputPostalCode(true);
      // }
    });
  };

  // useShallowCompareEffect(() => {
  //   // This is for handling the case when the location from the search result does not have data district
  //   // It will show a modal to input the postal code
  //   // Then after the data district is obtained, it will push to the form lokasi bongkar muat
  //   if (dataLokasi?.district && isManualInputPostalCode) {
  //     navigation.push("/FormSimpanLokasi", {
  //       ...params,
  //     });
  //   }
  // }, [dataLokasi?.district, isManualInputPostalCode]);

  // ======================================================================================================

  const handleEditSavedLocation = (location) => {
    const dataLokasi = normalizeUserSavedLocation(location);
    navigation.push("/FormSimpanLokasi", {
      ...params,
      defaultValues: {
        namaLokasi: location.Name,
        dataLokasi,
        detailLokasi: location.AddressDetail,
        namaPIC: location.PicName,
        noHPPIC: location.PicNoTelp,
        isMainAddress: Boolean(location.IsMainAddress),
      },
      layout: {
        title: "Ubah Lokasi",
      },
    });
  };
  return (
    <SearchBarResponsiveLayout placeholder="Cari Lokasi Muat">
      <div className="flex h-full flex-col gap-5 px-4 py-5">
        {locationAutoCompleteResult && searchLocationAutoComplete ? (
          <div className="flex h-full flex-col gap-4">
            {locationAutoCompleteResult.length > 0 ? (
              <>
                <h3 className="text-sm font-bold text-neutral-700">
                  Hasil Pencarian
                </h3>
                <div className="flex flex-1 flex-col gap-3">
                  {locationAutoCompleteResult.map((location, index) => (
                    <SearchResultItem
                      key={location.ID}
                      location={location}
                      onClick={() => handleLocationSearchSelected(location)}
                    />
                  ))}
                </div>
              </>
            ) : locationAutoCompleteResult.length === 0 &&
              !isLoadingAutoComplete ? (
              <div className="flex flex-1 flex-col items-center justify-center">
                <img
                  src="/img/search-not-found.webp"
                  alt="search-not-found"
                  className="h-[114px] w-[134px] object-contain"
                />
                <p className="mt-3 text-center text-sm font-semibold">
                  Keyword
                  <br />
                  Tidak Ditemukan
                </p>
              </div>
            ) : null}
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

            <div className="h-px w-full bg-neutral-400"></div>
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
                      onClick: (e) => {
                        e.stopPropagation();
                        handleAddToSavedLocation(location);
                      },
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="h-px w-full bg-neutral-400" />
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
                          handleEditSavedLocation(location);
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

            {/* <div className="h-px w-full bg-neutral-400"></div>
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
            </div> */}
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

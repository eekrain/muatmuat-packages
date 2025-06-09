import { useEffect, useRef, useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { ModalPostalCodeResponsive } from "@/components/LocationManagement/Responsive/ModalPostalCodeResponsive";
import { LocationProvider, useLocationContext } from "@/hooks/use-location";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import SearchBarResponsiveLayout from "@/layout/ResponsiveLayout/SearchBarResponsiveLayout";
import { normalizeUserSavedLocation } from "@/lib/normalizers";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { toast } from "@/lib/toast";
import { useLocationFormStore } from "@/store/forms/locationFormStore";

import { SavedLocationItem } from "./SavedLocationItem";
import { SearchResultItem } from "./SearchResultItem";

const InnerPencarianLokasi = () => {
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();
  console.log("🚀 ~ InnerPencarianLokasi ~ params:", params);

  const districtData = useLocationFormStore(
    (s) => s.formValues.dataLokasi?.district
  );
  const validateLokasiOnSelect = useLocationFormStore(
    (s) => s.validateLokasiOnSelect
  );

  const {
    autoCompleteSearchPhrase,
    autoCompleteSearchResult,
    isLoadingAutoComplete,
    handleSelectSearchResult,

    userSavedLocationResult,
    handleSelectUserSavedLocation,

    handleGetCurrentLocation,
  } = useLocationContext();

  // ======================================================================================================

  const [isManualPostalCodeAutoComplete, setIsManualPostalCodeAutoComplete] =
    useState(false);

  const onLocationSearchSelected = (location) => {
    const error = validateLokasiOnSelect(
      params.config.formMode,
      params.config.index,
      location.Title
    );

    if (error) {
      toast.error(error);
      return;
    }

    handleSelectSearchResult(location).then((result) => {
      // If districtData is automatically filled, then immediately navigate to FormLokasiBongkarMuat
      if (result?.district?.value) {
        navigation.push("/FormLokasiBongkarMuat", { ...params });
      }
      // If districtData is not automatically filled, then mark it as manual postal code, handle it later when user filled the postal code
      else {
        setIsManualPostalCodeAutoComplete(true);
      }
    });
  };

  useShallowCompareEffect(() => {
    // If districtData has been filled, then navigate to FormLokasiBongkarMuat
    if (districtData && isManualPostalCodeAutoComplete) {
      navigation.push("/FormLokasiBongkarMuat", { ...params });
    }
  }, [districtData, isManualPostalCodeAutoComplete]);

  // ======================================================================================================

  const [isManualPostalCodeGPS, setIsManualPostalCodeGPS] = useState(false);

  const onGetCurrentLocation = () => {
    handleGetCurrentLocation().then((result) => {
      console.log("🚀 ~ handleGetCurrentLocation ~ result:", result);
      // If districtData is automatically filled, then immediately navigate to FormLokasiBongkarMuat
      if (result?.district?.value) {
        navigation.push("/FormLokasiBongkarMuat", { ...params });
      }
      // If districtData is not automatically filled, then mark it as manual postal code, handle it later when user filled the postal code
      else {
        setIsManualPostalCodeGPS(true);
      }
    });
  };

  useShallowCompareEffect(() => {
    // If districtData has been filled, then navigate to FormLokasiBongkarMuat
    if (districtData && isManualPostalCodeGPS) {
      navigation.push("/PinPointMap", { ...params });
    }
  }, [districtData, isManualPostalCodeGPS]);

  // ======================================================================================================

  const [isManualPostalCodeSaveLocation, setIsManualPostalCodeSaveLocation] =
    useState(false);

  const onAddToSavedLocation = (location) => {
    handleSelectSearchResult(location).then((result) => {
      console.log("🚀 ~ handleSelectSearchResultResponsive ~ result:", result);
      // If districtData is automatically filled, then immediately navigate to FormLokasiBongkarMuat
      if (result?.district?.value) {
        navigation.push("/FormSimpanLokasi", {
          ...params,
          layout: { title: "Tambah Lokasi" },
          mode: "add",
        });
      }
      // If districtData is not automatically filled, then mark it as manual postal code, handle it later when user filled the postal code
      else {
        setIsManualPostalCodeSaveLocation(true);
      }
    });
  };

  useShallowCompareEffect(() => {
    // If districtData has been filled, then navigate to FormLokasiBongkarMuat
    if (districtData && isManualPostalCodeSaveLocation) {
      navigation.push("/FormSimpanLokasi", {
        ...params,
        layout: { title: "Tambah Lokasi" },
        mode: "add",
      });
    }
  }, [districtData, isManualPostalCodeSaveLocation]);

  // ======================================================================================================

  const onSelectUserSavedLocation = (location) => {
    handleSelectUserSavedLocation(location);
    navigation.push("/FormLokasiBongkarMuat", { ...params });
  };

  const handleEditSavedLocation = (location) => {
    console.log("🚀 ~ handleEditSavedLocation ~ location:", location);
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
      mode: "update",
      idToUpdate: location.ID,
    });
  };

  const navigateToPencarianLokasiTersimpan = () => {
    navigation.push("/PencarianLokasiTersimpan", {
      ...params,
    });
  };

  const reset = useLocationFormStore((s) => s.reset);
  const hasInit = useRef(false);
  useEffect(() => {
    // Reset form values when component is mounted
    // This is to prevent form values from being filled when user navigates back to this page
    if (!hasInit.current) {
      reset();
      hasInit.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SearchBarResponsiveLayout
      placeholder={
        params.config.formMode === "muat"
          ? "Cari Lokasi Muat"
          : "Cari Lokasi Bongkar"
      }
    >
      <div className="flex h-full flex-col gap-5 px-4 py-5">
        {autoCompleteSearchResult && autoCompleteSearchPhrase ? (
          <div className="flex h-full flex-col gap-4">
            {autoCompleteSearchResult.length > 0 ? (
              <>
                <h3 className="text-sm font-bold text-neutral-700">
                  Hasil Pencarian
                </h3>
                <div className="flex flex-1 flex-col gap-3">
                  {autoCompleteSearchResult.map((location, index) => (
                    <SearchResultItem
                      key={location.ID}
                      location={location}
                      onClick={() => {
                        onLocationSearchSelected(location);
                      }}
                      withBookmark={{
                        onClick: (e) => {
                          e.stopPropagation();
                          onAddToSavedLocation(location);
                        },
                      }}
                    />
                  ))}
                </div>
              </>
            ) : autoCompleteSearchResult.length === 0 &&
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
              onClick={onGetCurrentLocation}
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
                    onClick={() => onLocationSearchSelected(location)}
                    withBookmark={{
                      onClick: (e) => {
                        e.stopPropagation();
                        onAddToSavedLocation(location);
                      },
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="h-px w-full bg-neutral-400" />
            {userSavedLocationResult.length > 0 ? (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-neutral-700">
                  Manajemen Lokasi
                </h3>

                <div className="flex flex-col gap-3">
                  {userSavedLocationResult
                    .slice(0, 3)
                    .map((location, index) => (
                      <SavedLocationItem
                        key={index}
                        location={location}
                        onClick={() => onSelectUserSavedLocation(location)}
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
                  onClick={navigateToPencarianLokasiTersimpan}
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

        <ModalPostalCodeResponsive />
      </div>
    </SearchBarResponsiveLayout>
  );
};

export const PencarianLokasi = () => {
  return (
    <LocationProvider>
      <InnerPencarianLokasi />
    </LocationProvider>
  );
};

const recentSearches = [
  {
    ID: "ChIJx0YaJPNdxWgRM2hgerpFV4s",
    Title:
      "muatmuat, Jalan Kedung Doro, RT.001/RW.06, Kedungdoro, Surabaya, Jawa Timur, Indonesia",
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

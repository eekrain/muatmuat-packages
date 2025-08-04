import { useEffect, useRef, useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { ModalPostalCodeResponsive } from "@/components/LocationManagement/Responsive/ModalPostalCodeResponsive/ModalPostalCodeResponsive";
import { normalizeUserSavedLocation } from "@/hooks/use-location/normalizer";
import { useLocationContext } from "@/hooks/use-location/use-location";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useTranslation } from "@/hooks/use-translation";
import SearchBarResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/SearchBarResponsiveLayout";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";

import { SavedLocationItem } from "./SavedLocationItem";
import { SearchResultItem } from "./SearchResultItem";

const PencarianLokasiScreen = () => {
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();
  console.log("🚀 ~ InnerPencarianLokasi ~ params:", params);

  const districtData = useLocationFormStore(
    (s) => s.formValues.dataLokasi?.district
  );

  const dataAddress = useLocationFormStore(
    (s) => s.formValues.dataLokasi?.location?.name
  );

  const {
    autoCompleteSearchPhrase,
    autoCompleteSearchResult,
    isLoadingAutoComplete,
    handleSelectSearchResult,

    userSavedLocationResult,
    handleSelectUserSavedLocation,
    userRecentSearchedLocation,
    userRecentTransactionLocation,
    handleSelectRecentLocation,

    handleGetCurrentLocation,
    resetLocationContext,
  } = useLocationContext();
  console.log(
    "🚀 ~ file: PencarianLokasiScreen.jsx:40 ~ userRecentSearchedLocation:",
    userRecentSearchedLocation
  );

  // ======================================================================================================

  const [isManualPostalCodeAutoComplete, setIsManualPostalCodeAutoComplete] =
    useState(false);

  const onLocationSearchSelected = async (location) => {
    try {
      params?.config?.validateLokasiOnSelect?.(location.Title);

      const result = await handleSelectSearchResult(location);

      // If districtData is automatically filled, then immediately navigate to FormLokasiBongkarMuat
      if (result?.district?.value) {
        params?.config?.afterLocationSelected?.();
      }
      // If districtData is not automatically filled, then mark it as manual postal code, handle it later when user filled the postal code
      else {
        setIsManualPostalCodeAutoComplete(true);
      }
    } catch (error) {
      console.log("Error selecting search result", error);
    }
  };

  useShallowCompareEffect(() => {
    // If districtData has been filled, then navigate to FormLokasiBongkarMuat
    if (districtData && isManualPostalCodeAutoComplete) {
      params?.config?.afterLocationSelected?.();
    }
  }, [districtData, isManualPostalCodeAutoComplete]);

  // ======================================================================================================

  const [isManualPostalCodeGPS, setIsManualPostalCodeGPS] = useState(false);

  const onGetCurrentLocation = async () => {
    try {
      const result = await handleGetCurrentLocation();

      // If districtData is automatically filled, then immediately navigate to FormLokasiBongkarMuat
      if (result?.district?.value) {
        params?.config?.validateLokasiOnSelect?.(result.location.name);
        navigation.push("/PinPointMap", { ...params });
      }
      // If districtData is not automatically filled, then mark it as manual postal code, handle it later when user filled the postal code
      else {
        setIsManualPostalCodeGPS(true);
      }
    } catch (error) {
      console.log("Error getting current location", error);
    }
  };

  useShallowCompareEffect(() => {
    // If districtData has been filled, then navigate to FormLokasiBongkarMuat
    if (districtData && isManualPostalCodeGPS) {
      try {
        params?.config?.validateLokasiOnSelect?.(dataAddress);
        navigation.push("/PinPointMap", { ...params });
      } catch (error) {
        console.log("Error getting current location", error);
      }
    }
  }, [districtData, dataAddress, isManualPostalCodeGPS]);

  // ======================================================================================================

  const [isManualPostalCodeSaveLocation, setIsManualPostalCodeSaveLocation] =
    useState(false);

  const onAddSearchToSavedLocation = (location) => {
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

  // ======================================================================================================

  const onAddRecentLocationToSavedLocation = (location) => {
    handleSelectRecentLocation(location);
    navigation.push("/FormSimpanLokasi", {
      ...params,
      layout: { title: "Tambah Lokasi" },
      mode: "add",
    });
  };

  // ======================================================================================================

  const onSelectUserSavedLocation = (location) => {
    try {
      params?.config?.validateLokasiOnSelect?.(location.Address);
      handleSelectUserSavedLocation(location);
      params?.config?.afterLocationSelected?.();
    } catch (error) {
      console.log("Error selecting user saved location", error);
    }
  };

  const onSelectRecentLocation = (location) => {
    try {
      params?.config?.validateLokasiOnSelect?.(location.pencarian);
      handleSelectRecentLocation(location);
      params?.config?.afterLocationSelected?.();
    } catch (error) {
      console.log("Error selecting user saved location", error);
    }
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

  const { setField: setLocationField, reset: resetLocationForm } =
    useLocationFormStore();
  const hasInit = useRef(false);
  useEffect(() => {
    // Reset only location-related fields when component is mounted
    // This preserves other fields like namaPIC and noHPPIC that user might have filled
    if (!hasInit.current) {
      // Reset only location-specific fields, keep PIC info intact
      setLocationField("dataLokasi", null);
      setLocationField("detailLokasi", "");
      setLocationField("namaLokasi", "");
      resetLocationContext();

      hasInit.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { t } = useTranslation();

  return (
    <SearchBarResponsiveLayout
      placeholder={t("placeholderCariLokasi") /* Cari Lokasi */}
    >
      <div className="flex h-full flex-col gap-5 px-4 py-5">
        {autoCompleteSearchResult && autoCompleteSearchPhrase ? (
          <div className="flex h-full flex-col gap-4">
            {autoCompleteSearchResult.length > 0 ? (
              <>
                <h3 className="text-sm font-bold text-neutral-700">
                  {t("titleHasilPencarian") /* Hasil Pencarian */}
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
                          onAddSearchToSavedLocation(location);
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
                  {t("messageKeywordNotFoundLine1") /* Keyword */}
                  <br />
                  {t("messageKeywordNotFoundLine2") /* Tidak Ditemukan */}
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
              />
              <h2 className="text-sm font-semibold text-primary-700">
                {t("buttonPilihLokasi") /* Pilih Lokasi */}
              </h2>
            </button>

            {userRecentSearchedLocation.length > 0 ? (
              <>
                <div className="h-px w-full bg-neutral-400"></div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-neutral-700">
                    {t("titlePencarianTerakhir") /* Pencarian Terakhir */}
                  </h3>

                  <div className="flex flex-col gap-3">
                    {userRecentSearchedLocation.map((location, index) => (
                      <SearchResultItem
                        key={index}
                        location={{
                          Title: location.pencarian,
                        }}
                        onClick={() => onSelectRecentLocation(location)}
                        withBookmark={{
                          onClick: (e) => {
                            e.stopPropagation();
                            onAddRecentLocationToSavedLocation(location);
                          },
                        }}
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            {userSavedLocationResult.length > 0 ? (
              <>
                <div className="h-px w-full bg-neutral-400" />
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-neutral-700">
                    {t("titleManajemenLokasi") /* Manajemen Lokasi */}
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
                    {
                      t(
                        "buttonLihatManajemenLokasi"
                      ) /* Lihat Manajemen Lokasi */
                    }
                  </button>
                </div>
              </>
            ) : null}

            {userRecentTransactionLocation.length > 0 ? (
              <>
                <div className="h-px w-full bg-neutral-400"></div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-neutral-700">
                    {t("titleTransaksiTerakhir") /* Transaksi Terakhir */}
                  </h3>

                  <div className="flex flex-col gap-3">
                    {userRecentTransactionLocation.map((location, index) => (
                      <SearchResultItem
                        key={index}
                        location={{
                          Title: location.pencarian,
                        }}
                        onClick={() => onSelectRecentLocation(location)}
                        withBookmark={{
                          onClick: (e) => {
                            e.stopPropagation();
                            onAddRecentLocationToSavedLocation(location);
                          },
                        }}
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </>
        )}
        <ModalPostalCodeResponsive />
      </div>
    </SearchBarResponsiveLayout>
  );
};

export default PencarianLokasiScreen;

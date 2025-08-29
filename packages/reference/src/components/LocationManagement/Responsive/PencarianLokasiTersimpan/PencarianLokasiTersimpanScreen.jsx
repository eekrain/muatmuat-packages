import { useEffect, useMemo, useRef } from "react";

import { normalizeUserSavedLocation } from "@/hooks/use-location/normalizer";
import { useLocationContext } from "@/hooks/use-location/use-location";
import { useTranslation } from "@/hooks/use-translation";

import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";

import SearchBarResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/SearchBarResponsiveLayout";
import { useResponsiveSearchStore } from "@/store/Shipper/zustand/responsiveSearchStore";

import { SavedLocationItem } from "../PencarianLokasi/SavedLocationItem";

const PencarianLokasiTersimpanScreen = () => {
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();
  const { searchValue, setSearchValue } = useResponsiveSearchStore();
  const { t } = useTranslation();

  const { userSavedLocationResult, handleSelectUserSavedLocation } =
    useLocationContext();

  const filteredUserSavedLocations = useMemo(() => {
    if (!userSavedLocationResult) return [];
    return userSavedLocationResult.filter(
      (item) =>
        item.Name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.Address.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, userSavedLocationResult]);

  const hasInit = useRef(false);
  useEffect(() => {
    if (!hasInit.current) {
      setSearchValue("");
      hasInit.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelected = (location) => {
    handleSelectUserSavedLocation(
      location,
      params.config?.needValidateLocationChange
    );
    navigation.push("/FormLokasiBongkarMuat", { ...params });
  };

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
        title: t("buttonUbahLokasi") /* Ubah Lokasi */,
      },
    });
  };

  return (
    <SearchBarResponsiveLayout
      placeholder={
        t("placeholderCariLokasiYangDisimpan") /* Cari Lokasi yang Disimpan */
      }
    >
      <div className="grid gap-5 px-4 py-5">
        {/* Location Management Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-neutral-700">
            {t("titleManajemenLokasi") /* Manajemen Lokasi */}
          </h3>

          <div className="flex flex-col gap-3">
            {filteredUserSavedLocations.map((location, index) => (
              <SavedLocationItem
                key={location.ID}
                location={location}
                onClick={onSelected}
                withEdit={{
                  onClick: (e) => {
                    e.stopPropagation();
                    handleEditSavedLocation(location);
                  },
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </SearchBarResponsiveLayout>
  );
};

export default PencarianLokasiTersimpanScreen;

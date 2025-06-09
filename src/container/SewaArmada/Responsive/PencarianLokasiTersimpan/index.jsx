import { useEffect, useMemo, useRef } from "react";

import { LocationProvider, useLocationContext } from "@/hooks/use-location";
import SearchBarResponsiveLayout from "@/layout/ResponsiveLayout/SearchBarResponsiveLayout";
import { normalizeUserSavedLocation } from "@/lib/normalizers";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
  useResponsiveSearch,
} from "@/lib/responsive-navigation";

import { SavedLocationItem } from "../PencarianLokasi/SavedLocationItem";

const InnerPencarianLokasiTersimpan = () => {
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();
  const { searchValue, setSearchValue } = useResponsiveSearch();

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
  }, []);

  const onSelected = (location) => {
    handleSelectUserSavedLocation(location);
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
        title: "Ubah Lokasi",
      },
    });
  };

  return (
    <SearchBarResponsiveLayout placeholder="Cari Lokasi yang Disimpan">
      <div className="grid gap-5 px-4 py-5">
        {/* Location Management Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-neutral-700">
            Manajemen Lokasi
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

export const PencarianLokasiTersimpan = () => {
  return (
    <LocationProvider>
      <InnerPencarianLokasiTersimpan />
    </LocationProvider>
  );
};

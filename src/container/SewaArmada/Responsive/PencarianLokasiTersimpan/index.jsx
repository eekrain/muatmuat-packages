import { useMemo } from "react";

import { useLocation } from "@/hooks/use-location";
import SearchBarResponsiveLayout from "@/layout/ResponsiveLayout/SearchBarResponsiveLayout";
import {
  useResponsiveNavigation,
  useResponsiveSearch,
} from "@/lib/responsive-navigation";
import { useLocationFormStore } from "@/store/forms/locationFormStore";

import { SavedLocationItem } from "../PencarianLokasi/SavedLocationItem";

export const PencarianLokasiTersimpan = () => {
  const navigation = useResponsiveNavigation();
  const { searchValue } = useResponsiveSearch();
  const {
    formValues,
    formErrors,
    setField,
    setLocationPartial,
    validateForm,
    reset,
  } = useLocationFormStore();

  const { userSavedLocations, handleSelectUserSavedLocation } = useLocation({
    onAddressSelected: (data) => {
      setField("dataLokasi", data);
    },
    setPICName: (name) => {
      setField("namaPIC", name);
    },
    setNoHPPIC: (noHPPIC) => {
      setField("noHPPIC", noHPPIC);
    },
    setLocationPartial,
  });

  const filteredUserSavedLocations = useMemo(() => {
    if (!userSavedLocations) return [];
    return userSavedLocations.filter(
      (item) =>
        item.Name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.Address.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, userSavedLocations]);

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
                onClick={(location) => {
                  handleSelectUserSavedLocation(location);
                  navigation.pop();
                  navigation.pop();
                }}
                withEdit={{
                  onClick: (e) => {
                    e.stopPropagation();
                    alert("kocak");
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

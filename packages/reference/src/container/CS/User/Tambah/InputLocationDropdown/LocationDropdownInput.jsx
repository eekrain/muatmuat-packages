import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import { Modal, ModalContent } from "@/components/Modal/Modal";

import { useLocationSearch } from "@/hooks/use-location/use-location-search";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";

import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";

import { LocationDropdown } from "./LocationDropdown";
import { SearchPostal } from "./SearchPostal";

const defaultModalConfig = {
  open: false,
  mode: "add",
  title: "Detail Alamat",
  defaultValues: null,
};

const useModalFormSimpanLokasiWeb = ({
  setIsDropdownSearchOpen,
  handleSelectSearchResult,
}) => {
  const [modalConfig, setModalConfig] = useState(defaultModalConfig);

  const districtData = useLocationFormStore(
    (s) => s.formValues.dataLokasi?.district
  );
  const [isManualPostalCode, setIsManualPostalCode] = useState(false);

  const handleCloseModalFormSimpanLokasiWeb = () =>
    setModalConfig(defaultModalConfig);

  const handleAddToSavedLocation = (location) => {
    setIsDropdownSearchOpen(false);

    handleSelectSearchResult(location).then((result) => {
      if (result?.district?.value) {
        setModalConfig({
          open: true,
          mode: "add",
          title: "Detail Alamat",
          defaultValues: null,
        });
      } else {
        setIsManualPostalCode(true);
      }
    });
  };

  const handleEditLocation = (location) => {
    setIsDropdownSearchOpen(false);
    setModalConfig({
      open: true,
      mode: "edit",
      title: "Detail Alamat",
      defaultValues: location,
    });
  };

  useShallowCompareEffect(() => {
    if (districtData && isManualPostalCode) {
      setModalConfig({
        open: true,
        mode: "add",
        title: "Detail Alamat",
        defaultValues: null,
      });
    }
  }, [districtData, isManualPostalCode]);

  return {
    configFormSimpanLokasi: modalConfig,
    handleAddToSavedLocation,
    handleEditLocation,
    handleCloseModalFormSimpanLokasiWeb,
  };
};

export const LocationDropdownInput = ({
  errorMessage,
  markerIcon,
  placeholder,
  needValidateLocationChange,
  showClearButton = false,
  value,
  onSelectLocation,
  autoCompleteSearchPhrase,
  setAutoCompleteSearchPhrase,
  autoCompleteSearchResult,
  isDropdownSearchOpen,
  setIsDropdownSearchOpen,
  handleSelectSearchResult,
  handleGetCurrentLocation,
  userSavedLocationResult,
  handleSelectUserSavedLocation,
  portalContainer,
  onInputClick,
  onResolvedLocation,
  onInputChange,
}) => {
  const [setIsModalSavedLocationManagementOpen] = useState(false);

  useEffect(() => {
    if (value) {
      setAutoCompleteSearchPhrase(value);
    }
  }, [value, setAutoCompleteSearchPhrase]);

  const { handleAddToSavedLocation, handleEditLocation } =
    useModalFormSimpanLokasiWeb({
      setIsDropdownSearchOpen,
      handleSelectSearchResult,
    });

  return (
    <>
      <LocationDropdown
        className="mt-0"
        isDropdownSearchOpen={isDropdownSearchOpen}
        setIsDropdownSearchOpen={setIsDropdownSearchOpen}
        locationAutoCompleteResult={autoCompleteSearchResult}
        onInputClick={onInputClick} // <-- Teruskan prop
        onInputChange={onInputChange} // <-- Teruskan prop
        onSelectSearchResult={(location) => {
          // Panggil handler dari props
          handleSelectSearchResult(location, needValidateLocationChange).then(
            (result) => {
              // Panggil onSelectLocation untuk memberitahu form
              if (result && onSelectLocation) {
                onSelectLocation(result);
              }
            }
          );
        }}
        userSavedLocations={userSavedLocationResult}
        searchLocationAutoComplete={autoCompleteSearchPhrase}
        setSearchLocationAutoComplete={setAutoCompleteSearchPhrase}
        handleGetCurrentLocation={handleGetCurrentLocation}
        handleSelectUserSavedLocation={handleSelectUserSavedLocation}
        onLocationManagementClicked={() => {
          setIsModalSavedLocationManagementOpen(true);
          setIsDropdownSearchOpen(false);
        }}
        handleAddToSavedLocation={handleAddToSavedLocation}
        handleEditLocation={handleEditLocation}
        errorMessage={errorMessage}
        markerIcon={markerIcon}
        placeholder={placeholder}
        needValidateLocationChange={needValidateLocationChange}
        showClearButton={showClearButton}
        portalContainer={portalContainer}
        onResolvedLocation={onResolvedLocation}
      />
    </>
  );
};

import { useState } from "react";

import { useLocationContext } from "@/hooks/use-location/use-location";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";

import { LocationDropdown } from "./LocationDropdown";
import { ModalPostalCode } from "./ModalPostalCode";

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
}) => {
  const [setIsModalSavedLocationManagementOpen] = useState(false);

  const {
    autoCompleteSearchPhrase,
    autoCompleteSearchResult,
    isDropdownSearchOpen,
    setIsDropdownSearchOpen,
    handleSelectSearchResult,
    setAutoCompleteSearchPhrase,

    handleGetCurrentLocation,

    isModalPostalCodeOpen,
    setIsModalPostalCodeOpen, // ✅ tambahkan
    locationPostalCodeSearchPhrase,
    setLocationPostalCodeSearchPhrase,
    postalCodeAutoCompleteResult,
    handleSelectPostalCode,

    userSavedLocationResult,
    handleSelectUserSavedLocation,
  } = useLocationContext();

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
        onSelectSearchResult={handleSelectSearchResult}
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
      />

      <ModalPostalCode
        open={isModalPostalCodeOpen}
        setOpen={setIsModalPostalCodeOpen} // ✅ dikirim ke modal
        searchValue={locationPostalCodeSearchPhrase}
        setSearchValue={setLocationPostalCodeSearchPhrase}
        options={postalCodeAutoCompleteResult}
        onSelectPostalCode={handleSelectPostalCode}
        needValidateLocationChange={needValidateLocationChange}
      />
    </>
  );
};

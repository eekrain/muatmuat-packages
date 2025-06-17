import { useState } from "react";

import { useLocationContext } from "@/hooks/use-location/use-location";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useLocationFormStore } from "@/store/forms/locationFormStore";

import { LocationDropdownOnly } from "./LocationDropdownOnly";
import { ModalFormSimpanLokasiWeb } from "./ModalFormSimpanLokasiWeb";
import { ModalPostalCode } from "./ModalPostalCode";
import { ModalSavedLocationManagement } from "./ModalSavedLocationManagement";

const defaultModalConfig = {
  open: false,
  mode: "add",
  title: "Detail Alamat",
  defaultValues: null,
};

const useModalFormSimpanLokasiWeb = ({
  setIsDropdownSearchOpen,
  handleSelectSearchResult,
  withSupportiveData = false,
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
      console.log("🚀 ~ handleSelectSearchResult ~ result:", result);
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

  useShallowCompareEffect(() => {
    // If districtData has been filled, then navigate to FormLokasiBongkarMuat
    if (districtData && isManualPostalCode) {
      console.log("🚀 ~ useShallowCompareEffect ~ districtData:", districtData);
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
    handleCloseModalFormSimpanLokasiWeb,
  };
};

export const InputLocationManagementDropdown = ({
  hideDropdownWhenTopIsLessThan,
}) => {
  const [
    isModalSavedLocationManagementOpen,
    setIsModalSavedLocationManagementOpen,
  ] = useState(false);

  const {
    autoCompleteSearchPhrase,
    autoCompleteSearchResult,
    isDropdownSearchOpen,
    setIsDropdownSearchOpen,
    handleSelectSearchResult,
    setAutoCompleteSearchPhrase,

    handleGetCurrentLocation,

    isModalPostalCodeOpen,
    locationPostalCodeSearchPhrase,
    setLocationPostalCodeSearchPhrase,
    postalCodeAutoCompleteResult,
    handleSelectPostalCode,

    userSavedLocationResult,
    handleSelectUserSavedLocation,
  } = useLocationContext();

  const {
    configFormSimpanLokasi,
    handleAddToSavedLocation,
    handleCloseModalFormSimpanLokasiWeb,
  } = useModalFormSimpanLokasiWeb({
    setIsDropdownSearchOpen,
    handleSelectSearchResult,
  });

  // useEffect(() => {
  //   // Untuk menghapus data lokasi jika user menghapus text di inputan
  //   if (!searchLocationAutoComplete) onAddressSelected(null);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchLocationAutoComplete]);

  return (
    <>
      <LocationDropdownOnly
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
        hideDropdownWhenTopIsLessThan={hideDropdownWhenTopIsLessThan}
      />

      <ModalPostalCode
        open={isModalPostalCodeOpen}
        searchValue={locationPostalCodeSearchPhrase}
        setSearchValue={setLocationPostalCodeSearchPhrase}
        options={postalCodeAutoCompleteResult}
        onSelectPostalCode={handleSelectPostalCode}
      />

      <ModalSavedLocationManagement
        open={isModalSavedLocationManagementOpen}
        onOpenChange={setIsModalSavedLocationManagementOpen}
        userSavedLocations={userSavedLocationResult}
        handleSelectUserSavedLocation={handleSelectUserSavedLocation}
      />

      <ModalFormSimpanLokasiWeb
        {...configFormSimpanLokasi}
        onOpenChange={handleCloseModalFormSimpanLokasiWeb}
      />
    </>
  );
};

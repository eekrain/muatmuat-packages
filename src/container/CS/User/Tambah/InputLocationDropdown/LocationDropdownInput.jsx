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
}) => {
  const [setIsModalSavedLocationManagementOpen] = useState(false);
  const [errorMessagePostalCode, setErrorMessagePostalCode] = useState("");

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
  } = useLocationSearch({ onSelectLocation });

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
        showClearButton={showClearButton}
      />

      <Modal
        open={isModalPostalCodeOpen}
        onOpenChange={setIsModalPostalCodeOpen}
        closeOnOutsideClick={false}
        withCloseButton={false}
      >
        <ModalContent>
          <div className="relative w-[472px] space-y-6 p-6">
            <div className="text-center text-sm font-bold">
              Cari Kelurahan/Kecamatan/Kode Pos
            </div>
            <div className="min-h-[1px] w-full border border-solid border-stone-300 bg-stone-300" />

            <SearchPostal
              name="search"
              placeholder="Cari Kelurahan/Kecamatan/Kode Pos"
              searchValue={locationPostalCodeSearchPhrase}
              setSearchValue={setLocationPostalCodeSearchPhrase}
              icon={{ left: "/icons/search.svg" }}
              options={postalCodeAutoCompleteResult}
              getOptionLabel={(option) => option.Description}
              onSelectValue={(val) =>
                handleSelectPostalCode(val, needValidateLocationChange)
              }
              errorMessage={errorMessagePostalCode}
            />
          </div>

          <div className="flex items-center justify-center gap-2 pb-4">
            {/* Button Batalkan */}
            <Button
              variant="muattrans-primary-secondary"
              onClick={() => {
                setLocationPostalCodeSearchPhrase("");
                setErrorMessagePostalCode("");
                setIsModalPostalCodeOpen(false); // ✅ tutup modal
              }}
            >
              Batal
            </Button>

            {/* Button Simpan */}
            <Button
              variant="muattrans-primary"
              onClick={() => {
                if (!locationPostalCodeSearchPhrase) {
                  setErrorMessagePostalCode(
                    "Kelurahan/Kecamatan/Kode Pos wajib diisi"
                  );
                } else {
                  setErrorMessagePostalCode("");
                  handleSelectPostalCode(
                    locationPostalCodeSearchPhrase,
                    needValidateLocationChange
                  );
                  setIsModalPostalCodeOpen(false); // ✅ tutup modal setelah simpan juga
                }
              }}
            >
              Simpan
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

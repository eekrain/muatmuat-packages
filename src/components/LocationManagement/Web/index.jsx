//  dependencies:
// npm install zustand react-google-maps/api
import { useEffect, useRef, useState } from "react";

import { Modal, ModalContent } from "@/components/Modal/Modal";
import { LocationProvider, useLocationContext } from "@/hooks/use-location";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { cn } from "@/lib/utils";
import { useLocationFormStore } from "@/store/forms/locationFormStore";

import { MapContainer } from "../../MapContainer/MapContainer";
import { InputLocationManagementDropdown } from "./InputLocationManagementDropdown";
import ModalFormSimpanLokasiWeb from "./ModalFormSimpanLokasiWeb";
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
  getLocationByPlaceId,
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

const InnerLocationModalFormWeb = ({
  formMode = "muat",
  open,
  onSubmit = () => {},
  onOpenChange = () => {},
  defaultValues,
  index,
}) => {
  const [
    isModalSavedLocationManagementOpen,
    setIsModalSavedLocationManagementOpen,
  ] = useState(false);

  const { formValues, formErrors, setField, validateLokasiBongkarMuat, reset } =
    useLocationFormStore();

  const {
    autoCompleteSearchPhrase,
    autoCompleteSearchResult,
    isDropdownSearchOpen,
    setIsDropdownSearchOpen,
    handleSelectSearchResult,
    setAutoCompleteSearchPhrase,

    coordinates,
    setCoordinates,
    handleGetCurrentLocation,

    isModalPostalCodeOpen,
    locationPostalCodeSearchPhrase,
    setLocationPostalCodeSearchPhrase,
    postalCodeAutoCompleteResult,
    handleSelectPostalCode,

    userSavedLocationResult,
    handleSelectUserSavedLocation,

    getLocationByPlaceId,
  } = useLocationContext();

  const {
    configFormSimpanLokasi,
    handleAddToSavedLocation,
    handleCloseModalFormSimpanLokasiWeb,
  } = useModalFormSimpanLokasiWeb({
    setIsDropdownSearchOpen,
    getLocationByPlaceId,
    handleSelectSearchResult,
  });

  // useEffect(() => {
  //   // Untuk menghapus data lokasi jika user menghapus text di inputan
  //   if (!searchLocationAutoComplete) onAddressSelected(null);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchLocationAutoComplete]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const isFormValid = validateLokasiBongkarMuat(formMode, index);
    if (!isFormValid) return;

    onSubmit(formValues);
    setAutoCompleteSearchPhrase("");
    setLocationPostalCodeSearchPhrase("");
    onOpenChange(false);
  };

  const hasInit = useRef(false);
  useEffect(() => {
    if (open && !hasInit.current) {
      // This is for the first time the modal is opened
      if (defaultValues) {
        // If there is default values, set the search location auto complete and postal code, and reset the form with the default values
        setAutoCompleteSearchPhrase(defaultValues.dataLokasi.location.name);
        setLocationPostalCodeSearchPhrase(
          defaultValues.dataLokasi.postalCode?.value
        );
        reset(defaultValues);
      }
      hasInit.current = true;
    } else if (!open && hasInit.current) {
      // This is for handling when the modal is closed
      // Reset the form and the search location auto complete and postal code
      reset();
      setAutoCompleteSearchPhrase("");
      setLocationPostalCodeSearchPhrase("");
      hasInit.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultValues]);

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        closeOnOutsideClick={false}
      >
        <ModalContent>
          <div className="h-[420px] w-[919px]">
            <div className="flex h-full w-full flex-row items-center gap-4 p-4">
              <MapContainer
                viewOnly={false}
                coordinates={coordinates}
                onPositionChange={setCoordinates}
                className="h-[380px] w-[604px]"
              />

              <div className="w-full flex-1">
                <h2 className="h-[43px] text-base font-semibold">
                  {formMode === "muat" ? "Lokasi Muat" : "Lokasi Bongkar"}
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="flex h-[calc(380px-43px)] flex-col gap-4 overflow-y-auto"
                >
                  <div className="w-full">
                    <label className="block text-[12px] font-medium text-neutral-600">
                      {formMode === "muat" ? "Lokasi Muat*" : "Lokasi Bongkar*"}
                    </label>
                    <InputLocationManagementDropdown
                      isDropdownSearchOpen={isDropdownSearchOpen}
                      setIsDropdownSearchOpen={setIsDropdownSearchOpen}
                      locationAutoCompleteResult={autoCompleteSearchResult}
                      onSelectSearchResult={handleSelectSearchResult}
                      userSavedLocations={userSavedLocationResult}
                      searchLocationAutoComplete={autoCompleteSearchPhrase}
                      setSearchLocationAutoComplete={
                        setAutoCompleteSearchPhrase
                      }
                      handleGetCurrentLocation={handleGetCurrentLocation}
                      handleSelectUserSavedLocation={
                        handleSelectUserSavedLocation
                      }
                      onLocationManagementClicked={() => {
                        setIsModalSavedLocationManagementOpen(true);
                        setIsDropdownSearchOpen(false);
                      }}
                      handleAddToSavedLocation={handleAddToSavedLocation}
                    />
                    {formErrors?.dataLokasi && (
                      <span className="text-xs font-medium text-red-500">
                        {formErrors?.dataLokasi}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-neutral-600">
                      Detail Lokasi (Optional)
                    </label>
                    <textarea
                      value={formValues.detailLokasi}
                      onChange={(e) => setField("detailLokasi", e.target.value)}
                      placeholder="Masukkan Detail Lokasi"
                      className={cn(
                        "w-full rounded-[6px] border p-2 text-xs font-medium",
                        formErrors?.detailLokasi && "border-red-500"
                      )}
                      maxLength={500}
                      rows={4}
                    />
                    {formErrors?.detailLokasi && (
                      <span className="text-xs font-medium text-red-500">
                        {formErrors?.detailLokasi}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-neutral-600">
                      Nama PIC{" "}
                      {formMode === "muat" ? "Lokasi Muat" : "Lokasi Bongkar"}*
                    </label>
                    <input
                      type="text"
                      value={formValues.namaPIC}
                      onChange={(e) => setField("namaPIC", e.target.value)}
                      placeholder="Masukkan Nama PIC Lokasi Muat"
                      className={cn(
                        "w-full rounded-[6px] border p-2 text-xs font-medium",
                        formErrors?.namaPIC && "border-red-500"
                      )}
                    />
                    {formErrors?.namaPIC && (
                      <span className="text-xs font-medium text-red-500">
                        {formErrors?.namaPIC}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-neutral-600">
                      No. HP PIC{" "}
                      {formMode === "muat" ? "Lokasi Muat" : "Lokasi Bongkar"}*
                    </label>
                    <input
                      type="number"
                      value={formValues.noHPPIC}
                      onChange={(e) => {
                        const val = e.currentTarget.value;
                        if (val.length > 14) return;
                        setField("noHPPIC", val);
                      }}
                      placeholder="Masukkan No. HP PIC Lokasi Muat"
                      className={cn(
                        "w-full rounded-[6px] border p-2 text-xs font-medium",
                        formErrors?.noHPPIC && "border-red-500"
                      )}
                    />
                    {formErrors?.noHPPIC && (
                      <span className="text-xs font-medium text-red-500">
                        {formErrors?.noHPPIC}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="rounded-[6px] bg-blue-600 py-2 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    Simpan
                  </button>
                </form>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>

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

export const LocationModalFormWeb = (props) => {
  return (
    <LocationProvider>
      <InnerLocationModalFormWeb {...props} />
    </LocationProvider>
  );
};

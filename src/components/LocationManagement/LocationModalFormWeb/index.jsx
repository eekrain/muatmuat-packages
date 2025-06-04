//  dependencies:
// npm install zustand react-google-maps/api
import { useEffect, useRef } from "react";

import { Modal, ModalContent } from "@/components/Modal/Modal";
import { useLocation } from "@/hooks/use-location";
import { cn } from "@/lib/cn";
import { useLocationFormStore } from "@/store/forms/locationFormStore";

import { InputLocationManagementDropdown } from "./InputLocationManagementDropdown";
import { MapContainer } from "./MapContainer";
import { ModalPostalCode } from "./ModalPostalCode";
import { ModalSavedLocationManagement } from "./ModalSavedLocationManagement";

export const LocationModalFormWeb = ({
  formMode = "muat",
  open,
  onSubmit = () => {},
  onOpenChange = () => {},
  allSelectedLocations = [],
  defaultValues,
  index,
}) => {
  const {
    formValues,
    formErrors,
    setField,
    setLocationCoordinatesOnly,
    validateForm,
    reset,
  } = useLocationFormStore();
  const hasInit = useRef(false);

  const {
    locationAutoCompleteResult,
    onSelectAutoComplete,
    userSavedLocations,
    searchLocationAutoComplete,
    setSearchLocationAutoComplete,

    isModalPostalCodeOpen,
    searchLocationByPostalCode,
    setSearchLocationByPostalCode,
    postalCodeAutoCompleteResult,
    onSelectPostalCode,

    coordinates,
    setCoordinates,
    handleGetCurrentLocation,
    isDropdownOpen,
    setIsDropdownOpen,

    handleSelectUserSavedLocation,
    isModalSavedLocationManagementOpen,
    setIsModalSavedLocationManagementOpen,
  } = useLocation({
    onAddressSelected: (data) => {
      setField("dataLokasi", data);
    },
    setPICName: (name) => {
      setField("namaPIC", name);
    },
    setNoHPPIC: (noHPPIC) => {
      setField("noHPPIC", noHPPIC);
    },
    setLocationCoordinatesOnly,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const isFormValid = validateForm(formMode, allSelectedLocations, index);
    if (!isFormValid) return;

    onSubmit(formValues);
    setSearchLocationAutoComplete("");
    setSearchLocationByPostalCode("");
    onOpenChange(false);
  };

  useEffect(() => {
    if (open && !hasInit.current) {
      // This is for the first time the modal is opened
      if (defaultValues) {
        // If there is default values, set the search location auto complete and postal code, and reset the form with the default values
        setSearchLocationAutoComplete(defaultValues.dataLokasi.location.name);
        setSearchLocationByPostalCode(
          defaultValues.dataLokasi.postalCode?.value
        );
        reset(defaultValues);
      }
      hasInit.current = true;
    } else if (!open && hasInit.current) {
      // This is for handling when the modal is closed
      // Reset the form and the search location auto complete and postal code
      reset();
      setSearchLocationAutoComplete("");
      setSearchLocationByPostalCode("");
      hasInit.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultValues]);

  return (
    <>
      <Modal open={open} onOpenChange={onOpenChange} closeOnOutsideClick>
        <ModalContent>
          <div className="h-[420px] w-[919px]">
            <div className="flex h-full w-full flex-row items-center gap-4 p-4">
              <MapContainer
                viewOnly={false}
                width={604}
                height={380}
                coordinates={coordinates}
                onPositionChange={setCoordinates}
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
                      locationAutoCompleteResult={locationAutoCompleteResult}
                      onSelectAutoComplete={onSelectAutoComplete}
                      userSavedLocations={userSavedLocations}
                      searchLocationAutoComplete={searchLocationAutoComplete}
                      setSearchLocationAutoComplete={
                        setSearchLocationAutoComplete
                      }
                      handleGetCurrentLocation={handleGetCurrentLocation}
                      isDropdownOpen={isDropdownOpen}
                      setIsDropdownOpen={setIsDropdownOpen}
                      handleSelectUserSavedLocation={
                        handleSelectUserSavedLocation
                      }
                      onLocationManagementClicked={() => {
                        setIsModalSavedLocationManagementOpen(true);
                        setIsDropdownOpen(false);
                      }}
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
                      onChange={(e) => setField("noHPPIC", e.target.value)}
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
        searchValue={searchLocationByPostalCode}
        setSearchValue={setSearchLocationByPostalCode}
        options={postalCodeAutoCompleteResult}
        onSelectPostalCode={onSelectPostalCode}
        onLocationManagementClicked={() =>
          setIsModalSavedLocationManagementOpen(true)
        }
      />

      <ModalSavedLocationManagement
        open={isModalSavedLocationManagementOpen}
        onOpenChange={setIsModalSavedLocationManagementOpen}
        userSavedLocations={userSavedLocations}
        handleSelectUserSavedLocation={handleSelectUserSavedLocation}
      />
    </>
  );
};

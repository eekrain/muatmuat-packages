//  dependencies:
// npm install zustand react-google-maps/api
import { useEffect, useRef } from "react";

import Input from "@/components/Form/Input";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import {
  LocationProvider,
  useLocationContext,
} from "@/hooks/use-location/use-location";
import { cn } from "@/lib/utils";
import { useLocationFormStore } from "@/store/forms/locationFormStore";

import { MapContainer } from "../../../MapContainer/MapContainer";
import { InputLocationManagementDropdown } from "../InputLocationManagementDropdown/InputLocationManagementDropdown";

const InnerLocationModalFormWeb = ({
  formMode = "muat",
  open,
  onSubmit = () => {},
  onOpenChange = () => {},
  defaultValues,
  index,
}) => {
  const {
    formValues,
    formErrors,
    setField,
    validateLokasiBongkarMuat,
    reset: resetForm,
  } = useLocationFormStore();

  const {
    setAutoCompleteSearchPhrase,

    coordinates,
    handleChangeMarkerCoordinates,

    setLocationPostalCodeSearchPhrase,

    resetLocationContext,
  } = useLocationContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    const isFormValid = validateLokasiBongkarMuat(formMode, index);
    if (!isFormValid) return;

    onSubmit(formValues);
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
        resetForm(defaultValues);
      }
      hasInit.current = true;
    } else if (!open && hasInit.current) {
      // This is for handling when the modal is closed
      // Reset the form and the search location auto complete and postal code
      resetForm();
      resetLocationContext();
      hasInit.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultValues]);

  return (
    <Modal open={open} onOpenChange={onOpenChange} closeOnOutsideClick={false}>
      <ModalContent>
        <div className="h-[420px] w-[919px]">
          <div className="flex h-full w-full flex-row items-center gap-4 p-4">
            <MapContainer
              viewOnly={false}
              coordinates={coordinates}
              onPositionChange={handleChangeMarkerCoordinates}
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
                    hideDropdownWhenTopIsLessThan={415}
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
                      "w-full rounded-[6px] border p-2 text-xs font-medium outline-none",
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
                  <Input
                    value={formValues.namaPIC}
                    placeholder="Masukkan Nama PIC Lokasi Muat"
                    onChange={(e) => setField("namaPIC", e.target.value)}
                    errorMessage={formErrors?.namaPIC}
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-neutral-600">
                    No. HP PIC{" "}
                    {formMode === "muat" ? "Lokasi Muat" : "Lokasi Bongkar"}*
                  </label>
                  <Input
                    type="number"
                    value={formValues.noHPPIC}
                    onChange={(e) => {
                      const val = e.currentTarget.value;
                      if (val.length > 14) return;
                      setField("noHPPIC", val);
                    }}
                    placeholder="Masukkan No. HP PIC Lokasi Muat"
                    errorMessage={formErrors?.noHPPIC}
                  />
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
  );
};

export const LocationModalFormWeb = (props) => {
  return (
    <LocationProvider>
      <InnerLocationModalFormWeb {...props} />
    </LocationProvider>
  );
};

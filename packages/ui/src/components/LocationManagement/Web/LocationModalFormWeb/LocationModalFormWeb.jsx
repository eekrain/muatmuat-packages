//  dependencies:
// npm install zustand react-google-maps/api
import { useEffect, useRef } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Form/Input";
import { MyTextArea } from "@/components/Form/TextArea";
import { Modal, ModalContent } from "@/components/Modal/Modal";

import {
  LocationProvider,
  useLocationContext,
} from "@/hooks/use-location/use-location";
import { useTranslation } from "@/hooks/use-translation";

import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";

import { MapContainer } from "../../../MapContainer/MapContainer";
import { InputLocationManagementDropdown } from "../InputLocationManagementDropdown/InputLocationManagementDropdown";

const InnerLocationModalFormWeb = ({
  formMode = "muat",
  open,
  onSubmit = () => {},
  onOpenChange = () => {},
  defaultValues,
  index,
  needValidateLocationChange,
}) => {
  const { t } = useTranslation();
  const {
    formValues,
    formErrors,
    setField,
    setLastValidLocation,
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
    const isFormValid = validateLokasiBongkarMuat(formMode, index, false);
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
        setLastValidLocation(defaultValues.dataLokasi);
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
    <Modal open={open} onOpenChange={onOpenChange} closeOnOutsideClick>
      <ModalContent type="muatmuat">
        <div className="h-[420px] w-[919px]">
          <div className="flex h-full w-full flex-row items-center gap-4 p-4 pr-0">
            <MapContainer
              viewOnly={false}
              coordinates={coordinates}
              onPositionChange={handleChangeMarkerCoordinates}
              className="h-[380px] w-[604px]"
              markerIcon={
                formMode === "muat"
                  ? "/icons/marker-lokasi-muat.svg"
                  : "/icons/marker-lokasi-bongkar.svg"
              }
            />

            <div className="w-full flex-1 pr-[8px]">
              <h2 className="h-[43px] text-base font-semibold">
                {formMode === "muat"
                  ? t("LocationModalFormWeb.titleMuat", {}, "Lokasi Muat")
                  : t(
                      "LocationModalFormWeb.titleBongkar",
                      {},
                      "Lokasi Bongkar"
                    )}
              </h2>

              <form
                onSubmit={handleSubmit}
                // className="flex h-[calc(380px-43px)] flex-col gap-4 overflow-y-auto"
                className="flex h-[calc(380px-43px)] flex-col gap-4"
              >
                <div className="flex w-full flex-col gap-4 overflow-y-auto pr-[7px]">
                  <div className="w-full">
                    <label className="mb-3 block text-xs font-medium text-neutral-600">
                      {formMode === "muat"
                        ? t(
                            "LocationModalFormWeb.labelLokasiMuat",
                            {},
                            "Lokasi Muat*"
                          )
                        : t(
                            "LocationModalFormWeb.labelLokasiBongkar",
                            {},
                            "Lokasi Bongkar*"
                          )}
                    </label>
                    <InputLocationManagementDropdown
                      needValidateLocationChange={needValidateLocationChange}
                      errorMessage={formErrors?.dataLokasi}
                      markerIcon={
                        formMode === "muat"
                          ? "/icons/marker-lokasi-muat.svg"
                          : "/icons/marker-lokasi-bongkar.svg"
                      }
                      placeholder={
                        formMode === "muat"
                          ? t(
                              "LocationModalFormWeb.placeholderLokasiMuat",
                              {},
                              "Masukkan Lokasi Muat"
                            )
                          : t(
                              "LocationModalFormWeb.placeholderLokasiBongkar",
                              {},
                              "Masukkan Lokasi Bongkar"
                            )
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-3 block text-xs font-medium text-neutral-600">
                      {t(
                        "LocationModalFormWeb.detailLokasi",
                        {},
                        "Detail Lokasi"
                      )}{" "}
                      <i className="font-normal">
                        {t("LocationModalFormWeb.opsional", {}, "(Opsional)")}
                      </i>
                    </label>
                    <MyTextArea
                      value={formValues.detailLokasi}
                      onChange={(e) => setField("detailLokasi", e.target.value)}
                      placeholder={t(
                        "LocationModalFormWeb.placeholderDetailLokasi",
                        {},
                        "Masukkan Detail Lokasi"
                      )}
                      maxLength={500}
                      errorMessage={formErrors?.detailLokasi}
                      appearance={{
                        inputClassName: "resize-none h-[80px]",
                      }}
                      withCharCount
                    />
                  </div>
                  <div>
                    <label className="mb-3 block text-xs font-medium text-neutral-600">
                      {t("LocationModalFormWeb.namaPIC", {}, "Nama PIC")}{" "}
                      {formMode === "muat"
                        ? t(
                            "LocationModalFormWeb.lokasiMuat",
                            {},
                            "Lokasi Muat"
                          )
                        : t(
                            "LocationModalFormWeb.lokasiBongkar",
                            {},
                            "Lokasi Bongkar"
                          )}
                      *
                    </label>
                    <Input
                      value={formValues.namaPIC}
                      placeholder={t(
                        "LocationModalFormWeb.placeholderNamaPICMuat",
                        {},
                        "Masukkan Nama PIC Lokasi Muat"
                      )}
                      onChange={(e) => setField("namaPIC", e.target.value)}
                      errorMessage={formErrors?.namaPIC}
                    />
                  </div>
                  <div>
                    <label className="mb-3 block text-xs font-medium text-neutral-600">
                      {t("LocationModalFormWeb.noHPPIC", {}, "No. HP PIC")}{" "}
                      {formMode === "muat"
                        ? t(
                            "LocationModalFormWeb.lokasiMuat",
                            {},
                            "Lokasi Muat"
                          )
                        : t(
                            "LocationModalFormWeb.lokasiBongkar",
                            {},
                            "Lokasi Bongkar"
                          )}
                      *
                    </label>
                    <Input
                      value={formValues.noHPPIC}
                      onChange={(e) => {
                        const val = e.currentTarget.value;
                        if (val.length > 14) return;
                        setField("noHPPIC", val);
                      }}
                      placeholder={t(
                        "LocationModalFormWeb.placeholderNoHPPIC",
                        {},
                        "Contoh: 08xxxxxxxx"
                      )}
                      errorMessage={formErrors?.noHPPIC}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="muatparts-primary"
                  className="mx-auto w-[112px] rounded-full"
                >
                  {t("LocationModalFormWeb.save", {}, "Simpan")}
                </Button>
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

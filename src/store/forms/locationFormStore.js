import { create } from "zustand";

import { zustandDevtools } from "@/lib/utils";

/**
 * @typedef {Object} NameValuePair
 * @property {string} name - The name of the district.
 * @property {string | number | null} value - The value/id of the district.
 */

/**
 * @typedef {Object} Coordinates
 * @property {number} latitude - The latitude coordinate.
 * @property {number} longitude - The longitude coordinate.
 */

/**
 * @typedef {Object} SelectedAddress
 * @property {NameValuePair} location
 * @property {NameValuePair} district
 * @property {NameValuePair} city
 * @property {NameValuePair} province
 * @property {NameValuePair[]} kecamatanList
 * @property {NameValuePair[]} postalCodeList
 * @property {NameValuePair} postalCode
 * @property {Coordinates} coordinates
 */

/**
 * @typedef {Object} LocationFormValues
 * @property {SelectedAddress|null} dataLokasi
 * @property {string} detailLokasi
 * @property {string} namaPIC
 * @property {string} noHPPIC
 */

/**
 * @typedef {Object} LocationFormStoreState
 * @property {LocationFormValues} formValues
 * @property {Object} formErrors
 * @property {(field: keyof LocationFormValues, value: any) => void} setField
 * @property {(formErrors: Object) => void} setErrors
 * @property {() => void} resetForm
 * @property {() => boolean} validateForm
 */

/** @type {LocationFormValues} */
const defaultValues = {
  dataLokasi: null,
  detailLokasi: "",
  namaPIC: "",
  noHPPIC: "",
};

/**
 * Zustand store for the location form.
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<LocationFormStoreState>>}
 */
export const useLocationFormStore = create(
  zustandDevtools((set, get) => ({
    formValues: defaultValues,
    formErrors: {},
    setField: (field, value) =>
      set((state) => ({
        formValues: { ...state.formValues, [field]: value },
      })),
    setLocationCoordinatesOnly: (coordinates) =>
      set((state) => ({
        formValues: {
          ...state.formValues,
          dataLokasi: {
            ...state.formValues.dataLokasi,
            coordinates,
          },
        },
      })),
    setErrors: (formErrors) =>
      set((state) => ({
        formErrors,
      })),
    reset: (newValues) =>
      set({
        formValues: newValues ? newValues : defaultValues,
        formErrors: {},
      }),
    validateForm: (formMode, allSelectedLocations = [], index) => {
      const { formValues } = get();

      const validateLocation = () => {
        if (!formValues.dataLokasi.location)
          return formMode === "muat"
            ? "Lokasi muat harus diisi"
            : "Lokasi bongkar harus diisi";

        const foundLocationIndex = allSelectedLocations.findIndex(
          (item) =>
            item?.dataLokasi?.location?.name ===
            formValues?.dataLokasi?.location?.name
        );

        if (foundLocationIndex !== -1)
          return formMode === "muat"
            ? `Lokasi Muat ${index + 1} tidak boleh sama dengan Lokasi Muat ${foundLocationIndex + 1}`
            : `Lokasi bongkar ${index + 1} tidak boleh sama dengan Lokasi bongkar ${foundLocationIndex + 1}`;
      };

      const validateNamaPIC = () => {
        if (!formValues.namaPIC) return "Nama PIC harus diisi";
        if (formValues.namaPIC.length < 3) return "Nama PIC minimal 3 karakter";
        // validate it name only alphabet and "'"
        if (!/^[a-zA-Z' ]+$/.test(formValues.namaPIC))
          return "Penulisan Nama PIC tidak valid";
      };

      const validateNoHPPIC = () => {
        if (!formValues.noHPPIC) return "No. HP PIC harus diisi";
        if (formValues.noHPPIC.length < 8) return "No. HP PIC minimal 8 digit";
        if (!/^[0-9]+$/.test(formValues.noHPPIC))
          return "No. HP PIC tidak valid";
        if (
          formValues.noHPPIC
            .split("")
            ?.every((char) => char === formValues.noHPPIC[0])
        )
          return "Format No. HP PIC muat salah";
        if (
          !formValues.noHPPIC.startsWith("0") &&
          !formValues.noHPPIC.startsWith("62")
        )
          return "Format No. HP PIC muat salah";
      };

      const errors = {
        dataLokasi: validateLocation(),
        namaPIC: validateNamaPIC(),
        noHPPIC: validateNoHPPIC(),
      };
      // console.log("🚀 ~ zustandDevtools ~ errors:", errors);

      set({ formErrors: errors });
      // return validateForm is valid if all errors are undefined
      return Object.values(errors).every((error) => error === undefined);
    },
  }))
);

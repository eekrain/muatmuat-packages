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
    resetForm: () => set({ formValues: defaultValues, formErrors: {} }),
    validateForm: (allSelectedLocations = [], formMode) => {
      const errors = {};
      const { formValues } = get();
      const sameLocationIndex = allSelectedLocations.findIndex(
        (item) =>
          item.dataLokasi.location.name === formValues.dataLokasi.location.value
      );

      if (sameLocationIndex !== -1)
        errors.dataLokasi =
          formMode === "muat"
            ? `Lokasi Muat ${allSelectedLocations.length + 1} tidak boleh sama dengan Lokasi Muat ${sameLocationIndex + 1}`
            : `Lokasi bongkar ${allSelectedLocations.length + 1} tidak boleh sama dengan Lokasi bongkar ${sameLocationIndex + 1}`;

      if (!formValues.dataLokasi.location)
        errors.dataLokasi =
          formMode === "muat"
            ? "Lokasi muat harus diisi"
            : "Lokasi bongkar harus diisi";

      if (formValues.namaPIC.length < 3)
        errors.namaPIC = "Nama PIC minimal 3 karakter";
      // validate it name only alphabet and "'"
      if (!/^[a-zA-Z' ]+$/.test(formValues.namaPIC))
        errors.namaPIC = "Penulisan Nama PIC tidak valid";
      if (!formValues.namaPIC) errors.namaPIC = "Nama PIC harus diisi";

      // validate it only starts with 0 or 62
      if (
        !formValues.noHPPIC.startsWith("0") &&
        !formValues.noHPPIC.startsWith("62")
      )
        errors.noHPPIC = "Format No. HP PIC muat salah";
      // validate if its only contains the same number, like 777777777
      if (
        formValues.noHPPIC
          .split("")
          ?.every((char) => char === formValues.noHPPIC[0])
      )
        errors.noHPPIC = "Format No. HP PIC muat salah";

      // validate it noHPPIC only number
      if (!/^[0-9]+$/.test(formValues.noHPPIC))
        errors.noHPPIC = "No. HP PIC tidak valid";

      if (!formValues.noHPPIC) errors.noHPPIC = "No. HP PIC harus diisi";
      else if (formValues.noHPPIC.length < 8)
        errors.noHPPIC = "No. HP PIC minimal 8 digit";

      set({ formErrors: errors });
      set({ formErrors: errors });
      return Object.keys(errors).length === 0;
    },
  }))
);

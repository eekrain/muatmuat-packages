import { create } from "zustand";

import { zustandDevtools } from "@/lib/utils";

import { useSewaArmadaStore } from "./sewaArmadaStore";

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
 * @property {string} namaLokasi
 * @property {SelectedAddress|null} dataLokasi
 * @property {string} detailLokasi
 * @property {string} namaPIC
 * @property {string} noHPPIC
 * @property {boolean} isPrimaryLocation
 */

/**
 * @typedef {Object} LocationFormStoreState
 * @property {LocationFormValues} formValues
 * @property {Object} formErrors
 * @property {(field: keyof LocationFormValues, value: any) => void} setField
 * @property {(formErrors: Object) => void} setErrors
 * @property {() => void} reset
 * @property {() => boolean} validateForm
 */

/** @type {LocationFormValues} */
const defaultValues = {
  namaLokasi: "",
  dataLokasi: null,
  detailLokasi: "",
  namaPIC: "",
  noHPPIC: "",
  isMainAddress: false,
};

/**
 * Zustand store for the location form.
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<LocationFormStoreState>>}
 */
export const useLocationFormStore = create(
  zustandDevtools(
    (set, get) => ({
      formValues: defaultValues,
      formErrors: {},
      setField: (field, value) =>
        set((state) => ({
          formValues: { ...state.formValues, [field]: value },
        })),
      setLocationPartial: (partialLocation) =>
        set((state) => ({
          formValues: {
            ...state.formValues,
            dataLokasi: {
              ...state.formValues.dataLokasi,
              ...partialLocation,
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
      validateLokasiBongkarMuat: (formMode, index) => {
        const { formValues } = get();
        const allSelectedLocations =
          useSewaArmadaStore.getState().formValues[
            formMode === "muat" ? "lokasiMuat" : "lokasiBongkar"
          ];

        const validateLocation = () => {
          if (!formValues.dataLokasi?.location)
            return formMode === "muat"
              ? "Lokasi Muat wajib diisi"
              : "Lokasi Bongkar wajib diisi";

          const foundLocationIndex = allSelectedLocations.findIndex(
            (item) =>
              item?.dataLokasi?.location?.name ===
              formValues?.dataLokasi?.location?.name
          );

          if (foundLocationIndex !== -1)
            return formMode === "muat"
              ? `Lokasi Muat ${index + 1} tidak boleh sama dengan Lokasi Muat ${foundLocationIndex + 1}`
              : `Lokasi Bongkar ${index + 1} tidak boleh sama dengan Lokasi Bongkar ${foundLocationIndex + 1}`;
        };

        const errors = {
          dataLokasi: validateLocation(),
          namaPIC: validateNamaPIC(formValues.namaPIC),
          noHPPIC: validateNoHPPIC(formValues.noHPPIC, formMode),
        };

        set({ formErrors: errors });
        // return validateForm is valid if all errors are undefined
        return Object.values(errors).every((error) => error === undefined);
      },
      validateSimpanLokasi: () => {
        const { formValues } = get();

        const errors = {
          namaLokasi: validateNamaLokasi(formValues.namaLokasi),
          detailLokasi: validateDetailLokasi(formValues.detailLokasi),
          namaPIC: validateNamaPIC(formValues.namaPIC),
          noHPPIC: validateNoHPPIC(formValues.noHPPIC),
        };

        set({ formErrors: errors });
        // return validateForm is valid if all errors are undefined
        return Object.values(errors).every((error) => error === undefined);
      },
      validateLokasiOnSelect: (formMode, index, selectedAddress) => {
        const allSelectedLocations =
          useSewaArmadaStore.getState().formValues[
            formMode === "muat" ? "lokasiMuat" : "lokasiBongkar"
          ];
        console.log("🚀 ~ allSelectedLocations:", allSelectedLocations);

        const foundLocationIndex = allSelectedLocations.findIndex(
          (item) => item?.dataLokasi?.location?.name === selectedAddress
        );
        console.log("🚀 ~ foundLocationIndex:", foundLocationIndex);

        if (foundLocationIndex !== -1 && foundLocationIndex !== index)
          return formMode === "muat"
            ? `Lokasi Muat ${index + 1} tidak boleh sama dengan Lokasi Muat ${foundLocationIndex + 1}`
            : `Lokasi bongkar ${index + 1} tidak boleh sama dengan Lokasi bongkar ${foundLocationIndex + 1}`;
      },
      validateLayananTambahan: () => {
        const { formValues } = get();

        const errors = {
          dataLokasi: validateDataLokasi(formValues.dataLokasi),
          detailLokasi: validateDetailLokasi(formValues.detailLokasi),
        };

        set({ formErrors: errors });
        // return validateForm is valid if all errors are undefined
        if (!formValues.namaPIC) {
          errors.namaPIC = "Nama Penerima wajib diisi";
        } else if (formValues.namaPIC.length < 3) {
          errors.namaPIC = "Nama Penerima minimal 3 karakter";
        } else if (!/^[a-zA-Z' ]+$/.test(formValues.namaPIC)) {
          errors.namaPIC = "Penulisan Nama Penerima tidak valid";
        }

        if (!formValues.noHPPIC) {
          errors.noHPPIC = "Nomor Handphone Penerima wajib diisi";
        } else if (formValues.noHPPIC.length < 8) {
          errors.noHPPIC = "Nomor Handphone Penerima minimal 8 digit";
        } else if (/[^0-9]/.test(formValues.noHPPIC)) {
          errors.noHPPIC = "Nomor handphone Penerima tidak valid";
        } else if (
          formValues.noHPPIC
            .split("")
            ?.every((char) => char === formValues.noHPPIC[0])
        ) {
          errors.noHPPIC = "Format No. HP Penerima salah";
        } else if (
          !formValues.noHPPIC.startsWith("0") &&
          !formValues.noHPPIC.startsWith("62")
        ) {
          errors.noHPPIC = "Format No. HP Penerima salah";
        }

        if (!formValues.dataLokasi?.location?.name) {
          errors.dataLokasi = "Alamat Tujuan wajib diisi";
        }

        if (!formValues.detailLokasi) {
          errors.detailLokasi = "Detail Alamat Tujuan wajib diisi";
        } else if (formValues.detailLokasi.length < 3) {
          errors.detailLokasi = "Detail Alamat Tujuan minimal 3 karakter";
        }

        // Kecamatan wajib diisi
        if (!formValues.dataLokasi?.district?.value) {
          errors.district = "Kecamatan wajib diisi";
        }

        // Kode Pos wajib diisi
        if (!formValues.dataLokasi?.postalCode?.value) {
          errors.postalCode = "Kode Pos wajib diisi";
        }

        return Object.values(errors).every((error) => error === undefined);
      },
    }),
    {
      name: "location-form-store",
    }
  )
);

const validateNamaLokasi = (namaLokasi) => {
  if (!namaLokasi) return "Nama Lokasi wajib diisi";
  if (namaLokasi.length < 3) return "Nama Lokasi minimal 3 karakter";
};

const validateDataLokasi = (dataLokasi) => {
  if (!dataLokasi?.location?.name) return "Lokasi wajib diisi";
};

const validateDetailLokasi = (detailLokasi) => {
  if (!detailLokasi) return "Detail Lokasi wajib diisi";
  if (detailLokasi.length < 3) return "Detail Lokasi minimal 3 karakter";
};

const validateNamaPIC = (namaPIC) => {
  if (!namaPIC) return "Nama PIC wajib diisi";
  if (namaPIC.length < 3) return "Nama PIC minimal 3 karakter";
  // validate it name only alphabet and "'"
  if (!/^[a-zA-Z' ]+$/.test(namaPIC)) return "Penulisan Nama PIC tidak valid";
};

const validateNoHPPIC = (noHPPIC, formMode) => {
  if (!noHPPIC) return "No. HP PIC wajib diisi";
  if (!/^[0-9]+$/.test(noHPPIC)) return "No. HP PIC tidak valid";
  if (noHPPIC.length < 8) return "No. HP PIC minimal 8 digit";
  if (noHPPIC.split("")?.every((char) => char === noHPPIC[0]))
    return `Format No. HP PIC lokasi ${formMode === "muat" ? "muat" : "bongkar"} salah`;
  if (!noHPPIC.startsWith("0") && !noHPPIC.startsWith("62"))
    return `Format No. HP PIC lokasi ${formMode === "muat" ? "muat" : "bongkar"} salah`;
};

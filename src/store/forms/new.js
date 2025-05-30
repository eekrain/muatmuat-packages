// store/SewaArmada.js
import { create } from "zustand";

const defaultValues = {
  rentalType: "",
  waktuMuat: "",
  showRangeOption: false,
  lokasi: { muat: "", bongkar: "" },
  tipeMuatan: "",
  jenisMuatan: "",
  informasiMuatan: "",
  fotoMuatan: [null, null, null, null],
  deskripsi: "",
  jenisCarrier: "",
  jenisTruk: "",
  useAsuransi: true,
  kirimBuktiFisik: false,
  bantuanTambahan: false,
  noDO: "",
  isCompany: false,
};

// generate a state for errors and disabled, using formFields keys and set to false
const defaultState = Object.keys(defaultValues).reduce((acc, field) => {
  acc[field] = false;
  return acc;
}, {});

export const useSewaArmadaStore = create((set) => ({
  values: {
    ...defaultValues,
  },
  // error text for each field
  errors: {},
  // boolean for disabled fields
  disabled: {},
  setField: (field, value) =>
    set((state) => ({
      values: { ...state.values, [field]: value },
      errors: { ...state.errors, [field]: undefined },
    })),
  setError: (field, error) =>
    set((state) => ({
      errors: { ...state.errors, [field]: error },
    })),
  setDisabled: (field, disabled) =>
    set((state) => ({
      disabled: { ...state.disabled, [field]: disabled },
    })),
  reset: () => set(defaultValues),
}));

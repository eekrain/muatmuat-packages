// store/SewaArmada.js
import { create } from "zustand";

import { zustandDevtools } from "@/lib/utils";

const defaultValues = {
  rentalType: "",
  startDate: null,
  endDate: null,
  showRangeOption: false,
  lokasiMuat: [],
  lokasiBongkar: [],
  tipeMuatan: "bahan-mentah",
  jenisMuatan: "padat",
  informasiMuatan: "",
  fotoMuatan: [null, null, null, null],
  deskripsi: "",
  jenisCarrier: null,
  jenisTruk: null,
  jumlahArmada: 0,
  useAsuransi: true,
  kirimBuktiFisik: false,
  bantuanTambahan: false,
  noDO: "",
  isCompany: false,
};

export const useSewaArmadaStore = create(
  zustandDevtools((set, get) => ({
    formValues: defaultValues,
    formErrors: {},
    setField: (field, value) =>
      set((state) => ({
        formValues: { ...state.formValues, [field]: value },
        formErrors: { ...state.formErrors, [field]: undefined },
      })),
    setError: (field, error) =>
      set((state) => ({
        formErrors: { ...state.formErrors, [field]: error },
      })),
    setFotoMuatan: (index, value) =>
      set((state) => {
        let updated = [...state.values.fotoMuatan];
        if (value == null) {
          updated[index] = null;
          updated = updated
            .filter((item) => item != null)
            .concat(new Array(state.formValues.fotoMuatan.length).fill(null))
            .slice(0, state.formValues.fotoMuatan.length);
        } else {
          const emptyIndex = updated.findIndex(
            (item, i) => item == null && i < index
          );
          if (emptyIndex !== -1) {
            updated[emptyIndex] = value;
          } else {
            updated[index] = value;
          }
        }
        return { formValues: { ...state.formValues, fotoMuatan: updated } };
      }),
    addLokasi: (field, value) =>
      set((state) => ({
        formValues: {
          ...state.formValues,
          [field]: [...state.formValues[field], value],
        },
      })),
    removeLokasi: (field, index) =>
      set((state) => ({
        formValues: {
          ...state.formValues,
          [field]: state.formValues[field].filter((_, i) => i !== index),
        },
      })),
    reset: () => set({ formValues: defaultValues, formErrors: defaultErrors }),
    validateForm: () => {
      const { startDate, endDate, showRangeOption, fotoMuatan, deskripsi } =
        get().formValues;
      const newErrors = {};
      const isValidFotoMuatan = fotoMuatan.some((item) => item !== null);
      if (!startDate) {
        newErrors.startDate = "Tanggal & waktu muat wajib diisi";
      }
      if (startDate && showRangeOption) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffMs = end - start;
        const diffHours = diffMs / (1000 * 60 * 60);
        const eightHoursMs = 8 * 60 * 60 * 1000;
        if (!endDate) {
          newErrors.endDate = "Tanggal & waktu muat wajib diisi";
        } else if (diffHours < 1) {
          newErrors.endDate = "Rentang waktu minimal 1 jam";
        } else if (diffMs > eightHoursMs) {
          newErrors.endDate = "Rentang waktu maksimal 8 jam";
        }
      }
      if (!isValidFotoMuatan) {
        newErrors.fotoMuatan = "Mohon upload foto muatan";
      }
      if (!deskripsi) {
        newErrors.deskripsi = "Deskripsi Muatan wajib diisi";
      } else if (deskripsi.length < 3) {
        newErrors.deskripsi = "Deskripsi Muatan minimal 3 karakter";
      }
      set({ formErrors: newErrors });
      return Object.keys(newErrors).length === 0;
    },
  }))
);

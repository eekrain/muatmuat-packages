import { create } from "zustand";

import { zustandDevtools } from "@/lib/utils";

const defaultInformasiMuatan = {
  namaMuatan: {
    label: "",
    value: null,
  },
  beratMuatan: {
    berat: "",
    unit: "kg",
  },
  dimensiMuatan: {
    panjang: "",
    lebar: "",
    tinggi: "",
    unit: "m",
  },
};

const defaultFormValues = {
  cargoTypeId: null,
  cargoCategoryId: null,
  isHalalLogistics: false,
  informasiMuatan: [defaultInformasiMuatan],
};

export const useInformasiMuatanStore = create(
  zustandDevtools(
    (set, get) => ({
      formValues: defaultFormValues,
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
      addInformasiMuatan: () =>
        set((state) => ({
          formValues: {
            ...state.formValues,
            informasiMuatan: [
              ...state.formValues.informasiMuatan,
              defaultInformasiMuatan,
            ],
          },
        })),
      removeInformasiMuatan: (index) =>
        set((state) => {
          const newInformasiMuatan = [...state.formValues.informasiMuatan];
          newInformasiMuatan.splice(index, 1);
          return {
            formValues: {
              ...state.formValues,
              informasiMuatan: newInformasiMuatan,
            },
          };
        }),
      updateInformasiMuatan: (index, field, value) =>
        set((state) => {
          const newInformasiMuatan = [...state.formValues.informasiMuatan];
          newInformasiMuatan[index] = {
            ...newInformasiMuatan[index],
            [field]: value,
          };
          return {
            formValues: {
              ...state.formValues,
              informasiMuatan: newInformasiMuatan,
            },
          };
        }),
      updateBeratMuatan: (index, field, value) =>
        set((state) => {
          const newInformasiMuatan = [...state.formValues.informasiMuatan];
          newInformasiMuatan[index] = {
            ...newInformasiMuatan[index],
            beratMuatan: {
              ...newInformasiMuatan[index].beratMuatan,
              [field]: value,
            },
          };
          return {
            formValues: {
              ...state.formValues,
              informasiMuatan: newInformasiMuatan,
            },
          };
        }),
      updateDimensiMuatan: (index, field, value) =>
        set((state) => {
          const newInformasiMuatan = [...state.formValues.informasiMuatan];
          newInformasiMuatan[index] = {
            ...newInformasiMuatan[index],
            dimensiMuatan: {
              ...newInformasiMuatan[index].dimensiMuatan,
              [field]: value,
            },
          };
          return {
            formValues: {
              ...state.formValues,
              informasiMuatan: newInformasiMuatan,
            },
          };
        }),
      reset: (defaultValues) =>
        set({
          formValues: defaultValues || defaultFormValues,
          formErrors: {},
        }),
      validateForm: () => {
        const { cargoTypeId, cargoCategoryId, informasiMuatan } =
          get().formValues;
        const newErrors = {};

        if (!cargoTypeId) {
          newErrors.cargoTypeId = "Tipe muatan harus diisi";
        }
        if (!cargoCategoryId) {
          newErrors.cargoCategoryId = "Jenis muatan harus diisi";
        }

        informasiMuatan.forEach((muatan, index) => {
          if (!muatan.namaMuatan) {
            newErrors[`informasiMuatan.${index}.namaMuatan`] =
              "Nama muatan harus diisi";
          }
          if (!muatan.beratMuatan.berat) {
            newErrors[`informasiMuatan.${index}.beratMuatan.berat`] =
              "Berat muatan harus diisi";
          }
        });

        set({ formErrors: newErrors });
        return Object.keys(newErrors).length === 0;
      },
    }),
    {
      name: "informasi-muatan-store",
    }
  )
);

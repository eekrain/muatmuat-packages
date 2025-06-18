// store/SewaArmada.js
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { zustandDevtools } from "@/lib/utils";

const defaultValues = {
  startDate: null,
  endDate: null,
  showRangeOption: false,
  lokasiMuat: [null],
  lokasiBongkar: [null],
  tipeMuatan: "",
  jenisMuatan: "",
  sertifikasiHalal: false,
  informasiMuatan: [],
  fotoMuatan: [null, null, null, null],
  deskripsi: "",
  jenisCarrier: null,
  jenisTruk: null,
  jumlahArmada: 0,
  useAsuransi: true,
  // layananTambahan: [],
  kirimBuktiFisik: false,
  bantuanTambahan: false,
  noDO: [],
  isCompany: false,
  companyName: "",
  companyNpwp: "",
  opsiPembayaran: null,
};

export const useSewaArmadaStore = create(
  zustandDevtools(
    persist(
      (set, get) => ({
        formId: "",
        orderType: "",
        formValues: defaultValues,
        formErrors: {},

        actions: {
          setFormId: (formId) => set({ formId }),
          setOrderType: (orderType) => set({ orderType }),
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
              let updated = [...state.formValues.fotoMuatan];
              if (value == null) {
                updated[index] = null;
                updated = updated
                  .filter((item) => item != null)
                  .concat(
                    new Array(state.formValues.fotoMuatan.length).fill(null)
                  )
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
              return {
                formValues: { ...state.formValues, fotoMuatan: updated },
              };
            }),
          addLokasi: (field, value) =>
            set((state) => ({
              formValues: {
                ...state.formValues,
                [field]: [...state.formValues[field], value],
              },
            })),
          updateLokasi: (field, index, newValue) => {
            console.log("Tes njir", { field, index, newValue });
            set((state) => ({
              formValues: {
                ...state.formValues,
                [field]: state.formValues[field].map((item, i) =>
                  i === index ? newValue : item
                ),
              },
            }));
          },
          removeLokasi: (field, index) =>
            set((state) => ({
              formValues: {
                ...state.formValues,
                ...(state.formValues[field].length === 1
                  ? { [field]: [null] }
                  : {
                      [field]: state.formValues[field].filter(
                        (_, i) => i !== index
                      ),
                    }),
              },
            })),
          reset: () =>
            set({
              formValues: defaultValues,
              formErrors: {},
              formId: "",
            }),
          // VALIDASI BUAT YG DESKTOP KARENA JADI SATU HALAMAN
          validateForm: () => {
            const {
              startDate,
              endDate,
              showRangeOption,
              fotoMuatan,
              deskripsi,
            } = get().formValues;
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
          // VALIDASI BUAT YG RESPONSIVE KARENA FORM UTAMANYA ADA 2 HALAMAN
          validateSecondForm: () => {
            const {
              deskripsi,
              fotoMuatan,
              isCompany,
              companyName,
              companyNpwp,
              opsiPembayaran,
            } = get().formValues;
            const newErrors = {};

            // Validate uploaded images (at least one required)
            const hasUploadedImage = fotoMuatan.some((image) => image !== null);
            if (!hasUploadedImage) {
              newErrors.fotoMuatan = "Pesanan harus memiliki minimal 1 foto";
            }

            // Validate description
            if (!deskripsi.trim()) {
              newErrors.deskripsi = "Deskripsi muatan wajib diisi";
            } else if (deskripsi.trim().length < 3) {
              newErrors.deskripsi = "Deskripsi muatan minimal 3 karakter";
            }

            // Validate badan usaha fields if checkbox is checked
            if (isCompany) {
              if (!companyName.trim()) {
                newErrors.companyName =
                  "Nama badan usaha/perusahaan wajib diisi";
              } else if (companyName.trim().length < 3) {
                newErrors.companyName =
                  "Nama badan usaha/perusahaan minimal 3 karakter";
              } else if (/[^a-zA-Z]/.test(companyName)) {
                newErrors.companyName =
                  "Nama badan usaha/perusahaan tidak valid";
              }

              if (!companyNpwp.trim()) {
                newErrors.companyNpwp = "Nomor NPWP wajib diisi";
              } else if (companyNpwp.trim().length < 15) {
                newErrors.companyNpwp = "Nomor NPWP minimal 15 digit";
              }
            }

            if (!opsiPembayaran) {
              newErrors.opsiPembayaran = "Metode pembayaran wajib diisi";
            }

            set({ formErrors: newErrors });
            return Object.keys(newErrors).length === 0;
          },
        },
      }),
      {
        name: "t-sewa-armada",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          formId: state.formId,
          orderType: state.orderType,
          formValues: state.formValues,
          formErrors: state.formErrors,
        }),
      }
    ),
    {
      name: "sewa-armada-store",
    }
  )
);

export const useSewaArmadaActions = () => {
  const {
    setFormId,
    setOrderType,
    setField,
    setError,
    setFotoMuatan,
    addLokasi,
    updateLokasi,
    removeLokasi,
    reset,
    validateForm,
    validateSecondForm,
  } = useSewaArmadaStore((state) => state.actions);

  return {
    setFormId,
    setOrderType,
    setField,
    setError,
    setFotoMuatan,
    addLokasi,
    updateLokasi,
    removeLokasi,
    reset,
    validateForm,
    validateSecondForm,
  };
};

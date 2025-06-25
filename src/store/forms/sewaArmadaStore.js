// store/SewaArmada.js
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { zustandDevtools } from "@/lib/utils";

const defaultValues = {
  loadTimeStart: null,
  loadTimeEnd: null,
  showRangeOption: false,
  lokasiMuat: [null],
  lokasiBongkar: [null],
  cargoTypeId: null,
  cargoCategoryId: null,
  isHalalLogistics: false,
  informasiMuatan: [],
  fotoMuatan: [null, null, null, null],
  cargoDescription: "",
  carrierId: null,
  truckTypeId: null,
  truckCount: 0,
  distance: 0,
  distanceUnit: "",
  estimatedTime: 0,

  useAsuransi: true,
  // Sementara, nanti diganti additionalServices
  kirimBuktiFisik: false,
  bantuanTambahan: false,
  additionalServices: [],

  deliveryOrderNumbers: [],
  businessEntity: {
    isBusinessEntity: false,
    name: "",
    taxId: "",
  },
  paymentMethodId: null,
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
              orderType: "",
            }),
          // VALIDASI BUAT YG DESKTOP KARENA JADI SATU HALAMAN
          validateForm: () => {
            const {
              loadTimeStart,
              loadTimeEnd,
              showRangeOption,
              fotoMuatan,
              cargoDescription,
            } = get().formValues;
            const newErrors = {};
            const isValidFotoMuatan = fotoMuatan.some((item) => item !== null);
            if (!loadTimeStart) {
              newErrors.loadTimeStart = "Tanggal & waktu muat wajib diisi";
            }
            if (loadTimeStart && showRangeOption) {
              const start = new Date(loadTimeStart);
              const end = new Date(loadTimeEnd);
              const diffMs = end - start;
              const diffHours = diffMs / (1000 * 60 * 60);
              const eightHoursMs = 8 * 60 * 60 * 1000;
              if (!loadTimeEnd) {
                newErrors.loadTimeEnd = "Tanggal & waktu muat wajib diisi";
              } else if (diffHours < 1) {
                newErrors.loadTimeEnd = "Rentang waktu minimal 1 jam";
              } else if (diffMs > eightHoursMs) {
                newErrors.loadTimeEnd = "Rentang waktu maksimal 8 jam";
              }
            }
            if (!isValidFotoMuatan) {
              newErrors.fotoMuatan = "Mohon upload foto muatan";
            }
            if (!cargoDescription) {
              newErrors.cargoDescription = "Deskripsi Muatan wajib diisi";
            } else if (cargoDescription.length < 3) {
              newErrors.cargoDescription =
                "Deskripsi Muatan minimal 3 karakter";
            }
            set({ formErrors: newErrors });
            return Object.keys(newErrors).length === 0;
          },
          // VALIDASI BUAT YG RESPONSIVE KARENA FORM UTAMANYA ADA 2 HALAMAN
          validateSecondForm: () => {
            const {
              cargoDescription,
              fotoMuatan,
              businessEntity,
              paymentMethodId,
            } = get().formValues;
            const newErrors = {};

            // Validate uploaded images (at least one required)
            const hasUploadedImage = fotoMuatan.some((image) => image !== null);
            if (!hasUploadedImage) {
              newErrors.fotoMuatan = "Pesanan harus memiliki minimal 1 foto";
            }

            // Validate description
            if (!cargoDescription.trim()) {
              newErrors.cargoDescription = "Deskripsi muatan wajib diisi";
            } else if (cargoDescription.trim().length < 3) {
              newErrors.cargoDescription =
                "Deskripsi muatan minimal 3 karakter";
            }

            // Validate badan usaha fields if checkbox is checked
            console.log(
              "businessEntity.isBusinessEntity",
              businessEntity.isBusinessEntity
            );
            if (businessEntity.isBusinessEntity) {
              newErrors.businessEntity = {};
              if (!businessEntity.name.trim()) {
                newErrors.businessEntity.name =
                  "Nama badan usaha/perusahaan wajib diisi";
              } else if (businessEntity.name.trim().length < 3) {
                newErrors.businessEntity.name =
                  "Nama badan usaha/perusahaan minimal 3 karakter";
              } else if (/[^a-zA-Z]/.test(businessEntity.name)) {
                newErrors.businessEntity.name =
                  "Nama badan usaha/perusahaan tidak valid";
              }

              if (!businessEntity.taxId.trim()) {
                newErrors.businessEntity.taxId = "Nomor NPWP wajib diisi";
              } else if (businessEntity.taxId.trim().length < 15) {
                newErrors.businessEntity.taxId = "Nomor NPWP minimal 15 digit";
              }
            }

            if (!paymentMethodId) {
              newErrors.paymentMethodId = "Metode pembayaran wajib diisi";
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

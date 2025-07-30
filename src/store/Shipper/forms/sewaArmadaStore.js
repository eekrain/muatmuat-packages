// store/SewaArmada.js
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { zustandDevtools } from "@/lib/utils";

export const defaultValues = {
  loadTimeStart: null,
  loadTimeEnd: null,
  showRangeOption: false,
  lokasiMuat: [null],
  lokasiBongkar: [null],
  cargoTypeId: null,
  cargoCategoryId: null,
  isHalalLogistics: false,
  informasiMuatan: [],
  cargoPhotos: [null, null, null, null],
  cargoDescription: "",
  carrierId: null,
  truckTypeId: null,
  tempTrucks: null,
  minTruckCount: 1,
  truckCount: 1,
  distance: 0,
  distanceUnit: "",
  estimatedTime: 0,

  useAsuransi: true,
  // Sementara, nanti diganti additionalServices
  kirimBuktiFisik: false,
  bantuanTambahan: false,
  additionalServices: [],
  tempShippingOptions: [],
  deliveryOrderNumbers: [],
  businessEntity: {
    isBusinessEntity: false,
    name: "",
    taxId: "",
  },
  voucherId: null,
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
        isUpdateOrderSuccess: false,

        actions: {
          setFormId: (formId) => set({ formId }),
          setOrderType: (orderType) => set({ orderType }),
          setUpdateOrderSuccess: (isUpdateOrderSuccess) =>
            set({ isUpdateOrderSuccess }),
          setField: (field, value) =>
            set((state) => ({
              formValues: { ...state.formValues, [field]: value },
              formErrors: { ...state.formErrors, [field]: undefined },
            })),
          setError: (field, error) =>
            set((state) => ({
              formErrors: { ...state.formErrors, [field]: error },
            })),
          setCargoPhotos: (index, value) =>
            set((state) => {
              let updated = [...state.formValues.cargoPhotos];
              if (value === null) {
                updated[index] = null;
                updated = updated
                  .filter((item) => item !== null)
                  .concat(
                    new Array(state.formValues.cargoPhotos.length).fill(null)
                  )
                  .slice(0, state.formValues.cargoPhotos.length);
              } else {
                const emptyIndex = updated.findIndex(
                  (item, i) => item === null && i < index
                );
                if (emptyIndex !== -1) {
                  updated[emptyIndex] = value;
                } else {
                  updated[index] = value;
                }
              }
              return {
                formValues: { ...state.formValues, cargoPhotos: updated },
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
          validateForm: (settingsTime) => {
            const {
              loadTimeStart,
              loadTimeEnd,
              showRangeOption,
              cargoTypeId,
              cargoCategoryId,
              cargoPhotos,
              cargoDescription,
              lokasiMuat,
              lokasiBongkar,
            } = get().formValues;

            const newErrors = {};
            const isValidcargoPhotos = cargoPhotos.some(
              (item) => item !== null
            );
            if (!loadTimeStart) {
              newErrors.loadTimeStart = "Tanggal & waktu muat wajib diisi";
            }
            if (loadTimeStart && showRangeOption) {
              const start = new Date(loadTimeStart);
              const end = new Date(loadTimeEnd);
              const diffMs = end - start;
              const diffHours = diffMs / (1000 * 60 * 60);
              const eightHoursMs =
                settingsTime.loadingTime.maxRangeHours * 60 * 60 * 1000;
              if (!loadTimeEnd) {
                newErrors.loadTimeEnd = "Tanggal & waktu muat wajib diisi";
              } else if (diffHours < settingsTime.loadingTime.minRangeHours) {
                newErrors.loadTimeEnd = `Rentang waktu minimal ${settingsTime.loadingTime.minRangeHours} jam`;
              } else if (diffMs > eightHoursMs) {
                newErrors.loadTimeEnd = `Rentang waktu maksimal ${settingsTime.loadingTime.maxRangeHours} jam`;
              }
            }
            if (!cargoTypeId) {
              newErrors.cargoTypeId = "Tipe muatan harus diisi";
            }
            if (!cargoCategoryId) {
              newErrors.cargoCategoryId = "Jenis muatan harus diisi";
            }
            if (!isValidcargoPhotos) {
              newErrors.cargoPhotos = "Muatan harus memiliki minimal 1 foto";
            }
            if (!cargoDescription) {
              newErrors.cargoDescription = "Deskripsi Muatan wajib diisi";
            } else if (cargoDescription.length < 3) {
              newErrors.cargoDescription =
                "Deskripsi Muatan minimal 3 karakter";
            }

            if (!lokasiMuat.some((item) => Boolean(item))) {
              newErrors.lokasiMuat = "Lokasi Muat wajib diisi";
            }

            if (!lokasiBongkar.some((item) => Boolean(item))) {
              newErrors.lokasiBongkar = "Lokasi Bongkar wajib diisi";
            }

            set({ formErrors: newErrors });
            return Object.keys(newErrors).length === 0;
          },
          // VALIDASI BUAT YG RESPONSIVE KARENA FORM UTAMANYA ADA 2 HALAMAN
          validateSecondForm: () => {
            const {
              cargoDescription,
              cargoPhotos,
              businessEntity,
              paymentMethodId,
            } = get().formValues;
            const newErrors = {};

            // Validate uploaded images (at least one required)
            const hasUploadedImage = cargoPhotos.some(
              (image) => image !== null
            );
            if (!hasUploadedImage) {
              newErrors.cargoPhotos = "Pesanan harus memiliki minimal 1 foto";
            }

            // Validate description
            if (!cargoDescription.trim()) {
              newErrors.cargoDescription = "Deskripsi muatan wajib diisi";
            } else if (cargoDescription.trim().length < 3) {
              newErrors.cargoDescription =
                "Deskripsi muatan minimal 3 karakter";
            }

            if (businessEntity.isBusinessEntity) {
              newErrors.businessEntity = {};
              if (!businessEntity.name.trim()) {
                newErrors.businessEntity.name =
                  "Nama badan usaha/perusahaan wajib diisi";
              } else if (businessEntity.name.trim().length < 3) {
                newErrors.businessEntity.name =
                  "Nama badan usaha/perusahaan minimal 3 karakter";
              } else if (/[^a-zA-Z\s]/.test(businessEntity.name)) {
                newErrors.businessEntity.name =
                  "Nama badan usaha/perusahaan tidak valid";
              }

              if (!businessEntity.taxId.trim()) {
                newErrors.businessEntity.taxId = "Nomor NPWP wajib diisi";
              } else if (businessEntity.taxId.trim().length < 15) {
                newErrors.businessEntity.taxId = "Nomor NPWP minimal 15 digit";
              } else if (businessEntity.taxId.trim().length > 16) {
                newErrors.businessEntity.taxId = "Nomor NPWP maksimal 16 digit";
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
    setUpdateOrderSuccess,
    setField,
    setError,
    setCargoPhotos,
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
    setUpdateOrderSuccess,
    setField,
    setError,
    setCargoPhotos,
    addLokasi,
    updateLokasi,
    removeLokasi,
    reset,
    validateForm,
    validateSecondForm,
  };
};

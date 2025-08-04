import { create } from "zustand";

import { toast } from "@/lib/toast";
import { zustandDevtools } from "@/lib/utils";

const defaultValues = {
  // Form data state
  opsiPegiriman: null,
  asuransiPengiriman: false,

  // Checkbox states
  kirimBuktiFisik: false,
  bantuanTambahan: false,
  troli: false,

  additionalServices: [],
  tempShippingOptions: [],
  // UI state
  showOtherAdditionalServices: false,
};

export const useLayananTambahanStore = create(
  zustandDevtools(
    (set, get) => ({
      formValues: defaultValues,
      formErrors: {},

      // Actions
      setField: (field, value) =>
        set((state) => ({
          formValues: { ...state.formValues, [field]: value },
          formErrors: { ...state.formErrors, [field]: undefined },
        })),

      setErrors: (errors) =>
        set((state) => ({
          formErrors: { ...state.formErrors, ...errors },
        })),

      validateForm: () => {
        const { namaPenerima, nomorHandphonePenerima, opsiPegiriman } =
          get().formValues;
        const newErrors = {};
        let emptyField = 0;

        if (!namaPenerima) {
          emptyField += 1;
          newErrors.namaPenerima = "Nama penerima wajib diisi";
        } else if (namaPenerima.length < 3) {
          newErrors.namaPenerima = "Nama penerima minimal 3 karakter";
        } else if (/[^a-zA-Z\s]/.test(namaPenerima)) {
          newErrors.namaPenerima = "Penulisan nama penerima tidak valid";
        }

        if (!nomorHandphonePenerima) {
          emptyField += 1;
          newErrors.nomorHandphonePenerima =
            "Nomor handphone penerima wajib diisi";
        } else if (nomorHandphonePenerima.length < 8) {
          newErrors.nomorHandphonePenerima = "No. HP penerima minimal 8 digit";
        } else if (/[^0-9]/.test(nomorHandphonePenerima)) {
          newErrors.nomorHandphonePenerima = "No. HP penerima tidak valid";
        }

        if (!opsiPegiriman) {
          emptyField += 1;
          newErrors.opsiPegiriman = "Opsi pengiriman wajib diisi";
        }

        if (emptyField > 1) {
          toast.error("Terdapat field yang kosong");
        }

        set({ formErrors: newErrors });
        return Object.keys(newErrors).length === 0;
      },
    }),
    {
      name: "layanan-tambahan-store",
    }
  )
);

export const useLayananTambahanActions = () => {
  const store = useLayananTambahanStore();

  return {
    setField: store.setField,
    validateForm: store.validateForm,
    setErrors: store.setErrors,
  };
};

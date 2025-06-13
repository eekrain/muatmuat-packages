import { create } from "zustand";

const defaultValues = {
  // Image upload state
  uploadedImages: [null, null, null, null],

  // Form data
  deskripsiMuatan: "",
  deliveryOrder: "",

  // Badan usaha data
  isBadanUsaha: false,
  badanUsahaData: {
    companyName: "",
    npwp: "",
  },

  // UI state
  showDOInput: false,
};

export const useInformasiPesananStore = create((set, get) => ({
  formValues: defaultValues,
  formErrors: {},

  // Actions
  setField: (field, value) =>
    set((state) => ({
      formValues: { ...state.formValues, [field]: value },
      formErrors: { ...state.formErrors, [field]: undefined },
    })),

  setBadanUsahaField: (field, value) =>
    set((state) => ({
      formValues: {
        ...state.formValues,
        badanUsahaData: {
          ...state.formValues.badanUsahaData,
          [field]: value,
        },
      },
      formErrors: { ...state.formErrors, [field]: undefined },
    })),

  handleImageUpload: (index, imageData) =>
    set((state) => {
      const newImages = [...state.formValues.uploadedImages];
      newImages[index] = imageData;
      return {
        formValues: {
          ...state.formValues,
          uploadedImages: newImages,
        },
      };
    }),

  handleBadanUsahaToggle: (checked) =>
    set((state) => ({
      formValues: {
        ...state.formValues,
        isBadanUsaha: checked,
        // Reset form data when checkbox is unchecked
        badanUsahaData: checked
          ? state.formValues.badanUsahaData
          : {
              companyName: "",
              npwp: "",
            },
      },
    })),

  handleAddDeliveryOrder: () =>
    set((state) => ({
      formValues: {
        ...state.formValues,
        showDOInput: true,
      },
    })),

  validateForm: () => {
    const { deskripsiMuatan, uploadedImages, isBadanUsaha, badanUsahaData } =
      get().formValues;
    const newErrors = {};

    // Validate uploaded images (at least one required)
    const hasUploadedImage = uploadedImages.some((image) => image !== null);
    if (!hasUploadedImage) {
      newErrors.uploadedImages = "Pesanan harus memiliki minimal 1 foto";
    }

    // Validate description
    if (!deskripsiMuatan.trim()) {
      newErrors.deskripsiMuatan = "Deskripsi muatan wajib diisi";
    } else if (deskripsiMuatan.trim().length < 10) {
      newErrors.deskripsiMuatan = "Deskripsi muatan minimal 10 karakter";
    }

    // Validate badan usaha fields if checkbox is checked
    if (isBadanUsaha) {
      if (!badanUsahaData.companyName.trim()) {
        newErrors.companyName = "Nama badan usaha/perusahaan wajib diisi";
      } else if (badanUsahaData.companyName.trim().length < 3) {
        newErrors.companyName =
          "Nama badan usaha/perusahaan minimal 3 karakter";
      } else if (/[^a-zA-Z]/.test(badanUsahaData.companyName)) {
        newErrors.companyName = "Nama badan usaha/perusahaan tidak valid";
      }

      if (!badanUsahaData.npwp.trim()) {
        newErrors.npwp = "Nomor NPWP wajib diisi";
      } else if (badanUsahaData.npwp.trim().length < 15) {
        newErrors.npwp = "Nomor NPWP minimal 15 digit";
      } else if (badanUsahaData.npwp.trim().length > 15) {
        newErrors.npwp = "Nomor NPWP maksimal 16 digit";
      }
    }

    set({ formErrors: newErrors });
    return Object.keys(newErrors).length === 0;
  },

  resetForm: () =>
    set({
      formValues: defaultValues,
      formErrors: {},
    }),
}));

export const useInformasiPesananActions = () => {
  const setField = useInformasiPesananStore((state) => state.setField);
  const setBadanUsahaField = useInformasiPesananStore(
    (state) => state.setBadanUsahaField
  );
  const handleImageUpload = useInformasiPesananStore(
    (state) => state.handleImageUpload
  );
  const handleBadanUsahaToggle = useInformasiPesananStore(
    (state) => state.handleBadanUsahaToggle
  );
  const handleAddDeliveryOrder = useInformasiPesananStore(
    (state) => state.handleAddDeliveryOrder
  );
  const validateForm = useInformasiPesananStore((state) => state.validateForm);
  const resetForm = useInformasiPesananStore((state) => state.resetForm);

  return {
    setField,
    setBadanUsahaField,
    handleImageUpload,
    handleBadanUsahaToggle,
    handleAddDeliveryOrder,
    validateForm,
    resetForm,
  };
};

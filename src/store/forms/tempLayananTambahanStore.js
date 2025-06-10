import { create } from "zustand";

const useTempLayananTambahanStore = create((set, get) => ({
  // Form data state
  namaPenerima: "",
  nomorHandphone: "",
  alamatTujuan: "",
  detailAlamat: "",
  kecamatan: "",
  kodePos: null,

  // Checkbox states
  kirimBuktiFisik: false,
  bantuanTambahan: false,
  troli: false,

  // UI state
  showOtherAdditionalServices: false,

  // Actions
  updateFormData: (field, value) =>
    set((state) => ({
      [field]: value,
    })),

  updateFormDataBulk: (data) =>
    set((state) => ({
      ...data,
    })),

  setKirimBuktiFisik: (value) => set({ kirimBuktiFisik: value }),

  setBantuanTambahan: (value) => set({ bantuanTambahan: value }),

  setTroli: (value) => set({ troli: value }),

  toggleOtherAdditionalServices: () =>
    set((state) => ({
      showOtherAdditionalServices: !state.showOtherAdditionalServices,
    })),

  setShowOtherAdditionalServices: (value) =>
    set({ showOtherAdditionalServices: value }),

  // Reset functions
  resetForm: () =>
    set({
      namaPenerima: "",
      nomorHandphone: "",
      alamatTujuan: "",
      detailAlamat: "",
      kecamatan: "",
      kodePos: "",
    }),

  resetCheckboxes: () =>
    set({
      kirimBuktiFisik: false,
      bantuanTambahan: false,
      troli: false,
    }),

  resetAll: () =>
    set({
      namaPenerima: "",
      nomorHandphone: "",
      alamatTujuan: "",
      detailAlamat: "",
      kecamatan: "",
      kodePos: "",
      kirimBuktiFisik: false,
      bantuanTambahan: false,
      troli: false,
      showOtherAdditionalServices: false,
    }),

  // Computed/derived state
  getTotalAdditionalCost: () => {
    const state = get();
    let total = 0;

    if (state.bantuanTambahan) total += 100000;
    if (state.troli) total += 75000;

    return total;
  },

  getSelectedServices: () => {
    const state = get();
    const services = [];

    if (state.kirimBuktiFisik)
      services.push("Kirim Bukti Fisik Penerimaan Barang");
    if (state.bantuanTambahan) services.push("Bantuan Tambahan");
    if (state.troli) services.push("Troli");

    return services;
  },

  isFormValid: () => {
    const state = get();

    // Check if kirim bukti fisik is selected and required fields are filled
    if (state.kirimBuktiFisik) {
      return !!(
        state.namaPenerima.trim() &&
        state.nomorHandphone.trim() &&
        state.alamatTujuan.trim() &&
        state.detailAlamat.trim() &&
        state.kecamatan.trim() &&
        state.kodePos.trim()
      );
    }

    // If kirim bukti fisik is not selected, form is valid
    return true;
  },
}));

export default useTempLayananTambahanStore;

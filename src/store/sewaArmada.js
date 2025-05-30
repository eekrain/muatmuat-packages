// store/SewaArmada.js
import { create } from "zustand";

export const useSewaArmadaStore = create((set, get) => ({
  // Layanan Type
  rentalType: "",
  setRentalType: (value) => set({ rentalType: value }),

  // Waktu Muat
  startDate: null,
  setStartDate: (value) => set({ startDate: value }),
  endDate: null,
  setEndDate: (value) => set({ endDate: value }),

  // Rentang Waktu
  showRangeOption: false,
  setShowRangeOption: (value) => set({ showRangeOption: value }),

  // Lokasi
  lokasi: { muat: "", bongkar: "" },
  setLokasiMuat: (value) =>
    set((state) => ({
      lokasi: { ...state.lokasi, muat: value },
    })),
  setLokasiBongkar: (value) =>
    set((state) => ({
      lokasi: { ...state.lokasi, bongkar: value },
    })),

  // Tipe Muatan
  tipeMuatan: "bahan-mentah",
  setTipeMuatan: (value) => set({ tipeMuatan: value }),

  // Jenis Muatan
  jenisMuatan: "padat",
  setJenisMuatan: (value) => set({ jenisMuatan: value }),

  // Informasi Muatan
  informasiMuatan: "",
  setInformasiMuatan: (value) => set({ informasiMuatan: value }),

  // Lampiran/Foto Muatan
  fotoMuatan: [null, null, null, null],
  setFotoMuatan: (index, value) =>
    set((state) => {
      let updated = [...state.fotoMuatan]; // copy array

      if (value == null) {
        // Delete the value at index
        updated[index] = null;

        // Collapse all items leftward after the deleted index
        updated = updated
          .filter((item) => item != null) // remove all nulls
          .concat(new Array(state.fotoMuatan.length).fill(null)) // ensure same length
          .slice(0, state.fotoMuatan.length); // trim to original length
      } else {
        // Try to find the first empty slot before the index
        const emptyIndex = updated.findIndex(
          (item, i) => item == null && i < index
        );

        if (emptyIndex !== -1) {
          updated[emptyIndex] = value;
        } else {
          updated[index] = value;
        }
      }

      return { fotoMuatan: updated };
    }),

  // Deskripsi Muatan
  deskripsi: "",
  setDeskripsi: (value) => set({ deskripsi: value }),

  // Jenis Armada
  jenisCarrier: "",
  setJenisCarrier: (value) => set({ jenisCarrier: value }),
  jenisTruk: "",
  setJenisTruk: (value) => set({ jenisTruk: value }),

  // Asuransi Barang
  useAsuransi: true,
  setUseAsuransi: (value) => set({ useAsuransi: value }),

  // Layanan Tambahan
  kirimBuktiFisik: false,
  setKirimBuktiFisik: (value) => set({ kirimBuktiFisik: value }),
  bantuanTambahan: false,
  setBantuanTambahan: (value) => set({ bantuanTambahan: value }),

  // No Delivery Order
  noDO: "",
  setNoDO: (value) => set({ noDO: value }),

  // Tipe Pemesan
  isCompany: false,
  setIsCompany: (value) => set({ isCompany: value }),

  errors: {},
  setErrors: (value) => set({ errors: value }),

  // Reset Form
  resetForm: () =>
    set({
      rentalType: "",
      startDate: null,
      endDate: null,
      showRangeOption: false,
      lokasi: { muat: "", bongkar: "" },
      tipeMuatan: "bahan-mentah",
      jenisMuatan: "padat",
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
    }),

  validateForm: () => {
    const { fotoMuatan, deskripsi } = get();
    const newErrors = {};
    const isValidFotoMuatan = fotoMuatan.some((item) => item !== null);

    if (!isValidFotoMuatan) {
      newErrors.fotoMuatan = "Mohon upload foto muatan";
    }

    if (!deskripsi) {
      newErrors.deskripsi = "Deskripsi Muatan wajib diisi";
    } else if (deskripsi.length < 3) {
      newErrors.deskripsi = "Deskripsi Muatan minimal 3 karakter";
    }

    set({ errors: newErrors });

    // Return true if newErrors is empty, false otherwise
    return Object.keys(newErrors).length === 0;
  },
}));

// store/SewaArmada.js
import { create } from "zustand";

export const useSewaArmadaStore = create((set) => ({
  // Layanan Type
  rentalType: "",
  setRentalType: (value) => set({ rentalType: value }),

  // Waktu Muat
  waktuMuat: "",
  setWaktuMuat: (value) => set({ waktuMuat: value }),

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
  tipeMuatan: "",
  setTipeMuatan: (value) => set({ tipeMuatan: value }),

  // Jenis Muatan
  jenisMuatan: "",
  setJenisMuatan: (value) => set({ jenisMuatan: value }),

  // Informasi Muatan
  informasiMuatan: "",
  setInformasiMuatan: (value) => set({ informasiMuatan: value }),

  // Lampiran/Foto Muatan
  fotoMuatan: [null, null, null, null],
  setFotoMuatan: (index, value) =>
    set((state) => {
      const updated = [...state.fotoMuatan]; // copy array
      updated[index] = value; // update by index
      return { fotoMuatan: updated }; // return new state
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

  // Reset Form
  resetForm: () =>
    set({
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
    }),
}));

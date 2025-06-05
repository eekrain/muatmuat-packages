import { create } from "zustand";

const useTempInformasiMuatanStore = create((set) => ({
  tipeMuatan: "",
  jenisMuatan: "",
  sertifikasiHalal: false,
  informasiMuatan: [
    {
      namaMuatan: null,
      beratMuatan: { berat: 0, unit: "kg" },
      dimensiMuatan: { panjang: 0, lebar: 0, tinggi: 0, unit: "m" },
    },
  ],

  setTempInformasiMuatan: (field, value) =>
    set((state) => ({ ...state, [field]: value })),

  addTempInformasiMuatan: () =>
    set((state) => ({
      ...state,
      informasiMuatan: [
        ...state.informasiMuatan,
        {
          namaMuatan: null,
          beratMuatan: { berat: 0, unit: "kg" },
          dimensiMuatan: { panjang: 0, lebar: 0, tinggi: 0, unit: "m" },
        },
      ],
    })),

  removeTempInformasiMuatan: (index) =>
    set((state) => ({
      ...state,
      informasiMuatan: state.informasiMuatan.filter((_, i) => i !== index),
    })),

  setTempBeratMuatan: (index, key, value) =>
    set((state) => ({
      ...state,
      informasiMuatan: state.informasiMuatan.map((muatan, i) => {
        if (key === "berat") {
          return i === index
            ? {
                ...muatan,
                beratMuatan: {
                  ...muatan.beratMuatan,
                  [key]: value.replace(/\D/g, ""),
                },
              }
            : muatan;
        }
        return i === index
          ? { ...muatan, beratMuatan: { ...muatan.beratMuatan, [key]: value } }
          : muatan;
      }),
    })),
}));

export default useTempInformasiMuatanStore;

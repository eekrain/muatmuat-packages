import { create } from "zustand";

const useBatalkanPesanan = create((set, get) => ({
  modalBatal: false,
  validateReason: false,
  activeReason: false,
  setActiveReason: (state) => set({ activeReason: state }),
  setValidateReason: (state) => set({ validateReason: state }),
  setModalBatal: (state) => set({ modalBatal: state }),
}));

export default useBatalkanPesanan;

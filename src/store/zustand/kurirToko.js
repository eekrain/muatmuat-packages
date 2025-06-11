import { create } from "zustand";

const kurirTokoZustand = create((set) => ({
  isDirty: false,
  setIsDirty: (isDirty) => set({ isDirty }),
  hiddenProvinceIds: [],
  setHiddenProvinceIds: (hiddenProvinceIds) => set({ hiddenProvinceIds }),
  formData: [],
  setFormData: (val) => set({ formData: val }),
  tempData: [],
  setTempData: (val) => set({ tempData: val }),
  // FIX BUG Opsi Pengiriman LB-0022
  resetStore: () =>
    set({ isDirty: false, formData: [], tempData: [], hiddenProvinceIds: [] }),
}));

export default kurirTokoZustand;

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useTransporterFormStore = create(
  persist(
    (set, get) => ({
      forms: {},

      setForm: (key, data) => {
        set((state) => ({
          forms: {
            ...state.forms,
            [key]: data,
          },
        }));
      },

      updateFormField: (key, field, value) => {
        const currentForm = get().forms[key] || {};
        set((state) => ({
          forms: {
            ...state.forms,
            [key]: {
              ...currentForm,
              [field]: value,
            },
          },
        }));
      },

      removeForm: (key) => {
        const { [key]: _, ...rest } = get().forms;
        set({ forms: rest });
      },

      resetForm: (key) => {
        set((state) => ({
          forms: {
            ...state.forms,
            [key]: undefined,
          },
        }));
      },

      getForm: (key) => {
        return get().forms[key] || {};
      },

      isFormComplete: (key) => {
        const form = get().forms[key];
        if (!form) return false;
        const requiredFields = [
          "transporterId",
          "registrantName",
          "registrantEmail",
        ];
        return requiredFields.every(
          (field) => form[field] && form[field].trim() !== ""
        );
      },
    }),
    {
      name: "transporter-forms",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        forms: state.forms,
      }),
    }
  )
);

export const transporterFormStore = useTransporterFormStore.getState();

export const getTransporterForm = (key) => transporterFormStore.getForm(key);

export const isTransporterFormComplete = (key) =>
  transporterFormStore.isFormComplete(key);

export const getAllTransporterForms = () => transporterFormStore.forms;

export const setTransporterForm = (key, data) =>
  transporterFormStore.setForm(key, data);

export const updateTransporterFormField = (key, field, value) =>
  transporterFormStore.updateFormField(key, field, value);

export const removeTransporterForm = (key) =>
  transporterFormStore.removeForm(key);

export const resetTransporterForm = (key) =>
  transporterFormStore.resetForm(key);

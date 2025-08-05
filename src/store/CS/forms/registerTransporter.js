import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useTransporterFormStore = create(
  persist(
    (set, get) => ({
      forms: {},
      tabsStatus: {},

      setForm: (key, data) => {
        set((state) => ({
          forms: {
            ...state.forms,
            [key]: data,
          },
        }));
      },

      updateNestedFormField: (key, path, value) => {
        const currentForm = get().forms[key] || {};
        const newForm = { ...currentForm };
        set(newForm, path, value);

        set((state) => ({
          forms: {
            ...state.forms,
            [key]: newForm,
          },
        }));
      },

      removeForm: (key) => {
        set((state) => {
          const newForms = { ...state.forms };
          delete newForms[key];
          return { forms: newForms };
        });
      },

      getForm: (key) => {
        return get().forms[key];
      },

      isFormComplete: (key, requiredFields) => {
        const form = get().forms[key];
        if (!form) return false;
        return requiredFields.every((field) => !!form[field]);
      },

      setTabStatus: (formKey, newStatusArray) => {
        set((state) => ({
          tabsStatus: {
            ...state.tabsStatus,
            [formKey]: newStatusArray,
          },
        }));
      },

      getTabStatus: (formKey) => {
        return (
          get().tabsStatus[formKey] || [
            "incomplete",
            "incomplete",
            "incomplete",
          ]
        );
      },
      clearRegistrationData: (formKey) => {
        set((state) => {
          const newForms = { ...state.forms };
          const newTabsStatus = { ...state.tabsStatus };
          delete newForms[formKey];
          delete newTabsStatus[formKey];
          return {
            forms: newForms,
            tabsStatus: newTabsStatus,
          };
        });
      },
    }),
    {
      name: "transporter-forms-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        forms: state.forms,
        tabsStatus: state.tabsStatus,
      }),
    }
  )
);

export const getTransporterForm = (key) =>
  useTransporterFormStore.getState().getForm(key);
export const setTransporterForm = (key, data) =>
  useTransporterFormStore.getState().setForm(key, data);
export const updateNestedTransporterFormField = (key, path, value) =>
  useTransporterFormStore.getState().updateNestedFormField(key, path, value);
export const removeTransporterForm = (key) =>
  useTransporterFormStore.getState().removeForm(key);

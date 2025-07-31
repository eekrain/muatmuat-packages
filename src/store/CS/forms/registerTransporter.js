import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useTransporterFormStore = create(
  persist(
    (set, get) => ({
      forms: {},
      actions: {
        setForm: (key, data) => {
          set((state) => ({
            forms: {
              ...state.forms,
              [key]: data,
            },
          }));
        },
        updateFormField: (key, field, value) => {
          const form = get().forms[key] || {};
          set((state) => ({
            forms: {
              ...state.forms,
              [key]: {
                ...form,
                [field]: value,
              },
            },
          }));
        },
        removeForm: (key) => {
          const { [key]: removed, ...rest } = get().forms;
          set({ forms: rest });
        },
        resetForm: (key) => {
          set((state) => ({
            forms: {
              ...state.forms,
              [key]: {},
            },
          }));
        },
      },
    }),
    {
      name: "transporter-forms", // Semua form tersimpan di localStorage dalam satu objek
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Menyimpan form ke key "v"
// const { setForm } = useTransporterFormStore((state) => state.actions);

// setForm("v", {
//   transporterId: "uuid-transporter",
//   registrantName: "John Doe",
//   // ...data lainnya
// });

// Mengupdate field tertentu
// const { updateFormField } = useTransporterFormStore((state) => state.actions);

// updateFormField("v", "registrantEmail", "john@update.com");

// Mengambil data form
// const formData = useTransporterFormStore((state) => state.forms["v"]);

// Reset Data Form
// const { resetForm } = useTransporterFormStore((state) => state.actions);
// resetForm("v");

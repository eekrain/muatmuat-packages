import { create } from "zustand";
import { persist } from "zustand/middleware";

import { zustandDevtools } from "@/lib/utils";

/**
 * @typedef {Object} SelectedLanguageState
 * @property {string|null} selectedLanguage - The currently selected language code
 * @property {Object} actions - Actions to modify the selected language
 * @property {function(string): void} actions.setSelectedLanguage - Function to set the selected language
 */

/**
 * Store for managing the selected language
 * @type {import('zustand').UseStore<SelectedLanguageState>}
 */
export const useSelectedLanguageStore = create(
  zustandDevtools(
    persist(
      (set) => ({
        selectedLanguage: null,
        actions: {
          setSelectedLanguage: (selected) =>
            set({
              selectedLanguage: selected,
            }),
        },
      }),
      {
        name: "locale-selection",
        getStorage: () => localStorage,
        // Only persist selectedLanguage, not actions
        partialize: (state) => ({ selectedLanguage: state.selectedLanguage }),
      }
    ),
    {
      name: "locale-selection",
    }
  )
);

/**
 * Hook to access selected language actions
 * @returns {SelectedLanguageState['actions']}
 */
export const useSelectedLanguageActions = () =>
  useSelectedLanguageStore((s) => s.actions);

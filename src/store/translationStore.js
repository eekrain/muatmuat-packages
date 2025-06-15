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

/**
 * @typedef {Object} TranslationState
 * @property {Object} translation - The current translation object
 * @property {string[]} listLanguages - List of available languages
 * @property {boolean} isTranslationsReady - Whether translations are loaded
 * @property {Object} actions - Actions to modify translations
 * @property {function(string[]): void} actions.setListLanguages - Function to set available languages
 * @property {function(string): Promise<void>} actions.updateTranslations - Function to update translations for a language
 */

/**
 * Store for managing translations
 * @type {import('zustand').UseStore<TranslationState>}
 */
export const useTranslationStore = create(
  zustandDevtools(
    (set) => ({
      // State
      translation: {},
      listLanguages: [],
      isTranslationsReady: false,
      // Actions grouped in an actions object
      actions: {
        setListLanguages: (listLanguages) => set({ listLanguages }),

        updateTranslations: async (languageUrl) => {
          if (!languageUrl) return console.error("Locale is not defined");

          const envProd = process.env.NEXT_PUBLIC_ENVIRONMENT;
          const s3url = process.env.NEXT_PUBLIC_S3_URL;
          const url = `${s3url}content-general/locales/${envProd}/${languageUrl}/common.json`;

          try {
            const response = await fetch(url, {
              headers: {
                "Content-Type": "application/json",
                "Cache-Control":
                  "public, max-age=86400, stale-while-revalidate=3600",
              },
            });
            if (!response.ok) {
              throw new Error(`Failed to fetch ${languageUrl} translations`);
            }
            const data = await response.json();
            set({ translation: data, isTranslationsReady: true });
          } catch (error) {
            console.error(
              `Error fetching ${languageUrl} translations: ${error.message}`
            );
            set({ translation: {}, isTranslationsReady: true });
          }
        },
      },
    }),
    {
      name: "translation",
    }
  )
);

/**
 * Hook to access translation actions
 * @returns {TranslationState['actions']}
 */
export const useTranslationActions = () =>
  useTranslationStore((s) => s.actions);

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * @typedef {Object} SelectedLanguage
 * @property {string} languangeid - Unique identifier for the language
 * @property {string} image - URL to the language's flag/image
 * @property {string} locale - Full locale name with region
 * @property {string} url - Short URL code for the language
 * @property {string} code - Language-region code
 * @property {string} name - Display name of the language
 * @property {boolean} default - Whether this is the default language
 */

/**
 * @typedef {Object} SelectedLanguageState
 * @property {SelectedLanguage|null} selectedLanguage - The currently selected language
 */

/**
 * @typedef {Object} SelectedLanguageActions
 * @property {(selected: string) => void} setSelectedLanguage - Set the selected language
 */

/**
 * @typedef {SelectedLanguageState & SelectedLanguageActions} SelectedLanguageStore
 */

/**
 * Creates the selected language store with persistence
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<SelectedLanguageStore>>}
 */
export const useSelectedLanguageStore = create(
  persist(
    /** @param {import('zustand').StateCreator<SelectedLanguageStore>} set */
    (set) => ({
      selectedLanguage: null,
      // Actions should be defined at the root level, not inside persisted state,
      // to avoid issues with rehydration and undefined functions.
      setSelectedLanguage: (selected) =>
        set({
          selectedLanguage: selected,
        }),
    }),
    {
      name: "locale",
      getStorage: () => localStorage,
      // Only persist selectedLanguage, not actions
      partialize: (state) => ({ selectedLanguage: state.selectedLanguage }),
    }
  )
);

/**
 * @typedef {Object} TranslationState
 * @property {Object.<string, any>} translation - Translation key-value pairs
 * @property {string[]} listLanguages - List of available languages
 */

/**
 * @typedef {Object} TranslationActions
 * @property {(listLanguages: string[]) => void} setListLanguages - Set the list of available languages
 * @property {(languageUrl: string) => Promise<void>} updateTranslations - Fetch and update translations for a language
 * @property {() => boolean} isTranslationsReady - Check if translations are loaded
 */

/**
 * @typedef {TranslationState & { actions: TranslationActions }} TranslationStore
 */

/**
 * Creates the translation slice
 * @param {import('zustand').StateCreator<TranslationStore>} set
 * @param {import('zustand').StoreApi<TranslationStore>['getState']} get
 * @returns {TranslationStore}
 */
const createTranslationSlice = (set, get) => ({
  // State
  translation: {},
  listLanguages: [],
  isTranslationsReady: false,
  // Actions grouped in an actions object
  actions: {
    setListLanguages: (listLanguages) => set({ listLanguages }),

    updateTranslations: async (languageUrl) => {
      if (!languageUrl) return console.error("Locale is not defined");

      // const envProd = process.env.NEXT_PUBLIC_ENVIRONMENT;
      // const s3url = process.env.NEXT_PUBLIC_S3_URL;
      // const url = `${s3url}content-general/locales/${envProd}/${languageUrl}/common.json`;
      const url = `https://azlogistik-rc.s3.ap-southeast-3.amazonaws.com/content-general/locales/rc/${languageUrl}/common.json`;
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
        console.log("🚀 ~ updateTranslations: ~ data:", data);
        set({ translation: data, isTranslationsReady: true });
      } catch (error) {
        console.error(
          `Error fetching ${languageUrl} translations: ${error.message}`
        );
        set({ translation: {}, isTranslationsReady: true });
      }
    },
  },
});

/**
 * Creates the translation store
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<TranslationStore>>}
 */
export const useTranslationStore = create(createTranslationSlice);

/**
 * Hook to access translation actions
 * @returns {TranslationActions}
 */
export const useTranslationActions = () =>
  useTranslationStore((state) => state.actions);

/**
 * Hook to access selected language actions
 * @returns {SelectedLanguageActions}
 */
export const useSelectedLanguageActions = () => {
  const setSelectedLanguage = useSelectedLanguageStore(
    (state) => state.setSelectedLanguage
  );
  return { setSelectedLanguage };
};

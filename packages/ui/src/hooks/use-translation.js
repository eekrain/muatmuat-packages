"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import xior from "xior";
import { createStore, useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { fetcherMuatparts } from "@/lib/axios";

import {
  useSelectedLanguageActions,
  useSelectedLanguageStore,
} from "@/store/Shipper/selectedLanguageStore";

/* eslint-disable no-console */

const useMockTranslation = true;

const cacheConfig = {
  headers: {
    "Content-Type": "application/json",
    // Cache for 1 week, but allow revalidation for every 1 hour
    "Cache-Control": "public, max-age=604800, stale-while-revalidate=3600",
  },
};

const createTranslationStore = () =>
  createStore((set) => ({
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
        // const url = `${s3url}content-general/locales/muat-trans/${envProd}/${languageUrl}/common.json`;

        try {
          if (useMockTranslation) {
            const [commonResult, mockResult] = await Promise.allSettled([
              xior.get(url, cacheConfig),
              xior.get(`/mock-common-${languageUrl}.json`),
            ]);

            // Always set translation data, even if one or both requests failed
            const mergedTranslation = {
              ...(commonResult?.value?.data || {}),
              ...(mockResult?.value?.data || {}),
            };
            // console.log(
            //   "🚀 ~ createTranslationStore ~ mergedTranslation:",
            //   mergedTranslation
            // );
            set({
              translation: mergedTranslation,
            });
          } else {
            const response = await xior.get(url, cacheConfig);
            set({ translation: response.data });
          }
        } catch (error) {
          console.warn(
            `Error fetching ${languageUrl} translations: ${error.message}`
          );
          set({ translation: {} });
        } finally {
          await new Promise((resolve) => setTimeout(resolve, 500));
          set({ isTranslationsReady: true });
        }
      },
    },
  }));

const TranslationContext = createContext(null);

export const TranslationProvider = ({ children }) => {
  const store = useRef(createTranslationStore()).current;
  const translation = useStore(
    store,
    useShallow((s) => s.translation)
  );

  /**
   * Translates a given key, replacing placeholders with provided parameters.
   * If the key is not found, it returns an optional fallback string or the key itself.
   *
   * @typedef {Record<string, string | number>} TranslationParams
   *
   * @type {(label: string, params?: TranslationParams, fallback?: string) => string}
   *
   * @param {string} label - The translation key (e.g., 'welcome_message').
   * @param {TranslationParams} [params] - An object whose keys match placeholders in the translation string (e.g., `{name: 'John'}` for a placeholder like `{name}`).
   * @param {string} [fallback] - An optional string to return if the `label` is not found in the translations.
   * @returns {string} The translated and formatted string, the fallback string, or the original `label` if no translation or fallback is available.
   *
   * @example
   * // Basic usage - returns translation or original key
   * t('welcome_message') // Returns: "Welcome to our app" (if translation exists) or "welcome_message"
   *
   * @example
   * // With parameters for placeholder replacement
   * t('hello_user', {name: "John"}) // Returns: "Hello John" (if translation is "Hello {name}")
   *
   * @example
   * // Multiple parameters
   * t('order_summary', {count: 5, total: 100}) // Returns: "You have 5 items totaling $100" (if translation is "You have {count} items totaling ${total}")
   *
   * @example
   * // With custom fallback text
   * t('missing_key', {name: "John"}, "Hello John!") // Returns: "Hello John!" (uses fallback when key not found)
   *
   * @example
   * // Complex example with all parameters
   * t('user_greeting', {name: "Alice", time: "morning"}, "Good morning, Alice!") // Returns translation with params or fallback
   *
   * @example
   * // Fallback without parameters
   * t('unknown_key', null, "Default message") // Returns: "Default message" (when key not found)
   */
  const t = useCallback(
    (label, params, fallback) => {
      const template = translation[label];
      if (!template) return fallback || label;

      if (params) {
        return template.replace(/{(\w+)}/g, (_, key) => String(params[key]));
      }

      return template;
    },
    [translation]
  );

  useInitTranslation(store);

  return (
    <TranslationContext.Provider value={{ ...store, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

/**
 * @typedef {Object} UseTranslationReturn
 * @property {(label: string, params?: Record<string, string | number>) => string} t - Translation function
 * @property {boolean} isTranslationsReady - Whether translations are loaded and ready
 */

/**
 * Custom hook to access translation function and readiness state.
 * @returns {UseTranslationReturn}
 */
export const useTranslation = () => {
  const store = useContext(TranslationContext);
  if (!store) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  const isTranslationsReady = useStore(store, (s) => s.isTranslationsReady);

  return {
    t: store.t,
    isTranslationsReady,
  };
};

export const useListLanguages = () => {
  const store = useContext(TranslationContext);
  if (!store) {
    throw new Error(
      "useListLanguages must be used within a TranslationProvider"
    );
  }
  const listLanguages = useStore(
    store,
    useShallow((s) => s.listLanguages)
  );
  return { listLanguages };
};

const useInitTranslation = (store) => {
  const selectedLanguageUrl = useSelectedLanguageStore(
    (s) => s.selectedLanguage?.url
  );

  const { setSelectedLanguage } = useSelectedLanguageActions();
  const { setListLanguages, updateTranslations } = useStore(
    store,
    (s) => s.actions
  );

  const [hasSetupSelectedLanguage, setHasSetupSelectedLanguage] =
    useState(false);

  // First this effect will run, and it will fetch the list of language and initialize the selectedLanguage state
  useEffect(() => {
    // This function is used to initialize the list of language and the translations
    const initLanguageSelection = async () => {
      try {
        // First we fetch the list of language
        const response = await fetcherMuatparts.get(
          "v1/bo/language/list?supermenuid=6&role=5",
          cacheConfig
        );
        const listLanguages = response.data.Data;
        setListLanguages(listLanguages);

        let currentLanguageUrl = selectedLanguageUrl;
        const defaultLanguage =
          listLanguages.find((x) => x.default) || listLanguages[0];
        // After we fetch the list of language, we need to check if the selectedLanguage zustand state is initialized
        // If not, we set the selectedLanguage state to the default language
        if (!currentLanguageUrl) {
          setSelectedLanguage(defaultLanguage);
          currentLanguageUrl = defaultLanguage.url;
        } else {
          // So here the selectedLanguage state is defined, but it might be the response from listLang is removed / not found
          // Example: The back-office decided to remove the language, but the selectedLanguage state is still there
          const currentLanguageFound = listLanguages.find(
            (x) => x.url === currentLanguageUrl
          );
          if (!currentLanguageFound) {
            // We need to reset the selectedLanguage state to the default language
            setSelectedLanguage(defaultLanguage);
            currentLanguageUrl = defaultLanguage.url;
          } else {
            // If the selectedLanguage state is found, we need to ensure that the selectedLanguage state is always up to date with the latest listLang response
            // Because selectedLanguage is persisted to local storage, so it will not be updated if the listLang is changed
            setSelectedLanguage(currentLanguageFound);
            currentLanguageUrl = currentLanguageFound.url;
          }
        }

        // And only after the selectedLanguage state is setup, we can start to trigger fetch the translations, because the translations are dependent on user selected language
        setHasSetupSelectedLanguage(true);
      } catch (error) {
        console.error("Failed to initialize translations", error);
      }
    };

    if (!hasSetupSelectedLanguage) {
      initLanguageSelection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguageUrl, hasSetupSelectedLanguage]);

  // This effect will run when the selectedLanguageUrl or hasSetupSelectedLanguage state is true
  useEffect(() => {
    if (selectedLanguageUrl && hasSetupSelectedLanguage) {
      updateTranslations(selectedLanguageUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguageUrl, hasSetupSelectedLanguage]);
};

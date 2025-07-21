import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

        try {
          const response = await xior.get(url, cacheConfig);
          set({ translation: response.data });
        } catch (error) {
          console.error(
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

  const tesTranslation = useMemo(() => {
    return {
      "label.eka": "Eka Di mana wkw {index}",
      ...translation,
    };
  }, [translation]);

  /**
   * Translation function that replaces placeholders in translation keys with provided parameters
   * @param {string} label - The translation key to look up
   * @param {Record<string, string | number>} [params] - Optional parameters object to replace placeholders
   * @returns {string} The translated string with replaced placeholders, or the original label if translation not found
   *
   * @example
   * // Basic usage
   * t(welcome_message') // Returns: "Welcome to our app"
   *
   * // With parameters
   * t('hello_user', {name: "John" })// Returns: "Hello John" (if translation is "Hello {name}")
   *
   * // Multiple parameters
   * t('items_count,  {count: 5, }) // Returns: "Showing 5 of 10 items" (if translation is "Showing {count} of {total} items")
   *
   * // Fallback to original label if translation not found
   * t('unknown_key') // Returns: "unknown_key"
   */
  const t = useCallback(
    (label, params) => {
      if (!tesTranslation?.[label]) return label;
      const template = tesTranslation[label];
      if (params) {
        return template.replace(/\{(\w+)\}/g, (match, key) =>
          params[key] !== undefined ? params[key] : match
        );
      }
      return template;
    },
    [tesTranslation]
  );

  useInitTranslation(store);

  return (
    <TranslationContext.Provider value={{ ...store, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

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

  // This effect will run when the selectedLanguageUrl or hasSetupSelectedLanguage state is changed
  useEffect(() => {
    if (selectedLanguageUrl && hasSetupSelectedLanguage) {
      updateTranslations(selectedLanguageUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguageUrl, hasSetupSelectedLanguage]);
};

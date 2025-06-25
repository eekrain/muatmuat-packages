import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { createStore, useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { fetcherMuatparts } from "@/lib/axios";
import {
  useSelectedLanguageActions,
  useSelectedLanguageStore,
} from "@/store/selectedLanguageStore";

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
  }));

const TranslationContext = createContext(null);

export const TranslationProvider = ({ children }) => {
  const store = useRef(createTranslationStore()).current;
  const translation = useStore(
    store,
    useShallow((s) => s.translation)
  );
  const isTranslationsReady = useStore(store, (s) => s.isTranslationsReady);

  const t = useCallback(
    (key) => {
      return translation[key] || key;
    },
    [translation]
  );

  useInitTranslation(store);

  return (
    <TranslationContext.Provider value={{ ...store, t }}>
      {isTranslationsReady && children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const store = useContext(TranslationContext);
  if (!store) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  const listLanguages = useStore(
    store,
    useShallow((s) => s.listLanguages)
  );

  return {
    t: store.t,
    listLanguages,
  };
};

const useInitTranslation = (store) => {
  const selectedLanguageUrl = useSelectedLanguageStore(
    (state) => state.selectedLanguage?.url
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
          {
            headers: {
              "Content-Type": "application/json",
              // Cache for 24 hours, but allow revalidation for every 1 hour
              "Cache-Control":
                "public, max-age=86400, stale-while-revalidate=3600",
            },
          }
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

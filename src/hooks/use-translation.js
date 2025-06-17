import { useCallback, useEffect, useState } from "react";

import { fetcherMuatparts } from "@/lib/axios";
import {
  useSelectedLanguageActions,
  useSelectedLanguageStore,
  useTranslationActions,
  useTranslationStore,
} from "@/store/translationStore";

export const useTranslation = () => {
  const translation = useTranslationStore((state) => state.translation);
  const isTranslationsReady = useTranslationStore(
    (state) => state.isTranslationsReady
  );

  const t = useCallback(
    (key) => {
      return translation[key] || key;
    },
    [translation]
  );

  return {
    t,
    isTranslationsReady,
  };
};

export const useInitTranslation = () => {
  const selectedLanguageUrl = useSelectedLanguageStore(
    (state) => state.selectedLanguage?.url
  );

  const { setSelectedLanguage } = useSelectedLanguageActions();
  const { setListLanguages, updateTranslations } = useTranslationActions();

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

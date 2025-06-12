import { useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import {
  useSelectedLanguageActions,
  useSelectedLanguageStore,
  useTranslationStore,
} from "@/store/translationStore";

const LanguageDropdown = () => {
  const [open, setOpen] = useState(false);
  const selectedLanguage = useSelectedLanguageStore(
    (state) => state.selectedLanguage
  );
  const listLanguages = useTranslationStore((state) => state.listLanguages);
  const { setSelectedLanguage } = useSelectedLanguageActions();

  return (
    <div
      tabIndex={0}
      className="relative inline-flex cursor-pointer items-center gap-1 text-xs font-medium"
      onClick={() => setOpen(!open)}
    >
      <img
        src={selectedLanguage?.image}
        className="h-4 w-6 rounded-[5px] border"
        alt="flag"
      />
      <span className="pt-[2px] text-xs font-semibold">
        {selectedLanguage?.name}
      </span>
      <IconComponent
        width={16}
        loader={false}
        className={`-mt-[2px] ${open && "rotate-180"}`}
        src="/icons/chevron-down.svg"
      />
      {/* toggle bahasa */}
      {open && (
        <div className="shadow-muat shadow-muat absolute left-0 top-6 z-50 flex w-[216px] cursor-pointer flex-col rounded-md border border-neutral-300 bg-neutral-50">
          {listLanguages?.map((language, index) => {
            return (
              <span
                key={index}
                className={
                  "flex cursor-pointer items-center justify-between p-2 font-medium text-neutral-900"
                }
                onClick={() => {
                  setSelectedLanguage(language);
                }}
              >
                <div className="flex items-center gap-2">
                  <img src={language.image} className="h-4 w-6" alt="Flag" />
                  <span
                    className={`pt-1 hover:text-muat-trans-primary-600 ${
                      selectedLanguage.name == language.name && "font-bold"
                    }`}
                  >
                    {language.name}
                  </span>
                </div>
                {/* LB - 0601, 25.03 */}
                {selectedLanguage.name == language.name && (
                  <ImageComponent
                    src="/img/checkedblue.png"
                    className="h-4 w-4"
                    alt="Selected Icon"
                  />
                )}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;

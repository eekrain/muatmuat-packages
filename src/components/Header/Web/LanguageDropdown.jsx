import { useEffect, useState } from "react";

import { ChevronDown } from "lucide-react";

import ImageComponent from "@/components/ImageComponent/ImageComponent";

import { useListLanguages } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

import { useOverlayAction } from "@/store/Shared/overlayStore";
import {
  useSelectedLanguageActions,
  useSelectedLanguageStore,
} from "@/store/Shipper/selectedLanguageStore";

const LanguageDropdown = () => {
  const [open, setOpen] = useState(false);
  const selectedLanguage = useSelectedLanguageStore(
    (state) => state.selectedLanguage
  );
  const { listLanguages } = useListLanguages();
  const { setSelectedLanguage } = useSelectedLanguageActions();
  const { setIsOverlayActive } = useOverlayAction();

  useEffect(() => {
    setIsOverlayActive(open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
      <span className="capsize block text-xs font-semibold">
        {selectedLanguage?.name}
      </span>
      <ChevronDown
        className={cn(
          "h-4 w-4 transition-transform duration-300",
          open && "rotate-180"
        )}
      />
      {/* toggle bahasa */}
      {open && (
        <div className="absolute left-0 top-6 z-50 flex w-[216px] cursor-pointer flex-col rounded-md border border-neutral-300 bg-neutral-50 shadow-muat">
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
                      selectedLanguage.name === language.name && "font-bold"
                    }`}
                  >
                    {language.name}
                  </span>
                </div>
                {/* LB - 0601, 25.03 */}
                {selectedLanguage.name === language.name && (
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

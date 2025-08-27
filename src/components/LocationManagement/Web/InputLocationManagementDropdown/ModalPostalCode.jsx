import { useState } from "react";

import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";

import { useTranslation } from "@/hooks/use-translation";

import { InputSearch } from "../../../InputSearch/InputSearch";

export const ModalPostalCode = ({
  open,
  searchValue,
  setSearchValue,
  options,
  onSelectPostalCode,
  needValidateLocationChange,
}) => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <Modal
      open={open}
      onOpenChange={() => {}}
      closeOnOutsideClick={false}
      withCloseButton={false}
    >
      <ModalContent>
        <div className="relative w-[472px] space-y-6 p-6">
          <div className="text-center text-sm font-bold">
            {t("labelFillVPS")}
          </div>
          <div className="min-h-[1px] w-full border border-solid border-stone-300 bg-stone-300" />
          {errorMessage && (
            <div className="mt-2 flex items-center justify-center gap-2.5 rounded-md border border-error-400 bg-error-50 py-4 text-center text-xs font-semibold">
              <ImageComponent
                src="/img/alert.png"
                width={18}
                height={18}
                className={"pb-px"}
              />
              <span>{t(errorMessage)}</span>
            </div>
          )}
          <InputSearch
            name="search"
            placeholder={t("labelSearchVPS")}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            icon={{ left: "/icons/search.svg" }}
            options={options}
            getOptionLabel={(option) => option.Description}
            onSelectValue={(val) =>
              onSelectPostalCode(val, needValidateLocationChange)
            }
          />
        </div>
      </ModalContent>
    </Modal>
  );
};

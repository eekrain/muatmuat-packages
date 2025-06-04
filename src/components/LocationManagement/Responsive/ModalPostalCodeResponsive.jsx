import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { useTranslation } from "@/hooks/use-translation";

import { InputSearch } from "../common/InputSearch";

export const ModalPostalCodeResponsive = ({
  open,
  searchValue,
  setSearchValue,
  options,
  onSelectPostalCode,
  onOpenChange,
}) => {
  const { t } = useTranslation();

  const [tempSelectedPostalCode, setTempSelectedPostalCode] = useState(null);
  const [hideDropdown, setHideDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSelect = (option) => {
    setTempSelectedPostalCode(option);
    setSearchValue(option.Description);
    setHideDropdown(true);
  };

  const handleSave = () => {
    if (!tempSelectedPostalCode?.Description) {
      setErrorMessage("Kelurahan/Kecamatan/Kode Pos harus diisi");
      return;
    }

    onSelectPostalCode(tempSelectedPostalCode);

    // Reset state and close the modal
    setSearchValue("");
    setTempSelectedPostalCode(null);
    setHideDropdown(false);
    setErrorMessage("");
    onOpenChange(false);
  };

  useEffect(() => {
    // If search value is empty, then reset hideDropdown to false and tempSelectedPostalCode to null
    // e.g: user click icon X (clear)
    if (!searchValue) {
      setHideDropdown(false);
      setTempSelectedPostalCode(null);
    }
  }, [searchValue]);

  return (
    <Modal open={open} closeOnOutsideClick={false} withCloseButton={false}>
      <ModalContent>
        <div className="relative w-[328px] space-y-6 p-6">
          <div className="text-center text-sm font-bold">
            {t("labelFillVPS")}
          </div>
          <div className="min-h-[1px] w-full border border-solid border-stone-300 bg-stone-300" />
          {errorMessage && (
            <div className="mt-2 flex items-center justify-center gap-2.5 rounded-md border border-error-400 bg-error-50 p-3 text-center text-xs font-semibold">
              <IconComponent
                src="/icons/toast-error.svg"
                width={18}
                height={18}
                className={"pb-px text-error-400"}
              />
              <span className="text-balance">{t(errorMessage)}</span>
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
            onSelectValue={handleSelect}
            hideDropdown={hideDropdown}
            errorMessage={errorMessage}
          />

          <div className="flex flex-row justify-center gap-2">
            <Button
              color="primary_secondary"
              onClick={() => onOpenChange(false)}
              className="h-8 min-w-[108px]"
              type="muatparts"
            >
              Batal
            </Button>
            <Button
              color="primary"
              onClick={handleSave}
              className="h-8 min-w-[108px]"
              type="muatparts"
            >
              Simpan
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

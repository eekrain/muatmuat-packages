import { useState } from "react";

import Button from "@/components/Button/Button";
import { InputSearch } from "@/components/InputSearch/InputSearch";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { useTranslation } from "@/hooks/use-translation";

export const ModalPostalCode = ({
  open,
  setOpen, // ✅ tambahkan ini
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
      onOpenChange={setOpen}
      closeOnOutsideClick={false}
      withCloseButton={false}
    >
      <ModalContent>
        <div className="relative w-[472px] space-y-6 p-6">
          <div className="text-center text-sm font-bold">
            {t("labelFillVPS")}
          </div>
          <div className="min-h-[1px] w-full border border-solid border-stone-300 bg-stone-300" />

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
            errorMessage={errorMessage}
          />
        </div>

        <div className="flex items-center justify-center gap-2 pb-4">
          {/* Button Batalkan */}
          <Button
            variant="muattrans-primary-secondary"
            onClick={() => {
              setSearchValue("");
              setErrorMessage("");
              setOpen(false); // ✅ tutup modal
            }}
          >
            {t("labelCancel")}
          </Button>

          {/* Button Simpan */}
          <Button
            variant="muattrans-primary"
            onClick={() => {
              if (!searchValue) {
                setErrorMessage("Kelurahan/Kecamatan/Kode Pos wajib diisi");
              } else {
                setErrorMessage("");
                onSelectPostalCode(searchValue, needValidateLocationChange);
                setOpen(false); // ✅ tutup modal setelah simpan juga
              }
            }}
          >
            {t("labelSave")}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

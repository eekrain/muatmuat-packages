import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Form/Input";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import { useTranslation } from "@/hooks/use-translation";

export const ModalNamaMuatan = ({ open, onOpenChange, onSubmit }) => {
  const { t } = useTranslation();
  const [namaMuatan, setNamaMuatan] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setNamaMuatan("");
  }, [open]);

  const handleSubmit = () => {
    if (namaMuatan.length === 0) {
      setError("Nama Muatan harus diisi");
      return;
    }
    if (namaMuatan.length < 3) {
      setError("Nama Muatan minimal 3 karakter");
      return;
    }
    // only accept alphabet and space
    if (!/^[a-zA-Z\s]+$/.test(namaMuatan)) {
      setError("Nama Muatan tidak valid");
      return;
    }

    setError("");
    onSubmit(namaMuatan);
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="w-modal-small" type="muattrans">
        <ModalHeader size="small" />
        <div className="px-6 py-9">
          <div className="flex flex-col items-center justify-center gap-6">
            {/* Judul Modal */}
            <h2 className="w-full text-center text-base font-bold leading-[19.2px] text-neutral-900">
              {t("Masukkan Nama Muatan")}
            </h2>

            <Input
              value={namaMuatan}
              onChange={(e) => setNamaMuatan(e.currentTarget.value)}
              placeholder={t("Masukkan Nama Muatan")}
              className="w-full cursor-pointer"
              appearance={{
                inputClassName: "w-full cursor-pointer",
              }}
              errorMessage={error}
            />

            {/* Container Tombol */}
            <div className="flex flex-row justify-center gap-2">
              <Button
                variant="muatparts-primary-secondary"
                onClick={() => {}}
                className="h-8 w-[112px]"
              >
                {t("Batal")}
              </Button>
              <Button
                variant="muatparts-primary"
                onClick={handleSubmit}
                className="h-8 w-[112px]"
              >
                {t("Simpan")}
              </Button>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

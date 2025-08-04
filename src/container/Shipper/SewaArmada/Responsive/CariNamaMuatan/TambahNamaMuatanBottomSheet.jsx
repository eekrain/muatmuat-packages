"use client";

import { useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/BottomSheet";
import Button from "@/components/Button/Button";
import TextArea from "@/components/TextArea/TextArea";
import { useTranslation } from "@/hooks/use-translation";

const TambahNamaMuatanBottomSheet = ({
  open,
  onOpenChange,
  onSubmit,
  cargoTypeId,
  cargoCategoryId,
}) => {
  const { t } = useTranslation();
  const [namaMuatan, setNamaMuatan] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!namaMuatan.trim()) {
      newErrors.namaMuatan = t(
        "CariNamaMuatanScreen.errorCargoNameRequired",
        {},
        "Nama muatan wajib diisi"
      );
    }
    // Minimum length validation (3 characters)
    else if (namaMuatan.trim().length < 3) {
      newErrors.namaMuatan = t(
        "CariNamaMuatanScreen.errorCargoNameMinLength",
        {},
        "Nama muatan minimal 3 karakter"
      );
    }
    // Invalid characters validation (no special characters except spaces)
    else if (!/^[a-zA-Z0-9\s]+$/.test(namaMuatan.trim())) {
      newErrors.namaMuatan = t(
        "CariNamaMuatanScreen.errorCargoNameInvalid",
        {},
        "Penulisan nama muatan tidak valid"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        label: namaMuatan.trim(),
        value: namaMuatan.trim().toLowerCase().replace(/\s+/g, "_"),
        isCustom: true,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setNamaMuatan("");
    setErrors({});
    onOpenChange(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNamaMuatan(value);

    // Clear error when user starts typing
    if (errors.namaMuatan) {
      setErrors({});
    }
  };

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent className="max-h-[75vh]">
        <BottomSheetHeader>
          {t(
            "CariNamaMuatanScreen.titleEnterCargoName",
            {},
            "Masukkan Nama Muatan"
          )}
        </BottomSheetHeader>

        <div className="flex flex-col gap-4 px-4 py-4">
          <div className="flex flex-col gap-2">
            <TextArea
              name="namaMuatan"
              placeholder={t(
                "CariNamaMuatanScreen.placeholderCargoNameExample",
                {},
                "Contoh : Karet Mentah"
              )}
              value={namaMuatan}
              onChange={handleInputChange}
              status={errors.namaMuatan ? "error" : null}
              maxLength={50}
              hasCharCount={true}
              height={80}
              supportiveText={{
                title: errors.namaMuatan || "",
                desc: "",
              }}
            />
          </div>
        </div>

        <div className="border-t border-neutral-200 px-4 py-4">
          <Button
            variant="muatparts-primary"
            className="w-full"
            onClick={handleSubmit}
            type="button"
          >
            {t("CariNamaMuatanScreen.buttonSave", {}, "Simpan")}
          </Button>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default TambahNamaMuatanBottomSheet;

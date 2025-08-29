"use client";

import { useState } from "react";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/BottomSheet/BottomSheetUp";
import Button from "@/components/Button/Button";
import { ExpandableTextArea } from "@/components/Form/ExpandableTextArea";

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
      {/* 25. 18 - Web - LB - 0032 */}
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>
            {t(
              "CariNamaMuatanScreen.titleEnterCargoName",
              {},
              "Masukkan Nama Muatan"
            )}
          </BottomSheetTitle>
        </BottomSheetHeader>

        <div className="px-4">
          <ExpandableTextArea
            value={namaMuatan}
            onChange={handleInputChange}
            placeholder={t(
              "CariNamaMuatanScreen.placeholderCargoNameExample",
              {},
              "Contoh : Karet Mentah"
            )}
            errorMessage={errors.namaMuatan}
            appearance={{
              inputClassName: "max-h-[47px]",
            }}
          />
        </div>
        <BottomSheetFooter>
          <Button
            variant="muatparts-primary"
            className="w-full"
            onClick={handleSubmit}
            type="button"
          >
            {t("CariNamaMuatanScreen.buttonSave", {}, "Simpan")}
          </Button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default TambahNamaMuatanBottomSheet;

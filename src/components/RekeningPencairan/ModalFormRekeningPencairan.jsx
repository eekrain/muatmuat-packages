import { useShallow } from "zustand/react/shallow";

import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useTranslation } from "@/hooks/use-translation";
import {
  useRekeningPencairanActions,
  useRekeningPencairanStore,
} from "@/store/Shipper/forms/rekeningPencairanStore";

import { Alert } from "../Alert/Alert";
import Button from "../Button/Button";
import Checkbox from "../Form/Checkbox";
import Input from "../Form/Input";
import { Select } from "../Form/Select";
import { Modal, ModalContent, ModalHeader } from "../Modal/Modal";

export const ModalFormRekeningPencairan = ({
  open,
  onOpenChange,
  labelTitle = "titleAccountInfo",
  defaultValues = null,
  bankOptions = [],
  dataRekening = [],
  onSave = () => {},
}) => {
  const { t } = useTranslation();
  const { formValues, formErrors } = useRekeningPencairanStore(
    useShallow((state) => ({
      formValues: state.formValues,
      formErrors: state.formErrors,
    }))
  );
  const { setField, validateForm, reset } = useRekeningPencairanActions();

  const handleSave = () => {
    const isValid = validateForm({ dataRekening });
    if (!isValid) return;

    onOpenChange(false);
    onSave(formValues);
  };

  useShallowCompareEffect(() => {
    if (!open) {
      reset();
    }
    if (open && defaultValues) {
      reset(defaultValues);
    }
  }, [open, defaultValues]);

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="w-modal-xl">
        <ModalHeader type="muattrans" size="xl" />
        <div className="flex flex-col items-center justify-center gap-[22px] px-6 py-9">
          {/* Title */}
          <h2 className="w-full text-center text-base font-bold leading-[19.2px] text-black">
            {t(labelTitle)}
          </h2>

          {/* Form Fields */}
          <div className="grid w-full grid-cols-[140px_1fr] gap-x-6 gap-y-4">
            {/* Bank Name Field */}
            <label className="pt-2 text-xs font-medium leading-[14.4px] text-neutral-600">
              {`${t("labelBankName")}*`}
            </label>
            <div className="relative">
              <Select
                options={bankOptions}
                value={formValues.bankId}
                onChange={(selectedValue) => {
                  setField("bankId", selectedValue);
                }}
                errorMessage={formErrors.bankId}
                placeholder="Pilih Bank"
              />
            </div>

            {/* Account Number Field */}
            <label className="pt-2 text-xs font-medium leading-[14.4px] text-neutral-600">
              {`${t("labelAccountNumber")}*`}
            </label>
            <div>
              <Input
                placeholder="Masukkan Nomor Rekening"
                value={formValues.accountNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  // only allow digits
                  if (!/^\d*$/.test(value)) return;
                  setField("accountNumber", value);
                }}
                errorMessage={formErrors.accountNumber}
              />
            </div>

            {/* Account Holder Name Field */}
            <label className="pt-2 text-xs font-medium leading-[14.4px] text-neutral-600">
              {`${t("labelOwnerName")}*`}
            </label>
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Masukkan Nama Pemilik Rekening"
                value={formValues.accountHolderName}
                onChange={(e) => setField("accountHolderName", e.target.value)}
                errorMessage={formErrors.accountHolderName}
              />
              <Checkbox
                checked={formValues.isPrimary}
                onChange={({ checked }) => {
                  setField("isPrimary", checked);
                }}
                value="primary_account"
                label="Jadikan sebagai rekening utama"
                className="h-4"
              />
            </div>
          </div>

          {/* Warning Alert */}

          <Alert variant="secondary" size="big">
            {t("descAccountPurpose")}
          </Alert>

          {/* Action Buttons */}
          <div className="flex min-h-8 w-[232px] flex-row items-start gap-2">
            <Button
              variant="muatparts-primary-secondary"
              className="h-8 w-[112px] min-w-[112px]"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              {t("buttonCancel")}
            </Button>
            <Button
              variant="muatparts-primary"
              onClick={handleSave}
              className="h-8 w-[112px] min-w-[112px]"
              type="button"
            >
              {t("buttonSave")}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

import { create } from "zustand";

import { zustandDevtools } from "@/lib/utils";

const defaultValues = {
  bankId: "",
  accountNumber: "",
  accountHolderName: "",
  flag: "seller",
  isPrimary: false,
};

export const useRekeningPencairanStore = create(
  zustandDevtools(
    (set, get) => ({
      formValues: defaultValues,
      formErrors: {},
      actions: {
        setField: (field, value) =>
          set((state) => ({
            formValues: { ...state.formValues, [field]: value },
          })),
        reset: (newValues = null) =>
          set({
            formValues: newValues ? newValues : defaultValues,
            formErrors: {},
          }),
        validateForm: ({ dataRekening }) => {
          const formValues = get().formValues;
          const errors = {};

          if (!formValues.bankId) {
            errors.bankId = "messageBankAccountRequired";
          }

          if (!formValues.accountNumber) {
            errors.accountNumber = "messageAccountNumberRequired";
          }

          if (!formValues.accountHolderName) {
            errors.accountHolderName = "errorOwnerNameRequired";
          }

          const hasSameBankAccount = dataRekening.find(
            (item) =>
              item.bankId === formValues.bankId &&
              item.accountNumber === formValues.accountNumber
          );
          if (hasSameBankAccount) {
            errors.accountNumber = "messageBankAccountAlreadyRegistered";
          }

          set((state) => ({
            formErrors: errors,
          }));
          return Object.keys(errors).length === 0;
        },
      },
    }),
    {
      name: "rekening-pencairan-store",
    }
  )
);

export const useRekeningPencairanActions = () => {
  const { setField, setErrors, reset, validateForm } =
    useRekeningPencairanStore((state) => state.actions);
  return {
    setField,
    setErrors,
    reset,
    validateForm,
  };
};

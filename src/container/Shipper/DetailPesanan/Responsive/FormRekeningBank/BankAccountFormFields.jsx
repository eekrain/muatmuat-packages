import { useGetAvailableBankOptions } from "@/services/Shipper/detailpesanan/batalkan-pesanan/getAvailableBankOptions";

import Checkbox from "@/components/Form/Checkbox";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";

import { useTranslation } from "@/hooks/use-translation";

// Mock data for the bank selection dropdown (fallback)
const bankOptionsFallback = [
  { value: "bca", label: "BCA" },
  { value: "mandiri", label: "Mandiri" },
  { value: "bni", label: "BNI" },
  { value: "bri", label: "BRI" },
  { value: "cimb", label: "CIMB Niaga" },
];

const BankAccountFormFields = ({
  selectedBank,
  setSelectedBank,
  accountNumber,
  setAccountNumber,
  accountHolderName,
  setAccountHolderName,
  isPrimary,
  setIsPrimary,
}) => {
  const { t } = useTranslation();

  // Fetch bank options from API
  const {
    data: apiBankOptions,
    error,
    isLoading,
  } = useGetAvailableBankOptions();

  // Use API data if available, otherwise fallback to hardcoded data
  const bankOptions = apiBankOptions;

  return (
    <div className="flex flex-col gap-6">
      {/* Bank Selection Field */}
      <FormContainer>
        <FormLabel required>
          {t("BankAccountFormFields.bankNameLabel", {}, "Nama Bank")}
        </FormLabel>
        <Select
          placeholder={t(
            "BankAccountFormFields.selectBankPlaceholder",
            {},
            "Pilih Bank"
          )}
          options={bankOptions}
          value={selectedBank}
          onChange={setSelectedBank}
        />
      </FormContainer>

      {/* Account Number Field */}
      <FormContainer>
        <FormLabel required>
          {t("BankAccountFormFields.accountNumberLabel", {}, "Nomor Rekening")}
        </FormLabel>
        <Input
          type="text"
          placeholder={t(
            "BankAccountFormFields.accountNumberPlaceholder",
            {},
            "Masukkan Nomor Rekening"
          )}
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="border-neutral-600 placeholder:text-neutral-600"
        />
      </FormContainer>

      {/* Account Holder Name Field */}
      <FormContainer>
        <FormLabel required>
          {t(
            "BankAccountFormFields.accountHolderNameLabel",
            {},
            "Nama Pemilik Rekening"
          )}
        </FormLabel>
        <Input
          type="text"
          placeholder={t(
            "BankAccountFormFields.accountHolderNamePlaceholder",
            {},
            "Masukkan Nama Pemilik Rekening"
          )}
          value={accountHolderName}
          onChange={(e) => setAccountHolderName(e.target.value)}
          className="border-neutral-600 placeholder:text-neutral-600"
        />
      </FormContainer>

      {/* Primary Account Checkbox */}
      <Checkbox
        label={t(
          "BankAccountFormFields.primaryAccountLabel",
          {},
          "Jadikan sebagai rekening utama"
        )}
        checked={isPrimary}
        onChange={({ checked }) => setIsPrimary(checked)}
        labelClassName="font-semibold text-sm text-neutral-900"
      />
    </div>
  );
};

export default BankAccountFormFields;

import Checkbox from "@/components/Form/Checkbox";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";
import { useGetAvailableBankOptions } from "@/services/Shipper/detailpesanan/batalkan-pesanan/getAvailableBankOptions";

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
        <FormLabel required>Nama Bank</FormLabel>
        <Select
          placeholder="Pilih Bank"
          options={bankOptions}
          value={selectedBank}
          onChange={setSelectedBank}
        />
      </FormContainer>

      {/* Account Number Field */}
      <FormContainer>
        <FormLabel required>Nomor Rekening</FormLabel>
        <Input
          type="text"
          placeholder="Masukkan Nomor Rekening"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="border-neutral-600 placeholder:text-neutral-600"
        />
      </FormContainer>

      {/* Account Holder Name Field */}
      <FormContainer>
        <FormLabel required>Nama Pemilik Rekening</FormLabel>
        <Input
          type="text"
          placeholder="Masukkan Nama Pemilik Rekening"
          value={accountHolderName}
          onChange={(e) => setAccountHolderName(e.target.value)}
          className="border-neutral-600 placeholder:text-neutral-600"
        />
      </FormContainer>

      {/* Primary Account Checkbox */}
      <Checkbox
        label="Jadikan sebagai rekening utama"
        checked={isPrimary}
        onChange={({ checked }) => setIsPrimary(checked)}
        labelClassName="font-semibold text-sm text-neutral-900"
      />
    </div>
  );
};

export default BankAccountFormFields;

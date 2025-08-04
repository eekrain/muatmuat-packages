import { useState } from "react";
import { useRouter } from "next/navigation";

// Import separate components
import { Alert } from "@/components/Alert/Alert";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import {
  useRequestOtpActions,
} from "@/store/Shipper/forms/requestOtpStore";

import BankAccountFormFields from "./BankAccountFormFields";
import { SaveBottomSheet } from "./SaveBottomSheet";

// Main Component
const FormRekeningBankScreen = () => {
  const navigation = useResponsiveNavigation();
  const router = useRouter();
  const { setParams } = useRequestOtpActions();

  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [selectedVerificationMethod, setSelectedVerificationMethod] =
    useState("");

  const handleVerification = () => {
    // Set parameters for OTP verification
    const bankAccountData = {
      selectedBank,
      accountNumber,
      accountHolderName,
      isPrimary,
    };
    
    setParams({
      mode: "add-rekening",
      data: bankAccountData,
      redirectUrl: "/shipper/detail-pesanan", // atau URL yang sesuai
    });
    
    // Navigate to OTP page
     router.push("/shipper/rekening-pencairan/otp");
  };

  return (
    <FormResponsiveLayout
      title={{
        label: "Informasi Rekening Bank",
      }}
      onClickBackButton={() => navigation.pop()}
      variant="muatmuat"
    >
      <div className="bg-white px-4 pt-5">
        <BankAccountFormFields
          selectedBank={selectedBank}
          setSelectedBank={setSelectedBank}
          accountNumber={accountNumber}
          setAccountNumber={setAccountNumber}
          accountHolderName={accountHolderName}
          setAccountHolderName={setAccountHolderName}
          isPrimary={isPrimary}
          setIsPrimary={setIsPrimary}
        />

        <Alert
          variant="warning"
          className="mt-6 flex items-center gap-2.5 bg-warning-100 p-3"
        >
          Rekening Bank akan digunakan sebagai rekening tujuan transaksi
          keuangan kamu.
        </Alert>
      </div>

      <ResponsiveFooter className="flex gap-3">
        <SaveBottomSheet
          selectedVerificationMethod={selectedVerificationMethod}
          setSelectedVerificationMethod={setSelectedVerificationMethod}
          onVerification={handleVerification}
        />
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};

export default FormRekeningBankScreen;

import { useRouter } from "next/navigation";
import { useState } from "react";

// Import separate components
import { Alert } from "@/components/Alert/Alert";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";

import { useTranslation } from "@/hooks/use-translation";

import { useResponsiveNavigation } from "@/lib/responsive-navigation";

import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import {
  useRequestOtpActions,
  useRequestOtpStore,
} from "@/store/Shipper/forms/requestOtpStore";

import BankAccountFormFields from "./BankAccountFormFields";
import { SaveBottomSheet } from "./SaveBottomSheet";

// Main Component
const FormRekeningBankScreen = () => {
  const { t } = useTranslation();
  const navigation = useResponsiveNavigation();
  const router = useRouter();
  const { setParams } = useRequestOtpActions();
  const otpParams = useRequestOtpStore((state) => state.params);

  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [selectedVerificationMethod, setSelectedVerificationMethod] =
    useState("");

  const handleVerification = () => {
    // Set parameters for OTP verification
    const bankAccountData = {
      bankId: selectedBank,
      accountNumber,
      accountHolderName,
      flag: "seller",
      isPrimary,
    };
    // Check if this is for cancel flow and preserve cancelData
    const isForCancel = otpParams?.mode === "add-rekening-cancel";
    const existingCancelData = otpParams?.data?.cancelData;

    setParams({
      mode: isForCancel ? "add-rekening-cancel" : "add-rekening",
      data: isForCancel
        ? {
            bankAccount: bankAccountData,
            cancelData: existingCancelData,
          }
        : bankAccountData,
      redirectUrl: window.location.pathname,
    });

    // Navigate to OTP page
    router.push("/rekening-pencairan/otp");
  };

  return (
    <FormResponsiveLayout
      title={{
        label: t("FormRekeningBankScreen.title", {}, "Informasi Rekening Bank"),
      }}
      onClickBackButton={() => navigation.pop()}
      variant="muatmuat"
    >
      <div className="bg-neutral-50 px-4 py-5">
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
          className="mt-6 flex h-[38px] items-center gap-2.5 bg-warning-100 p-3"
        >
          {t(
            "FormRekeningBankScreen.bankAccountInfo",
            {},
            "Rekening Bank akan digunakan sebagai rekening tujuan transaksi keuangan kamu."
          )}
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

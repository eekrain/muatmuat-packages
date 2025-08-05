import { useRouter } from "next/navigation";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/BottomSheet/BottomSheetUp";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import RadioButton from "@/components/Radio/RadioButton";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import {
  useRequestOtpActions,
  useRequestOtpStore,
} from "@/store/Shipper/forms/requestOtpStore";

const VerificationOption = ({
  option,
  selectedVerificationMethod,
  handleVerificationMethodSelect,
}) => {
  return (
    <label
      className={cn(
        "flex h-[50px] cursor-pointer items-center gap-2 rounded-md border border-neutral-400 px-3 transition-colors",
        selectedVerificationMethod === option.id &&
          "border-primary-700 bg-primary-50"
      )}
      onClick={() => handleVerificationMethodSelect(option.id, option.value)}
    >
      <IconComponent
        src={option.icon}
        alt={`${option.name} Icon`}
        className="h-6 w-6 text-neutral-700"
      />
      <div className="flex flex-1 flex-col gap-1">
        <span className="text-sm font-semibold leading-tight text-neutral-900">
          {option.name}
        </span>
        <span className="text-sm font-medium leading-tight text-neutral-600">
          {option.value}
        </span>
      </div>
      <RadioButton
        name="verification-method"
        value={option.id}
        checked={selectedVerificationMethod === option.id}
        onClick={() => handleVerificationMethodSelect(option.id, option.value)}
        readOnly
      />
    </label>
  );
};

export const SaveBottomSheet = ({
  selectedVerificationMethod,
  setSelectedVerificationMethod,
  onVerification,
}) => {
  const router = useRouter();
  const { dataUser } = useAuth();
  const formValues = useRequestOtpStore((state) => state.formValues);
  const { setField, sendRequestOtp } = useRequestOtpActions();

  const verificationOptions = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      value: dataUser?.PhoneStrip,
      icon: "/icons/verify-whatsapp.svg",
    },
    {
      id: "email",
      name: "Email",
      value: dataUser?.Email,
      icon: "/icons/verify-email.svg",
    },
  ];

  const handleVerificationMethodSelect = (optionId, optionValue) => {
    setSelectedVerificationMethod(optionId);
    setField("verificationMethod", optionId);
    setField("verificationData", optionValue);
  };

  const handleSendOtp = async () => {
    try {
      await sendRequestOtp();
      // toast.success("Kode verifikasi telah dikirim!");
      router.push("/rekening-pencairan/otp");
    } catch (error) {
      toast.error(error.message || "Gagal mengirim kode verifikasi");
    }
  };

  return (
    <BottomSheet>
      <BottomSheetTrigger asChild>
        <Button variant="muatparts-primary" className="w-full">
          Simpan
        </Button>
      </BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>Informasi</BottomSheetTitle>
        </BottomSheetHeader>
        <div className="flex flex-col gap-4 px-4">
          <p className="text-center text-sm font-medium leading-tight text-neutral-900">
            Pilih salah satu metode dibawah ini untuk mendapatkan kode
            verifikasi
          </p>

          <div className="flex w-full flex-col gap-4">
            {verificationOptions.map((option) => (
              <VerificationOption
                key={option.id}
                option={option}
                selectedVerificationMethod={selectedVerificationMethod}
                handleVerificationMethodSelect={handleVerificationMethodSelect}
              />
            ))}
          </div>
        </div>
        <BottomSheetFooter className="pt-6">
          <Button
            variant="muatparts-primary"
            onClick={handleSendOtp}
            disabled={!selectedVerificationMethod}
            className="w-full"
          >
            Verifikasi
          </Button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
};

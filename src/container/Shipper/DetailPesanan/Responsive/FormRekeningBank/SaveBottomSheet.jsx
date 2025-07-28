import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTrigger,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import RadioButton from "@/components/Radio/RadioButton";
import { cn } from "@/lib/utils";

const verificationOptions = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    value: "0821-6315-4381",
    icon: "/icons/verify-whatsapp.svg",
  },
  {
    id: "email",
    name: "Email",
    value: "nolariska@gmail.com",
    icon: "/icons/verify-email.svg",
  },
];

const VerificationOption = ({
  option,
  selectedVerificationMethod,
  setSelectedVerificationMethod,
}) => {
  return (
    <label
      className={cn(
        "flex h-[50px] cursor-pointer items-center gap-2 rounded-md border border-neutral-400 px-3 transition-colors",
        selectedVerificationMethod === option.id &&
          "border-primary-700 bg-primary-50"
      )}
      onClick={() => setSelectedVerificationMethod(option.id)}
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
        onClick={() => setSelectedVerificationMethod(option.id)}
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
  return (
    <BottomSheet>
      <BottomSheetTrigger asChild>
        <Button variant="muatparts-primary" className="w-full">
          Simpan
        </Button>
      </BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader>Informasi</BottomSheetHeader>
        <div className="flex flex-col gap-4 p-4 pb-6">
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
                setSelectedVerificationMethod={setSelectedVerificationMethod}
              />
            ))}
          </div>

          {/* Action Button */}
          <Button
            variant="muatparts-primary"
            onClick={onVerification}
            disabled={!selectedVerificationMethod}
            className="w-full"
          >
            Verifikasi
          </Button>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

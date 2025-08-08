import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import { ModalFormRekeningPencairan } from "@/components/RekeningPencairan/ModalFormRekeningPencairan";
import { ModalFormRequestOtp } from "@/components/RekeningPencairan/ModalFormRequestOtp";
import { toast } from "@/lib/toast";
import { useGetAvailableBankOptions } from "@/services/Shipper/detailpesanan/batalkan-pesanan/getAvailableBankOptions";
import { useGetBankAccounts } from "@/services/Shipper/detailpesanan/batalkan-pesanan/getBankAccounts";
import { useRequestOtpActions } from "@/store/Shipper/forms/requestOtpStore";

export const ModalPesananGagal = ({ open, onOpenChange }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setParams, reset: resetOtp, sendRequestOtp } = useRequestOtpActions();
  const [isBankAccountModalOpen, setBankAccountModalOpen] = useState(false);
  const [isVerificationMethodModalOpen, setVerificationMethodModalOpen] =
    useState(false);

  const { data: bankAccounts } = useGetBankAccounts();
  const { data: bankOptions } = useGetAvailableBankOptions();

  const handleConfirmOrderCancellation = () => {
    if (true) {
      setBankAccountModalOpen(true);
    }
  };

  const handleTempSaveRekening = (data) => {
    setParams({
      mode: "add-rekening-cancel",
      data: {
        // Data bank
        bankAccount: data,
      },
      redirectUrl: pathname,
    });
    setVerificationMethodModalOpen(true);
  };

  const handleRequestOtp = async () => {
    try {
      await sendRequestOtp();
      router.push("/rekening-pencairan/otp");
    } catch (error) {
      toast.error(error.message || "Gagal mengirim OTP");
    }
  };

  return (
    <>
      <Modal open={open} onOpenChange={onOpenChange}>
        <ModalContent className="w-[440px] p-0" type="muatmuat">
          <ModalHeader size="big" className="h-[70px] w-[440px] object-cover" />
          <div className="flex flex-col items-center gap-6 px-6 py-9">
            <h2 className="text-center text-base font-bold leading-tight text-neutral-900">
              Mohon Maaf, Pesanan
              <br />
              Tidak Dapat Diproses
            </h2>

            <p className="text-center text-sm font-medium text-neutral-900">
              Karena tingginya volume pemesanan, kami belum dapat menyiapkan
              armada yang sesuai dengan pesananmu.
              <br />
              <br />
              Kami akan mengembalikan dana secara penuh dan memberikan
              kompensasi sebagai bentuk permohonan maaf atas ketidaknyamanan
              ini.
              <br />
              <br />
              Terima kasih atas pengertiannya.
            </p>

            <Button
              onClick={handleConfirmOrderCancellation}
              variant="muatparts-primary"
              className="h-8 w-[130px] rounded-full text-sm font-semibold"
            >
              Ya, Mengerti
            </Button>
          </div>
        </ModalContent>
      </Modal>

      <ModalFormRekeningPencairan
        labelTitle="titleAccountInfo"
        open={isBankAccountModalOpen}
        onOpenChange={setBankAccountModalOpen}
        bankOptions={bankOptions || []}
        dataRekening={bankAccounts}
        onSave={handleTempSaveRekening}
      />

      <ModalFormRequestOtp
        open={isVerificationMethodModalOpen}
        onOpenChange={setVerificationMethodModalOpen}
        onSubmit={handleRequestOtp}
      />
    </>
  );
};

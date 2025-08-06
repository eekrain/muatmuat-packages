// RingkasanPembayaran.jsx
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Form/Checkbox";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from "@/components/Modal/Modal";
import { ModalAlasanPembatalan } from "@/components/Modal/ModalAlasanPembatalan";
import { ModalFormRekeningPencairan } from "@/components/RekeningPencairan/ModalFormRekeningPencairan";
import { ModalFormRequestOtp } from "@/components/RekeningPencairan/ModalFormRequestOtp";
import { useTranslation } from "@/hooks/use-translation";
import { fetcherMuatparts, fetcherMuatrans } from "@/lib/axios";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { toast } from "@/lib/toast";
import { useGetAvailableBankOptions } from "@/services/Shipper/detailpesanan/batalkan-pesanan/getAvailableBankOptions";
import { useGetBankAccounts } from "@/services/Shipper/detailpesanan/batalkan-pesanan/getBankAccounts";
import { useGetCancellationReasons } from "@/services/Shipper/detailpesanan/batalkan-pesanan/getCancellationReasons";
import {
  useRequestOtpActions,
  useRequestOtpStore,
} from "@/store/Shipper/forms/requestOtpStore";

export const ModalBatalkanPesanan = ({ dataRingkasanPembayaran, children }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [isModalBatalkanOpen, setIsModalBatalkanOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isModalReasonOpen, setIsModalReasonOpen] = useState(false);
  const [isModalRekeningOpen, setIsModalRekeningOpen] = useState(false);
  const [isModalOtpOpen, setIsModalOtpOpen] = useState(false);
  const [pendingCancelData, setPendingCancelData] = useState(null);

  const { data: cancellationReasons } = useGetCancellationReasons();
  const { data: bankAccounts } = useGetBankAccounts();
  const { data: bankOptions } = useGetAvailableBankOptions();
  const params = useParams();
  const [cancelFormErrors, setCancelFormErrors] = useState({});
  const handleProceedCancelOrder = ({
    selectedReason,
    isOtherReason,
    customReason,
  }) => {
    // Validation
    if (!selectedReason) {
      toast.error(t("messageMinimalPilihAlasan"));
      return;
    }

    const errors = {};

    if (isOtherReason && !customReason)
      errors.customReason = t("messageAlasanPembatalanHarusDiisi");
    setCancelFormErrors(errors);

    if (Object.keys(errors)?.length > 0) {
      return;
    }

    // If there is no rekening, show modal to add rekening
    if (!bankAccounts || bankAccounts?.length === 0) {
      // Store cancel data for later use after rekening is added
      setPendingCancelData({
        reasonId: selectedReason,
        additionalInfo: isOtherReason ? customReason : "",
      });
      setIsModalBatalkanOpen(false);
      setIsModalReasonOpen(false);
      setIsModalRekeningOpen(true);
      return;
    } else {
      // Implement cancel order
      const body = {
        reasonId: selectedReason,
        additionalInfo: isOtherReason ? customReason : "",
      };
      console.log(bankAccounts, "bankAccount");
      fetcherMuatrans
        .post(`v1/orders/${params.orderId}/cancel`, body)
        .then((response) => {
          toast.success(t("messageBerhasilMembatalkanPesanan"));
        })
        .catch((error) => {
          toast.error(error.response.data?.Data?.Message);
        });

      setIsModalReasonOpen(false);
    }
  };

  const { params: otpParams, formValues: otpValues } = useRequestOtpStore();
  const { setParams, reset: resetOtp, sendRequestOtp } = useRequestOtpActions();
  const handleTempSaveRekening = (data) => {
    setParams({
      mode: "add-rekening-cancel",
      data: {
        // Data bank
        bankAccount: data,
        // Data cancel
        cancelData: pendingCancelData,
      },
      redirectUrl: pathname,
    });
    setIsModalOtpOpen(true);
  };

  const handleRequestOtp = async () => {
    try {
      await sendRequestOtp();
      router.push("/rekening-pencairan/otp");
    } catch (error) {
      toast.error(error.message || "Gagal mengirim OTP");
    }
  };

  const handlePendingCancelOrder = () => {
    console.log(pendingCancelData, "tes");
    if (otpParams.data.cancelData) {
      fetcherMuatrans
        .post(`v1/orders/${params.orderId}/cancel`, otpParams.data.cancelData)
        .then((cancelResponse) => {
          toast.success(t("messageBerhasilMembatalkanPesanan"));
          setPendingCancelData(null);
          resetOtp();
        })
        .catch((cancelError) => {
          toast.error(cancelError.response.data?.Data?.Message);
          resetOtp();
        });
    }
  };

  const handleAddNewRekeningPencairan = () => {
    // Extract bankAccount data from otpParams.data
    const bankAccountData = otpParams.data?.bankAccount || otpParams.data;

    fetcherMuatparts
      .post("v1/muatparts/bankAccount", bankAccountData)
      .then((response) => {
        toast.success(response.data?.Data?.Message);
        handlePendingCancelOrder();
      })
      .catch((error) => {
        toast.error(error.response.data?.Data?.Message);
        resetOtp();
      });
  };

  const hasAddedNewRekening = useRef(false);
  console.log(hasAddedNewRekening, "hasAddedNewRekening");

  console.log(otpParams?.mode, otpParams?.data, otpValues?.hasVerified, "otp");
  useEffect(() => {
    if (
      (otpParams?.mode === "add-rekening" ||
        otpParams?.mode === "add-rekening-cancel") &&
      otpParams.data &&
      otpValues?.hasVerified
    ) {
      if (hasAddedNewRekening.current) return;
      handleAddNewRekeningPencairan();
      hasAddedNewRekening.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpParams?.mode, otpValues?.hasVerified]);

  return (
    <>
      <Modal open={isModalBatalkanOpen} onOpenChange={setIsModalBatalkanOpen}>
        <ModalTrigger>{children}</ModalTrigger>
        <ModalContent className="w-modal-small">
          <ModalHeader type="muattrans" size="small" />
          <div className="flex w-[386px] flex-col items-center justify-center gap-6 px-6 py-9">
            {/* Title */}
            <h2 className="w-full text-center text-base font-bold leading-[19.2px] text-black">
              {t("titleCancelOrder")}
            </h2>

            {dataRingkasanPembayaran?.orderStatus ===
            OrderStatusEnum.PREPARE_FLEET ? (
              <CancelContentWhenPrepareFleet
                isAgreed={isAgreed}
                setIsAgreed={setIsAgreed}
              />
            ) : (
              <CancelContentWhenNotPrepareFleet
                isAgreed={isAgreed}
                setIsAgreed={setIsAgreed}
              />
            )}

            {/* Action Button */}
            <Button
              variant="muatparts-primary-secondary"
              disabled={!isAgreed}
              type="button"
              onClick={() => {
                setIsModalBatalkanOpen(false);
                setIsModalReasonOpen(true);
              }}
            >
              {t("buttonCancelOrder")}
            </Button>
          </div>
        </ModalContent>
      </Modal>

      <ModalAlasanPembatalan
        open={isModalReasonOpen}
        onOpenChange={setIsModalReasonOpen}
        cancelReasons={cancellationReasons || []}
        errors={cancelFormErrors}
        onSubmit={handleProceedCancelOrder}
        title={t("titleCancellationReason")}
      />

      <ModalFormRekeningPencairan
        labelTitle="titleAccountInfo"
        open={isModalRekeningOpen}
        onOpenChange={setIsModalRekeningOpen}
        bankOptions={bankOptions || []}
        dataRekening={bankAccounts}
        onSave={handleTempSaveRekening}
      />

      <ModalFormRequestOtp
        open={isModalOtpOpen}
        onOpenChange={setIsModalOtpOpen}
        onSubmit={handleRequestOtp}
      />
    </>
  );
};

const CancelContentWhenPrepareFleet = ({ isAgreed, setIsAgreed }) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Description */}
      <p className="w-full text-center text-sm font-medium leading-[15.4px] text-black">
        {t("descConfirmCancelOrder")}{" "}
        <a
          href="https://faq.muatmuat.com/pusat-bantuan"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer text-primary-700"
          onClick={(e) => e.stopPropagation()}
        >
          {t("linkTermsConditions")}
        </a>
      </p>

      {/* Checkbox with Terms */}
      <div className="flex w-[318px] flex-row items-center gap-2">
        <Checkbox
          checked={isAgreed}
          onChange={(e) => setIsAgreed(e.checked)}
          value="terms_agreement"
          label=""
        >
          <span className="text-xs font-medium leading-[14.4px] text-black">
            {t("labelAgreeTerms")}
          </span>
        </Checkbox>
      </div>
    </>
  );
};

const CancelContentWhenNotPrepareFleet = ({ isAgreed, setIsAgreed }) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Description */}
      <p className="w-full text-center text-sm font-medium leading-[15.4px] text-black">
        {t("descAdminFee")}
        <br />
        <br />
        {t("descConfirmCancelOrder2")}
      </p>

      {/* Checkbox with Terms */}
      <div className="flex w-[292px] flex-row items-center gap-2">
        <Checkbox
          checked={isAgreed}
          onChange={(e) => setIsAgreed(e.checked)}
          value="terms_agreement"
          label=""
        >
          <span className="text-xs font-medium leading-[14.4px] text-black">
            {t("labelAgreeTo")}{" "}
            <a
              href="https://faq.muatmuat.com/pusat-bantuan"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-primary-700"
              onClick={(e) => e.stopPropagation()}
            >
              {t("linkMuatransTerms")}
            </a>
          </span>
        </Checkbox>
      </div>
    </>
  );
};
